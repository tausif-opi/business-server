const { isValidObjectId } = require("mongoose");
const BaseService = require("../base/BaseService");
const projectDataDB = require("../database/projectDataDB");
const { convertObjectId } = require("../database/utils/utils");
const { isObject } = require("../lib/isAnything");
const { rootDirectory } = require("../directory")

const validationError = require("../lib/validationError");
const ProjectService = require("./ProjectService");
const generateExcelFile = require("../lib/generateExcel");
const fileController = require("../controller/fileController");
const { generateCreatedAndUpdatedDate } = require("../lib/generateDate");
const { validateFiles, unlinkFiles } = require("../lib/fileValidator");

const path = require("path")

const projectService = new ProjectService()

class ProjectDataService extends BaseService {

    constructor() {
        super(projectDataDB)
    }

    async create(payload, fileList) {
        let errors = {}
        let project;
        let allFieldsInPayload = false
        const publicData = {};
        if (!isValidObjectId(payload.project)) errors.project = "invalid project id"
        else {
            project = await projectService.db.findOne({ _id: convertObjectId(payload.project) })
            if (!project) errors.project = "no project found with given id"
        }
        const fixedFields = ["title", "price", "subtitle", "publish", "category"]
        const payloadKeys = Object.keys(payload)
        const payloadFields  = {}

        for(let i = 0; payloadKeys.length > i; i++){
            if(! fixedFields.includes(payloadKeys[i] ) ) {
                payloadFields[payloadKeys[i]] = payload[payloadKeys[i]]
            }
        }

        if (!payloadFields || !isObject(payloadFields)) errors.fields = "invalid fields"
        let fields = Object.keys(payloadFields)
        let fieldsInRecord = []
        if (project && project.fields) {
            fieldsInRecord = project.fields
            allFieldsInPayload = project.fields.every((field) => {
                return fields.includes(field)
            })
        }

        if (payload.publish === true) {
            const files = await validateFiles(fileList, ["png", "jpg", "jpeg", "webp"])
            if (Object.keys(files.errors).length) {
                errors = {
                    ...errors,
                    ...files.errors
                }
            }

            if (!fileList || !isObject(fileList)) errors.file = "invalid file format"

            if (!payload.title || !payload.price || !payload.subtitle || !payload.category ) {
                errors.public = "invalid public data information"
            }
            if(Object.keys(errors).length) {

                await unlinkFiles(path.join(rootDirectory, "public", "file", "upload"), files.list)
                throw validationError(errors)
    
            }
            else {
                publicData.price = parseInt(payload.price) || 0
                publicData.title = payload.title
                publicData.subtitle = payload.subtitle
                publicData.image = files.list?.image || [],
                publicData.category = payload.category

            }
        }

        if (project && !allFieldsInPayload) errors.fields = "required field missing in fields object"

        if (Object.keys(errors).length) throw validationError(errors)

        const modifiedFields = {}

        fieldsInRecord.forEach((e) => {
            modifiedFields[e] = payloadFields[e]
        });

        let body = {}
        body.fields = modifiedFields
        body.publish = payload.publish
        body.project = payload.project
        body.updatedAt = payload.updatedAt
        body.createdAt = payload.createdAt
        if(body.publish === true) {
            body = {
                ...body,
                ...publicData
            }
        }
        return await this.db.insert(body)
    }

    async read(filter, resolve, options) {
        return await this.db.read(filter, resolve, options)
    }

    async readByMultipleId(filter, resolve, options) {
        const error = {}
        const isObjectIdOfArray = filter._id.every((id) => {
            return isValidObjectId(id)
        })
        if (!isObjectIdOfArray) error._id = "invalid id"
        return await this.db.readByMultipleId(filter, resolve, options)
    }

    async generateExcel(result) {
        const error = {}
        if (!result.data || !result.page) error.excel = "no data to generate excel file"
        let fields = []

        const data = result.data || []
        for (let i = 0; data.length > i; i++) {
            for (let j = 0; data[i].project.fields.length > j; j++) {
                fields.push(data[i].project.fields[j])
            }
        }
        const uniqueColumns = [...new Set(fields)]

        //take a parameter in function as rows

        const rows = data.map(d => d.fields)

        for (let i = 0; rows.length > i; i++) {
            const dataField = Object.keys(rows[i])

            for (let j = 0; dataField.length > j; j++) {
                if (!uniqueColumns.includes(dataField[j])) delete rows[i][dataField[j]]

            }

        }

        const file = await generateExcelFile(uniqueColumns, rows, )
        if (file.error === null) {
            const fileData = {
                sendTo: [],
                ...generateCreatedAndUpdatedDate(),
                title: file.fileName

            }
            const insertFileToDB = await fileController.create({ body: fileData })
            return insertFileToDB
        }
        else {
            return error
        }


    }



}

module.exports = ProjectDataService