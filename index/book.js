// book.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "id": 0,
    'nickname': '',
    'headimgurl': '',
    "title": "",
    "subtitle": "",
    "pic": "/images/book.png",
    "author": "",
    "summary": "",
    "publisher": "",
    "pubdate": "",
    "page": 0,
    "price": 0.00,
    "charge": 0.00,
    "isbn": "",
    "state": 1,
    "winWidth": 0,
    "winHeight": 0,
    "is_android": 1,
    "borrow_days": "",
    'latitude': 0,
    'longitude': 0,
    "uid": 0,
    "nickname": "",
    "location": "",
    "distance": "",
    "is_collected": 0,
    "deposit": 0,
    "expire_charge": 0,
    'is_booked': 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id ? options.id : 30;
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          is_android: res.platform == 'android',
          id: id
        });
      }
    }); 
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
    //获取当前坐标
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
        that.getBook(that.data.id);
      }
    });
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
  getBook: function (id) {
    wx.showLoading({
      title: '正在加载数据',
      mask: true
    });
    var that = this;
    wx.request({
      url: getApp().globalData.Config.apiHost + 'book/get_book_by_id',
      data: {
        id: id,
        token: wx.getStorageSync('token'),
        'latitude': that.data.latitude,
        'longitude': that.data.longitude
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 0) {
          that.setData(res.data.msg);
        }
      },
      fail: function (data) {
        wx.hideLoading();
        wx.showModal({
          title: '错误提示',
          content: '未能获取我的图书！',
          showCancel: false
        });
      }
    })
  },
  collect: function () {
    var id = this.data.id;

    var title = this.data.is_collected ? '正在取消收藏' : "正在执行收藏";
    wx.showLoading({
      title: title,
      mask: true
    });
    var that = this;
    wx.request({
      url: getApp().globalData.Config.apiHost + 'user/collect?token=' + wx.getStorageSync('token'),
      method: "POST",
      header: {
        "Content-Type": 'application/x-www-form-urlencoded'
      },
      data: {
        id: id
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 0) {
          title = that.data.is_collected ? '取消收藏成功' : '收藏成功';
          that.setData({
            is_collected: !that.data.is_collected
          });
          wx.showModal({
            title: '操作提示',
            content: title,
            showCancel: false
          });
        } else {
          wx.showModal({
            title: '错误提示',
            content: res.data.msg,
            showCancel: false
          });
        }
      },
      fail: function (data) {
        wx.hideLoading();
        wx.showModal({
          title: '错误提示',
          content: '网络错误，请重试！',
          showCancel: false
        });
      }
    });
  },
  book: function () {
    var id = this.data.id;

    var title = this.data.is_booked ? '正在取消预约' : "正在预约";
    wx.showLoading({
      title: title,
      mask: true
    });
    var that = this;
    wx.request({
      url: getApp().globalData.Config.apiHost + 'book/book?token=' + wx.getStorageSync('token'),
      method: "POST",
      header: {
        "Content-Type": 'application/x-www-form-urlencoded'
      },
      data: {
        id: id
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 0) {
          title = !res.data.msg.is_booked ? '取消预约成功' : '预约成功';
          that.setData({
            is_booked: res.data.msg.is_booked
          });
          wx.showModal({
            title: '操作提示',
            content: title,
            showCancel: false
          });
        } else {
          wx.showModal({
            title: '错误提示',
            content: res.data.msg,
            showCancel: false
          });
        }
      },
      fail: function (data) {
        wx.hideLoading();
        wx.showModal({
          title: '错误提示',
          content: '网络错误，请重试！',
          showCancel: false
        });
      }
    });

  },
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  }
})