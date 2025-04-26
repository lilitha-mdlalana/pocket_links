import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import SidebarWithHeader from "../components/Sidebar/Sidebar";
import { SessionProvider } from "next-auth/react";

import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
    <ChakraProvider >
      <SidebarWithHeader>
        <main className={poppins.className}>
        <Component {...pageProps} />
        </main>
      </SidebarWithHeader>
    </ChakraProvider>
    </SessionProvider>
  );
}
