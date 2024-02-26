import Post from "@/models/blog/Post"
import { NextResponse } from "next/server"
import filter from 'leo-profanity'
import { uploadImages } from "@/utils/routeMethods"

export async function POST(request) {
  let requestBody = await request.json()
  try {
    // Improve filtering later
    const { user, images, content, title} = requestBody

    let uploadedImages
    if (requestBody.images[0]) {
      uploadedImages = await uploadImages(images)
    }


    requestBody.content = filter.clean(content);
    requestBody.title = filter.clean(title);

    const result = await Post.create({
      user,
      title: title,
      content: content,
      images: uploadedImages
    });
    
    return NextResponse.json({
      success: true,
      message: `Successfully created Post`,
      data: result
    })
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: `An error occurred creating Post`,
      errorMessage: err.message,
      error: err
    })
  }
}