package se.ifmo.ru.s267880.isdb.bigproject.isbdbigproject.beans

import org.springframework.stereotype.Component
import org.springframework.web.context.annotation.SessionScope
import se.ifmo.ru.s267880.isdb.bigproject.isbdbigproject.UserProfile

@Component
@SessionScope
class AppState {
    var user: UserProfile? = null
}