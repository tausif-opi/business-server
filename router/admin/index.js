const checkAuth = require("../../middleware/checkAuth")

const router  = require("express").Router()


router.use(checkAuth(process.env.JWT_SECRET))
router.use("/isValidToken", async (req, res, next)=>{
    res.status(200).send("valid")
})
router.use("/profile", require("./profile"))
router.use("/admin", require("./admin"))
router.use("/project", require("./project"))
router.use("/customer", require("./customer"))
router.use("/project-data", require("./projectData"))
router.use("/file", require("./file"))


module.exports = router
