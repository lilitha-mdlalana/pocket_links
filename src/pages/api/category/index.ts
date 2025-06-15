import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const categories = await prisma.category.findMany({
        where: {
          user: {
            email: session.user.email,
          },
        },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              links: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      });

      return res.status(200).json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  if (req.method === "POST") {
    const { name } = req.body;

    // Validation
    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "Category name is required" });
    }

    const trimmedName = name.trim();

    if (trimmedName.length === 0) {
      return res.status(400).json({ message: "Category name cannot be empty" });
    }

    if (trimmedName.length > 50) {
      return res
        .status(400)
        .json({ message: "Category name must be 50 characters or less" });
    }

    try {
      // Check if category already exists for this user
      const existingCategory = await prisma.category.findFirst({
        where: {
          name: {
            equals: trimmedName,
            mode: "insensitive", // Case-insensitive comparison
          },
          user: {
            email: session.user.email,
          },
        },
      });

      if (existingCategory) {
        return res.status(409).json({ message: "Category already exists" });
      }

      // Get or create user first
      let user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: session.user.email,
            name: session.user.name || null,
          },
        });
      }

      // Create the category
      const newCategory = await prisma.category.create({
        data: {
          name: trimmedName,
          userId: user.id,
        },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              links: true,
            },
          },
        },
      });

      return res.status(201).json(newCategory);
    } catch (error) {
      console.error("Error creating category:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  if (req.method === "DELETE") {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "Category ID is required" });
    }

    try {
      // Check if category exists and belongs to user
      const category = await prisma.category.findFirst({
        where: {
          id: id,
          user: {
            email: session.user.email,
          },
        },
        include: {
          _count: {
            select: {
              links: true,
            },
          },
        },
      });

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      // Check if category has links
      if (category._count.links > 0) {
        return res.status(400).json({
          message: `Cannot delete category with ${category._count.links} links. Move or delete the links first.`,
        });
      }

      // Delete the category
      await prisma.category.delete({
        where: {
          id: id,
        },
      });

      return res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting category:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
