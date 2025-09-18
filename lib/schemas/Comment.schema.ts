import { z } from "zod";
import { PydanticObjectIdSchema, TargetTypeSchema } from "./common.schema";

export default z.object({
	_id: z.union([PydanticObjectIdSchema, z.null()]).optional(),
	author_id: z.union([
		z.object({ id: z.string(), collection: z.string() }),
		z.record(z.string(), z.unknown()),
	]),
	target_type: TargetTypeSchema,
	target_id: PydanticObjectIdSchema,
	content: z.string(),
	created_at: z.string().datetime({ offset: true }).optional(),
	updated_at: z.string().datetime({ offset: true }).optional(),
	is_deleted: z.boolean().default(false).optional(),
	is_edited: z.boolean().default(false).optional(),
	reaction_count: z.number().int().default(0).optional(),
	comment_count: z.number().int().default(0).optional(),
});
