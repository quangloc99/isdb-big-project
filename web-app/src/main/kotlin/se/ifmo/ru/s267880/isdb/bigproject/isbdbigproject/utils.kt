package se.ifmo.ru.s267880.isdb.bigproject.isbdbigproject

fun UserProfile?.requirePrivilege(privilege: UserProfilePrivilege) =
    this?.takeIf { it.privilege == privilege} ?: throw IllegalAccessException("User must have $privilege privilege to do this operation")

fun UserProfile?.requireLoggedIn() = this ?: throw IllegalAccessException("User is not logged in")