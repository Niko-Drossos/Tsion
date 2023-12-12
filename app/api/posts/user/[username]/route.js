import { NextResponse } from "next/server";
import Post from '@/models/blog/Post'

export async function GET(request, context) {
  const { username } = context.params
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page')) || 1
  const pageSize = parseInt(searchParams.get('size'))

  try {
    const totalResults = await Post.countDocuments({ author: username })

    const results = await blogDB.model(Post.modelName)
      .find({ author: username })
      .skip((page - 1) * pageSize) // Calculate how many documents to skip based on the page number
      .sort({ createdAt: -1 }) // Sort by date
      .limit(pageSize) // Limit the number of documents per page

    let message = results.length === 0 ? 'No posts found from search' : 'Search results successfully fetched';
    return NextResponse.json({
      success: true,
      message: message,
      data: results,
      count: results.length,
      currentPage: page,
      totalPosts: totalResults,
      totalPages: Math.ceil(totalResults / pageSize)
    }, {
      status: 200
    })
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: `An error occurred fetching "${username}"'s Posts`,
      error: err
    }, {
      status: 500
    })
  }
}