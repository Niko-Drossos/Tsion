import allowUser from "@/models/user/allowUser"
import { NextResponse } from "next/server"

export async function POST(request, context) {
  let { email } = await context.params
  
  try {
    const result = await allowUser.deleteOne({ email: email})

    if (!result) throw new Error("User no longer verified")

    return NextResponse.json({
      success: true,
      message: `Successfully deleted user`,
      user: result
    })
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: `An error occurred deleting user`,
      errorMessage: err.message,
      error: err
    })
  }
}