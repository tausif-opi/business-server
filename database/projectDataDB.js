const BaseDB = require("../base/BaseDB");
const ProjectDataModel = require("../model/ProjectDataModel");
const { singleLookupStage } = require("./utils/commonQueries");
const { sortStage, unsetStage } = require("./utils/commonStage");
const Paginate = require("./utils/paginate");
const { convertObjectId } = require("./utils/utils");


const paginate = new Paginate(ProjectDataModel);

const matchStage = (filter) => {

    if(filter._id) filter._id = convertObjectId(filter._id);
    if(filter.project) filter.project = convertObjectId(filter.project)
    
    return [
        {
            $match: {
                
                ...filter,
                 
            }
        }
    ]
}

const multipleMatch = (filter) =>{
    filter._id = filter._id.map((id)=>{
        return convertObjectId(id)
    })
    return [
        {
            $match: {
                _id: { $in: filter._id }
            }
        }
    ]
}

const resolveStage = (resolve)=>{
    const stage = []
    if(resolve.project) stage.push(...singleLookupStage("project", "project", "_id", "project", "project"))
    return stage
}
class ProjectDataDB extends BaseDB{
    constructor(){
        super(ProjectDataModel)
    }

    async read(filter = {}, resolve = {}, options = {}){
        const stages = [
            ...matchStage(filter),
            ...unsetStage(["__v"])
        ];
        const facetStages = {
            data: [
                ...sortStage(options.sort, options.sortOrder, options.limit, options.page),
                ...resolveStage(resolve)
            ]
        }
        const result = await paginate.exec(stages, facetStages);
        return result
    }
    async readByMultipleId(filter = {}, resolve = {}, options){
        const stages = [
            ...multipleMatch(filter),
            ...unsetStage(["__v"])
        ];
        const facetStages = {
            data: [
                ...resolveStage(resolve)
            ]
        }
        return await paginate.exec(stages, facetStages)
    }

    async findOne(filter = {}){
        const result =  await this.model.findOne(filter)
        return result
    }
}

module.exports = new ProjectDataDB()