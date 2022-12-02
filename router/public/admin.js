const AdminController = require("../../controller/AdminController")
const router = require("express").Router()

const adminController = new AdminController()

router.post("/login", async (req, res, next)=>{
    try {
        const result = await adminController.login(req)
        res.send(result)

    } catch (error) {
        next(error)
    }
})



module.exports = router