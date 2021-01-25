package se.ifmo.ru.s267880.isdb.bigproject.isbdbigproject.services

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.query
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*
import se.ifmo.ru.s267880.isdb.bigproject.isbdbigproject.UserProfilePrivilege
import se.ifmo.ru.s267880.isdb.bigproject.isbdbigproject.beans.AppState
import se.ifmo.ru.s267880.isdb.bigproject.isbdbigproject.requirePrivilege
import kotlin.streams.toList

data class Worker(
        val worker_id: Int,
        val name: String,
        val email: String
)

@RestController
@RequestMapping("/worker")
class WorkerServices {
    @Autowired
    lateinit var appState: AppState

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @GetMapping("/free-for-order/{product_order_id}")
    @Transactional
    fun getWorkerFreeForOrder(@PathVariable("product_order_id") product_order_id: Int): List<Worker> =
        appState.user.requirePrivilege(UserProfilePrivilege.admin).let {
            jdbcTemplate.queryForStream("select * from get_free_workers_for(?);", { rs, _ ->
                Worker(rs.getInt("worker_id"), rs.getString("name"), rs.getString("email"))
            }, product_order_id).toList()
        }

    @PutMapping("/assign-to-order")
    @Transactional
    fun assignWorkerToOrder(@RequestParam worker_id: Int, @RequestParam product_order_id: Int, @RequestParam deadline: String) =
        appState.user.requirePrivilege(UserProfilePrivilege.admin).let{
            jdbcTemplate.query("select assign_order(?, ?, date (?));", product_order_id, worker_id, deadline) {}
        }

    @PutMapping("/archive-order")
    @Transactional
    fun archiveOrder(@RequestParam product_order_id: Int) =
        appState.user.requirePrivilege(UserProfilePrivilege.worker).let {
            jdbcTemplate.query("select archive_order(?, ?);", appState.user!!.user_profile_id, product_order_id) {}
        }
}