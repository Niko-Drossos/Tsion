/* -------------------------------------------------------------------------- */
/*     All of the commented out function are for if we decide to use them     */
/* -------------------------------------------------------------------------- */

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

/* ----------------------------- MongoDB Schemas ---------------------------- */

import User from '@/models/user/User'

/* ------------------------------- Count votes ------------------------------ */

/* function countVotes(data) {
  let trueVotes = 0
  let falseVotes = 0

  for (const item of data) {
    if (item.vote === true) {
      trueVotes++
    } else if (item.vote === false) {
      falseVotes++
    }
  }

  return trueVotes - falseVotes
} */

/* ------------------------ check for duplicate vote ------------------------ */

/* async function isDuplicate(req, res, id, author) {
  try {
    let updatedDoc
    let { vote } = req.body

    let newVote = { author, vote }

    const existingVoteInPost = await Post.findOne({ _id: id, "votes.author": author })

    const existingVoteInComment = await Comment.findOne({ _id: id, "votes.author": author })

    if (existingVoteInPost) {      
      updatedDoc = await Post.findOneAndUpdate(
        { _id: id, "votes.author": author },
        { $set: { 'votes.$': newVote } },
        { new: true }
      )

      updatedDoc.voteCount = countVotes(updatedDoc.votes)
      await updatedDoc.save()
      
    } else if (existingVoteInComment) {
      updatedDoc = await Comment.findOneAndUpdate(
        { _id: id, "votes.author": author },
        { $set: { 'votes.$': newVote } },
        { new: true }
      )
      updatedDoc.voteCount = countVotes(updatedDoc.votes)
      await updatedDoc.save()
    }

    const existingVote = existingVoteInPost || existingVoteInComment

    if (existingVote) {
      res.status(200).json({
        success: true,
        message: `Vote successfully updated`,
        voteCount: updatedDoc.voteCount
      })
      return true
    }

    return false
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred in function isDuplicate',
      errorMessage: err.message,
      error: err
    })
  }
} */

/* ---------------------- Get a users auth with authID ---------------------- */

async function getUserWithID(userID) {
  const user = await User.findOne({ userAuthId: userID })
  if (!user) throw new Error(`User with userAuthId: ${userID} has not been found`)
  return user
}

/* ------------------------ Get a users _id with name ----------------------- */

async function getIdWithName(name) {
  const user = await User.findOne({ username: name })
  if (!user) throw new Error(`User with username: ${name} not found`)
  return user._id
}

/* ------------------------ Generate recovery token ----------------------- */

function generateRecoveryToken() {
  const getRandomChar = () => {
    const characters = '0123456789ABCDEF'
    const randomIndex = Math.floor(Math.random() * characters.length)
    return characters[randomIndex]
  }

  let token = ''
  for(let i = 0; i < 8; i++){
    token += getRandomChar()
  }

  return token
}

/* --------------------------- Generate JWT Token --------------------------- */

function generateJwtToken(payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' })
  return token
}

/* ---------------------------- Verify JWT Token ---------------------------- */

function verifyJwtToken(token) {
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET)
    return data
  } catch (error) {
    throw new Error('Invalid token')
  }
}

/* ------------------------ Generate recovery token ----------------------- */

function generateExpiryDate() {
  let expiryDate = new Date()

  expiryDate.setDate(expiryDate.getDate() + 1)

  const dateString = expiryDate.toISOString()

  return dateString
}

/* ------------------- Will throw an error if not an admin ------------------ */

async function isAdmin(headerList) {
  const adminToken = headerList.get('authorization')
  const userId = headerList.get('x-userid')

  if (!adminToken) throw new Error("You must append authorization header")
	if (!userId) throw new Error("You must append user ID header")

  const user = await User.findOne({ _id: userId, admin: true })
  if (!user) throw new Error(`User not an admin and not allowed to preform API call`)

  const adminIdMatch = await bcrypt.compare(user.adminAuthId, adminToken)
  if (adminIdMatch) return true
  
  throw new Error(`User not an admin and not allowed to preform API call`)
}

/* ----------------- Generate userAuthId on account creation ---------------- */

function generateUserAuthID() {
  const getRandomChar = () => {
    const characters = '0123456789ABCDEF'
    const randomIndex = Math.floor(Math.random() * characters.length)
    return characters[randomIndex]
  }

  const generateBlock = () => {
    let block = ''
    for (let i = 0; i < 6; i++) {
      block += getRandomChar()
    }
    return block
  }

  return `${generateBlock()}-${generateBlock()}-${generateBlock()}-${generateBlock()}-${generateBlock()}-${generateBlock()}`
}

/* ----------------------- Hash strings with bcryptjs ----------------------- */

async function hash(input) {
  const salt = await bcrypt.genSalt(10)

  // Hash the input using the generated salt
  const hashedOutput = await bcrypt.hash(input, salt)

  return hashedOutput
}

/* -------------------------------------------------------------------------- */

// countVotes, 
// isDuplicate, 
// getUserWithID, 
export { 
  generateUserAuthID, 
  isAdmin, 
  hash, 
  generateRecoveryToken, 
  generateExpiryDate, 
  getIdWithName, 
  getUserWithID,
  generateJwtToken, 
  verifyJwtToken, 
}