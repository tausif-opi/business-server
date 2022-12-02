
/**
*
* @param {Function} documentModel return an object
* @param {String} collectionFieldName which field to match with owner id
*/

function validateOwnerFactory(documentModel, collectionFieldName){

    /**
    *
    * @param {Object} query
    * @param {String} ownerId
    * @param {Object} 
    */

    return async function validateOwner(query, ownerId, info){
        const document = await documentModel[info.method](query)

        if(info.returnType == "object"){
            return document[collectionFieldName].toString() == ownerId
        }
    }
}

module.exports = validateOwnerFactory