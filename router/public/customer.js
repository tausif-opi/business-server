const customerController = require("../../controller/customerController")
const { generateCreatedAndUpdatedDate } = require("../../lib/generateDate")
const { isObject } = require("../../lib/isAnything")
const router = require("express").Router()




router.post("/", async (req, res, next)=>{
    try {
        if("comments" in req.body) delete req.body.comments
        let modifiedQuery = []
        if(req.body.query && Array.isArray(req.body.query)){
            modifiedQuery = req.body.query.map((q)=>{
                if(isObject(q) ){
                    return {
                        ...q,
                        ...generateCreatedAndUpdatedDate()
                    }
                }
                else return {}
            })
        }
        req.body = {
            ...req.body,
            ...generateCreatedAndUpdatedDate(),
            source: "public",
            stage: "initial",
            query: modifiedQuery
        }


        
        const result = await customerController.createFromPublicQuery(req)
        res.json({
            result
        })

    } catch (error) {
        next(error)
    }
})



module.exports = router