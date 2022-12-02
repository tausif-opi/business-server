
function paginationQueryParser(query){
    return {
        page: query.page ? parseInt(query.page) || 1 : 1,
        limit: query.limit ? parseInt(query.limit) || 20: 20,
        sort: query.sort ? query.sort : "createdAt",
        sortOrder: query.sortOrder ? parseInt(query.sortOrder) || 1 : 1,

    }
}

/**
 * 
 * @param {Object} query 
 * @param {Array} fields 
 * 
 */

function filterQueryParser(query, fields){
    const filter = {}
    for(let field of fields){
        if(query[field] && typeof query[field] === "string" && typeof query[field].trim() == "string" ){
            filter[field] = query[field].trim()
        }
    }
    return filter
}

module.exports = {
    paginationQueryParser,
    filterQueryParser

}