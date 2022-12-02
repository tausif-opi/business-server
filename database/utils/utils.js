const {isValidObjectId , Types} = require("mongoose")
const {ObjectId} = Types


//this function is used to convert the object id to string
//accept 16 byte object id and return string
//if id is not 16 byte then return error
//validate before using this function
/**
 * 
 * @param {ObjectId} id
 * @return {String}
 * 
*/
const convertObjectId = (id)=>{
    if(id instanceof ObjectId){
        return id
    }
    return ObjectId(id)
}

/**
 * 
 * @param {String} input
 * @return {Boolean}
 * 
 */

const isObjectId = (input)=>{
    return isValidObjectId(input)
}

module.exports = {
    convertObjectId,
    isObjectId
}





