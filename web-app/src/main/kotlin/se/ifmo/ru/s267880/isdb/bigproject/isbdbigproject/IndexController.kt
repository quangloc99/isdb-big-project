package se.ifmo.ru.s267880.isdb.bigproject.isbdbigproject

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping

@Controller
class IndexController {
    @RequestMapping(value = ["/**/{not_having_dots:[^\\.]*}"], produces=["text/html"])
    fun forwardPageToIndexHtml(): String = "forward:/__generated/index.html"
}