import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";

interface UsePaginationProps<T> {
  initialData: {
    items: T[];
    pagination: {
      currentPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      nextCursor: string | null;
      prevCursor: string | null;
      totalCount: number;
      totalPages: number;
    };
  };
  basePath?: string;
}

export function usePagination<T>({
  initialData,
  basePath = "",
}: UsePaginationProps<T>) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const navigateToPage = useCallback(
    async (
      direction: "next" | "prev" | "specific",
      cursor?: string,
      pageNumber?: number,
    ) => {
      setLoading(true);

      try {
        const queryParams = new URLSearchParams(window.location.search);

        if (direction === "next" && cursor) {
          queryParams.set("cursor", cursor);
          queryParams.set("page", (data.pagination.currentPage + 1).toString());
        } else if (direction === "prev") {
          queryParams.set(
            "page",
            Math.max(1, data.pagination.currentPage - 1).toString(),
          );
          queryParams.delete("cursor");
        } else if (direction === "specific" && pageNumber) {
          queryParams.set("page", pageNumber.toString());
          queryParams.delete("cursor");
        }

        const newUrl = `${basePath}?${queryParams.toString()}`;
        await router.push(newUrl);
      } catch (error) {
        toast({
          title: `Navigation Error ${error}`,
          description: "Failed to load page",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    },
    [data.pagination.currentPage, router, toast, basePath],
  );

  const goToNextPage = useCallback(() => {
    if (data.pagination.hasNextPage) {
      navigateToPage("next", data.pagination.nextCursor || undefined);
    }
  }, [data.pagination.hasNextPage, data.pagination.nextCursor, navigateToPage]);

  const goToPrevPage = useCallback(() => {
    if (data.pagination.hasPrevPage) {
      navigateToPage("prev");
    }
  }, [data.pagination.hasPrevPage, navigateToPage]);

  const goToPage = useCallback(
    (pageNumber: number) => {
      if (pageNumber >= 1 && pageNumber <= data.pagination.totalPages) {
        navigateToPage("specific", undefined, pageNumber);
      }
    },
    [data.pagination.totalPages, navigateToPage],
  );

  return {
    data: data.items,
    pagination: data.pagination,
    loading,
    goToNextPage,
    goToPrevPage,
    goToPage,
    setData,
  };
}
