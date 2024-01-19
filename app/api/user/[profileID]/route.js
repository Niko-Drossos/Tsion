import User from "@/models/user/User"
import { NextResponse } from "next/server"

export async function GET(request, context) {
  let { profileID } = await context.params
  
  try {
    const result = await User.findById(profileID)

    if (!result) throw new Error("No user found")
    
    return NextResponse.json({
      success: true,
      message: `Successfully fetched user`,
      user: result
    })
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: `An error occurred fetching user`,
      errorMessage: err.message,
      error: err
    })
  }
}