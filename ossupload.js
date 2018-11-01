/**
 * ali oss upload
 * @type {request}
 */
const request = require('request');
//base64压缩
const Base64 = require('./util/base64');
//加密
const crypto = require('./util/crypto');
const sha1 = require('./util/sha1');
//form
const Form = require('form-data');
const conf = {
    accessid:'',
    accesskey:'',
    host:''
};
const policyText = {
    "expiration": "2020-01-01T12:00:00.000Z", //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
    "conditions": [
        ["content-length-range", 0, 1048576000] // 设置上传文件的大小限制
    ]
};
module.exports = {
    ossConf:{},
    getUploadConf() {
        let policyBase64 = Base64.encode(JSON.stringify(policyText));
        let bytes = crypto.HMAC(sha1,policyBase64,conf.accesskey,{asBytes: true});
        let signature = crypto.util.bytesToBase64(bytes);
        this.ossConf = {policyBase64,signature};
    },
    async upload(url = '',fileName = '') {
        return new Promise((resolve,reject) =>{
            let formData = new Form();
            formData.append('key',fileName);
            formData.append('policy',this.ossConf.policyBase64);
            formData.append('OSSAccessKeyId',conf.accessid);
            formData.append('success_action_status','200');
            formData.append('signature',this.ossConf.signature);
            formData.append('file',request(url));
            formData.submit(conf.host,(err,res) =>{
                if(err) reject(err);
                resolve(res);
            });
        });
    }
};