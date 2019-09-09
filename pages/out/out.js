// pages/out/out.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: 'https://wx.sharkmeida.cn/dist/index.html?id='
  },

  onLoad: function (options) {
    if(options.base!=undefined){
      this.setData({ url: decodeURIComponent(options.url)});
    } else {  
      if (options.footer==undefined){
        this.setData({ url: decodeURIComponent(options.url) + options.id });
      } else { this.setData({ url: decodeURIComponent(options.url) + options.id });}

      }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.gotoHomePage();
  },
  gotoHomePage: function () {//自定义页面跳转方法
    url: '/pages/index/index'
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})