import Head from "next/head";
import { Poppins, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import prisma from "@/lib/prisma";
import { HomeProps } from "@/types/types";
import { getServerSession } from "next-auth/next";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { LinkCard } from "@/components/LinkCard/LinkCard";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session: Session | null = await getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  if (!session || !session.user?.email) {
    return {
      props: {
        links: [],
      },
    };
  }

  const links = await prisma.link.findMany({
    where: {
      user: {
        email: session.user.email,
      },
    },
    include: {
      category: true,
    },
  });

  const serializedLinks = links.map((link) => ({
    ...link,
    createdAt: link.createdAt.toISOString(),
    category: link.category
      ? {
          ...link.category,
        }
      : null,
  }));

  return {
    props: { links: serializedLinks },
  };
};

export default function Home({ links }: HomeProps) {
  console.log(links);
  return (
    <>
      <Head>
        <title>Pocket Links | Home </title>
        <meta name="description" content="PocketLinks" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${poppins.className}`}>
        <Text as={"h1"} fontWeight={"bold"} fontSize={"3xl"}>
          Your Links
        </Text>
        <SimpleGrid as={"div"} minChildWidth={"320px"} spacing={4} mt={4}>
          {/* {links &&
            links.map((link) => (
              <>
                <LinkCard />
                <LinkCard />
                <LinkCard />
              </>
            ))} */}
            <>
            <LinkCard />
            <LinkCard />
            <LinkCard />
            <LinkCard />
            <LinkCard />
            <LinkCard />
            </>
        </SimpleGrid>
      </div>
    </>
  );
}
