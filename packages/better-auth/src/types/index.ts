import type {Session, User} from "better-auth";

/**
 * Extended user type with additional fields.
 */
export interface ExtendedUser extends User {
	// Add custom user fields here if needed
}

/**
 * Extended session type with organization context.
 */
export interface ExtendedSession extends Session {
	activeOrganizationId?: string | null;
	activeTeamId?: string | null;
}

/**
 * Auth session response from better-auth.
 */
export interface AuthSession {
	user: ExtendedUser;
	session: ExtendedSession;
}

/**
 * Organization invitation email data.
 */
export interface OrganizationInviteEmailData {
	id: string;
	email: string;
	organization: {
		id: string;
		name: string;
		slug: string;
		logo?: string | null;
	};
	inviter: {
		userId: string;
		user: {
			name: string;
			email: string;
		};
	};
	role: string;
	invitation: {
		expiresAt: Date;
	};
}

/**
 * Email verification data.
 */
export interface EmailVerificationData {
	user: {
		id: string;
		email: string;
		name: string;
	};
	url: string;
	token: string;
}

/**
 * Password reset email data.
 */
export interface PasswordResetEmailData {
	user: {
		id: string;
		email: string;
		name: string;
	};
	url: string;
	token: string;
}
