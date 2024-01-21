import allowUser from "@/models/user/allowUser"
import { NextResponse } from "next/server"

export async function GET(request, context) {
  let { email } = await context.params
  
  try {
    const result = await allowUser.findOne({ email: email})

    if (!result) throw new Error("Email not found to be verified")

    return NextResponse.json({
      success: true,
      message: `Successfully verified Email`,
      result
    })
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: `An error occurred verifying Email`,
      errorMessage: err.message,
      error: err
    })
  }
}