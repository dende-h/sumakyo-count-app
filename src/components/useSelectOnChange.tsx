import { ChangeEventHandler, useState } from "react";

export const useSelectOnChange = () => {
	const [value, setValue] = useState("");

	const onChangeSelect: ChangeEventHandler<HTMLSelectElement> = (e) => {
		setValue(e.target.value);
	};
	return { value, onChangeSelect };
};
