const express = require('express')
const axios = require('axios')
const app = express()
const md5 = require('js-sha1')
const port = 9000
var apiv1 = express.Router();
const APP_ID = 'cli_a38d8eda697e900d'
const APP_SECRET = 'aW5l1g2ZXripMDpQSewYwfuHW4yqKGio'
const FEISHU_HOST = 'https://open.feishu.cn'

const TENANT_ACCESS_TOKEN_URI = "/open-apis/auth/v3/tenant_access_token/internal"
const JSAPI_TICKET_URI = "/open-apis/jssdk/ticket/get"
const NONCE_STR = '13oEviLbrTo458A3NjrOwS70oTOXVOAm'
async function auth() {
    let url = `${FEISHU_HOST}${TENANT_ACCESS_TOKEN_URI}`
    console.log(url)
    let ans = await axios.post(url, { "app_id": APP_ID, "app_secret": APP_SECRET })
        .then(v => {
            console.log(v.data)
            return v.data

        }).catch()
    let r = await axios.post(`${FEISHU_HOST}${JSAPI_TICKET_URI}`, {}, {
        headers: {
            "Authorization": "Bearer " + ans.tenant_access_token,
            "Content-Type": "application/json",
        }
    })
        .then(v => {
            console.log(v.data, '---------')
            return v.data.data
        })
        .catch()
    return r
}
apiv1.get('/get_config_parameters', async function (req, res) {

    let url = req.query["url"]
    let {ticket} = await auth()
    let timestamp = Date.now()
    let verify_str = `jsapi_ticket=${ticket}&noncestr=${NONCE_STR}&timestamp=${timestamp}&url=${url}`
    console.log(url, req.query, '------')
    let signature = md5(verify_str)
    res.send({
        "appid": APP_ID,
        "signature": signature,
        "noncestr": NONCE_STR,
        "timestamp": timestamp,
    })
})
function errorHandler(err, req, res, next) {
    if (err) {
        res.status(500)
        res.render('error', { error: err })
    }
    next()
}
app.use('/fs', apiv1)
app.use(errorHandler)
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
process.on('unhandledRejection', error => {
    // console.log('unhandledRejection', error);
});