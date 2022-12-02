const notFound = async (req, res)=>{
    res.status(400).json({
        msg: "not found"
    })
}

module.exports = notFound