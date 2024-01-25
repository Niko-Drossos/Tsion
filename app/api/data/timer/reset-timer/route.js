import Timer from "@/models/data/cleanTimer"
import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    /* const searchParams = request.nextUrl.searchParams
    const resetDescription = searchParams.get('description') */
    // This is hopefully the fix for SSR search params
    const resetDescription = new URLSearchParams(window.location.search).get('description');

    const result = await Timer.create({ 
      description: resetDescription
    });

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