class BaseDB {
    constructor(Model){
        this.model = Model
    }
    async insert(payload){
        return await this.model.create(payload)
    }

    async read(query){
        return await this.model.find()
    }
    
    async readOne(query){
        return await this.model.findOne(query)
    }
    async update(query, payload){
        return await this.model.update(query, payload)
    }
}

module.exports = BaseDB