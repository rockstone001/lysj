// steps.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "title": "",
    "pic": "",
    "author": "",
    "summary": "",
    "publisher": "",
    "pubplace": "",
    "pubdate": "",
    "page": '',
    "price": '',
    "isbn": "",
    "keyworkd": "",
    "language": "",
    "types": [
      "儿童", "教辅", "小说", "管理", "文学", "成功励志", "青春文学", "历史", "哲学宗教", "传记", "保健养生", "亲子家教", "科技"
    ],
    "type": -1,
    "upload_file": '',
    "id": 0,
    "latitude": 0,
    "longitude": 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    })
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

  },

  bindPickerChange: function (e) {
    this.setData({
      "type": e.detail.value
    })
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          "upload_file": tempFilePaths[0],
          "pic": tempFilePaths[0]
        });
      }
    });
  },
  save: function (e) {
    
    var _type = e.detail.value.type;
    var title = e.detail.value.title;
    var author = e.detail.value.author;
    var price = e.detail.value.price;
    var publisher = e.detail.value.publisher;
    var page = e.detail.value.page;
    var summary = e.detail.value.summary;
    e.detail.value.id = this.data.id;
    e.detail.value.latitude = this.data.latitude;
    e.detail.value.longitude = this.data.longitude;

    if (_type == -1) {
      wx.showModal({
        title: '操作提示',
        content: '请选择分类！',
        showCancel: false
      });
      return;
    }
    if (/^\s*$/.test(title)) {
      wx.showModal({
        title: '操作提示',
        content: '书名不能为空！',
        showCancel: false
      });
      return;
    }
    if (/^\s*$/.test(author)) {
      wx.showModal({
        title: '操作提示',
        content: '作者不能为空！',
        showCancel: false
      });
      return;
    }
    if (!/^\d+(\.\d+)*$/.test(price)) {
      wx.showModal({
        title: '操作提示',
        content: '价格格式不对！',
        showCancel: false
      });
      return;
    }
    if (/^\s*$/.test(publisher)) {
      wx.showModal({
        title: '操作提示',
        content: '出版社不能为空！',
        showCancel: false
      });
      return;
    }
    if (!/^\d+$/.test(page)) {
      wx.showModal({
        title: '操作提示',
        content: '页数格式错误！',
        showCancel: false
      });
      return;
    }
    if (/^\s*$/.test(summary)) {
      wx.showModal({
        title: '操作提示',
        content: '摘要不能为空！',
        showCancel: false
      });
      return;
    }

    wx.showLoading({
      title: '正在上传',
      mask: true
    });
    var that = this;
    if (this.data.upload_file != "") {
      //上传图片和数据
      wx.uploadFile({
        url: getApp().globalData.Config.apiHost + 'book/upload?token=' + wx.getStorageSync('token'),
        filePath: this.data.pic,
        name: 'pic',
        formData: e.detail.value,
        success: function (res) {
          wx.hideLoading();
          var data = JSON.parse(res.data);
          if (data.code == 0) {
            // wx.navigateTo({
            //   url: 'step2?book=' + JSON.stringify(data.msg)
            // });
            wx.showModal({
              title: '操作提示',
              content: '发布成功！',
              cancelText: '查看图书',
              confirmText: '继续发布',
              success: function (res2) {
                if (res2.confirm) {
                  that.initData();
                } else if (res2.cancel) {
                  getApp().globalData.if_redirect_to_my_books = true;
                  wx.switchTab({
                    url: '/mine/index'
                  });
                }
              }
            });
          }
        },
        fail: function (data) {
          console.log(data);
          wx.hideLoading();
          wx.showModal({
            title: '错误提示',
            content: '未能保存图书数据, 请重试！',
            showCancel: false
          });
        }
      });
    } else {
      //不上传图片 只保存数据
      wx.request({
        url: getApp().globalData.Config.apiHost + 'book/save_book?token=' + wx.getStorageSync('token'),
        method: "POST",
        header: {
          "Content-Type": 'application/x-www-form-urlencoded'
        },
        data: e.detail.value,
        success: function (res) {
          wx.hideLoading();
          if (res.data.code == 0) {
            wx.showModal({
              title: '操作提示',
              content: '发布成功！',
              cancelText: '查看图书',
              confirmText: '继续发布',
              success: function (res2) {
                if (res2.confirm) {
                  that.initData();
                } else if (res2.cancel) {
                  getApp().globalData.if_redirect_to_my_books = true;
                  wx.switchTab({
                    url: '/mine/index'
                  });
                }
              }
            });
          }
        },
        fail: function (data) {
          console.log(data);
          wx.hideLoading();
          wx.showModal({
            title: '错误提示',
            content: '未能保存图书数据, 请重试！',
            showCancel: false
          });
        }
      })
    }

  },
  scanEnter: function () {
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        if (res.result) {
          //返回isbn 通过isbn获取书本信息
          var isbn = res.result;
          wx.request({
            url: getApp().globalData.Config.apiHost + 'book/get_book',
            data: {
              token: wx.getStorageSync('token'),
              isbn: isbn
            },
            success: function (res) {
              if (res.data.code == 0) {
                // 获取图书信息成功  进入图书确认页面
                that.setData(res.data.msg);
              } else if (res.data.code == 205) {
                // 无法获取图书信息 是否进入手动录入页面
                //先提示用户没有获取到图书信息
                wx.showModal({
                  title: '操作提示',
                  content: '没有该图书的信息, 点击确定手工录入！',
                  success: function (res) {
                    if (res.confirm) {
                      //手工录入
                    }
                  }
                });

              } else {
                // 各种失败
                wx.showModal({
                  title: '错误提示',
                  content: res.data.msg,
                  showCancel: false
                });
              }
            },
            fail: function (data) {
              wx.showModal({
                title: '错误提示',
                content: '未能获取图书信息！',
                showCancel: false
              });
            }
          });
        }
      }
    });
  },
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  initData: function() {
    this.setData({
      "title": "",
      "pic": "",
      "author": "",
      "summary": "",
      "publisher": "",
      "pubplace": "",
      "pubdate": "",
      "page": '',
      "price": '',
      "isbn": "",
      "keyworkd": "",
      "language": "",
      "types": [
        "儿童", "教辅", "小说", "管理", "文学", "成功励志", "青春文学", "历史", "哲学宗教", "传记", "保健养生", "亲子家教", "科技"
      ],
      "type": -1,
      "upload_file": '',
      "id": 0
    })
  }
})