export interface iPasswordResetLogModel {
	id: string;
	user_id: string;
	email: string;
	datetime: string;
	req_ip_address: string;
	otp: string;
	is_otp_usable: boolean;
	created_at: string;
}
