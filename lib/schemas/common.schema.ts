import { z } from "zod";

// Common MongoDB ObjectId schema used across all documents
export const PydanticObjectIdSchema = z
	.string()
	.min(24)
	.max(24)
	.regex(/^[0-9a-f]{24}$/);

// Media type enumeration
export const MediaTypeSchema = z.enum(["IMAGE", "VIDEO", "AUDIO"]);

// Media reference schema for attachments
export const MediaRefSchema = z.object({
	url: z.string().url().min(1).max(2083),
	kind: MediaTypeSchema.default("IMAGE"),
	alt: z.union([z.string(), z.null()]).default(null),
	metadata: z
		.union([z.record(z.string(), z.unknown()), z.null()])
		.default(null),
});

// User type enumeration
export const UserTypeSchema = z.enum(["STUDENT", "TEACHER", "OTHER"]);

// Target type for reactions and comments
export const TargetTypeSchema = z.enum(["POST", "COMMENT"]);

// Post type enumeration
export const PostTypeSchema = z.enum(["POST", "MEMORY"]);

// Reaction type enumeration
export const ReactionTypeSchema = z.enum([
	"LIKE",
	"DISLIKE",
	"LOVE",
	"HAHA",
	"WOW",
	"SAD",
	"ANGRY",
]);
