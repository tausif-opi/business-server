const ProjectController = require("../../controller/ProjectController")
const addFieldToEntity = require("../../lib/addFieldToEntity")
const { generateCreatedAndUpdatedDate } = require("../../lib/generateDate")
const router = require("express").Router()

const projectController = new ProjectController()

router.get("/", async (req, res, next)=>{
    try {
        
        const result = await projectController.read(req)
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
        const result = await projectController.create(req)
        res.json({
            result
        })
    } catch (error) {
        next(error)
    }
})


module.exports = router