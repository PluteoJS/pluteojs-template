import React, {FC} from "react";

import {ComponentIdType} from "@/customTypes/CommonTypes";

type iExampleComponentProps = {
	id?: ComponentIdType;
	label: string;
};

const ExampleComponent: FC<iExampleComponentProps> = ({
	id,
	label,
}: iExampleComponentProps) => {
	return (
		<div id={id}>
			<text>Example Component {label}</text>
		</div>
	);
};

ExampleComponent.displayName = "ExampleComponent";

export default ExampleComponent;
