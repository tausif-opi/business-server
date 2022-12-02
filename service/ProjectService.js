const BaseService = require("../base/BaseService");
const projectDB = require("../database/projectDB");

const validationError = require("../lib/validationError");

class ProjectService extends BaseService{

    constructor(){
        super(projectDB)
    }

    async create(payload){
        let errors = {}

        if(!payload.fields || !Array.isArray(payload.fields)) errors.fields = "invalid fields"

        if(Object.keys(errors).length) throw validationError(errors)

        return await this.db.insert(payload)
    }

    async read(filter, resolve, options){
        return await this.db.read(filter, resolve, options)
    }



}

module.exports = ProjectService