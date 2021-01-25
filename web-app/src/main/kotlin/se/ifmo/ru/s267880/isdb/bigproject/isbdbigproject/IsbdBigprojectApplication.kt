package se.ifmo.ru.s267880.isdb.bigproject.isbdbigproject

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.CommandLineRunner
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.query
import java.io.File
import java.io.FileOutputStream
import java.io.PrintStream

@SpringBootApplication
class IsbdBigprojectApplication: CommandLineRunner {
	@Autowired
	lateinit var jt: JdbcTemplate

	@Value("\${prototypeResourceRoot}")
	lateinit var prototypeResourceRoot: String

	override fun run(args: Array<String>) {
        File(prototypeResourceRoot).also {
			if (!it.exists()) {
				it.mkdirs()
			}
		}
	}
}

fun main(args: Array<String>) {
	runApplication<IsbdBigprojectApplication>(*args)
}
