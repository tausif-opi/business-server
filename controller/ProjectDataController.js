const BaseController = require("../base/BaseController");
const { paginationQueryParser, filterQueryParser } = require("../lib/queryParser");
const ProjectDataService = require("../service/ProjectDataService");


const projectDataService = new ProjectDataService()

class ProjectDataController extends BaseController {
    constructor() {
        super(projectDataService)
    }

    async create(req) {
        return projectDataService.create(req.body, req.files)
    }
    async read(req) {

        // const filter = filterQueryParser(req.query, ["_id", "project",])
        const filterProperty = Object.getOwnPropertyNames(req.query)

        const fieldProperty = filterProperty.map((p) => {
            if (p !== "_id" && p !== "project" && p !== "resolveProject" && p !== "sort" && p !== "sortOrder" && p !== "page" && p !== "limit" && p!== "category" && p!=="publish" && p !== "title" && p !== "subtitle" && p !== "price") {
                return p
            }
        }).filter(Boolean)

        const fieldsFilter = (field) => {
            const filter = {}
            for (let f of field) {
                filter[`fields.${f}`] = req.query[f]
            }
            return filter
        }
        const filterBoolean = (req, key)=>{
            return key in req ? req[key] == "true" ? {publish: true}: {publish: false}: {}
        }
        const filter = {
            ...fieldsFilter(fieldProperty),
            ...filterQueryParser(req.query, ["_id", "project", "title", "subtitle", "price", "category"]),
            ...filterBoolean(req.query, "publish")
        }
        const resolve = {
            project: req.query.resolveProject == "1"
        }
        const options = paginationQueryParser(req.query)

        return await this.service.read(filter, resolve, options)
    }

    async readByMultipleId(req) {
        const filter = {
            _id: req.query._id?.split(",") || []
        }
        const resolve = {
            project: req.query.resolveProject == "1"
        }
        return await this.service.readByMultipleId(filter, resolve)
    }

    async generateExcel(req) {
        req.query.resolveProject = "1"
        const result = await this.readByMultipleId(req)

        return this.service.generateExcel(result)
    }

}

module.exports = ProjectDataController