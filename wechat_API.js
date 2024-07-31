const axios = require('axios');
const wechat_config = require('../config/WeChat');
const Buffer = require('buffer').Buffer;
const crypto = require('crypto');
const fs = require('fs');
const FormData = require('form-data');

// 企业id
const corpid = wechat_config.corpid;
// 应用secret
const corpsecret = wechat_config.corpsecret;
//审批模板template_id






//定义一个null的变量，后面函数来赋值;
let access_token = null;
//为变量access_token赋值；
const updateAccessToken = async () => {
    try {
        const response = await axios.get(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpid}&corpsecret=${corpsecret}`);
        const token = response.data.access_token;
        access_token = token;
    } catch (err) {
        console.error(err);
    }
}

// 五分钟更新一次 access_token
setInterval(updateAccessToken, 5 * 60 * 1000); // 单位为毫秒

// 初始获取一次 access_token
updateAccessToken();

module.exports = {
    // 获取访问用户基本信息，根据userId
    user_data: async (userId) => {
        try {
            let { data: user_data } = await axios.get(`https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=${access_token}&userid=${userId}`);
            return { data: user_data };
        } catch (err) {
            if (err.response && err.response.data.errcode === 42001) {
                // 根据实际情况替换以下代码中的 corpid 和 corpsecret
                let response = await axios.get(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpid}&corpsecret=${corpsecret}`);
                access_token = response.data.access_token;
                // 重新调用 user_data 函数，并返回结果
                let { data: user_data } = await axios.get(`https://qyapi.weixin.qq.com/cgi-bin/auth/getuserinfo?access_token=${access_token}&code=${code}`);
                return { data: user_data };
            } else {
                // 其他错误的处理逻辑
                console.error(err);
                return null;
            }
        }
    },
    //企业微信的OAUTH2验证后页面token获取
    oauth2: async (code) => {
        try {
            const oauth2_url = `https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=${access_token}&code=${code}`;
            const data = await axios.get(oauth2_url);
            return data;
        } catch {
            if (err.response && err.response.data.errcode === 42001) {
                // 根据实际情况替换以下代码中的 corpid 和 corpsecret
                let response = await axios.get(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpid}&corpsecret=${corpsecret}`);
                access_token = response.data.access_token;
                // 重新调用 user_data 函数，并返回结果
                const oauth2_url = `https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=${access_token}&code=${code}`;
                const data = await axios.get(oauth2_url);
                return data;
            } else {
                // 其他错误的处理逻辑
                console.error(err);
                return null;
            }
        }

    },

    //读取成员敏感信息
    user_detail_data: async (user_ticket) => {
        try {
            const data = {
                'user_ticket': user_ticket
            }
            let { data: user_detail_data } = await axios.post(`https://qyapi.weixin.qq.com/cgi-bin/auth/getuserdetail?access_token=${access_token}`, data);
            return { data: user_detail_data };
        } catch (err) {
            if (err.response && err.response.data.errcode === 42001) {
                // 根据实际情况替换以下代码中的 corpid 和 corpsecret
                const response = await axios.get(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpid}&corpsecret=${corpsecret}`);
                access_token = response.data.access_token;
                // 重新调用 user_detail_data 函数，并返回结果
                let { data: user_detail_data } = await axios.get(`https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=${access_token}&userid=${user_id}`);
                return { data: user_detail_data };
            } else {
                // 其他错误的处理逻辑
                console.error(err);
                return null;
            }
        }
    },

    //获取部门成员
    department_user: async (department_id) => {
        try {
            const data = await axiox.get(`https://qyapi.weixin.qq.com/cgi-bin/user/simplelist?access_token=${access_token}&department_id=${department_id}`)
            return data;
        } catch (err) {
            if (err.response && err.response.data.errcode === 42001) {
                // 根据实际情况替换以下代码中的 corpid 和 corpsecret
                const response = await axios.get(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpid}&corpsecret=${corpsecret}`);
                access_token = response.data.access_token;
                //重新尝试函数
                const data = await axiox.get(`https://qyapi.weixin.qq.com/cgi-bin/user/simplelist?access_token=${access_token}&department_id=${department_id}`)
                return data;
            } else {
                // 其他错误的处理逻辑
                console.error(err);
                return null;
            }
        }
    },
    //获取部门成员详情
    department_user: async (department_id) => {
        try {
            const data = await axiox.get(`https://qyapi.weixin.qq.com/cgi-bin/user/list?access_token=${access_token}&department_id=${department_id}`)
            return data;
        } catch (err) {
            if (err.response && err.response.data.errcode === 42001) {
                // 根据实际情况替换以下代码中的 corpid 和 corpsecret
                const response = await axios.get(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpid}&corpsecret=${corpsecret}`);
                access_token = response.data.access_token;
                //重新尝试函数
                const data = await axiox.get(`https://qyapi.weixin.qq.com/cgi-bin/user/list?access_token=${access_token}&department_id=${department_id}`)
                return data;
            } else {
                // 其他错误的处理逻辑
                console.error(err);
                return null;
            }
        }
    },
    //获取审批模板详情
    get_templatedetail: async (template_id) => {
        const postData = {
            "template_id": template_id
        };

        try {
            const data = await axios.post(`https://qyapi.weixin.qq.com/cgi-bin/oa/gettemplatedetail?access_token=${access_token}`, postData)
            return data;
        } catch (err) {
            if (err.response && err.response.data.errcode === 42001) {
                // 根据实际情况替换以下代码中的 corpid 和 corpsecret
                const response = await axios.get(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpid}&corpsecret=${corpsecret}`);
                access_token = response.data.access_token;
                //重新尝试函数
                const data = await axios.post(`https://qyapi.weixin.qq.com/cgi-bin/oa/gettemplatedetail?access_token=${access_token}`, postData)
                return data;
            } else {
                // 其他错误的处理逻辑
                console.error(err);
                return null;
            }

        }
    },
    //提交审批申请
    post_approval: async (postData) => {
        try {
            const data = await axios.post(`https://qyapi.weixin.qq.com/cgi-bin/oa/applyevent?access_token=${access_token}`, postData)
            return data;
        } catch (err) {
            if (err.response && err.response.data.errcode === 42001) {
                const response = await axios.get(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpid}&corpsecret=${corpsecret}`);
                access_token = response.data.access_token;
                const data = await axios.post(`https://qyapi.weixin.qq.com/cgi-bin/oa/applyevent?access_token=${access_token}`, postData)
                return data;
            } else {
                // 其他错误的处理逻辑
                console.error(err);
                return null;
            }
        }
    },

    //发送应用消息
    send_message: async (postData) => {
        try {
            const returnData = await axios.post(`https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${access_token}`, postData)
            return returnData;
        } catch (err) {
            if (err.response && err.response.data.errcode === 42001) {
                const response = await axios.get(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpid}&corpsecret=${corpsecret}`);
                access_token = response.data.access_token;
                const returnData = await axios.post(`https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${access_token}`, postData)

                return returnData;
            } else {
                // 其他错误的处理逻辑
                console.error(err);
                return null;
            }
        }

    },
    //临时上传文件
    upload: async (filename, fileType) => {
        try {
            const fileData = fs.readFileSync(filename);
            const uploadMedia = async (fileData, filename) => {
                const formData = new FormData();
                formData.append('media', fileData, {
                    'filename': filename,
                    'contentType': 'application/octet-stream'
                })
                return formData;
            };
            const formData = await uploadMedia(fileData, filename);
            const returnData = await axios.post(`https://qyapi.weixin.qq.com/cgi-bin/media/upload?access_token=${access_token}&type=${fileType}`, formData, {
                headers: formData.getHeaders()
            });
            return returnData;
        } catch (err) {
            console.error(err);
        }
    },





    // 企业微信解密函数
    decrypt: async (encryptedData) => {
        try {
            const key = Buffer.from(wechat_config.callback_KEY + '=', 'base64');
            const iv = key.slice(0, 16);
            const encryptedBuffer = Buffer.from(encryptedData, 'base64');
            const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
            const decryptedData = (() => {
                let data = decipher.update(encryptedBuffer);
                const paddingLen = data.slice(16, 20).readUInt32BE();
                return data.slice(20, 20 + paddingLen).toString('utf8');
            })();
            return decryptedData;
        } catch {
            return '解密失败'
        }

    },
    // 企业微信加密函数
    encryption: async (decryptData) => {
        try {
            const corpid = wechat_config.corpid;
            const lengthBuffer = Buffer.alloc(4);
            lengthBuffer.writeUInt32BE(decryptData.length);
            const bytes = crypto.randomBytes(16);;
            const data = [bytes, lengthBuffer, decryptData, corpid].join('');
            const key = Buffer.from(wechat_config.callback_KEY + '=', 'base64');
            const iv = bytes;
            // 创建 Cipher 对象
            const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
            // 加密数据
            let encryptedData = cipher.update(data, 'binary', 'base64');
            encryptedData += cipher.final('base64');
            return encryptedData;
        } catch {
            return '加密失败';
        }



    },
    //企业微信验证验证函数
    verify: async (timestamp, nonce, verifyData) => {
        try {
            const token = wechat_config.callback_token;
            const signArr = [token, timestamp, nonce, verifyData].sort();
            const signStr = signArr.join('');
            const hashCode = crypto.createHash('sha1');
            const resultCode = hashCode.update(signStr, 'utf8').digest('hex');
            return resultCode;
        } catch (err) {
            console.error(err);
            return '计算签名失败';
        }
    }






};








