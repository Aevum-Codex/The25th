import { z } from "zod"

export default z.object({ "_id": z.union([z.any(), z.null()]).describe("MongoDB document ObjectID").default(null), "username": z.string(), "password": z.string(), "profile": z.any(), "created_at": z.string().datetime({ offset: true }).optional(), "updated_at": z.string().datetime({ offset: true }).optional(), "is_active": z.boolean().default(true), "user_type": z.enum(["STUDENT","TEACHER","OTHER"]).default("OTHER") })
