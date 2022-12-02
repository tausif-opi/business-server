const ProjectDataController = require("../../controller/ProjectDataController")
const router = require("express").Router()

const projectDataController = new ProjectDataController()

router.get("/", async (req, res, next)=>{
    try {
        req.query.publish = "true"
        const result = await projectDataController.read(req)
        res.json({
            result
        })

    } catch (error) {
        next(error)
    }
})



module.exports = router