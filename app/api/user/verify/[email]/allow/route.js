import allowUser from "@/models/user/allowUser"
import { NextResponse } from "next/server"

export async function POST(request, context) {
  let { email } = await context.params
  
  try {
    const result = await allowUser.create({ email: email })

    if (!result) throw new Error("User now allowed to create account")
    
    return NextResponse.json({
      success: true,
      message: `Successfully updated user`,
      user: result
    })
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: `An error occurred adding user to list user`,
      errorMessage: err.message,
      error: err
    })
  }
}