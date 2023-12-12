import Post from "@/models/blog/Post"
import { NextResponse } from "next/server"

export async function GET(/* request */) {
  // let requestBody = await request.json()
  try {
    const result = await Post.find();
    
    return NextResponse.json({
      success: true,
      message: `Successfully fetched all Posts`,
      data: result
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