import User from "@/models/user/User"
import { connectUserDB } from "@/utils/db"
import { NextResponse } from "next/server"
const { getUserWithID, hash, generateUserAuthID } = require('@/utils/routeMethods.js')

export const POST = async (request) => {
  try {
    const { username, password, email, tribe, walletAddress } = await request.json()
    
    await connectUserDB()

    // Hashes the password to not store in plain text
    let hashedPassword = await hash(password)

    const userAuthId = generateUserAuthID()

    const newUser = await User.create({
      username: username, 
      email: email || "",
      password: hashedPassword,
      userAuthId: userAuthId, 
      walletAddress: walletAddress,
      tribe: tribe,
      admin: false,
      bio: "",
      avatar: "",
      follows: {
        followers: [],
        following: [],
        followerCount: 0,
        followingCount: 0,
      }
    })

    return NextResponse.json({
      success: true,
      message: `User: ${newUser.username} has been created`,
      data: newUser
    }, {
      status: 201,
    })
  } catch(err) {
    return NextResponse.json({
      success: false, 
      message: 'Error saving user to database', 
      errorMessage: err.message,
      error: err
    }, {
      status: 500 
    })  
  }
}