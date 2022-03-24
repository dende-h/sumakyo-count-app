import { ChakraProvider } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";
import theme from "../theme";
import { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider resetCSS theme={theme}>
			<RecoilRoot>
				<Component {...pageProps} />
			</RecoilRoot>
		</ChakraProvider>
	);
}

export default MyApp;
