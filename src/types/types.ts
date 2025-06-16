import { FlexProps, BoxProps } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { IconType } from "react-icons";

export interface LinkItemProps {
  name: string;
  icon: IconType;
  href: string;
}

export interface NavItemProps extends FlexProps {
  icon: IconType;
  children: React.ReactNode;
}

export interface MobileProps extends FlexProps {
  onOpen: () => void;
}

export interface SidebarProps extends BoxProps {
  onClose: () => void;
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

export interface PrismaLink {
  createdAt: unknown;
  id: string;
  title?: string;
  description?: string;
  url: string;
  category?: {
    name?: string;
  };
}

export interface PaginationInfo {
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextCursor: string | null;
  prevCursor: string | null;
  totalCount: number;
  totalPages: number;
}

export interface PaginatedLinks {
  links: SerializedLink[];
  pagination: PaginationInfo;
}

export interface SerializedLink {
  id: string;
  title: string | null;
  description: string | null;
  url: string;
  createdAt: string;
  category: {
    id: string;
    name: string;
  } | null;
}

export interface HomeProps {
  links: SerializedLink[];
}

export type LinkWithCategory = Prisma.LinkGetPayload<{
  include: { category: true };
}>;

export type LinkWithCategoryName = Prisma.LinkGetPayload<{
  include: { category: { select: { name: true } } };
}>;
