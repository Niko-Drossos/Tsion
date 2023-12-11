import User from "@/models/User";
import connect from "@/utils/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const { name, email, password } = await request.json();

  await connect();
  // Hashes the password to not store in plain text
  const hashedPassword = await bcrypt.hash(password, 5);
  // Create a user object but don't post to the DB with the .create() method
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  try {
    // Saves the newUser object to the DB
    await newUser.save();
    // Return the response with a 201 status signaling it has created a document
    return new NextResponse("User has been created", {
      status: 201,
    });
    // Catch any errors that occur in the try block
  } catch (err) {
    return new NextResponse(err.message, {
      status: 500,
    });
  }
};