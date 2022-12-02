const router  = require("express").Router()



router.use("/admin", require("./admin"))
router.use("/project-data", require("./projectData"))
router.use("/customer", require("./customer"))



module.exports = router
