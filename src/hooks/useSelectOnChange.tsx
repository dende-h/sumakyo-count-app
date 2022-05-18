import { ChangeEventHandler, useCallback, useState } from "react";

export const useSelectOnChange = () => {
	const [value, setValue] = useState("");

	const onChangeSelect: ChangeEventHandler<HTMLSelectElement> = useCallback((e) => {
		setValue(e.target.value);
	}, []);
	return { value, onChangeSelect, setValue };
};
