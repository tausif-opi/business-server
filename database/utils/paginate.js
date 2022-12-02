
const { isObject, isRealPositiveNumber } = require("../../lib/isAnything")


class Paginate {

    constructor(Model){
        this.Model = Model
    }

    //dependency checking
    /**
    * *** *** *** *** ***
    * @param {Array} input
    * @return {Boolean}
    * *** *** *** *** ***
    */
    
    __checkObjectDependency(input){
        
        //input is an array of dependency
        //type is input elements type
        let errorInput = {}
        for(let i =0; i< input.length; i++){
            if(!isObject(input[i])) errorInput[i] = `accept object received ${typeof input[i]}`
        }
        
        if(Object.keys(errorInput).length) return errorInput
        return true
    }

    /**
    * *** *** *** *** ***
    *
    * @param {String} sort
    * @param {String} sortOrder
    * @param {String} page
    * @param {String} limit
    * @return {Array}
    * 
    *  *** *** *** *** ***
    */
    __sortStage(sort, sortOrder, page, limit){
        // this stage is a middle stage to perform better 
        // before joining with other collection or after grouping or after unwind this method will be used
    
        let sortStage = []

        sort = typeof sort === "string" ? sort.trim() : "createdAt" //by default by created date
        sortOrder = sortOrder === "1" ? 1 : -1 //by default 1
        limit = isRealPositiveNumber(limit) === 1 ? parseInt(limit): 20 //by default 20
        page = isRealPositiveNumber(page) === 1 ? parseInt(page) : 1 //by default page 1

        sortStage.push(...[
            {
                $sort: {
                    [sort]: sortOrder,
                },
            },
            {
                $skip: parseInt(limit * (page - 1)),
            },
            {
                $limit: limit
            }
            
        ])

        return sortStage

    }

    //thing is group stage does not make any sense after sorting
    //so that first find out where is group stage and 
    //push sort stage just after group stage

    /**
     * 
     * @param {Array} sortStage 
     * @param {Array} postStage 
     * @return {Array}
     */
    __pushGroupStageBeforeSort(sortStage, postStage){
        let index = 0;

        //find last index of group stage
        for(let s = 0; s < postStage.length; s++){
            if(postStage[s]["$group"]) index = s
        }

        //push just after that last index
        postStage.splice(index + 1, 0, ...sortStage)

        return postStage
        
    }

    async prepare(filter = [], facet = []){
        const pipeLine = []

        //filter stage
        pipeLine.push(...filter)

        //facet stage
        const facetStage = {
            $facet: {
                page: [
                    {
                        $group: {
                            _id: null,
                            totalIndex: { $sum: 1 },
                        }
                    },
                    
                    {
                        $unset: ["_id"]
                    },
                ],
                ...facet
                
            }
        }
        pipeLine.push(facetStage)
        return pipeLine


    }

    
    async exec(filter, facet){

        // const validateParam = this.__checkObjectDependency([aggregation, options])
        // if( validateParam !== true) throw validationError(validateParam, 500)
        const prepare =await  this.prepare(filter, facet)
        let response = await this.Model.aggregate(prepare)

        return response[0]


    }
}

module.exports = Paginate