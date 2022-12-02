const generateCreatedAndUpdatedDate = (createdAt = new Date(), updatedAt= createdAt)=>{
    return {
        createdAt,
        updatedAt
    }
}

const generateUpdatedDate =  (updatedAt = new Date()) => {
    return {
        updatedAt
    }
}

module.exports = {
    generateCreatedAndUpdatedDate,
    generateUpdatedDate
}