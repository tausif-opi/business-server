const BaseController = require("../base/BaseController");
const { paginationQueryParser, filterQueryParser } = require("../lib/queryParser");
const fileService = require("../service/fileService");



class FileController extends BaseController {
    constructor() {
        super(fileService)
    }

    async read(req) {

        const filter = filterQueryParser(req.query, ["_id", "title", "sendTo"])
        const options = paginationQueryParser(req.query)
        return await this.service.read(filter, {}, options)
    }

}

module.exports = new FileController()