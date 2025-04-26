import {
  Avatar,
  Box,
  Flex,
  Tag,
  Text,
  Heading,
  IconButton,
  TagLabel,
} from "@chakra-ui/react";
import Link from "next/link";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdEdit, MdPushPin } from "react-icons/md";

interface LinkCardProps {
  title: string;
  description: string;
  linkUrl: string;
  category: string;
  onEdit: () => void;
  onPin: () => void;
}

export const LinkCard = ({
  title,
  description,
  category,
  linkUrl,
  onEdit,
  onPin,
}: LinkCardProps) => {
  return (
    <Box
      w={{
        base: "320px",
        sm: "90vw",
        lg: "345px",
      }}
      p={8}
      borderWidth="1px"
      borderRadius="md"
      boxShadow="md"
      bg="white"
    >
      <Flex direction="column" gap={2}>
        <Flex align="center" gap={2} justify="space-between">
          <Avatar
            size="lg"
            name="Nue Camp"
            src={`https://www.google.com/s2/favicons?sz=64&domain_url=${linkUrl}`}
            borderRadius="md"
          />
          <Heading size="md" mb={2}>
            {title}
          </Heading>

          <Link href={linkUrl} target="_blank" rel="noopener noreferrer">
            <IconButton aria-label="Edit Link" icon={<FaExternalLinkAlt />} />
          </Link>
        </Flex>
        <Text>{description}</Text>

        <Text>{linkUrl}</Text>
      </Flex>

      <Flex justify="space-between" align="center" mt={4}>
        <Tag size={"lg"} variant="solid" borderRadius="full">
          <TagLabel>{category}</TagLabel>
        </Tag>
        <Flex justify="flex-end" gap={2} mt={4}>
          <IconButton
            aria-label="Edit Link"
            icon={<MdEdit />}
            onClick={onEdit}
          />
          <IconButton
            aria-label="Pin Link"
            icon={<MdPushPin />}
            onClick={onPin}
          />
        </Flex>
      </Flex>
    </Box>
  );
};
