const { verifyToken } = require("../lib/token");


const errorObj = {
    name: "Authentication",
    errors: {
        msg: "authentication failed"
    }
}
function checkAuthBuilder(secret){
    return async function checkAuth(req, res, next){

        if("x-access-token" in req.headers){
            try {
                const payload = await verifyToken(req.headers["x-access-token"], secret)
                req.locals = payload
                next()
            } catch (error) {
                next(errorObj)
            }
        }
        else {
            next(errorObj)
        }
    }
}

module.exports = checkAuthBuilder