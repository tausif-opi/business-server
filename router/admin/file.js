const fileController = require("../../controller/fileController")
const addFieldToEntity = require("../../lib/addFieldToEntity")
const { generateCreatedAndUpdatedDate } = require("../../lib/generateDate")
const router = require("express").Router()

router.get("/", async (req, res, next)=>{
    try {
        
        const result = await fileController.read(req)
        res.json({
            result
        })
    } catch (error) {
        next(error)
    } 
})  

// router.post("/", async (req, res, next)=>{
//     try {
//         const concatObj = {
//             ...generateCreatedAndUpdatedDate()
//         }
//         req.body = addFieldToEntity(req.body, concatObj)
//         const result = await fileController.create(req)
//         res.json({
//             result
//         })
//     } catch (error) {
//         next(error)
//     }
// })


module.exports = router