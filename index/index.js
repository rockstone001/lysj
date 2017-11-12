// index.js
var util = require('../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "winWidth": 100,
    "winHeight": 200,
    "btnWidth": 0,
    "btnHeight": 0,
    "btnX": 0,
    "btnY": 0,
    "btnHidden": false,
    "hasMobile": false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          "winWidth": res.windowWidth,
          "winHeight": res.windowHeight,
          "btnWidth": res.windowWidth * 650 / 750,
          "btnHeight": res.windowHeight * 120 / 1206,
          "btnX": res.windowWidth * 50 / 750,
          "btnY": res.windowHeight * 766 / 1206
        });
      }
    });

    // console.log(that.data);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    wx.showToast({
      title: '正在获取数据',
      icon: 'loading',
      mask: true
    });
    wx.request({
      url: getApp().globalData.Config.apiHost + 'user/get_userinfo?token=' + wx.getStorageSync('token'),
      method: "GET",
      header: {
        "Content-Type": 'application/x-www-form-urlencoded'
      },
      success: function (res1) {
        // console.log(res1);
        wx.hideToast();
        if (res1.data.code == 0) {
          // that.cancel();
          // console.log(res1.data.msg.mobile);
          if (res1.data.msg.mobile) {
            that.setData({
              "hasMobile": true
            });
          }
        } else {
          wx.showModal({
            title: '错误提示',
            content: res1.data.msg,
            showCancel: false
          });
        }
      },
      fail: function (data) {
        wx.hideToast();
        wx.showModal({
          title: '错误提示',
          content: '网络错误，请重试！',
          showCancel: false
        });
      }
    });
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
  start: function() {
    if (!this.data.hasMobile){
      wx.redirectTo({
        url: '/bind/index',
      });
    } else {
      wx.redirectTo({
        url: '/profile/index',
      });
    }
  }
})