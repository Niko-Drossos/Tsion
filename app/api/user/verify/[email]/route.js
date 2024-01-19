import allowUser from "@/models/user/allowUser"
import { NextResponse } from "next/server"

export async function GET(request, context) {
  let { email } = await context.params
  
  try {
    const result = await allowUser.find({ email: email})

    if (!result) throw new Error("User not found to be verified")

    return NextResponse.json({
      success: true,
      message: `Successfully verified user`,
      user: result
    })
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: `An error occurred verifying user`,
      errorMessage: err.message,
      error: err
    })
  }
}