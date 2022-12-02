const { isValidObjectId } = require("mongoose");
const BaseService = require("../base/BaseService");
const fileDB = require("../database/fileDB");

const validationError = require("../lib/validationError");

class FileService extends BaseService{

    constructor(){
        super(fileDB)
    }

    async create(payload){
        let errors = {}

        if(!payload.sendTo || !Array.isArray(payload.sendTo)) errors.sendTo = "invalid sendTo"

        if(Object.keys(errors).length) throw validationError(errors)

        return await this.db.insert(payload)
    }

    async read(filter, resolve, options){
        return await this.db.read(filter, resolve, options)
    }

    async update(query, payload){
        const error = {}
        try {

            const file = await this.read(query)
            let body = {}
            if(! file.data || !Array.isArray(file.data) || file.data.length !== 1 ) error.file = "no file found with given id"

            if(Object.keys(error).length) throw validationError(error)

            if(payload.customer && isValidObjectId(payload.customer)) {
                body.sendTo = [
                    ...file.data[0].sendTo,
                    payload.customer
                ]
                delete payload.customer
            }

            body = {
                ...body,
                ...payload
            }

            const result = await this.db.update(query, body)
            return {
                matchedCount: result.matchedCount,
                modifiedCount: result.modifiedCount,
                data: payload,
    
            }






            
        } catch (error) {
            error.file = "can not find file"
            //do some stuff
            throw error
        }

    }



}

module.exports = new FileService()