const AdminModel = require("../model/AdminModel");
const Paginate = require("./utils/paginate");


const paginate = new Paginate(AdminModel);

class AdminDB {
    constructor(){
        this.model = AdminModel
    }

    async insert(payload){
        const result = await this.model.create(payload)
        return result
    }

    async read(query = {}){
        const result = await this.model.find(query)
        return result
    }

    async readOne(query = {}){
        return await this.model.findOne(query)
    }

    async update(query, payload){
    
        return await this.model.updateOne(query, payload)
    }


}

module.exports = new AdminDB()