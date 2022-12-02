class BaseService {
    constructor(db){
        this.db = db
    }

    async create(input){
        return await this.db.insert(input)
    }

    async __read(query){
        return await this.db.read(query)
    }

    async read(query){
        return await this.__read(query)
    }

    async update(query ,payload){
        const result =  await this.db.update(query ,payload)
        return {
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
            data: payload,

        }
    }
}
module.exports = BaseService