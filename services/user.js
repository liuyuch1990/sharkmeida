/**
 * 用户相关服务
 */

const util = require('../utils/util.js');
const api = require('../config/api.js');
const app = getApp();
/**
 * 调用微信登录
 */
function loginByWeixin() {
  let code = null;
  return new Promise(function (resolve, reject) {
    return util.login().then((res) => {
      code = res.code;
      return util.getUserInfo();
    }).then((userInfo) => {
      //登录远程服务器
      userInfo.userInfo.mobile = wx.getStorageSync("mobile");
      util.request(api.getUserInfoByCode, {
        code:code,
        msg:JSON.stringify(userInfo.userInfo)
     }, 'POST').then(res => {
        console.log(res)
       if (res.code == '0000') {
          //存储用户信息
          wx.setStorageSync('userInfo', res.result.data.user);
          wx.setStorageSync('token', res.result.data.WebAccessToken);

          resolve(res);
        } else {
          reject(res);
        }
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    })
  });
}

/**
 * 判断用户是否登录
 */
function checkLogin() {
  return new Promise(function (resolve, reject, resule) {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {
      util.checkSession().then((res) => {
        resolve(true);
        console.log('session_Key未过期')
        // resule = true
        // return true
      }).catch(() => {
        reject(false);
        console.log('session_Key过期')
        app.globalData.token = '';
        // return false
      });

    } else {
      reject(false);
    }
  });
}


module.exports = {
  loginByWeixin,
  checkLogin,
  // checkAuth,
};











