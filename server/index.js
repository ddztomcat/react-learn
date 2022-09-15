const express = require('express')
const axios = require('axios')
const app = express()
const md5 = require('js-sha1')
const port = 9000
var apiv1 = express.Router();
const APP_ID = 'cli_a3ab190de278d076'
const APP_SECRET = 'xadgUH2srOf7tSdYMbBoNWMuRwHSGKcZ'
const FEISHU_HOST = 'https://open.work.sany.com.cn'

const TENANT_ACCESS_TOKEN_URI = "/open-apis/auth/v3/tenant_access_token/internal"
const JSAPI_TICKET_URI = "/open-apis/jssdk/ticket/get"
const NONCE_STR = '13oEviLbrTo458A3NjrOwS70oTOXVOAm'

function getAccessToken() {
    let url = `${FEISHU_HOST}${TENANT_ACCESS_TOKEN_URI}`
    console.log(url)
    return axios.post(url, { "app_id": APP_ID, "app_secret": APP_SECRET })
        .then(v => {
            console.log(v.data)
            return v.data
        }).catch()
}

async function auth() {
    let ans = await getAccessToken()
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

apiv1.get('/getUserInfo', async function(req, res) {
    let code = req.query["code"]
    let url = FEISHU_HOST + '/open-apis/authen/v1/access_token'
    let ac = await getAccessToken()
    let ans = await axios.post(url, {
        "grant_type": "authorization_code",
        code
    }, {
        headers: {
            "Authorization": "Bearer " + ac.tenant_access_token,
            "Content-Type": "application/json; charset=utf-8",
        }
    })
    .then(res => {
        console.log(res.data)
        return res.data
    })
    res.send({...ans})
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