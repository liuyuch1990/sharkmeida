const app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var user = require('../../services/user.js');
const qiniuUploader = require("../../utils/qiniuUploader");

Page({
  data: {
    orderList: [],
    refund_orderid: '',
    refund_orderprice: '',
    refund_resond: '',
    nav_item: ['待付款', '待发货', '待收货', '已完成', '退款/售后'],
    refund_nologarray: ['全额退款'],
    refund_logarray: ['全额退款', '部分退款'],
    refund_index: 0,
    refund_logindex: 0,
    refund_resonarray: ['拍错商品', '商品缺货', '与卖家协商一致退款', '未按约定时间发货', '其他'],
    refund_logresonarray: ['拍错商品', '商品缺货', '与卖家协商一致退款', '未按约定时间发货', '漏发/错发', '收到商品不符合描述', '认为不是正品', '商品质量问题', '其他'],
    refundreson_index: 0,
    refundreson_logindex: 0,
    activeTab: 0,
    url: encodeURIComponent('https://wx.sharkmeida.cn/dist/index.html/#/eggEdit?id='),
    refund_type: 0,
    refundloc_orderid: '',
    refundloc_orderprice: '',
    qiniuUpload: '',
    refund_price: '',
    refund_uploadimg: [],
    // comment_uploadimg:[],
    showModalStatusComment: false,
    animationDataComment: '',
    showModalStatus: false,
    animationData: '',
    comment_detail: {},
    showRefundBox: false,
    showRefundTimeBox: false,
    timestate: 'null',
    // auth: false,
    barginData: [],
    userinfo: '',
    listall: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let that = this;
    //that.setDistriPrice('20180605152025161097')
    // that.checkisstoragedis('20180605152025161097')
    that.getListall();
    try {
      var tab = wx.getStorageSync('tab');
      // console.log(addressId)
      // if (addressId != '') {
      this.setData({
        activeTab: tab
      });
      // }
    } catch (e) {
      // Do something when catch error
    }
    // console.log(app.globalData.token)



  },
  getListall() {
    let that = this;
    util.request(api.lotteryList, {
      page: 0
    }, 'POST').then(function (res) {
      console.log(res)
      wx.hideLoading()
      if (res.code === '0000') {
        that.setData({
          listall: res.result.data,
        });

      }
    });
  },
  onShow() {
    let that = this
    // if (app.globalData.token == "") {
    //   that.setData({
    //     auth: false
    //   })
    //   wx.showToast({
    //     title: '未授权！请在“我的”页点击头像授权!',
    //     icon: 'none',
    //     duration: 2000,
    //     mask: true,
    //   })
    // } else {
    //   //用户已经授权过
    //   that.setData({
    //     auth: true
    //   })
    // wx.showLoading({
    //   title: '获取中...',
    //   mask: true,
    //   success: function (res) {
    //     that.getOrderList();
    //    },
    //   fail: function (res) { },
    //   complete: function (res) { },
    // })
    // }
    that.setData({
      auth: true
    })
    this.onLoad();
  },
  getOrderList() {
    let that = this;
    // console.info('api.OrderList', api.OrderList);
    // console.info(' that.data.activeTab', that.data.activeTab);

    // util.request("https://wx.sharkmeida.cn/sys/log/queryAll", {
    //   index: that.data.activeTab
    // }, 'POST').then(function (res) {
    //   wx.hideLoading()
    //   if (res.errno === 0) {
    //     that.setData({
    //       orderList: res.data.reverse()
    //     });
    //   }
    // });
  },
  onReady: function () {
    // 页面渲染完成
  },

  imgYu: function (event) {
    let that = this;
    var src = event.currentTarget.id;//获取data-src
    var urls = src.split(",")
    //var imgList = event.currentTarget.dataset.list;//获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  viewOrder: function (event) {
    wx.navigateTo({
      url: '/pages/order/order?id=' + event.currentTarget.id + "&type=lottery", //
      success: function (res) {
        console.info("回退后的参数", res);
      },       //成功后的回调；
      fail: function (res) { },         //失败后的回调；
      complete: function (res) { }      //结束后的回调(成功，失败都会执行)
    })
  },
  OutUrl(e) {
    wx.navigateTo({
      url: '/pages/out/out?id=' + e.currentTarget.id + '&url=' + this.data.url + '&footer=#/3pageEdit', //
      success: function (res) {
        console.info("回退后的参数", res);
      },       //成功后的回调；
      fail: function (res) { },         //失败后的回调；
      complete: function (res) { }      //结束后的回调(成功，失败都会执行)
    })
  },
  delActivity(e) {
    let that = this;
    let id = e.currentTarget.id.split(",");
    console.log(id);
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          wx.request({
            //项目的真正接口，通过字符串拼接方式实现
            url: "https://wx.sharkmeida.cn/lottery/delete",
            header: {
              "content-type": "application/json;charset=UTF-8"
            },
            data: JSON.stringify(id),
            method: 'POST',
            success: function (res) {
              //参数值为res.data,直接将返回的数据传入
              //doSuccess(res.data);
              console.log('success');
              that.onLoad();
            },
            fail: function () {
              //doFail();
            },
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  copyActivity(e) {
    let that = this;
    let id = e.currentTarget.id;
    let data = { id: id }
    console.log(data);
    wx.showModal({
      title: '提示',
      content: '确定要复制吗？',
      success: function (sm) {
        if (sm.confirm) {
          wx.request({
            //项目的真正接口，通过字符串拼接方式实现
            url: "https://wx.sharkmeida.cn/lottery/copy",
            header: {
              "content-type": "application/json;charset=UTF-8"
            },
            data: JSON.stringify(data),
            method: 'POST',
            success: function (res) {
              //参数值为res.data,直接将返回的数据传入
              //doSuccess(res.data);
              console.log('success');
              that.onLoad();
            },
            fail: function () {
              //doFail();
            },
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // })
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
})
// 初始化七牛相关参数
function initQiniu(that) {
  var options = {
    region: 'ECN', // 华北区
    // uptokenURL: 'https://[yourserver.com]/api/uptoken',
    uptoken: that.data.qiniuUpload,
    // domain: 'http://[yourBucketId].bkt.clouddn.com',
    shouldUseQiniuFileName: false
  };
  qiniuUploader.init(options);
}
