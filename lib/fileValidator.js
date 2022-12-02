const fs = require("fs")
const path = require("path")
const util = require("util")
const unlink = util.promisify(fs.unlink)


async function validateFiles(files,approvedExt = [], maxFileSize = 10 * 1024 * 1024) {
    const validateFiles = {}
    const errors = {}
    for (let file in files) {
        if (!Array.isArray(files[file])) files[file] = [files[file]]

        validateFiles[file] = []
        files[file].forEach(currentFile => {

            let fileExt = currentFile.mimetype.split("/")[1]
            if (!approvedExt.includes(fileExt)) errors[file] = "invalid file extension " + fileExt
            if (currentFile.size > maxFileSize) errors[file] = "exceeded maximum file size";
            validateFiles[file].push(currentFile.newFilename)            

        });

    }
    return {
        errors,
        list: validateFiles
    }

}

async function unlinkFiles(directory, fields){
    const unlinkPromise = []
    for(let field in fields ){
        fields[field].forEach(file => {
            unlinkPromise.push(unlink(path.join(directory, file)))
        })
    }
    await Promise.all(unlinkPromise)
}

module.exports = {
    validateFiles,
    unlinkFiles
}