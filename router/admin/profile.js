const AdminController = require("../../controller/AdminController")
const addFieldToEntity = require("../../lib/addFieldToEntity")
const { generateUpdatedDate } = require("../../lib/generateDate")
const { fileParser } = require("../../middleware/parser")
const router = require("express").Router()

const adminController = new AdminController()

router.get("/", async (req, res, next)=>{
    try {
        req.query  = addFieldToEntity({}, {_id: req.locals._id})
        const result = await adminController.read(req)
        res.json({
            result
        })
    } catch (error) {
        next(error)
    }
})

router.put("/",fileParser, async (req, res, next)=>{
    try {
        const concatObj = {
            ...generateUpdatedDate()
        }

        req.query = {_id: req.locals._id}
        req.body = addFieldToEntity(req.body, concatObj)
        const result = await adminController.update(req)
        res.json(result)
    } catch (error) {
        next(error)
    }
})

router.put("/change-password", async (req, res, next)=>{
    try {
        const concatObj = {
            ...generateUpdatedDate()
        }
        req.body = addFieldToEntity(req.body, concatObj)
        req.query = {_id: req.locals._id}
        const result = await adminController.updatePassword(req)
        res.json(result)
    } catch (error) {
        next(error)
    }
})






module.exports = router