const bcrypt = require("bcrypt")
const saltRound = 10

async function convertToHash(plainText){
    if( typeof plainText === "string") return await bcrypt.hash(plainText, saltRound)
}

async function compareHash(plainText, hash){
    const match =  await bcrypt.compare(plainText, hash)
    return match
}

module.exports = {
    convertToHash, 
    compareHash
}