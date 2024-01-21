import allowUser from "@/models/user/allowUser"
import User from "@/models/user/User"
import { NextResponse } from "next/server"

export async function GET(request, context) {
  let { email } = await context.params
  
  try {
    const result = await allowUser.findOne({ email: { $regex: new RegExp(email, 'i') } })

    if (!result) throw new Error("Email not found to be verified")

    const alreadyUser = await User.findOne({ email: { $regex: new RegExp(email, 'i') } })

    if (alreadyUser) throw new Error("Email is already in use")

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