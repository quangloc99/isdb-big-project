package se.ifmo.ru.s267880.isdb.bigproject.isbdbigproject

import com.fasterxml.jackson.annotation.JsonInclude
import java.util.*

data class LoginResponse(val code: Int, val message: String)
enum class LoginRespondEnum(val inner: LoginResponse) {
    OK(0, "OK"),
    ALREADY_IN(1, "User is already logged in"),
    NOT_EXISTED(2, "User's email or password is in correct");
    constructor(code: Int, message: String) : this(LoginResponse(code, message))
}

data class LogoutResponse(val code: Int, val message: String)
enum class LogoutResponseEnum(val inner: LogoutResponse) {
    OK(0, "OK"),
    ALREADY_OUT(1, "User is not logged in");
    constructor(code: Int, message: String): this(LogoutResponse(code, message))
}

enum class UserProfilePrivilege {
    admin, worker, client
}

@JsonInclude(JsonInclude.Include.USE_DEFAULTS)
data class UserProfile(
    val user_profile_id: Int,
    val name: String,
    val date_of_birth: Date,
    val email: String,
    val telephone_number: String,
    val privilege: UserProfilePrivilege,
)
