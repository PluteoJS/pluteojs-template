export interface iEmailLogModel {
	id: string;
	user_id: string;
	message_id: string;
	sender_address: string;
	target_address: string;
	subject: string;
	body_type: string;
	body: string;
	created_at: string;
}
