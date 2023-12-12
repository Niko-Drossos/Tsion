import { NextResponse } from "next/server";
import { getUserWithID } from "@/utils/routeMethods";
import Comment from '@/models/blog/Comment'

export async function POST(request, context) {
  const { commentID } = context.params
  const searchParams = request.nextUrl.searchParams
  const userID = searchParams.get('userID')
  
  try {
    const user = await getUserWithID(userID)
    const comment = await Comment.findById(commentID)

    if (user.username !== comment.author && !user.admin) {
      res.status(403).json({
        message: 'You do not have permission to delete this comment'
      })
      return false
    }

    await comment.delete()

    return NextResponse.json({
      success: true,
      message: "Comment and votes successfully Deleted"
    }, {
      status: 204
    })
  } catch(err) {
    return NextResponse.json({
      success: false,
      message: `An error occurred deleting comment with _id: "${commentID}"`,
      error: err
    }, {
      status: 500
    })
  }
}