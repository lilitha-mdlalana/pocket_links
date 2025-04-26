"use client";
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Button,
  Collapse,
  List,
  ListItem,
} from "@chakra-ui/react";
import { FiHome, FiMenu, FiChevronDown, FiChevronRight } from "react-icons/fi";
import { MdPushPin, MdCategory } from "react-icons/md";
import {
  LinkItemProps,
  SidebarProps,
  NavItemProps,
  MobileProps,
} from "../../types/types";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import CreateLinkModal from "../Modal/CreateLinkModal";
import { useState } from "react";

const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: FiHome, href: "/" },
  { name: "Pinned", icon: MdPushPin, href: "/pinned" },
];

// This would come from your database or API
const UserCategories: Array<{name: string, href: string}> = [
  { name: "Work", href: "/category/work" },
  { name: "Personal", href: "/category/personal" },
  { name: "Learning", href: "/category/learning" },
  { name: "Entertainment", href: "/category/entertainment" },
];

const CategorySection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);
  
  return (
    <Box ml={4} mr={4} mt={2}>
      <Flex
        align="center"
        p="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "purple.500",
          color: "white",
        }}
        onClick={toggleOpen}
        justify="space-between"
      >
        <HStack>
          <Icon
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={MdCategory}
          />
          <Text>Categories</Text>
        </HStack>
        <Icon
          as={isOpen ? FiChevronDown : FiChevronRight}
          transition="all 0.25s"
          transformOrigin="center"
        />
      </Flex>
      
      <Collapse in={isOpen} animateOpacity>
        <List spacing={2} pl={6} pt={2} pb={2}>
          {UserCategories.map((category) => (
            <ListItem key={category.name}>
              <Link href={category.href}>
                <Text
                  p={2}
                  borderRadius="md"
                  _hover={{
                    bg: "purple.400",
                    color: "white",
                  }}
                  cursor="pointer"
                >
                  {category.name}
                </Text>
              </Link>
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Box>
  );
};

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      as={"div"}
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          PocketLinks
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon}>
          <Link href={link.href}>{link.name}</Link>
        </NavItem>
      ))}
      
      {/* Add the collapsible categories section */}
      <CategorySection />
    </Box>
  );
};

const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Box style={{ textDecoration: "none" }} _focus={{ boxShadow: "none" }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "purple.500",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const { data: session, status } = useSession();
  const bgColorModeValue = useColorModeValue("white", "gray.900");
  const borderBottomColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={bgColorModeValue}
      borderBottomWidth="1px"
      borderBottomColor={borderBottomColor}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        PocketLinks
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        {status !== "authenticated" ? (
          <Button as={Link} href="/api/auth/signin" variant="ghost">
            Login
          </Button>
        ) : (
          <>
            <CreateLinkModal />
            <Flex alignItems={"center"}>
              <Menu>
                <MenuButton
                  py={2}
                  transition="all 0.3s"
                  _focus={{ boxShadow: "none" }}
                >
                  <HStack>
                    <Avatar
                      size={"sm"}
                      src={session?.user?.image || "https://bit.ly/broken-link"}
                    />
                    <VStack
                      display={{ base: "none", md: "flex" }}
                      alignItems="flex-start"
                      spacing="1px"
                      ml="2"
                    >
                      <Text fontSize="sm">{session?.user?.name || ""} </Text>
                      <Text fontSize="xs" color="gray.600">
                        {session?.user?.email || ""}
                      </Text>
                    </VStack>
                    <Box display={{ base: "none", md: "flex" }}>
                      <FiChevronDown />
                    </Box>
                  </HStack>
                </MenuButton>
                <MenuList bg={bgColorModeValue} borderColor={borderBottomColor}>
                  <MenuItem as={Link} href="/profile">
                    Profile
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={() => signOut()}>Sign out</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </>
        )}
      </HStack>
    </Flex>
  );
};

const SidebarWithHeader = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
};

export default SidebarWithHeader;