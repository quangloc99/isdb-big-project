package se.ifmo.ru.s267880.isdb.bigproject.isbdbigproject.beans

import org.springframework.stereotype.Component
import org.springframework.web.context.annotation.SessionScope

@Component("testBean")
@SessionScope
open class TestBean {
    private var _counter: Int = 0
    var counter: Int
        get() = _counter
        set(value) { _counter = value }
}