package se.ifmo.ru.s267880.isdb.bigproject.isbdbigproject.services

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*
import se.ifmo.ru.s267880.isdb.bigproject.isbdbigproject.*
import se.ifmo.ru.s267880.isdb.bigproject.isbdbigproject.beans.AppState

@RestController
@RequestMapping("user", produces = [MediaType.APPLICATION_JSON_VALUE])
class userAuthenticationServices {
    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var appState: AppState

    @PostMapping("/login")
    @Transactional
    fun login(@RequestParam email: String, @RequestParam password: String): LoginResponse =
            appState.user?.let {
                LoginRespondEnum.ALREADY_IN.inner
            } ?: jdbcTemplate.queryForRowSet("select * from authenticate_user_profile(?, ?)", email, password)
                .takeIf { it.next() }
                ?.let {
                    appState.user = UserProfile(
                            it.getInt("user_profile_id"),
                            it.getString("name")!!,
                            it.getDate("date_of_birth")!!,
                            it.getString("email")!!,
                            it.getString("telephone_number")!!,
                            UserProfilePrivilege.valueOf(it.getString("privilege")!!),
                    )
                    LoginRespondEnum.OK.inner
                } ?: LoginRespondEnum.NOT_EXISTED.inner

    @PostMapping("/logout")
    @Transactional
    fun logout(): LogoutResponse =
            appState.user?.let {
                appState.user = null
                LogoutResponseEnum.OK.inner
            } ?: LogoutResponseEnum.ALREADY_OUT.inner


    @GetMapping("/info")
    @Transactional
    fun info(): UserProfile? = appState.user
}