import Holiday from "@/models/events/Holiday"
import { NextResponse } from "next/server"

export async function POST(request) {
  const requestBody = await request.json()

  try {
    const { info, start, end, images } = requestBody
    const createEvent = await Holiday.create({  
      info, start, end, images
    })
    
    return NextResponse.json({
      success: true,
      message: `Successfully fetched all Posts`,
      data: createEvent
    })
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: `An error occurred fetching Posts`,
      errorMessage: err.message,
      error: err
    })
  }
}