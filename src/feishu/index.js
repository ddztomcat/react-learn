import axios from "axios";
export default function apiAuth() {
    console.log("start apiAuth");
    if (!window.h5sdk) {
        console.log("invalid h5sdk");
        return Promise.resolve();
    }

    // 调用config接口的当前网页url
    const url = encodeURIComponent(location.href.split("#")[0]);
    console.log("接入方前端将需要鉴权的url发给接入方服务端,url为:", url);
    // 向接入方服务端发起请求，获取鉴权参数（appId、timestamp、nonceStr、signature）
    return axios.get(`/fs/get_config_parameters?url=${url}`)
        .then((res) => {
                console.log(
                    "接入方服务端返回给接入方前端的结果(前端调用config接口的所需参数):", res
                );
                // 通过error接口处理API验证失败后的回调
                window.h5sdk.error((err) => {
                    console.log(3434)
                    throw ("h5sdk error:", JSON.stringify(err));
                });
                // 调用config接口进行鉴权
                window.h5sdk.config({
                    appId: res.data.appid,
                    timestamp: res.data.timestamp,
                    nonceStr: res.data.noncestr,
                    signature: res.data.signature,
                    jsApiList: [],
                    //鉴权成功回调
                    onSuccess: (res) => {
                        console.log(9999)
                        console.log(`config success: ${JSON.stringify(res)}`);
                    },
                    //鉴权失败回调
                    onFail: (err) => {
                        console.log(90099)
                        throw `config failed: ${JSON.stringify(err)}`;
                    },
                });
                // 完成鉴权后，便可在 window.h5sdk.ready 里调用 JSAPI
                window.h5sdk.ready(() => {
                    tt.requestAuthCode({
                        appId: res.data.appid,
                        success: (info) => {
                          console.info(info.code)
                          axios.get(`/fs/getUserInfo?code=${info.code}`)
                          .then(res => {
                            console.log('用户 userid', res)
                          })
                        },
                        fail: (error) => {
                            console.log(0)
                          console.error(error)
                        }
                      });
                    // window.h5sdk.ready回调函数在环境准备就绪时触发
                    // 调用 getUserInfo API 获取已登录用户的基本信息，详细文档参见https://open.feishu.cn/document/uYjL24iN/ucjMx4yNyEjL3ITM
                    tt.getUserInfo({
                        // getUserInfo API 调用成功回调
                        success(res) {
                            console.log(`getUserInfo success: ${JSON.stringify(res)}`);
                        },
                        // getUserInfo API 调用失败回调
                        fail(err) {
                            console.log(`getUserInfo failed:`, JSON.stringify(err));
                        },
                    });
                    // 调用 showToast API 弹出全局提示框，详细文档参见https://open.feishu.cn/document/uAjLw4CM/uYjL24iN/block/api/showtoast
                    tt.showToast({
                        title: "鉴权成功",
                        icon: "success",
                        duration: 3000,
                        success(res) {
                            console.log("showToast 调用成功", res.errMsg);
                        },
                        fail(res) {
                            console.log("showToast 调用失败", res.errMsg);
                        },
                        complete(res) {
                            console.log("showToast 调用结束", res.errMsg);
                        },
                    });
                });
            })
        .catch(function (e) {
            console.error(e);
        });
}