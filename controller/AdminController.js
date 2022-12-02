const AdminService = require("../service/AdminService")

const adminService = new AdminService()

class AdminController {
    
    constructor(){
        this.service = adminService
    }
    
    async create(req){
        const payload = req.body
        const result = await this.service.create(payload)
        return result
    }

    async read(req){
        const result = await this.service.read(req.query)
        return result
    }

    async login(req){
        const payload = req.body
        return this.service.login(payload)
    }

    async update(req){
        return this.service.update(req.query,req.files, req.body)
    }

    async updatePassword(req){
        return this.service.updatePassword(req.query, req.body)
    }
}

module.exports = AdminController