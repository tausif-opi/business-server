const jwt = require("jsonwebtoken")

// const secret = {
//     admin: process.env.JWT_SECRET,
//     operator: process.env.OPERATOR_JWT_SECRET
// }
async function generateToken(payload,secret, expiresIn = 5 * 24 * 60 * 60){
    return jwt.sign(payload, secret, {expiresIn})
}

async function verifyToken(token, secret){
    return jwt.verify(token, secret)
    
}

module.exports = {
    generateToken,
    verifyToken
}