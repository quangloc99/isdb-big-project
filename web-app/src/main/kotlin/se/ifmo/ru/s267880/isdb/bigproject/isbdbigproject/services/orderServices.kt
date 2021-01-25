package se.ifmo.ru.s267880.isdb.bigproject.isbdbigproject.services

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.jdbc.core.query
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*
import se.ifmo.ru.s267880.isdb.bigproject.isbdbigproject.UserProfile
import se.ifmo.ru.s267880.isdb.bigproject.isbdbigproject.UserProfilePrivilege
import se.ifmo.ru.s267880.isdb.bigproject.isbdbigproject.beans.AppState
import se.ifmo.ru.s267880.isdb.bigproject.isbdbigproject.requireLoggedIn
import se.ifmo.ru.s267880.isdb.bigproject.isbdbigproject.requirePrivilege
import java.sql.ResultSet
import java.util.*
import kotlin.streams.toList

enum class ProductOrderStatus {
    pending, making, finished, delivered
}

class ProductOrder(rs: ResultSet, user: UserProfile) {
    private fun UserProfile.whenAdmin() = privilege.takeIf { it == UserProfilePrivilege.admin }
    private fun UserProfile.whenClient() = privilege.takeIf { it == UserProfilePrivilege.client }
    private fun UserProfile.whenWorker() = privilege.takeIf { it == UserProfilePrivilege.worker}
    private fun UserProfile.whenAdminOrClient() = privilege.takeIf { it == UserProfilePrivilege.admin || it == UserProfilePrivilege.client }
    // Basic info
    val product_order_id = rs.getInt("product_order_id")
    val order_status = ProductOrderStatus.valueOf(rs.getString("order_status"))
    val product_prototype_id = rs.getInt("product_prototype_id")

    // client info
    val user_email: String? = user.whenAdminOrClient()?.let { rs.getString("email") }
    val planned_delivery_date: Date? = user.whenAdminOrClient()?.let { rs.getDate("planned_delivery_date") }
    val delivery_address = user.whenAdminOrClient()?.let {rs.getString("delivery_address") }
    val user_profile_id = user.whenClient()?.let { rs.getInt("user_profile_id") }
//        val price: Int?,
//        val additional_description: String?,

    // admin info
    val assigned_workers_count = user.whenAdmin()?.let { rs.getInt("assigned_workers_count") }
    val finished_workers_count = user.whenAdmin()?.let { rs.getInt("finished_workers_count") }

    // worker info
    val is_finished = user.whenWorker()?.let { rs.getBoolean("is_finished") }
    val deadline = user.whenWorker()?.let { rs.getDate("deadline") }
}

data class WorkerForOrder(
        val worker_id: Int,
        val name: String,
        val email: String,
        val deadline: Date,
        val is_finished: Boolean
) {
    constructor(rs: ResultSet) : this(
            rs.getInt("worker_id"),
            rs.getString("name"),
            rs.getString("email"),
            rs.getDate("deadline"),
            rs.getBoolean("is_finished")
    )
}

@RestController
@RequestMapping("order", produces=[MediaType.APPLICATION_JSON_VALUE])
class OrderServices {
    @Autowired
    lateinit var appState: AppState

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @PostMapping("/form")
    @Transactional
    fun formOrder(
            @RequestParam(name="prototype_id") prototypeId: Int,
            @RequestParam(name="wanted_delivery_date") wantedDeliveryDate: String,
            @RequestParam(name="delivery_address") deliveryAddress: String
    ): Unit =
            appState.user.requireLoggedIn().let {
                    jdbcTemplate.query("select form_product_order(?, ?, date (?), ?);",
                            it.user_profile_id, prototypeId, wantedDeliveryDate, deliveryAddress) {}
            }

    @GetMapping("/all")
    @Transactional
    fun getAllOrders(): List<ProductOrder> =
            when (appState.user?.privilege) {
                null -> { _ : RowMapper<ProductOrder> -> listOf<ProductOrder>() }
                UserProfilePrivilege.worker -> { rm: RowMapper<ProductOrder> ->
                    jdbcTemplate.queryForStream("select * from get_assigned_product_orders(?, false);", rm, appState.user!!.user_profile_id).toList()
                }
                UserProfilePrivilege.admin -> { rm: RowMapper<ProductOrder> ->
                    jdbcTemplate.queryForStream("select * from get_all_product_orders();", rm).toList()
                }
                UserProfilePrivilege.client -> { rm: RowMapper<ProductOrder> ->
                    jdbcTemplate.queryForStream("select * from get_owning_product_orders(?)", rm, appState.user!!.user_profile_id).toList()
                }
            }.invoke { rs, _ -> ProductOrder(rs, appState.user!!) }

    @PutMapping("/change-status")
    @Transactional
    fun changeOrderStatus(@RequestParam product_order_id: Int, @RequestParam order_status: ProductOrderStatus) =
            appState.user.requirePrivilege(UserProfilePrivilege.admin).let {
                jdbcTemplate.query("select update_order_status(?, (?)::order_status_type);", product_order_id, order_status.toString()) {}
            }

    @GetMapping("/{orderId}/workers")
    @Transactional
    fun getWorkerForOrder(@PathVariable("orderId") orderId: Int): List<WorkerForOrder> =
            appState.user.requirePrivilege(UserProfilePrivilege.admin).let {
                jdbcTemplate.queryForStream("select * from get_workers_for(?);", {rs, _ -> WorkerForOrder(rs)}, orderId).toList()
            }
}