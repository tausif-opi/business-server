const BaseController = require("../base/BaseController");
const { paginationQueryParser, filterQueryParser } = require("../lib/queryParser");
const ProjectService = require("../service/ProjectService");


const projectService = new ProjectService()

class ProjectController extends BaseController {
    constructor() {
        super(projectService)
    }

    async read(req) {

        const filter = filterQueryParser(req.query, ["_id", "title", "fields"])
        const options = paginationQueryParser(req.query)
        return await this.service.read(filter, {}, options)
    }

}

module.exports = ProjectController