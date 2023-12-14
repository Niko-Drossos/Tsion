import User from "@/models/user/User"
import { connectUserDB } from "@/utils/db"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
const { getUserWithID, hashPassword, generateUserAuthID } = require('@/utils/routeMethods.js')

export const POST = async (request) => {
  try {
    let hashedPassword
    let { username, password, email, tribe, walletAddress } = await request.json()
    
    await connectUserDB()

    // Hashes the password to not store in plain text
    try {
      hashedPassword = await hashPassword(password)
    } catch (err) {
      throw new Error(`Error hashing password: ${err.message}`)
    }

    const userAuthID = generateUserAuthID()

    const newUser = await User.create({
      username: username, 
      email: email || "",
      password: hashedPassword,
      userAuthID: userAuthID, 
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


    try {
      // Saves the newUser object to the DB
      await newUser.save()
      return NextResponse.json({
        success: true,
        message: "User has been created",
      }, {
        status: 201,
      })
    } catch (err) {
      return NextResponse.json({
        success: false, 
        message: 'Error saving user to database', 
        errorMessage: err.message,
        error: err
      }, {
        status: 500 
      })
    }
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