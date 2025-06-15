import Head from "next/head";
import { Grid, Text, Button, HStack, VStack, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";
import prisma from "@/lib/prisma";
import { HomeProps } from "@/types/types";
import { getServerSession } from "next-auth/next";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { LinkCard } from "@/components/LinkCard/LinkCard";

const LINKS_PER_PAGE = 12;

interface PaginationInfo {
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextCursor: string | null;
  totalCount: number;
  totalPages: number;
}

interface HomePageProps extends HomeProps {
  pagination: PaginationInfo;
  error?: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const session: Session | null = await getServerSession(
      context.req,
      context.res,
      authOptions,
    );

    if (!session?.user?.email) {
      return {
        redirect: {
          destination: "/api/auth/signin",
          permanent: false,
        },
      };
    }

    const page = parseInt(context.query.page as string) || 1;
    const skip = (page - 1) * LINKS_PER_PAGE;

    // Build where clause
    const where = {
      user: {
        email: session.user.email,
      },
    };

    // Get total count for pagination info
    const totalCount = await prisma.link.count({ where });

    // Get links with pagination
    const links = await prisma.link.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: LINKS_PER_PAGE,
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

    const totalPages = Math.ceil(totalCount / LINKS_PER_PAGE);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      props: {
        links: serializedLinks,
        pagination: {
          currentPage: page,
          hasNextPage,
          hasPrevPage,
          nextCursor: hasNextPage ? links[links.length - 1]?.id || null : null,
          totalCount,
          totalPages,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching links:", error);
    return {
      props: {
        links: [],
        pagination: {
          currentPage: 1,
          hasNextPage: false,
          hasPrevPage: false,
          nextCursor: null,
          totalCount: 0,
          totalPages: 0,
        },
        error: "Failed to load links",
      },
    };
  }
};

export default function Home({ links, pagination, error }: HomePageProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handlePageChange = async (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;

    setLoading(true);

    try {
      await router.push(`/?page=${page}`);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to load page",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (linkId: string) => {
    // TODO: Implement edit functionality
    console.log(`Edit link with id: ${linkId}`);
  };

  const handlePin = async (linkId: string) => {
    // TODO: Implement pin functionality
    console.log(`Pin link with id: ${linkId}`);
  };

  if (error) {
    return (
      <>
        <Head>
          <title>Pocket Links | Home</title>
          <meta name="description" content="PocketLinks" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <VStack spacing={4} py={8}>
          <Text color="red.500" fontSize="lg">
            {error}
          </Text>
          <Button onClick={() => router.reload()}>Try Again</Button>
        </VStack>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Pocket Links | Home</title>
        <meta name="description" content="PocketLinks" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <HStack justify="space-between" align="center" mb={4}>
          <Text as="h1" fontWeight="bold" fontSize="3xl">
            Your Links
          </Text>
          <Text color="gray.500" fontSize="sm">
            {pagination.totalCount} total links
          </Text>
        </HStack>

        {links.length === 0 ? (
          <VStack spacing={4} py={12}>
            <Text fontSize="lg" color="gray.500">
              No links found
            </Text>
          </VStack>
        ) : (
          <>
            <Grid
              templateColumns={{
                base: "repeat(1, 1fr)",
                md: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
              }}
              gap={4}
              mt={4}
            >
              {links.map((link) => (
                <LinkCard
                  key={link.id}
                  title={link.title || ""}
                  description={link.description || ""}
                  category={link.category?.name || "Uncategorized"}
                  linkUrl={link.url}
                  onEdit={() => handleEdit(link.id)}
                  onPin={() => handlePin(link.id)}
                />
              ))}
            </Grid>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <HStack justify="space-between" align="center" pt={6}>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage || loading}
                  isLoading={loading}
                >
                  Previous
                </Button>

                <HStack spacing={2}>
                  <Text fontSize="sm" color="gray.600">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </Text>
                </HStack>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage || loading}
                  isLoading={loading}
                >
                  Next
                </Button>
              </HStack>
            )}
          </>
        )}
      </div>
    </>
  );
}
