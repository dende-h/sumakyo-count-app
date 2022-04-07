import { ChangeEventHandler, useCallback, useState } from "react";

export const useInputValue = () => {
	const [value, setValue] = useState("");

	const onChangeInput: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
		setValue(e.target.value);
	}, []);
	return { value, onChangeInput };
};
