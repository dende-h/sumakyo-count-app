import { useState } from "react";

export const useCountUpDown = () => {
	const [count, setCount] = useState<number>(0);

	const upButtonClick = () => {
		setCount(count + 1);
	};
	const downButtonClick = () => {
		setCount(count - 1);
	};

	return { count, upButtonClick, downButtonClick, setCount };
};
