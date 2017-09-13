// index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "indexList": [
      {
        "id": "my_books/index",
        "desc": "我的图书"
      },
      {
        "id": "my_borrowed/index",
        "desc": "我的借阅"
      }
    ],
    'userInfo': {
      'avatarUrl': '/images/myself.png'
    },
    'mobile': '',
    'location': '',
    latitude: 0,
    longitude: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (getApp().globalData.if_redirect_to_my_books) {
      wx.navigateTo({
        url: 'my_books/index',
        success: function() {
          getApp().globalData.if_redirect_to_my_books = false;
        }
      })
    }
    var that = this;
    setTimeout(function(){
      that.setData({
        'userInfo': getApp().globalData.userInfo
      });
    }, 500);
    this.setData({
      'userInfo': getApp().globalData.userInfo
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
    //刷新用户信息
    this.get_userinfo();
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

  get_userinfo: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.Config.apiHost + 'user/get_userinfo',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData(res.data.msg);
        }
      },
      fail: function (data) {
        wx.showModal({
          title: '错误提示',
          content: '未能获取用户数据！',
          showCancel: false
        });
      }
    }); 
  }
})