function addFieldToEntity(entityObj, concatObj){
    return {
        ...entityObj,
        ...concatObj
    }

}

module.exports = addFieldToEntity