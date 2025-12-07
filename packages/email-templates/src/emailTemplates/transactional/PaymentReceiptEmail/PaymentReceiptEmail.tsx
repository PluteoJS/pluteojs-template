import {Column, Row, Section, Text} from "@react-email/components";

import {Layout} from "../../../components/Layout";
import type {iPaymentReceiptEmailProps} from "../../../customTypes";

const headingStyle: React.CSSProperties = {
	fontSize: "24px",
	fontWeight: "bold",
	color: "#1a1a1a",
	marginBottom: "24px",
};

const paragraphStyle: React.CSSProperties = {
	fontSize: "16px",
	lineHeight: "26px",
	color: "#525f7f",
};

const receiptContainerStyle: React.CSSProperties = {
	backgroundColor: "#f4f4f4",
	padding: "24px",
	margin: "24px 0",
};

const receiptHeaderStyle: React.CSSProperties = {
	fontSize: "12px",
	color: "#8898aa",
	textTransform: "uppercase",
	margin: "0 0 16px 0",
	textAlign: "center",
};

const amountStyle: React.CSSProperties = {
	fontSize: "48px",
	fontWeight: "bold",
	color: "#1a1a1a",
	textAlign: "center",
	margin: "0 0 8px 0",
};

const statusStyle: React.CSSProperties = {
	fontSize: "14px",
	color: "#28a745",
	textAlign: "center",
	fontWeight: "bold",
	margin: 0,
};

const detailsContainerStyle: React.CSSProperties = {
	marginTop: "24px",
};

const detailRowStyle: React.CSSProperties = {
	padding: "12px 0",
	borderBottom: "1px solid #e6ebf1",
};

const detailLabelStyle: React.CSSProperties = {
	fontSize: "14px",
	color: "#8898aa",
	margin: 0,
};

const detailValueStyle: React.CSSProperties = {
	fontSize: "14px",
	color: "#1a1a1a",
	fontWeight: "500",
	margin: 0,
	textAlign: "right",
};

const footerNoteStyle: React.CSSProperties = {
	fontSize: "12px",
	color: "#8898aa",
	textAlign: "center",
	marginTop: "24px",
};

function formatCurrency(amount: number, currency: string = "USD"): string {
	const symbols: Record<string, string> = {
		USD: "$",
		EUR: "€",
		GBP: "£",
	};
	const symbol = symbols[currency] || "$";
	return `${symbol}${amount.toFixed(2)}`;
}

export function PaymentReceiptEmail({
	firstName,
	receiptId,
	paymentDate,
	amount,
	currency = "USD",
	paymentMethod,
	description,
}: iPaymentReceiptEmailProps): React.ReactElement {
	return (
		<Layout preview={`Payment Receipt - ${formatCurrency(amount, currency)}`}>
			<Section>
				<Text style={headingStyle}>Payment Receipt</Text>
				<Text style={paragraphStyle}>Hi {firstName},</Text>
				<Text style={paragraphStyle}>
					Thank you for your payment. Here is your receipt for your records.
				</Text>

				{/* Receipt Card */}
				<Section style={receiptContainerStyle}>
					<Text style={receiptHeaderStyle}>Amount Paid</Text>
					<Text style={amountStyle}>{formatCurrency(amount, currency)}</Text>
					<Text style={statusStyle}>Payment Successful</Text>
				</Section>

				{/* Payment Details */}
				<Section style={detailsContainerStyle}>
					<Row style={detailRowStyle}>
						<Column>
							<Text style={detailLabelStyle}>Receipt ID</Text>
						</Column>
						<Column>
							<Text style={detailValueStyle}>{receiptId}</Text>
						</Column>
					</Row>
					<Row style={detailRowStyle}>
						<Column>
							<Text style={detailLabelStyle}>Payment Date</Text>
						</Column>
						<Column>
							<Text style={detailValueStyle}>{paymentDate}</Text>
						</Column>
					</Row>
					<Row style={detailRowStyle}>
						<Column>
							<Text style={detailLabelStyle}>Payment Method</Text>
						</Column>
						<Column>
							<Text style={detailValueStyle}>{paymentMethod}</Text>
						</Column>
					</Row>
					<Row style={{...detailRowStyle, borderBottom: "none"}}>
						<Column>
							<Text style={detailLabelStyle}>Description</Text>
						</Column>
						<Column>
							<Text style={detailValueStyle}>{description}</Text>
						</Column>
					</Row>
				</Section>

				<Text style={footerNoteStyle}>
					This receipt serves as confirmation of your payment. Please keep it for your records.
				</Text>
			</Section>
		</Layout>
	);
}

PaymentReceiptEmail.PreviewProps = {
	firstName: "John",
	receiptId: "RCP-2024-789012",
	paymentDate: "December 7, 2025",
	amount: 99.99,
	currency: "USD",
	paymentMethod: "Visa ending in 4242",
	description: "Pro Plan - Monthly Subscription",
} satisfies iPaymentReceiptEmailProps;

export default PaymentReceiptEmail;
