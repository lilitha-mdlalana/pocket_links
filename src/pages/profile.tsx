// pages/profile.tsx
import Head from "next/head";
import {
  VStack,
  HStack,
  Text,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Box,
  Divider,
  Badge,
  IconButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { MdDelete, MdAdd } from "react-icons/md";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useCategories } from "@/hooks/useCategories";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { categories, isLoading, createCategory, deleteCategory } =
    useCategories();

  const [newCategoryName, setNewCategoryName] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  if (status === "loading") return <Text>Loading...</Text>;
  if (!session) {
    router.push("/api/auth/signin");
    return null;
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!newCategoryName.trim())
      return setFormError("Category name is required");
    if (newCategoryName.trim().length > 50)
      return setFormError("Category name must be 50 characters or less");

    setIsSubmitting(true);
    const success = await createCategory(newCategoryName);
    if (success) setNewCategoryName("");
    setIsSubmitting(false);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    await deleteCategory(categoryToDelete.id);
    setCategoryToDelete(null);
    onClose();
  };

  return (
    <>
      <Head>
        <title>Pocket Links | Profile</title>
        <meta name="description" content="Manage your profile and categories" />
      </Head>

      <VStack spacing={8} maxW="2xl" mx="auto" p={4}>
        <Box>
          <Text as="h1" fontSize="3xl" fontWeight="bold">
            Profile
          </Text>
          <VStack align="start" spacing={2}>
            <Text>
              <strong>Name:</strong> {session.user?.name || "Not provided"}
            </Text>
            <Text>
              <strong>Email:</strong> {session.user?.email}
            </Text>
          </VStack>
        </Box>

        <Divider />

        <Box>
          <Text as="h2" fontSize="2xl" fontWeight="bold" mb={4}>
            Manage Categories
          </Text>

          <Box bg="gray.50" p={4} borderRadius="md" mb={6}>
            <form onSubmit={handleAddCategory}>
              <FormControl isInvalid={!!formError} mb={4}>
                <FormLabel>New Category</FormLabel>
                <HStack>
                  <Input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter category name"
                    maxLength={50}
                    bg="white"
                  />
                  <Button
                    type="submit"
                    colorScheme="blue"
                    leftIcon={<MdAdd />}
                    isLoading={isSubmitting}
                  >
                    Add
                  </Button>
                </HStack>
                <FormErrorMessage>{formError}</FormErrorMessage>
              </FormControl>
            </form>
          </Box>

          <Box>
            <Text fontWeight="semibold" mb={3}>
              Your Categories ({categories.length})
            </Text>
            {isLoading ? (
              <Text color="gray.500">Loading categories...</Text>
            ) : categories.length === 0 ? (
              <Text color="gray.500">No categories yet. Add one above!</Text>
            ) : (
              <VStack spacing={2} align="stretch">
                {categories.map((category) => (
                  <HStack
                    key={category.id}
                    justify="space-between"
                    p={3}
                    bg="white"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.200"
                  >
                    <HStack>
                      <Text fontWeight="medium">{category.name}</Text>
                      <Badge colorScheme="blue">
                        {category._count?.links ?? 0} links
                      </Badge>
                    </HStack>
                    <IconButton
                      aria-label="Delete category"
                      icon={<MdDelete />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => {
                        if ((category._count?.links ?? 0) === 0) {
                          setCategoryToDelete({
                            id: category.id,
                            name: category.name,
                          });
                          onOpen();
                        }
                      }}
                      isDisabled={(category._count?.links ?? 0) > 0}
                      title={
                        (category._count?.links ?? 0) > 0
                          ? "Cannot delete category with links"
                          : "Delete category"
                      }
                    />
                  </HStack>
                ))}
              </VStack>
            )}
          </Box>
        </Box>
      </VStack>

      {/* Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete Category</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete the category &quot;
              {categoryToDelete?.name}&quot;? This cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
