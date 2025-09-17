import { z } from "zod"

export default z.object({ "_id": z.union([z.any(), z.null()]).describe("MongoDB document ObjectID").default(null), "author_id": z.union([z.object({ "id": z.string(), "collection": z.string() }), z.record(z.any())]), "target_type": z.enum(["POST","COMMENT"]).default("POST"), "target_id": z.any(), "content": z.string(), "created_at": z.string().datetime({ offset: true }).optional(), "updated_at": z.string().datetime({ offset: true }).optional(), "is_deleted": z.boolean().default(false), "is_edited": z.boolean().default(false) })
