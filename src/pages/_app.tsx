import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import SidebarWithHeader from "../components/Sidebar/Sidebar";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
    <ChakraProvider >
      <SidebarWithHeader>
      <Component {...pageProps} />
      </SidebarWithHeader>
    </ChakraProvider>
    </SessionProvider>
  );
}
