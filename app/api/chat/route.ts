import { NextResponse } from "next/server";

import { getPortfolioData } from "@/lib/portfolio";
import { askPortfolioAI } from "@/lib/ai";
import {
  chatRequestSchema,
} from "@/lib/chat-validation";

export const runtime = "nodejs";

export async function POST(
  request: Request,
) {
  try {
    const body =
      await request.json();

    const parsed =
      chatRequestSchema.safeParse(
        body,
      );

    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            "Invalid chat request.",
        },
        {
          status: 400,
        },
      );
    }

    const {
      message,
      history,
    } = parsed.data;

    const portfolioData =
      await getPortfolioData();

    const conversation =
      history
        .map(
          (item) =>
            `${item.role.toUpperCase()}: ${item.content}`,
        )
        .join("\n");

    const question = `
Previous conversation:

${conversation}

Current client question:

${message}
`;

    const answer =
      await askPortfolioAI(
        question,
        portfolioData,
      );

    return NextResponse.json({
      answer,
    });
  } catch (error) {
    console.error(
      "Portfolio chatbot error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "The portfolio assistant is temporarily unavailable.",
      },
      {
        status: 500,
      },
    );
  }
}