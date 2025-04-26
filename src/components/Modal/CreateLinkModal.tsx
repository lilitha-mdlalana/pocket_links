"use client";
import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  IconButton,
  FormErrorMessage,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { ImPlus } from "react-icons/im";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { createLinkValidationSchema } from "@/utils/validationSchemas";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const CreateLinkModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/category");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        toast({
          title: "Error",
          description: `Error fetching categories: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchCategories();
  }, []);

  const initialValues = {
    title: "",
    url: "",
    description: "",
    categoryId: "",
  };

  const onSubmit = async (values: typeof initialValues) => {
    try {
      setLoading(true);
      await fetch("/api/link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      toast({
        title: "Success",
        description: "Link created!",
        position: "top-right",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      onClose();
      setLoading(false);
      router.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: `Error creating link: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <IconButton
        aria-label="Create Link"
        icon={<ImPlus />}
        onClick={onOpen}
        size="sm"
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={createLinkValidationSchema}
          >
            {({ errors, touched }) => (
              <Form>
                <ModalHeader>Add A New Link</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  <FormControl isInvalid={!!errors.title && touched.title}>
                    <FormLabel>Site Name</FormLabel>
                    <Field
                      type="text"
                      name="title"
                      as={Input}
                      placeholder="Google"
                    />
                    <ErrorMessage name="title" component={FormErrorMessage} />
                  </FormControl>

                  <FormControl mt={4} isInvalid={!!errors.url && touched.url}>
                    <FormLabel>URL</FormLabel>
                    <Field
                      type="url"
                      name="url"
                      as={Input}
                      placeholder="https://google.com"
                    />
                    <ErrorMessage name="url" component={FormErrorMessage} />
                  </FormControl>

                  <FormControl
                    mt={4}
                    isInvalid={!!errors.description && touched.description}
                  >
                    <FormLabel>Description</FormLabel>
                    <Field
                      name="description"
                      as={Textarea}
                      placeholder="Google is my favourite search engine"
                    />
                    <ErrorMessage
                      name="description"
                      component={FormErrorMessage}
                    />
                  </FormControl>
                  <FormControl
                    mt={4}
                    isInvalid={!!errors.categoryId && touched.categoryId}
                  >
                    <FormLabel>Category</FormLabel>
                    <Field name="categoryId" as="select">
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="categoryId"
                      component={FormErrorMessage}
                    />
                  </FormControl>
                </ModalBody>

                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    type="submit"
                    isLoading={loading}
                    loadingText="Creating..."
                    isDisabled={loading}
                  >
                    Create
                  </Button>

                  <Button onClick={onClose} type="button">
                    Cancel
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateLinkModal;
