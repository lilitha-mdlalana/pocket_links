import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { title, description, url, categoryId } = req.body;

  try {
    const result = await prisma.link.create({
      data: {
        title,
        description,
        url,
        category: {
          connect: {
            id: categoryId,
          },
        },
        user: {
          connect: {
            email: session.user.email,
          },
        },
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Failed to create link:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
