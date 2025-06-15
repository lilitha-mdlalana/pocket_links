import { GetServerSideProps } from "next";
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  HStack,
  Text,
  VStack,
  Grid,
} from "@chakra-ui/react";
import { BiChevronRight } from "react-icons/bi";
import Link from "next/link";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { LinkCard } from "@/components/LinkCard/LinkCard";
import { Link as CustomLink, SerializedLink } from "@/types/types";

interface CategoryPageProps {
  links: SerializedLink[];
  category: { id: string; name: string };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
  };
  error?: string;
}

export default function CategoryPage({
  links,
  category,
  pagination,
  error,
}: CategoryPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePageChange = async (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;

    setLoading(true);
    try {
      await router.push(
        `/category/${encodeURIComponent(category.name)}?page=${page}`
      );
    } catch (err) {
      console.error("Navigation error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <VStack spacing={4} py={8}>
        <Text color="red.500" fontSize="lg">
          {error}
        </Text>
        <Button as={Link} href="/" colorScheme="blue">
          Go Home
        </Button>
      </VStack>
    );
  }

  return (
    <>
      <Head>
        <title>Pocket Links | {category.name}</title>
        <meta
          name="description"
          content={`Links in ${category.name} category`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Breadcrumb
        spacing="8px"
        separator={<BiChevronRight color="gray.500" />}
        mb={6}
      >
        <BreadcrumbItem>
          <Link href="/" passHref>
            <BreadcrumbLink>Home</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>{category.name}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {links.length === 0 ? (
        <VStack spacing={6} py={12} textAlign="center">
          <Text fontSize="xl" color="gray.500">
            No links in this category yet
          </Text>
          <Text color="gray.400">
            Start building your {category.name} collection!
          </Text>
        </VStack>
      ) : (
        <>
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
              xl: "repeat(4, 1fr)",
            }}
            gap={4}
            mb={8}
          >
            {links.map((link: SerializedLink) => (
              <LinkCard
                key={link.id}
                title={link.title || "Untitled"}
                description={link.description || "No description"}
                category={link.category?.name || "Uncategorized"}
                linkUrl={link.url}
                onEdit={() => console.log("Edit:", link.id)}
                onPin={() => console.log("Pin:", link.id)}
              />
            ))}
          </Grid>

          {pagination.totalPages > 1 && (
            <VStack spacing={4}>
              <HStack justify="space-between" w="full">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  isDisabled={!pagination.hasPrevPage || loading}
                  isLoading={loading}
                >
                  Previous
                </Button>
                <Text fontSize="sm" color="gray.600">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </Text>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  isDisabled={!pagination.hasNextPage || loading}
                  isLoading={loading}
                >
                  Next
                </Button>
              </HStack>
            </VStack>
          )}
        </>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session || !session.user?.email) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  const name = context.params?.name as string;
  const page = parseInt((context.query.page as string) || "1", 10);
  const pageSize = 12;

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) return { notFound: true };

    const category = await prisma.category.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        userId: user.id,
      },
    });

    if (!category) return { notFound: true };

    const totalCount = await prisma.link.count({
      where: { categoryId: category.id },
    });

    const links = await prisma.link.findMany({
      where: { categoryId: category.id },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { category: { select: { name: true } } },
    });

    const serializedLinks = links.map(
      (
        link
      ): {
        createdAt: string;
        category: { name: string } | null;
        id: string;
        url: string;
        title: string | null;
        description: string | null;
        userId: string;
        categoryId: string | null;
      } => ({
        ...link,
        createdAt: link.createdAt.toISOString(),
        category: link.category ? { ...link.category } : null,
      })
    );

    return {
      props: {
        links: serializedLinks,
        category: { id: category.id, name: category.name },
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / pageSize),
          totalCount,
          hasPrevPage: page > 1,
          hasNextPage: page < Math.ceil(totalCount / pageSize),
        },
      },
    };
  } catch (err) {
    console.error("Error in getServerSideProps:", err);
    return {
      props: {
        links: [],
        category: { id: "", name },
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
          hasPrevPage: false,
          hasNextPage: false,
        },
        error: "Something went wrong while loading this category.",
      },
    };
  }
};
