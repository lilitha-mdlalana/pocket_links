import { HStack, Button, Text, Select } from "@chakra-ui/react";

interface PaginationControlsProps {
  pagination: {
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    totalPages: number;
    totalCount: number;
  };
  loading: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  onGoToPage: (page: number) => void;
}

export function PaginationControls({
  pagination,
  loading,
  onNextPage,
  onPrevPage,
  onGoToPage,
}: PaginationControlsProps) {
  return (
    <HStack justify="space-between" align="center" pt={4} spacing={4}>
      <Button
        variant="outline"
        onClick={onPrevPage}
        disabled={!pagination.hasPrevPage || loading}
        isLoading={loading && !pagination.hasPrevPage}
        size="sm"
      >
        Previous
      </Button>

      <HStack spacing={4} align="center">
        <Text fontSize="sm" color="gray.600">
          Page {pagination.currentPage} of {pagination.totalPages}
        </Text>

        {pagination.totalPages > 1 && (
          <HStack spacing={2} align="center">
            <Text fontSize="sm" color="gray.600">
              Go to:
            </Text>
            <Select
              size="sm"
              width="auto"
              value={pagination.currentPage}
              onChange={(e) => onGoToPage(parseInt(e.target.value))}
              disabled={loading}
            >
              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1,
              ).map((pageNum) => (
                <option key={pageNum} value={pageNum}>
                  {pageNum}
                </option>
              ))}
            </Select>
          </HStack>
        )}

        <Text fontSize="sm" color="gray.500">
          ({pagination.totalCount} total)
        </Text>
      </HStack>

      <Button
        variant="outline"
        onClick={onNextPage}
        disabled={!pagination.hasNextPage || loading}
        isLoading={loading && pagination.hasNextPage}
        size="sm"
      >
        Next
      </Button>
    </HStack>
  );
}
