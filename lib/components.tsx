import type { ComponentProps, ReactElement } from "react";

export function Input(props: ComponentProps<"input">): ReactElement {
	const { placeholder } = props;
	return (
		<label>
			<p>{placeholder}</p>
			<input {...props} />
		</label>
	);
}
