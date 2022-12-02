const BaseDB = require("../base/BaseDB");
const CustomerModel = require("../model/CustomerModel");
const { sortStage, unsetStage } = require("./utils/commonStage");
const Paginate = require("./utils/paginate");
const { convertObjectId } = require("./utils/utils");


const paginate = new Paginate(CustomerModel);

const matchStage = (filter) => {

    if(filter._id) filter._id = convertObjectId(filter._id);
    
    return [
        {
            $match: {
                
                ...filter,
                 
            }
        }
    ]
}




class ProjectDB extends BaseDB{
    constructor(){
        super(CustomerModel)
    }

    async read(filter = {}, resolve = {}, options = {}){
        const stages = [
            ...matchStage(filter),
            ...unsetStage(["__v"])
        ];
        const facetStages = {
            data: [
                ...sortStage(options.sort, options.sortOrder, options.limit, options.page),
            ]
        }
        const result = await paginate.exec(stages, facetStages);
        return result
    }

    async findOne(filter = {}){
        const result =  await this.model.findOne(filter)
        return result
    }
}

module.exports = new ProjectDB()