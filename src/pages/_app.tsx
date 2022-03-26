import { ChakraProvider } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";
import theme from "../theme";
import { AppProps } from "next/app";
import HeaderLayout from "../components/templates/HeaderLayout";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider resetCSS theme={theme}>
			<RecoilRoot>
				<HeaderLayout>
					<Component {...pageProps} />
				</HeaderLayout>
			</RecoilRoot>
		</ChakraProvider>
	);
}

export default MyApp;
