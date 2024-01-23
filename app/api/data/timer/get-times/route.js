import Timer from "@/models/data/cleanTimer"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await Timer.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      message: `Successfully reset timer`,
      data: result
    })
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: `An error occurred resetting timer`,
      errorMessage: err.message,
      error: err
    })
  }
}