const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');
const txvContext = requirePlugin("tencentvideo");
const config = require('../../modules/config');
const app = getApp();
//获取应用实例
Page({
  data: {
    newGoods: [],
    // newGoodslist: [],
    hotGoods: [],
    // hotGoodslist: [],
    luckdraw: [],
    collage: [],
    contactImage: '',
    phoneImage: '',
    // topics: [],
    // brands: [],
    floorGoods: [],
    contactList: [],
    banner: [],
    channel: [],
    auth: false,
    controll:true,
    userinfo: {},
    webviewurl: '/pages/out/out?base=1&url=',
    Inviter_userid: [],
    Inviter_laster: '',
    isdistribution: true,
    Inviter_locallaster: [],
    scrollTop: 0, //滚动监听
    vid: 'l0025mppim4',
    videos: [],
    isRuleTrue: true,
    pageNumberbusiness: 2,
    pageNumberactivity: 2,
    phonecall: '18652043832'
  },
  onShareAppMessage: function() {
    let that = this
    if (app.CorporateData.name == 'bbg') {
      return {
        title: '贝堡商城',
        desc: '贝堡商城微信小程序',
        path: '/pages/index/index',
        imageUrl: '../../image/CorporateData/bbg_share_logo.png',
      }
    } else if (app.CorporateData.name == 'yt') {
      return {
        title: '易天商城吊桥路店',
        desc: '易天商城吊桥路店微信小程序',
        path: '/pages/index/index',
        imageUrl: '../../image/CorporateData/yt_share_logo.png',
      }
    } else if (app.CorporateData.name == 'dw') {
      return {
        title: '德威商城·乐家家国际超市',
        desc: '德威商城·乐家家国际超市微信小程序',
        path: '/pages/index/index',
        imageUrl: '../../image/CorporateData/dw_share_logo.png',
      }
    }

  },
  // 下拉刷新
  onPullDownRefresh: function() {
    let that = this
    // if(op == '0'){
    // this.checkauth('1')
    wx.showLoading({
      title: '更新中...',
      mask: true,
    })
    that.getIndexData();
  },
  getIndexData: function() {
    let that = this;
    util.request(api.IndexUrl).then(function(res) {
      console.log(res)
      wx.hideLoading()
      if (res.errno === 0) {
        that.setData({
          // luckdraw: res.data.luckdraw,
          // collage: res.data.collage,
          newGoods: res.data.newGoodsList,
          contactList: res.data.contactList,
          contactImage: res.data.contactList[0].banner_url,
          phoneImage: res.data.contactList[1].banner_url,
          floorGoods: res.data.categoryList,
          banner: res.data.banner,
          videos: res.data.videos,
          channel: res.data.channel,
          pageNumberactivity: 2,
          pageNumberbusiness: 2
        });
        // util.request(api.GoodsCount).then(function(res) {
        //   that.setData({
        //     goodsCount: res.data.goodsCount
        //   });
        // });
        wx.stopPullDownRefresh()
        that.setTime()
      }
    });
  },
  setTime() {
    let that = this
    console.log(that.data.luckdraw)
    for (let i = 0; i < that.data.luckdraw.length; i++) {
      let item = that.data.luckdraw[i]
      item.open_local_time = util.timestampToTime(item.luck_open_time)
      item.limit_local_time = util.timestampToTime(item.luck_limit_time)
      // item.is_out_time_page = Number(item.luck_limit_time) > new Date().getTime() ? '0' : '1'
      // item.is_open_time_page = Number(item.luck_open_time) > new Date().getTime() ? '0' : '1'
    }
    that.setData({
      luckdraw: that.data.luckdraw
    })
  },
  toluckdrawpage(e) {
    // console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/luckdraw/luckdraw?id=' + e.currentTarget.dataset.id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  tocollagepage(e) {
    wx.navigateTo({
      url: '/pages/goods/goods?id=' + e.currentTarget.dataset.id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  navToPage(e) {
    var url = e.currentTarget.dataset.url
    if (url.indexOf("https") != -1) {
      url = this.data.webviewurl + encodeURIComponent(url)
    }
    wx.navigateTo({
      url: url,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  setLoadingbusiness(options) {
    var beforefloorGoods = this.data.floorGoods
    var that = this
    var pageNumberbusiness = this.data.pageNumberbusiness
    util.request(api.querybusiness, {
      pageNum: pageNumberbusiness,
      pageSize: 1
    }, 'POST').then(function(res) {
      wx.hideLoading()
      if (res.code === '0000' && (res.result.data != '')) {
        that.setData({
          floorGoods: beforefloorGoods.concat(res.result.data),
          pageNumberbusiness: pageNumberbusiness + 1
        });
      } else {
        that.setData({
          isdistribution: false
        });
      }
    });
  },

  setLoadingActivity(options) {
    var beforenewGoods = this.data.newGoods
    var that = this
    var pageNum = this.data.pageNumberactivity
    util.request(api.querydistribution, {
      pageNum: pageNum,
      pageSize: 1
    }, 'POST').then(function(res) {
      wx.hideLoading()
      if (res.code === '0000' && (res.result.data != '')) {
        that.setData({
          newGoods: beforenewGoods.concat(res.result.data),
          pageNumberactivity: pageNum + 1
        });
      } else {
        that.setData({
          isRuleTrue: false
        });
      }
    });
  },
  onLoad: function(options) {
    let that = this
    // console.log(options)
    wx.showLoading({
      title: '连接服务器...',
      mask: true,
    })
    that.getIndexData();
    that.checkIsAuth();
  },
  checkIsAuth() {
    wx.getStorage({
      key: 'auth',
      success: function(res) {
        console.log('存在')
        console.log(res.data)
      },
      fail: function(res) {
        console.log('不存在')
        wx.setStorage({
          key: "auth",
          data: false
        })
      },
    })
  },
  tocategorypage(e) {
    wx.navigateTo({
      url: '/pages/category/category?id=' + e.currentTarget.dataset.id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // back_to_top() {
  //   wx.pageScrollTo({
  //     scrollTop: 0,
  //     duration: 2000
  //   })
  // },
  // //滚动监听
  // scroll(e) {
  //   console.log(e)
  //   // this.setData({
  //   //   scrollTop: e.detail.scrollTop
  //   // })
  //   // console.log(this.data.scrollTop)
  // },
  onReady: function() {
    // console.log("1111111")
    // 页面渲染完成

  },
  onShow: function(op) {
    // 页面显示
    let that = this
    // if(op == '0'){
    // this.checkauth('1')
    // wx.showLoading({
    //   title: '更新中...',
    //   mask: true,
    //   success: function(res) {},
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
    that.getIndexData();

    // this.onshowaction()

    // }
    // this.onLoad();
    // this.goLogin()


  },
  // onshowaction() {
  // this.checkauth('1')
  // },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },
  // 点击事件
  phonecallevent: function(e) {
    wx.makePhoneCall({
      phoneNumber: this.data.phonecall
    })
  }
})