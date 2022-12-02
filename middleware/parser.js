const {IncomingForm} = require("formidable")
const { rootDirectory } = require("../directory")
const path = require("path")


const options = {
    multiples: true,
    uploadDir: path.join(rootDirectory, "public", "file", "upload"),
    maxFileSize: 10 * 1024 * 1024,
    keepExtensions: true,
}

const form = new IncomingForm(options)

const fileParser = async (req, res, next)=>{
    try {
        form.parse(req, (err, fields, files)=>{
            if(err) {
                throw err
            }
            req.body = fields
            req.files = files
            
            next()
        })
        form.on("error", (err)=>{
            throw err
        })
        
    } catch (e) {
        res.json({
            error:e
        })
    }
}


async function parser(req, res, next){
    try {
        if(req.method == "post" || req.method == "put" ) req.body = req.body
        if(req.method == "get" || req.method == "delete" ) req.query = req.query
        next()
    } catch (error) {
        next(error)
    }
}



module.exports ={
    parser,
    fileParser   
}