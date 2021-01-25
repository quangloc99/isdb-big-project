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

data class DetailInfo(
        val detail_type_id: Int,
        val name: String,
        val quantity_remain: Int
)

@RestController
@RequestMapping("/resources")
class ResourcesServices {
    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var appState: AppState

    @GetMapping("/all")
    @Transactional
    fun getAllDetailInfo(): List<DetailInfo> =
            jdbcTemplate.queryForStream("select * from get_all_detail_info(); ") { rs, _ ->
                DetailInfo(rs.getInt("detail_type_id"), rs.getString("name"), rs.getInt("quantity_remain"))
            }.toList()

    @PutMapping("/spend")
    @Transactional
    fun spendDetail(@RequestParam detail_type_id: Int, @RequestParam product_order_id: Int, @RequestParam quantity: Int) =
        appState.user.requirePrivilege(UserProfilePrivilege.worker).let {
            jdbcTemplate.query("select spend_details(?, ?, ?);", detail_type_id, product_order_id, quantity) {}
        }
}