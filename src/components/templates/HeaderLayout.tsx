import { memo, ReactNode, VFC } from "react";
import { Header } from "../index/Header";

type Props = {
	children: ReactNode;
};

const HeaderLayout: VFC<Props> = memo((props: Props) => {
	const { children } = props;
	return (
		<>
			<Header />
			{children}
		</>
	);
});
export default HeaderLayout;
