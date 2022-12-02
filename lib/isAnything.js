const isObject = (input)=>{

    if(Array.isArray(input) || input === null || typeof input === "function") return false
    else if (typeof input === "object") return true
    return false
}


/* **
*
* @param {Object} Obj 
* @param {Array}  ObjPropertiesArray
* @return true || false
* 
*/

//this function does not check its parameter.
//iterate every properties 
const isPropertiesInObject = (Obj, ObjPropertiesArray)=>{
    let notPropertiesOfObject = []
    for(let prop = 0; prop<ObjPropertiesArray; prop++){
        if(!(ObjPropertiesArray[prop] in Obj)) notPropertiesOfObject.push(ObjPropertiesArray[prop])
    }
    return notPropertiesOfObject.length ? false : true

}

/** *
*
* @param {Number | String} number
* @return {Boolean}
*/

const isRealPositiveNumber = (number)=>{
    return Math.sign(number) === 1 ? true : false
}


/**
 * 
 * @param {String} input 
 * @returns {Boolean}
 */
const isString = (input)=>{
    if(!(typeof input === "string") || !input.trim().length) return false
    return true
}

module.exports = {
    isObject,
    isPropertiesInObject,
    isRealPositiveNumber,
    isString
}


