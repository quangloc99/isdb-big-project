package se.ifmo.ru.s267880.isdb.bigproject.isbdbigproject

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Scope
import org.springframework.context.annotation.ScopedProxyMode
import org.springframework.web.context.annotation.SessionScope
import se.ifmo.ru.s267880.isdb.bigproject.isbdbigproject.beans.TestBean

class AppConfig {
    fun testBean() : TestBean {
        println("used bean")
        return TestBean()
    }
}