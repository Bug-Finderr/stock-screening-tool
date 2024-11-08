import { NextResponse } from "next/server";
import { Stock } from "@/types/stock";
import stockData from "@/data/mockData.json";

export const GET = async () => {
  try {
    const stocks: Stock[] = stockData;
    return NextResponse.json(stocks);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch stock data" },
      { status: 500 },
    );
  }
};
