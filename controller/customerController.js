const BaseController = require("../base/BaseController");
const { paginationQueryParser, filterQueryParser } = require("../lib/queryParser");
const customerService = require("../service/customerService");


class CustomerController extends BaseController {
    constructor() {
        super(customerService)
    }

    async read(req) {
        const filter = filterQueryParser(req.query, ["_id", "name", "fields", "phone", "email", "whatsapp", "profession", "designation", "organization", "source", "project", "stage"])
        if ("stage" in filter) filter.stage = typeof filter.stage.trim() === "string" ? filter.stage.trim().toLowerCase() : null

        const options = paginationQueryParser(req.query)
        return await this.service.read(filter, {}, options)
    }

    async update(req){
        return await this.service.update(req.query, req.body)
    }
    async createFromPublicQuery(req){
        return await this.service.createFromPublicQuery(req.body)
    }
    
    async sendWAFile(req) {
        return await this.service.sendFileToCustomer(req.body)
    }

}

module.exports = new CustomerController()