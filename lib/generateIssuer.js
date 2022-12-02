const generateCreatedByAndUpdatedBy = function (createdBy, type = "admins", updatedBy = createdBy, updateType = type){
    return {
        createdBy: {
            type,
            _id: createdBy
        },
        updatedBy: {
            type,
            _id: updatedBy
        }
    }
}

const generateUpdatedBy = function (updatedBy, type="admins"){
    const output =  {
        updatedBy: {
            type,
            _id: updatedBy
        }
    }
    // console.log(output);
    return output
} 

module.exports = {
    generateCreatedByAndUpdatedBy,
    generateUpdatedBy
}