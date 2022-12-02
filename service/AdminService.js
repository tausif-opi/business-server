const { default: isEmail } = require("validator/lib/isEmail");
const BaseService = require("../base/BaseService");
const adminDB = require("../database/adminDB");
const { validateFiles, unlinkFiles } = require("../lib/fileValidator");
const {convertToHash, compareHash} = require("../lib/hash");
const { isObject } = require("../lib/isAnything");
const { generateToken } = require("../lib/token");
const validationError = require("../lib/validationError");
const path = require("path")
const {rootDirectory} = require("../directory")

class AdminService extends BaseService{

    constructor(){
        super(adminDB)
    }

    async create(input){
        if(!("password" in input) || input.password.length<5) throw validationError({password: "invalid password"})
        const adminObj = {
            ...input,
            password: await convertToHash(input.password)

        }
        
        const result = await this.db.insert(adminObj)
        if("password" in result) result.password = undefined
        return result
    }

    async __read(input){
        return await this.db.read(input)
    }

    async read(input){
        const result = await this.__read(input)
        const modifiedResult = result.map(r =>{
            r.password = undefined
            r.__v = undefined

            return r
        
        })
        
        return modifiedResult
    }

    async login(input){
        let error = {}

        if(!input.email || !isEmail(input.email)) error.email = "invalid email"
        if(!input.password) error.password = "invalid password"

        //checking error object
        if(Object.keys(error).length) throw validationError(error)

        const admin = await this.__read({email: input.email.trim()})

        if(!Object.keys(admin).length){
            error.email = "no admin with given email"
            throw validationError(error, 401)
        }
        const matchedPass = await compareHash(input.password, admin[0].password)
        if(!matchedPass) {
            error.login = "invalid email or password"
            throw validationError(error, 401)
        }

        const adminPayload = {
            _id: admin[0]._id,
            title: admin[0].title,
            email: admin[0].email,
            type: "admin"
        }

        return await generateToken(adminPayload, process.env.JWT_SECRET)

    }

    async update(query, fileList, body){
        if("password" in body) delete body.password
        let errors = {}
        if(!query?._id?.length && !isValidObjectId(query._id.length)) errors._id = "invalid id"
        const files = await validateFiles(fileList, ["png", "jpg", "jpeg","webp"])
        if(Object.keys(files.errors).length){
            errors = {
                ...errors,
                ...files.errors
            }
        }
        if(!fileList || !isObject(fileList)) errors.file = "invalid file format"
        if(Object.keys(errors).length) {
            await unlinkFiles(path.join(rootDirectory, "public", "file", "upload"), files.list)
            throw validationError(errors)

        }
        const adminEntity = {
            ...body,
            profilePic: files.list?.profilePic?.length ? files.list.profilePic[0] : ""
        }
        try {
            const admin = await this.db.update( query, adminEntity)
            adminEntity._id = query._id
            admin.data = adminEntity
            return adminEntity
        } catch (error) {
            await unlinkFiles(path.join(rootDirectory, "public", "file", "upload"), files.list)
            throw error

        }

    }

    async updatePassword(query, payload){
        const error = {}
        if(!query._id) error._id = "invalid id"

        if(!payload.password ) error.password = "invalid password"
        if(!payload.oldPassword) error.oldPassword = "invalid old password"

        if(Object.keys(error).length) throw validationError(error, 400)
        
        const admin = await this.__read(query)

        if(!admin[0]) error.admin = "no entry found"
        
        const { password } = admin[0]
        const isSameHash = await compareHash(payload.oldPassword, password)

        if(isSameHash === false) throw validationError({oldPassword: "wrong old password"})
        const newHashedPassword = await convertToHash(payload.password)

        const result = await this.db.update(query, {...payload, password: newHashedPassword})

        return {
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount
        }
    }

    async aggregate(query, options){
        return await this.db.aggregate(query, options)
    }
}

module.exports = AdminService