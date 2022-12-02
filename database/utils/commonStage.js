
/**
 * 
 * @param {String} sort 
 * @param {Number} sortOrder 
 * @param {Number} limit 
 * @param {Number} page 
 * @returns {Array}
 */
module.exports.sortStage = (sort="createdAt", sortOrder=1, limit= 20, page=1)=>{

    return [
        {
            $sort: {
                [sort]: parseInt(sortOrder) || 1
            }
        },
        {
            $skip: parseInt(limit * (page - 1)) || 0
        },

        {
            $limit: parseInt(limit) || 20 //default 20 . from controller its coming from 
        }

    ]
}

/**
 * 
 * @param {Array} stage
 * @return {Array}
 * 
 */

module.exports.unsetStage = (stage)=>{
    return [
        {
            $unset: stage
        }
    ]
}
