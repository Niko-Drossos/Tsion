import Post from "@/models/blog/Post"
import { NextResponse } from "next/server"
import filter from 'leo-profanity'

export async function POST(request) {
  let requestBody = await request.json()
  try {
    // Improve filtering later
    requestBody.content = filter.clean(requestBody.content);
    requestBody.title = filter.clean(requestBody.title);

    const result = await Post.create(requestBody);
    
    return NextResponse.json({
      success: true,
      message: `Successfully created "${requestBody.author}"'s Post`,
      data: result
    })
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: `An error occurred creating "${requestBody.author}"'s Post`,
      errorMessage: err.message,
      error: err
    })
  }
}