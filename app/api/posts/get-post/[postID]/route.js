import { NextResponse } from "next/server";
import Post from '@/models/blog/Post'

export async function GET(request, context) {
  const { params } = context;
  const postID = params.postID;

  try {
    const result = await Post.findById(postID);

    if (result) {
      return NextResponse.json({
        success: true,
        message: `Found post with _id: ${postID}`,
        data: result,
      })
    } else {
      return NextResponse.json({
        success: false,
        message: `Could not find post with _id: ${postID}`,
      });
    }
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: `Error finding post with _id: ${postID}`,
      errorMessage: err.message,
      error: err,
    });
  }
}
