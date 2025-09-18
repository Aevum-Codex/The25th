import { z } from "zod"
import { PydanticObjectIdSchema, ReactionTypeSchema, TargetTypeSchema } from "./common.schema"

export default z.object({ "_id": z.union([PydanticObjectIdSchema, z.null()]).optional(), "author_id": z.union([z.object({ "id": z.string(), "collection": z.string() }), z.record(z.string(), z.unknown())]), "target_id": PydanticObjectIdSchema, "target_type": TargetTypeSchema, "reaction": ReactionTypeSchema, "created_at": z.string().datetime({ offset: true }).optional(), "updated_at": z.string().datetime({ offset: true }).optional(), "is_edited": z.boolean().default(false).optional(), "is_deleted": z.boolean().default(false).optional() })
