import { z } from "zod";

export const CredentialsLoginSchema = z.object({
	username: z.string().min(3),
	password: z.string().min(6),
});

export const UpdateCredentialsSchema = z.object({
	current_password: z.string().min(6),
	new_password: z.string().min(6).optional(),
	new_email: z.string().email().optional(),
});

export type CredentialsLoginInput = z.infer<typeof CredentialsLoginSchema>;
export type UpdateCredentialsInput = z.infer<typeof UpdateCredentialsSchema>;
