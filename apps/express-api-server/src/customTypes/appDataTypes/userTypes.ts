/**
 * User interface matching better-auth user schema.
 */
export interface iUser {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	image: string | null;
	createdAt: string;
	updatedAt: string;
}

/**
 * @deprecated Use better-auth for user creation.
 * This interface is kept for backwards compatibility during migration.
 */
export interface iUserInputDTO {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}
