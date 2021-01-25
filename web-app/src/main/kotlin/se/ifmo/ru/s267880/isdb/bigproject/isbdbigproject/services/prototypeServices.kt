package se.ifmo.ru.s267880.isdb.bigproject.isbdbigproject.services

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import se.ifmo.ru.s267880.isdb.bigproject.isbdbigproject.beans.AppState
import java.io.File
import kotlin.streams.toList

enum class ProductPrototypeResourceType {
    `2D_file`,
    `3D_file`
}

data class ProductPrototypeResource(
    val resource_type: ProductPrototypeResourceType,
    val location: String,
)

enum class ProductPrototypeModifierEnum {
    `private`,
    `public`
}


@JsonIgnoreProperties(value = ["owner_id", "modifier"])
data class ProductPrototype (
        val product_prototype_id: Int,
        val owner_id: Int,
        val description: String,
        val modifier: ProductPrototypeModifierEnum,
        val resources: List<ProductPrototypeResource>
) {
}

@RestController
@RequestMapping("/prototype")
class PrototypeServices {
    @Value("\${prototypeResourceRoot}")
    lateinit var prototypeResourceRoot: String

    @Autowired
    lateinit var appState: AppState

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @GetMapping("/resource/{fileName}", produces=[MediaType.IMAGE_JPEG_VALUE])
    @Transactional
    fun getResource(@PathVariable("fileName") fileName: String): ByteArray? =
        File("${prototypeResourceRoot}/${fileName}")
                .takeIf { it.exists() }
                ?.let(File::readBytes)

    @GetMapping("/of/{userId}", produces=[MediaType.APPLICATION_JSON_VALUE])
    @Transactional
    fun getPrototypeList(@PathVariable("userId") userId: Int): List<ProductPrototype> =
            jdbcTemplate.queryForStream("select * from get_owning_product_prototypes(?)", {
                rs, _ -> ProductPrototype(
                    rs.getInt("product_prototype_id"),
                    rs.getInt("owner_id"),
                    rs.getString("description"),
                    ProductPrototypeModifierEnum.valueOf(rs.getString("modifier")),
                    getPrototypeResources(rs.getInt("product_prototype_id"))
                )
            }, userId).toList()

    @GetMapping("/{prototypeId}", produces=[MediaType.APPLICATION_JSON_VALUE])
    @Transactional
    fun getPrototype(@PathVariable("prototypeId") prototypeId: Int): ProductPrototype? =
            jdbcTemplate.queryForRowSet("select * from product_prototype where product_prototype_id = (?);", prototypeId)
                    .takeIf { it.next() }
                    ?. let { rs -> ProductPrototype(
                            rs.getInt("product_prototype_id"),
                            rs.getInt("owner_id"),
                            rs.getString("description")!!,
                            ProductPrototypeModifierEnum.valueOf(rs.getString("modifier")!!),
                            getPrototypeResources(rs.getInt("product_prototype_id"))
                        )
                    }

    @GetMapping("/{prototypeId}/resources", produces=[MediaType.APPLICATION_JSON_VALUE])
    @Transactional
    fun getPrototypeResources(@PathVariable("prototypeId") prototypeId: Int): List<ProductPrototypeResource> =
            jdbcTemplate.queryForStream("select * from get_prototype_resources(?)", {
                rs, _ -> ProductPrototypeResource(
                    ProductPrototypeResourceType.valueOf(rs.getString("resource_type")),
                    rs.getString("location")
                )
            }, prototypeId).toList()


    @GetMapping("/owning", produces=[MediaType.APPLICATION_JSON_VALUE])
    @Transactional
    fun getOwningPrototypeList() = appState.user?.let {getPrototypeList(it.user_profile_id) }?: listOf()

}