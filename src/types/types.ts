import { FlexProps, BoxProps } from "@chakra-ui/react"
import { IconType } from "react-icons"

export interface LinkItemProps {
  name: string
  icon: IconType,
  href: string
}

export interface NavItemProps extends FlexProps {
  icon: IconType
  children: React.ReactNode
}

export interface MobileProps extends FlexProps {
  onOpen: () => void
}

export interface SidebarProps extends BoxProps {
  onClose: () => void
}


export interface User {
  id: string;
  name?: string | null;
  email: string;
  emailVerified?: Date | null;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  userId: string;
}

export interface Link {
  id: string;
  url: string;
  title?: string | null;
  description?: string | null;
  createdAt: Date | string;
  categoryId?: string | null;
  userId: string;
  category?: Category | null;
}

export interface HomeProps {
  links: Link[];
}