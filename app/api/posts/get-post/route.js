import { NextResponse } from "next/server";
import Post from '@/models/blog/Post'

export async function GET(request) { 
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page')) || 1
  const pageSize = parseInt(searchParams.get('size')) || 10
  const searchTerm = searchParams.get('search') || ""
  const search = new RegExp(searchTerm, "i")

  try {
    const totalResults = await Post.countDocuments()

    const results = await Post
      .find({
        $or: [
          { author: { $regex: search } },
          { title: { $regex: search } },
          { content: { $regex: search } },
          // Add more fields as needed
        ]
      })
      .skip((page - 1) * pageSize) // Calculate how many documents to skip based on the page number
      .sort({ createdAt: -1 }) // Sort by date
      .limit(pageSize) // Limit the number of documents per page

    let message = results.length === 0 ? 'No posts found from search' : 'Search results successfully fetched';
        
    return NextResponse.json({
      success: true,
      message: message,
      count: results.length,
      currentPage: page,
      totalPosts: totalResults,
      totalPages: Math.ceil(totalResults / pageSize),
      data: results
    }, {
      status: 200
    })
  } catch(err) {
    return NextResponse.json({
      success: false,
      message: `Fetching posts failed`,
      errorMessage: err.message,
      error: err
    }, {
      status: 500
    })
  }
}