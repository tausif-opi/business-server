const customerController = require("../../controller/customerController")
const addFieldToEntity = require("../../lib/addFieldToEntity")
const { generateUpdatedDate, generateCreatedAndUpdatedDate } = require("../../lib/generateDate")
const { fileParser } = require("../../middleware/parser")
const router = require("express").Router()


router.get("/", async (req, res, next)=>{
    try {
        const result = await customerController.read(req)
        res.json({
            result
        })
    } catch (error) {
        next(error)
    }
})

router.post("/", async (req, res, next)=>{
    try {
        const concatObj = {
            ...generateCreatedAndUpdatedDate()
        }
        req.body = addFieldToEntity(req.body, concatObj)
        req.body.source = "admin"
        const result = await customerController.create(req)

        res.json({
            result
        })
    } catch (error) {
        next(error)
    }
})
router.post("/send-wa-file", async (req, res, next)=>{
    try {
        const concatObj = {
            ...generateCreatedAndUpdatedDate()
        }
        req.body = addFieldToEntity(req.body, concatObj)
        const result = await customerController.sendWAFile(req)
        res.json({
            result
        })
    } catch (error) {
        next(error)
    }
})

router.put("/", async (req, res, next)=>{
    try {
        const concatObj = {
            ...generateUpdatedDate()
        }
        req.body = addFieldToEntity(req.body, concatObj)
        if("_id" in req.body){
            req.query = {
                ...req.query,
                _id: req.body._id
            }
            delete req.body._id
        }
        const result = await customerController.update(req)
        res.json(result)
    } catch (error) {
        next(error)
    }
})



module.exports = router