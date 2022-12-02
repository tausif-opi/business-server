const path = require("path")
const fs = require("fs")
const util = require("util")
const readFile = util.promisify(fs.readFile)
const { rootDirectory } = require("../directory")
const FormData = require("form-data")
const axios = require("axios")


const apiConfig = {
    version: process.env.WHATSAPP_API_VERSION,
    businessID: process.env.WA_BUSINESS_ID,
    url: process.env.WA_API_URL,
    phoneNumberId: process.env.WA_PHONE_NUMBER_ID,
}
const uri = `${apiConfig.url}/${apiConfig.version}/${apiConfig.phoneNumberId}/messages`


class WA {
    async sendFileToCustomer(payload, template) {
        const token = await this.getToken()
        const uri = `${apiConfig.url}/${apiConfig.version}/${apiConfig.phoneNumberId}/messages`

        const config = {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }
        const body = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: payload.to,
            type: "document",
            document: {
                id: payload.documentId
            }
        }
        try {

            const sendFile = await axios.post(uri, body, config)
            // console.log(sendFile);
            return { res: sendFile.data, error: null }
            

        } catch (error) {
            console.log(Object.keys(error));
            console.log("🚀 ~ file: wa.js:48 ~ WA ~ sendFileToCustomer ~ error", error.response)
            return { error, res: null }
        }
    }


    async getToken() {
        return process.env.WA_USER_ACCESS_TOKEN
    }

    async uploadMedia(fileName = "excel-1666558872522.xlsx") {
        const token = await this.getToken()

        const filePath = path.join(rootDirectory, "public", "file", "upload", fileName)


        const config = {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        }
        try {
            const file = await readFile(filePath)
            const uri = `${apiConfig.url}/${apiConfig.version}/${apiConfig.phoneNumberId}/media`
            const body = {
                messaging_product: "whatsapp",
                file,
            }
            const formData = new FormData()
            formData.append("messaging_product", body.messaging_product)
            formData.append("file", body.file, fileName)
            const res = await axios.post(uri, formData, config)
            return {  error: null, res: res.data, }

        } catch (error) {
            return { error, res: null }
        }

    }

    async retrieveMediaUrl (mediaId){
        const token = await this.getToken()


        const config = {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }

        const uri = `${apiConfig.url}/${apiConfig.version}/${mediaId}`

        try {
            const res = await axios.get(uri, config)
            return { error: null, res: res.data }
        } catch (error) {
            return {error, res: null}
        }

    }
}
module.exports = new WA()