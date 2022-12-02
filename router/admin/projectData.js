const ProjectDataController = require("../../controller/ProjectDataController")
const addFieldToEntity = require("../../lib/addFieldToEntity")
const { generateCreatedAndUpdatedDate } = require("../../lib/generateDate")
const { fileParser } = require("../../middleware/parser")
const router = require("express").Router()

const projectDataController = new ProjectDataController()

router.get("/", async (req, res, next)=>{
    try {
        
        const result = await projectDataController.read(req)
        res.json({
            result
        })
    } catch (error) {
        next(error)
    } 
})

router.get("/multiple", async (req, res, next)=>{
    try {
        
        const result = await projectDataController.readByMultipleId(req)
        res.json({
            result
        })
    } catch (error) {
        next(error)
    } 
})
router.get("/generate-excel", async (req, res, next)=>{
    try {
        
        const result = await projectDataController.generateExcel(req)
        res.json({
            result
        })
    } catch (error) {
        next(error)
    } 
})

router.post("/",fileParser, async (req, res, next)=>{
    try {
        const concatObj = {
            ...generateCreatedAndUpdatedDate()
        }
        req.body.publish = req.body.publish === "check" ? true : false
        req.body = addFieldToEntity(req.body, concatObj)
        const result = await projectDataController.create(req)
        res.json({
            result
        })
    } catch (error) {
        next(error)
    }
})


module.exports = router