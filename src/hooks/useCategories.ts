// hooks/useCategories.ts
import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";

interface Category {
  id: string;
  name: string;
  _count?: {
    links: number;
  };
}

interface UseCategoriesReturn {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  createCategory: (name: string) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  refreshCategories: () => Promise<void>;
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/category");

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      toast({
        title: "Error",
        description: "Failed to load categories",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createCategory = async (name: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setCategories((prev) => [...prev, data]);
        toast({
          title: "Success",
          description: "Category created successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create category",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return false;
      }
    } catch (err) {
      toast({
        title: `Error ${err}`,
        description: "Failed to create category",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/category?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
        toast({
          title: "Success",
          description: "Category deleted successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete category",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return false;
      }
    } catch (err) {
      toast({
        title: `Error ${err}`,
        description: "Failed to delete category",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  };

  const refreshCategories = async () => {
    await fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    isLoading,
    error,
    createCategory,
    deleteCategory,
    refreshCategories,
  };
}

export function useCategoriesSimple() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/category");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading };
}
