import { useState } from "react";

export const useCountUpDown = (props?: number) => {
	const [count, setCount] = useState<number>(props ? props : 0);

	const upButtonClick = () => {
		setCount(count + 1);
	};
	const downButtonClick = () => {
		setCount(count - 1);
	};

	return { count, upButtonClick, downButtonClick, setCount };
};
