class BaseController {
    constructor(service){
        this.service = service
    }

    async create(req){
        return await this.service.create(req.body)
    }

    async read(req){
        return await this.service.read(req.query)
    }

    async update(req){
        return await this.service.update(req.query, req.body)
    }
}

module.exports = BaseController