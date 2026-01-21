import {createAccessControl} from "better-auth/plugins/access";
import {
	adminAc as defaultAdminAc,
	memberAc as defaultMemberAc,
	ownerAc as defaultOwnerAc,
	defaultStatements,
} from "better-auth/plugins/organization/access";

/**
 * Custom permission statements for your application.
 * Extend the default better-auth statements with your own.
 *
 * The `defaultStatements` include organization-level permissions like:
 * - organization: ["create", "update", "delete"]
 * - member: ["create", "update", "delete"]
 * - invitation: ["create", "cancel"]
 *
 * Add your app-specific permissions below. Each key represents a resource,
 * and the array contains the allowed actions for that resource.
 *
 * Example: To add permissions for a "document" resource:
 *   document: ["create", "read", "update", "delete", "share", "archive"],
 */
const permissionStatements = {
	...defaultStatements,
	/**
	 * Project permissions - for managing projects within an organization.
	 * Common use cases: project management, workspaces, team projects.
	 */
	project: ["create", "read", "update", "delete"],
	/**
	 * Resource permissions - generic resource for application-specific entities.
	 * Extend or rename this based on your application's domain.
	 * Examples: "document", "report", "asset", "workflow", etc.
	 */
	resource: ["create", "read", "update", "delete"],
} as const;

/**
 * Access control instance with custom permission statements.
 */
export const accessControl = createAccessControl(permissionStatements);

/**
 * Owner role - Full access to everything.
 *
 * Owners have complete control over all resources including:
 * - All default organization permissions (organization, member, invitation)
 * - Full CRUD access to projects and resources
 *
 * Typically assigned to organization creators or super-admins.
 */
const owner = accessControl.newRole({
	...defaultOwnerAc.statements,
	// Full access to all custom permissions
	project: ["create", "read", "update", "delete"],
	resource: ["create", "read", "update", "delete"],
});

/**
 * Admin role - Can manage most resources but with some restrictions.
 *
 * Admins can:
 * - Manage projects (create, read, update) but cannot delete
 * - Read resources but cannot modify them
 * - Perform default admin operations (member management, invitations)
 *
 * Extend these permissions based on your application's needs.
 */
const admin = accessControl.newRole({
	...defaultAdminAc.statements,
	// Admin can manage projects but not delete; read-only for resources
	project: ["create", "read", "update"],
	resource: ["read"],
});

/**
 * Member role - Basic read access with limited write permissions.
 *
 * Members can:
 * - View projects (read-only)
 * - View resources (read-only)
 * - Perform default member operations
 *
 * This is the most restrictive role for regular team members.
 */
const member = accessControl.newRole({
	...defaultMemberAc.statements,
	// Read-only access to projects and resources
	project: ["read"],
	resource: ["read"],
});

/**
 * Exported roles for use in better-auth organization plugin.
 */
export const roles = {owner, admin, member};
