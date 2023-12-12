import { NextResponse } from "next/server";
import { getUserWithID } from "@/utils/routeMethods";
import Post from '@/models/blog/Post'
import Comment from '@/models/blog/Comment'
import cloudinaryConfig from "@/config/cloudinary"

export async function POST(request, context) {
  const { postID } = context.params
  const searchParams = request.nextUrl.searchParams
  const userID = searchParams.get('userID')

  try {
    const user = await getUserWithID(userID)
    const post = await Post.findById(postID)
    
    if (!post) {
      return NextResponse.json({
        success: false,
        message: `Post with _id: ${postID} not found`
      }, {
        status: 404
      })
    }
    
    if (user.username !== post.author && !user.admin) {
      return NextResponse.json({
        message: `User ${user.username} not authorized to delete ${post.author}'s post`
      }, {
        status: 403
      })
    }

    const deletePromises = [
      Post.findByIdAndDelete(postID),
      Comment.deleteMany({ postID: postID })
    ]
    
    if (post.imageUrl) {
      const publicId = post.imageUrl.split('/').pop().split('.')[0]
      await cloudinary.v2.api.delete_resources(
        [`BlogImages/${publicId}`], 
        { type: 'upload', resource_type: 'image' }
      )
    }
    
    await Promise.all(deletePromises)

    return NextResponse.json({
      success: true,
      message: `All info related to post: '${postID}' has been deleted`,
    }, {
      status: 200
    })
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: `An error occurred deleting  post with _id: '${postID}'`,
      error: err
    }, {
      status: 500
    })
  }
}