const mongoose = require("mongoose")
/**
* @param {object} err
* @param {integer} err.status
* @param {string} err.msg
* @param {string} err.scope
* 
*/

const generateError = (errors) => {

    let errObj = {}
    for (key in errors) {
        errObj[key] = errors[key]
    }

    return errObj
}

const errHandler = async (err, req, res, next) => {
    let error = {}

    let status = 500;


    let errObj = {}
    if (err.name === "CustomValidationError") {
        status = err.status || 400
        for (key in err.errors) {
            errObj[key] = err.errors[key]
        }

        error = errObj
    }

    else if (err.name === "Authentication") {
        status = err.status || 400
        error = generateError(err.errors)
    }


    else if (err.password && !err.status) {
        error.password = err.password
    }



    if (err instanceof mongoose.Error) {
        let mongooseErrorcode;
        let errObj = {}
        if (err.name === "ValidationError") {
            mongooseErrorcode = 400
            for (key in err.errors) {
                errObj[key] = err.errors[key].message
            }
            status = mongooseErrorcode
            error = errObj
        }
    }

    else if (err.code == "11000") {
        errorObj = {

        }
        status = 400
        for (let e in err.keyValue) {
            errorObj[e] = "already exist"
        }
        error = errorObj

    }
    else {
        if(!Object.keys(error).length){
            error = {
                msg: "something went wrong"
            }
            status = 500
        }
    }

    // console.log(err);
    res.status(status).json(error)

}

module.exports = errHandler