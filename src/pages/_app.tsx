import { ChakraProvider } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";
import theme from "../theme";
import { AppProps } from "next/app";
import HeaderLayout from "../components/templates/HeaderLayout";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider resetCSS theme={theme}>
			<RecoilRoot>
				<HeaderLayout>
					<Toaster />
					<Component {...pageProps} />
				</HeaderLayout>
			</RecoilRoot>
		</ChakraProvider>
	);
}

export default MyApp;
