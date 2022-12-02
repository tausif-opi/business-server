//config dotenv in top level for avoiding unexpected error
const dotenv = require("dotenv")
dotenv.config()


const express = require('express')
const path = require("path")
const PORT = process.env.PORT;
const app = express()
const mongoose = require('mongoose');
const cors = require('cors')
const morgan = require("morgan");
const { rootDirectory } = require("./directory");


app.use(cors())

app.get('/',(req,res)=>{
    res.send("Hi!")
})
app.use(express.json())
app.use("/resource/download", express.static(path.join(rootDirectory, "public", "file", "upload")))
app.use(morgan("dev"))
app.use("/api/v1", require("./router"))
const DBURI = "mongodb+srv://user96:begabond96@cluster0.9ikslkp.mongodb.net/business"

const uri = `${DBURI}?retryWrites=true&w=majority`
const localDB = "mongodb://localhost:27017/business"

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
.then(app.listen(PORT, () => console.log(`Server is listening on port ${PORT}...`)))
.catch((err)=>console.log(err))
