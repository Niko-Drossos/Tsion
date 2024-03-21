import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { generateJwtToken } from '@/utils/routeMethods'

/* ----------------------------- MongoDB Schemas ---------------------------- */

import User from '@/models/user/User'

/* -------------------------------------------------------------------------- */

/* ----------------- Send username and password through form ---------------- */

export const POST = async (request) => {
  try {
    const { email, password } = await request.json()

    const foundUser = await User.findOne({ email: email })
    if (!foundUser) throw new Error(`No user with email: ${email}`)

    const passwordMatch = await bcrypt.compare(password, foundUser.password)

    if (!passwordMatch) throw new Error("Wrong credentials")

    const { _id, username, userAuthId, admin, tags } = foundUser

    return NextResponse.json({
      success: true,
      message: `Successfully verified user`,
      data: {
        _id, username, userAuthId, email, admin, tags
      },
      token: generateJwtToken({ username, userAuthId, _id })
    }, {
      status: 200
    })
  } catch(error) {
    return NextResponse.json({
      success: false,
      message: `Failed to verify user`,
      errorMessage: error.message,
      error: error
    }, {
      status: 500
    })
  }
}