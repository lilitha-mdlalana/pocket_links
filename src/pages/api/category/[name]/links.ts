import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req });

  if (!session || !session.user?.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name } = req.query;
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = 12;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Category name is required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const category = await prisma.category.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        userId: user.id,
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const totalCount = await prisma.link.count({
      where: { categoryId: category.id },
    });

    const links = await prisma.link.findMany({
      where: { categoryId: category.id },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        category: {
          select: { name: true },
        },
      },
    });

    return res.status(200).json({
      links,
      category: { id: category.id, name: category.name },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / pageSize),
        totalCount,
        hasPrevPage: page > 1,
        hasNextPage: page < Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching category links:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
