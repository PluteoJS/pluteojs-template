import type {Session, User} from "better-auth";

/**
 * Extended user type with additional fields.
 *
 * FIXME: This interface currently has no additional members beyond what User provides.
 * The eslint-disable below suppresses the "no-empty-object-type" warning because this
 * interface is intentionally kept as a placeholder for future customization.
 *
 * When you add custom user fields (e.g., phoneNumber, avatarUrl, preferences):
 * 1. Add your custom properties to this interface
 * 2. Remove the eslint-disable comment below - it will no longer be needed
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ExtendedUser extends User {
	// Add custom user fields here
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
