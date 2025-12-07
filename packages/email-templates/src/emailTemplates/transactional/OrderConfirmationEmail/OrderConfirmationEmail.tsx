import {Column, Row, Section, Text} from "@react-email/components";

import {Layout} from "../../../components/Layout";
import type {iOrderConfirmationEmailProps} from "../../../customTypes";

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

const orderInfoStyle: React.CSSProperties = {
	backgroundColor: "#f4f4f4",
	padding: "16px",
	marginBottom: "24px",
};

const orderInfoLabelStyle: React.CSSProperties = {
	fontSize: "12px",
	color: "#8898aa",
	textTransform: "uppercase",
	margin: "0 0 4px 0",
};

const orderInfoValueStyle: React.CSSProperties = {
	fontSize: "16px",
	fontWeight: "bold",
	color: "#1a1a1a",
	margin: 0,
};

const tableHeaderStyle: React.CSSProperties = {
	backgroundColor: "#f4f4f4",
	padding: "12px",
	fontSize: "12px",
	fontWeight: "bold",
	color: "#525f7f",
	textTransform: "uppercase",
};

const tableCellStyle: React.CSSProperties = {
	padding: "12px",
	fontSize: "14px",
	color: "#525f7f",
	borderBottom: "1px solid #e6ebf1",
};

const totalRowStyle: React.CSSProperties = {
	padding: "12px",
	fontSize: "14px",
	color: "#525f7f",
};

const grandTotalStyle: React.CSSProperties = {
	padding: "12px",
	fontSize: "18px",
	fontWeight: "bold",
	color: "#1a1a1a",
};

const addressStyle: React.CSSProperties = {
	backgroundColor: "#f4f4f4",
	padding: "16px",
	marginTop: "24px",
};

const addressLabelStyle: React.CSSProperties = {
	fontSize: "12px",
	color: "#8898aa",
	textTransform: "uppercase",
	margin: "0 0 8px 0",
};

const addressTextStyle: React.CSSProperties = {
	fontSize: "14px",
	color: "#525f7f",
	margin: 0,
};

function formatCurrency(amount: number): string {
	return `$${amount.toFixed(2)}`;
}

export function OrderConfirmationEmail({
	firstName,
	orderId,
	orderDate,
	items,
	subtotal,
	shipping,
	total,
	shippingAddress,
	estimatedDelivery,
}: iOrderConfirmationEmailProps): React.ReactElement {
	return (
		<Layout preview={`Order Confirmed - #${orderId}`}>
			<Section>
				<Text style={headingStyle}>Order Confirmed!</Text>
				<Text style={paragraphStyle}>Hi {firstName},</Text>
				<Text style={paragraphStyle}>
					Thank you for your order. We&apos;re getting it ready to be shipped.
					We will notify you when it has been sent.
				</Text>

				{/* Order Info */}
				<Section style={orderInfoStyle}>
					<Row>
						<Column>
							<Text style={orderInfoLabelStyle}>Order Number</Text>
							<Text style={orderInfoValueStyle}>#{orderId}</Text>
						</Column>
						<Column>
							<Text style={orderInfoLabelStyle}>Order Date</Text>
							<Text style={orderInfoValueStyle}>{orderDate}</Text>
						</Column>
						{estimatedDelivery && (
							<Column>
								<Text style={orderInfoLabelStyle}>Estimated Delivery</Text>
								<Text style={orderInfoValueStyle}>{estimatedDelivery}</Text>
							</Column>
						)}
					</Row>
				</Section>

				{/* Order Items Table */}
				<Section>
					<Row>
						<Column style={{...tableHeaderStyle, width: "50%"}}>Item</Column>
						<Column style={{...tableHeaderStyle, width: "20%", textAlign: "center"}}>Qty</Column>
						<Column style={{...tableHeaderStyle, width: "30%", textAlign: "right"}}>Price</Column>
					</Row>
					{items.map((item, index) => (
						<Row key={index}>
							<Column style={{...tableCellStyle, width: "50%"}}>{item.name}</Column>
							<Column style={{...tableCellStyle, width: "20%", textAlign: "center"}}>{item.quantity}</Column>
							<Column style={{...tableCellStyle, width: "30%", textAlign: "right"}}>{formatCurrency(item.price)}</Column>
						</Row>
					))}

					{/* Totals */}
					<Row>
						<Column style={{...totalRowStyle, width: "70%", textAlign: "right"}}>Subtotal</Column>
						<Column style={{...totalRowStyle, width: "30%", textAlign: "right"}}>{formatCurrency(subtotal)}</Column>
					</Row>
					<Row>
						<Column style={{...totalRowStyle, width: "70%", textAlign: "right"}}>Shipping</Column>
						<Column style={{...totalRowStyle, width: "30%", textAlign: "right"}}>{formatCurrency(shipping)}</Column>
					</Row>
					<Row>
						<Column style={{...grandTotalStyle, width: "70%", textAlign: "right"}}>Total</Column>
						<Column style={{...grandTotalStyle, width: "30%", textAlign: "right"}}>{formatCurrency(total)}</Column>
					</Row>
				</Section>

				{/* Shipping Address */}
				<Section style={addressStyle}>
					<Text style={addressLabelStyle}>Shipping Address</Text>
					<Text style={addressTextStyle}>
						{shippingAddress.split("\n").map((line, index, array) => (
							<span key={index}>
								{line}
								{index < array.length - 1 && <br />}
							</span>
						))}
					</Text>
				</Section>
			</Section>
		</Layout>
	);
}

OrderConfirmationEmail.PreviewProps = {
	firstName: "John",
	orderId: "ORD-2024-001234",
	orderDate: "December 7, 2025",
	items: [
		{name: "Wireless Headphones", quantity: 1, price: 149.99},
		{name: "Phone Case", quantity: 2, price: 29.99},
		{name: "USB-C Cable", quantity: 3, price: 12.99},
	],
	subtotal: 248.94,
	shipping: 9.99,
	total: 258.93,
	shippingAddress: "John Doe\n123 Main Street\nApt 4B\nNew York, NY 10001\nUnited States",
	estimatedDelivery: "Dec 12 - Dec 15",
} satisfies iOrderConfirmationEmailProps;

export default OrderConfirmationEmail;
