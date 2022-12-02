const AdminController = require("../../controller/AdminController")
const addFieldToEntity = require("../../lib/addFieldToEntity")
const { generateCreatedAndUpdatedDate } = require("../../lib/generateDate")
const router = require("express").Router()

const adminController = new AdminController()

router.get("/", async (req, res, next)=>{
    try {
        
        const result = await adminController.read(req)
        res.json({
            result
        })
    } catch (error) {
        next(error)
    } 
})  

router.post("/create", async (req, res, next)=>{
    try {
        const concatObj = {
            ...generateCreatedAndUpdatedDate()
        }

        req.body = addFieldToEntity(req.body, concatObj)
        const result = await adminController.create(req)
        res.json({
            result
        })
    } catch (error) {
        next(error)
    }
})


module.exports = router