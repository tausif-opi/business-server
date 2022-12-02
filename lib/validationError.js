const validationError = (errObj, status = 400)=>{
    return {
        name: "CustomValidationError",
        errors: errObj,
        status
    }
}

module.exports = validationError

