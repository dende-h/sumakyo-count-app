import { ChangeEventHandler, useCallback, useState } from "react";

export const useSelectOnChange = (props?: string) => {
	const [value, setValue] = useState(props ? props : "");

	const onChangeSelect: ChangeEventHandler<HTMLSelectElement> = useCallback((e) => {
		setValue(e.target.value);
	}, []);
	return { value, onChangeSelect, setValue };
};
