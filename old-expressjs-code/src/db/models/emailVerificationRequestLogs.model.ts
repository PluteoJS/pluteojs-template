export interface iEmailVerificationRequestLogsModel {
	id: string;
	email: string;
	req_date_time: string;
	req_ip_address: string;
	otp: string;
	is_otp_usable: boolean;
	created_at: string;
	updated_at: string;
}
