package se.ifmo.ru.s267880.isdb.bigproject.isbdbigproject

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.ResponseStatus
import java.sql.SQLException

data class ErrorMsg(val message: String)

@ControllerAdvice
class GlobalExceptionHandler {
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ExceptionHandler(IllegalAccessException::class)
    @ResponseBody
    fun handleIllegalAccess(ex: Exception): ErrorMsg = ErrorMsg(ex.cause?.message ?: "Illegal access")

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(SQLException::class)
    @ResponseBody
    fun handleSqlException(ex: Exception): ErrorMsg = ErrorMsg(ex.cause?.message?.split('\n')?.get(0) ?: "There was an exception during SQL operation.")
}
