// user_info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    location: '',
    latitude: 0,
    longitude: 0,
    "is_android": 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          is_android: res.platform == 'android'
        });
      }
    });
    var data = {};
    if (options.mobile) {
      data.mobile = options.mobile;
    }
    if (options.location) {
      data.location = options.location;
    }
    if (options.latitude) {
      data.latitude = options.latitude;
    }
    if (options.longitude) {
      data.longitude = options.longitude;
    }

    this.setData(data);
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
  save: function (e) {
    wx.showLoading({
      title: '正在保存',
      mask: true
    });
    wx.request({
      url: getApp().globalData.Config.apiHost + 'user/save_user_info?token=' + wx.getStorageSync('token'),
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
            content: '保存成功！',
            showCancel: false,
            success: function(res2) {
              if (res2.confirm) {
                wx.navigateBack({
                  delta: 1
                });
              }
            }
          });
        }
      },
      fail: function (data) {
        wx.hideLoading();
        wx.showModal({
          title: '错误提示',
          content: '未能保存用户数据！',
          showCancel: false
        });
      }
    })
  },
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  getLocation: function(e) {
    console.log('hello world');
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          'location': res.name,
          'latitude': res.latitude,
          'longitude': res.longitude
        });
      }
    });
  }
})