var that;
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
Page({


  data: {
    image_width: getApp().screenWidth / 4 - 10,
    loading: false,
    roll_images: [],
    business_images: [],
    description_images: [],
    banner_images: [],
    banner_name: [],
    videos: [],
    urlArr: [],
    inputVal: '',
    id: null,
    choseReason: '',
    objectId: '',
    hiddenmodalput: true,
    editClassId: 0,
    editClassIndex: 0,
    editClassName: "功能名称",
    role: ''
  },


  onLoad: function(options) {
    that = this;
    util.request(api.queryApp).then(function(res) {
      console.log(res)
      wx.hideLoading()
      if (res.code === '0000') {
        console.log(res.msg);
      }
      
      var banners = res.result.channel;
      for (var i=0; i< banners.length;){
        if (banners[i].url.indexOf("pages")>0){
          banners.splice(i,1)
        }else{
          i++
        }
      }
      that.setData({
        roll_images: res.result.roll,
        business_images: res.result.contact,
        description_images: res.result.business,
        banner_images: banners,
        videos: res.result.vedio
      });
    });
  },


  onShow: function() {

  },


  choseReason: function(e) {
    var index = e.currentTarget.dataset.index; //获取自定义的ID值  
    this.setData({
      id: index,
      choseReason: that.data.reasonList[index]
    })
    console.log(that.data.id)
  },
  upImg: function() {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        wx.showNavigationBarLoading()
        that.setData({
          loading: false
        })
        //var urlArr = that.data.urlArr;
        // var urlArr={};
        var tempFilePaths = res.tempFilePaths;
        var roll_images = that.data.roll_images;

        // that.setData({
        //   roll_images: roll_images.concat(tempFilePaths)
        // });
        var imgLength = tempFilePaths.length;
        if (imgLength > 0) {
          wx.uploadFile({
            url: 'https://wx.sharkmeida.cn/distribution/upload', //仅为示例，非真实的接口地址
            filePath: tempFilePaths[0],
            name: 'upfile',
            formData: {
              'user': 'test'
            },
            success: function(res) {
              res = JSON.parse(res.data)
              var imgurl = res.result.data
              var name = imgurl.replace('https://wx.sharkmeida.cn/imgs/', '').split('.')[0]
              util.request(api.updateAppForPic, {
                img_path: imgurl,
                name: name,
                type: '2'
              }, 'POST').then(function(res) {
                console.log(res)
                wx.hideLoading()
                if (res.code === '0000') {
                  var img = {
                    id: res.result.id,
                    img_path: res.result.img_path
                  }
                  that.setData({
                    roll_images: roll_images.concat(img)
                  });
                  console.log(res.msg);
                }
              });
              //do something
            }
          })
        }
      }
    })
    console.log(that.data.urlArr)
  },


  delete_roll: function(e) {
    // 获取本地显示的图片数组
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var roll_images = that.data.roll_images;
    var urlArr = that.data.urlArr;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function(sm) {
        if (sm.confirm) {
          urlArr.splice(index, 1);
          roll_images.splice(index, 1);
          that.setData({
            roll_images: roll_images,
            urlArr: urlArr
          });
          util.request(api.deleteAppForPic, {
            id: id
          }, 'POST').then(function(res) {
            console.log(res)
            wx.hideLoading()
            if (res.code === '0000') {
              console.log(res.msg);
            }
          });
          console.log(that.data.urlArr)
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },


  upBusinessImg: function() {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        wx.showNavigationBarLoading()
        that.setData({
          loading: false
        })
        //var urlArr = that.data.urlArr;
        // var urlArr={};
        var tempFilePaths = res.tempFilePaths;
        var business_images = that.data.business_images;

        that.setData({
          business_images: business_images.concat(tempFilePaths)
        });
        var imgLength = business_images.length;
        if (imgLength >= 0 && imgLength < 2) {
          wx.uploadFile({
            url: 'https://wx.sharkmeida.cn/distribution/upload', //仅为示例，非真实的接口地址
            filePath: tempFilePaths[0],
            name: 'upfile',
            formData: {
              'user': 'test'
            },
            success: function(res) {
              res = JSON.parse(res.data)
              var imgurl = res.result.data
              var name = imgurl.replace('https://wx.sharkmeida.cn/imgs/', '').split('.')[0]
              util.request(api.updateAppForPic, {
                img_path: imgurl,
                name: name,
                type: '5'
              }, 'POST').then(function(res) {
                console.log(res)
                wx.hideLoading()
                if (res.code === '0000') {
                  var img = {
                    id: res.result.id,
                    img_path: res.result.img_path
                  }
                  that.setData({
                    business_images: business_images.concat(img)
                  });
                }
              });
              //do something
            }
          })
        } else {
          business_images.splice(imgLength, 1);
          that.setData({
            business_images: business_images
          });
          wx.showToast({
            title: '只可以上传两张图片',
            //image: '../../image/warn.png',
            duration: 4000
          })
        }
      }
    })
    console.log(that.data.urlArr)
  },

  delete_business: function(e) {
    // 获取本地显示的图片数组
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var business_images = that.data.business_images;
    var urlArr = that.data.urlArr;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function(sm) {
        if (sm.confirm) {
        urlArr.splice(index, 1);
        business_images.splice(index, 1);
        that.setData({
          business_images: business_images,
          urlArr: urlArr
        });
        util.request(api.deleteAppForPic, {
          id: id
        }, 'POST').then(function(res) {
          console.log(res)
          wx.hideLoading()
          if (res.code === '0000') {
            console.log(res.msg);
          }
        });
        console.log(that.data.urlArr)
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  upDescriptionImg: function() {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        wx.showNavigationBarLoading()
        that.setData({
          loading: false
        })
        //var urlArr = that.data.urlArr;
        // var urlArr={};
        var tempFilePaths = res.tempFilePaths;
        var description_images = that.data.description_images;

        that.setData({
          description_images: description_images.concat(tempFilePaths)
        });
        var imgLength = description_images.length;
        if (imgLength >= 0) {
          wx.uploadFile({
            url: 'https://wx.sharkmeida.cn/distribution/upload', //仅为示例，非真实的接口地址
            filePath: tempFilePaths[0],
            name: 'upfile',
            formData: {
              'user': 'test'
            },
            success: function(res) {
              res = JSON.parse(res.data)
              var data = res.data
              var imgurl = res.result.data
              var name = imgurl.replace('https://wx.sharkmeida.cn/imgs/', '').split('.')[0]
              util.request(api.updateAppForPic, {
                img_path: imgurl,
                name: name,
                type: '4'
              }, 'POST').then(function(res) {
                console.log(res)
                wx.hideLoading()
                if (res.code === '0000') {
                  var img = {
                    id: res.result.id,
                    img_path: res.result.img_path
                  }
                  that.setData({
                    description_images: description_images.concat(img)
                  });
                }
              });
              //do something
            }
          })
        }
      }
    })
    console.log(that.data.urlArr)
  },

  delete_description: function(e) {
    // 获取本地显示的图片数组
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var description_images = that.data.description_images;
    var urlArr = that.data.urlArr;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function(sm) {
        if(sm.confirm){
        urlArr.splice(index, 1);
        description_images.splice(index, 1);
        that.setData({
          description_images: description_images,
          urlArr: urlArr
        });
        util.request(api.deleteAppForPic, {
          id: id
        }, 'POST').then(function(res) {
          console.log(res)
          wx.hideLoading()
          if (res.code === '0000') {
            console.log(res.msg);
          }
        });
        console.log(that.data.urlArr)
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 编辑分类
   */
  btnClassEdit: function(e) {
    var classId = e.target.dataset.id;
    var classindex = e.target.dataset.index;
    var className = e.target.dataset.name;
    console.log("编辑分类：", e.target.dataset);
    this.setData({
      editClassId: classId,
      editClassIndex: classindex,
      editClassName: className,
      hiddenmodalput: false,
    })
  },
  /**
   * 编辑分类名称（取消）按钮
   */
  btnEditClassNameCancel: function() {
    console.log("编辑分类名称（取消）按钮");
    this.setData({
      hiddenmodalput: true
    });
  },

  /**
   * 编辑分类名称输入框
   */
  inputEditClassName: function(e) {
    this.setData({
      editClassName: e.detail.value
    });
  },
  /**
   * 编辑分类名称（提交）按钮
   */
  btnEditClassNameConfirm: function() {
    that = this;
    var index = this.data.editClassIndex; //获取自定义的ID值  
    var up = "banner_images[" + index + "].name";
    this.setData({
      hiddenmodalput: true,
      [up]: this.data.editClassName
    });
    util.request(api.updateAppForPic, {
      id: this.data.editClassId,
      url: 'https://wx.sharkmeida.cn/dist/index.html#/1pageEdit?id=&name=' + encodeURIComponent(this.data.editClassName),
      type: '1',
      name: this.data.editClassName
    }, 'POST').then(function(res) {
      console.log(res)
      wx.hideLoading()
      if (res.code === '0000') {
        // that.setData({
        //   listall: res.result.data,
        // });
      }
    });
  },
  upBannerImg: function() {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        wx.showNavigationBarLoading()
        that.setData({
          loading: false
        })
        //var urlArr = that.data.urlArr;
        // var urlArr={};
        var tempFilePaths = res.tempFilePaths;
        var banner_images = that.data.banner_images;

        that.setData({
          banner_images: banner_images.concat(tempFilePaths)
        });
        var imgLength = banner_images.length;
        if (imgLength >= 0) {
          wx.uploadFile({
            url: 'https://wx.sharkmeida.cn/distribution/upload', //仅为示例，非真实的接口地址
            filePath: tempFilePaths[0],
            name: 'upfile',
            formData: {
              'user': 'test'
            },
            success: function(res) {
              res = JSON.parse(res.data)
              var data = res.data
              var imgurl = res.result.data
              var name = imgurl.replace('https://wx.sharkmeida.cn/imgs/', '').split('.')[0]
              util.request(api.updateAppForPic, {
                img_path: imgurl,
                name: name,
                type: '1'
              }, 'POST').then(function(res) {
                console.log(res)
                wx.hideLoading()
                if (res.code === '0000') {
                  var img = {
                    id: res.result.id,
                    name: res.result.name,
                    img_path: res.result.img_path
                  }
                  that.setData({
                    banner_images: banner_images.concat(img)
                  });
                }
              });
              //do something
            }
          })
        }
      }
    })
    console.log(that.data.urlArr)
  },

  delete_banner: function(e) {
    // 获取本地显示的图片数组
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var banner_images = that.data.banner_images;
    var urlArr = that.data.urlArr;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function(sm) {
        if(sm.confirm){
        urlArr.splice(index, 1);
        banner_images.splice(index, 1);
        that.setData({
          banner_images: banner_images,
          urlArr: urlArr
        });
        util.request(api.deleteAppForPic, {
          id: id
        }, 'POST').then(function (res) {
          console.log(res)
          wx.hideLoading()
          if (res.code === '0000') {
            console.log(res.msg);
          }
        });
        console.log(that.data.urlArr)
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  upVideo: function(e) {
    var that = this
    var videos = that.data.videos;
    var video_v = {
      img_path: ''
    }
    that.setData({
      videos: videos.concat(video_v)
    });
  },

  inputTyping: function(e) {
    var index = e.currentTarget.dataset.index;
    var up = "videos[" + index + "].img_path";
    this.setData({
      inputVal: e.detail.value,
      [up]: e.detail.value
    });
  },
  /**
   * 编辑分类名称（提交）按钮
   */
  btnVideoEdit: function(e) {
    var index = e.currentTarget.dataset.index;
    var inputvalue = this.data.videos[index]
    var id = e.currentTarget.dataset.id;
    if (inputvalue.img_path != '') {
      util.request(api.updateAppForPic, {
        id: inputvalue.id,
        img_path: inputvalue.img_path,
        type: '6',
        name: 'video'
      }, 'POST').then(function(res) {
        console.log(res)
        var up = "videos[" + index + "].id";
        wx.hideLoading()
        if (res.code === '0000') {
          that.setData({
            [up]: res.result.id,
          });
        }
      });
    } else {
      wx.showToast({
        title: '请输入vid再保存',
        //image: '../../image/warn.png',
        duration: 4000
      })
    }
  },
  delete_video: function(e) {
    // 获取本地显示的图片数组
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var videos = that.data.videos;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function(sm) {
        if(sm.confirm){
        videos.splice(index, 1);
        that.setData({
          videos: videos
        });
        if (id != '' && id != undefined) {
          util.request(api.deleteAppForPic, {
            id: id
          }, 'POST').then(function (res) {
            console.log(res)
            wx.hideLoading()
            if (res.code === '0000') {
              console.log(res.msg);
            }
          });
        }
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }}
    })
  },
})