package se.ifmo.ru.s267880.isdb.bigproject.isbdbigproject.services

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.*
import org.springframework.web.context.annotation.SessionScope
import se.ifmo.ru.s267880.isdb.bigproject.isbdbigproject.beans.TestBean
import javax.annotation.Resource

@Controller
class TestServiceHtml {

    @GetMapping("/")
    fun index(model: Model): String = "redirect:index.html"
}

@Controller
class TestService {
    @Autowired
    lateinit var testBean: TestBean

    @GetMapping("/test")
    @ResponseBody
    fun test(): String {
        print("wtf")
        testBean.counter += 1
        return testBean.counter.toString()
    }
}