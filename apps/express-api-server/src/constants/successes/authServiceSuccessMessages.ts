/**
 * Helper function to create typed service success messages.
 */
function asTypeIServiceSuccess<
	T extends Record<string, Record<string, {message: string}>>,
>(success: T): T {
	return success;
}

export const authServiceSuccessMessage = asTypeIServiceSuccess({
	passwordReset: {
		passwordResetSuccess: {
			message: "Password reset successfully",
		},
	},
});
