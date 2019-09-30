const app = getApp();
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');

Page({
  data: {
    type: '',
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
    showDistribution: false,
    showGather: false,
    showLottery: false,
    timestate: 'null',
    // auth: false,
    distributionData: [],
    userinfo: '',
    listall: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let that = this;
    //that.setDistriPrice('20180605152025161097')
    // that.checkisstoragedis('20180605152025161097')
    that.getListall(options);
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
  getListall(options) {
    let that = this;
    let url = '';
    util.request(api.queryAllUsers, {
    }, 'POST').then(function (res) {
      console.log(res)
      wx.hideLoading()
      if (res.code === 0) {
        that.setData({
          listall: res.users
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
    this.onLoad(that.options);
  },
  getOrderList() {
    let that = this;
    // console.info('api.OrderList', api.OrderList);
    // console.info(' that.data.activeTab', that.data.activeTab);

    // util.request("https://www.jieruida-qd.com/sys/log/queryAll", {
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
  // })
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  phonecallevent: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.id
    })
  },
  editAdmin: function (e) {
    var that = this
    var status = e.target.dataset.type;
    var userId = e.target.dataset.id;
    util.request(api.updateUsersStatus, {
      userId: userId,
      status: status
    }, 'POST').then(function (res) {
      console.log(res)
      wx.hideLoading()
      if (res.code === 0) {
        var userinfo = wx.getStorageSync('userInfo')
        if (userId == userinfo.userId) {
          userinfo.status = status
        }
        wx.setStorageSync('userInfo', userinfo)
        that.onLoad()
      }
    });
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
