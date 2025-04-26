import Head from "next/head";
import { Grid, Text } from "@chakra-ui/react";
import prisma from "@/lib/prisma";
import { HomeProps } from "@/types/types";
import { getServerSession } from "next-auth/next";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { LinkCard } from "@/components/LinkCard/LinkCard";

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
      <div>
        <Text as={"h1"} fontWeight={"bold"} fontSize={"3xl"}>
          Your Links
        </Text>
        <Grid
          as={"div"}
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={4}
          mt={4}
        >
          {links &&
            links.map((link) => (
              <>
                <LinkCard
                  key={link.id}
                  title={link.title || ""}
                  description={link.description || ""}
                  category={link.category?.name || "Uncategorized"}
                  linkUrl={link.url}
                  onEdit={() => console.log(`Edit link with id: ${link.id}`)}
                  onPin={() => console.log(`Pin link with id: ${link.id}`)}
                />
              </>
            ))}
        </Grid>
      </div>
    </>
  );
}
