const { isValidObjectId } = require("mongoose");
const BaseService = require("../base/BaseService");
const customerDB = require("../database/customerDB");
const { generateUpdatedDate } = require("../lib/generateDate");
const validationError = require("../lib/validationError");
const wa = require("../utils/wa");
const fileService = require("./fileService");


class CustomerService extends BaseService {

    constructor() {
        super(customerDB)
    }
    async createFromAdmin(payload){
        const errors = {}
        if(!payload.number ) errors.phone = "please enter a number"
        if(errors.number) throw validationError(errors)
        const customer = await this.read({phone:payload.phone}, {}, {})
        if(customer.data.length) throw validationError({phone: "already exist this number"})
    }
    async create(payload) {
        if ("stage" in payload) payload.stage = typeof payload.stage.trim() === "string" ? payload.stage.trim().toLowerCase() : null
        return await this.db.insert(payload)
    }

    async createFromPublicQuery(payload) {
        const error = {}
        if (!payload.phone) error.phone = "input phone number"

        if (Object.keys(error).length) throw validationError(error)

        const customer = await this.read({ phone: payload.phone })
        if (customer.data.length === 0) {
            payload.whatsapp = payload.phone
            payload.workingPhone = payload.phone
            return await this.create(payload)
        }
        else if (customer.data.length == 1) {
            payload.updatedAt = new Date()
            return this.update({ phone: payload.phone }, payload)
        }
        else {
            throw validationError({ msg: "too many customer found for this number" })
        }
    }

    async update(query, payload) {
        const error = {}


        const customer = await this.read(query, {}, {})

        if (customer.data.length === 1) {
            let comments = []
            let csQuery = []


            if (payload.comments && Array.isArray(payload.comments)) {
                comments = [
                    ...payload.comments,
                    ...customer.data[0].comments
                ]
                payload.comments = comments
            }

            if (payload.query && Array.isArray(payload.query)) {
                csQuery = [
                    ...payload.query,
                    ...customer.data[0].query
                ]
                payload.query = csQuery
            }

            const result = await this.db.update(query, payload)

            return result

        }
        else {
            error.customer = "no customer found"
        }

    }

    async read(filter, resolve, options) {
        return await this.db.read(filter, resolve, options)
    }

    async sendFileToCustomer(query) {
        const errors = {}

        if (!query.file || !isValidObjectId(query.file)) errors.file = "invalid file id"
        if (!query._id || !isValidObjectId(query._id)) errors._id = "invalid customer id"

        if (Object.keys(errors).length) throw validationError(errors)

        try {
            const customer = await this.read({ _id: query._id }, {}, {})

            if (!customer.data || !Array.isArray(customer.data) || customer.data.length !== 1) errors.customer = "no customer with given id"
            const file = await fileService.read({ _id: query.file }, {}, {})
            if (!file.data || !Array.isArray(file.data) || file.data.length !== 1) errors.file = "no file with given id"
            if (Object.keys(errors).length) throw errors

            const retrieveDocs = {
                fileName: file.data[0].title,
                customerWhatsapp: customer.data[0].whatsapp
            }

            const uploadFile = await wa.uploadMedia(retrieveDocs.fileName)
            if (uploadFile.res === null) throw "failed to file upload in whatsapp"

            // const fileUrl = await wa.retrieveMediaUrl(uploadFile.res.id)
            // if (fileUrl.res === null) throw "can not retrieve file url from whatsapp api"

            const sendFile = await wa.sendFileToCustomer({ to: retrieveDocs.customerWhatsapp, documentId: uploadFile.res.id })

            return sendFile.res

        } catch (error) {
            throw error
        }

    }

}

module.exports = new CustomerService()