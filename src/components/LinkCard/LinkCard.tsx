import {
  Avatar,
  Box,
  Button,
  Flex,
  Tag,
  Text,
  Heading,
  IconButton,
  TagLabel,
} from "@chakra-ui/react";
import { MdEdit, MdPushPin } from "react-icons/md";

interface LinkCardProps {
  title: string;
  description: string;
  imageUrl: string;
  onEdit: () => void;
  onPin: () => void;
}

export const LinkCard = () => {
  return (
    <Box
      w={{
        base: "320px",
        sm: "90vw",
        lg: "350px",
      }}
      p={4}
      borderWidth="1px"
      borderRadius="md"
      boxShadow="md"
      bg="white"
    >
      <Flex direction="column" gap={2}>
        <Flex align="center" gap={2}>
          <Avatar
            size="lg"
            name="Nue Camp"
            src="https://picsum.photos/200/300"
            borderRadius="md"
          />
          <Heading size="md" mb={2}>
            Nue Camp
          </Heading>
        </Flex>
        <Text>
          This is the card body. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit.
        </Text>
      </Flex>

      <Flex justify="space-between" align="center" mt={4}>
        <Tag size={'lg'} variant="solid"  borderRadius='full'>
        <TagLabel>Tag</TagLabel>
        </Tag>
        <Flex justify="flex-end" gap={2} mt={4}>
          <IconButton aria-label="Edit Link" icon={<MdEdit />} />
          <IconButton aria-label="Pin Link" icon={<MdPushPin />} />
        </Flex>
      </Flex>
    </Box>
  );
};
