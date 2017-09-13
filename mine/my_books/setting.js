// setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'pic': '',
    'title': '',
    'author': '',
    'price': '',
    'deposit': '',
    'charge': '',
    'borrow_days': '',
    'expire_charge': '',
    'id': 0,
    "is_android": 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    if (id) {
      this.get_book(id);
    }
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          is_android: res.platform == 'android'
        });
      }
    });
    if (options.source) {
      wx.setNavigationBarTitle({
        title: options.source
      });
    }
  },

  get_book: function (id) {
    wx.showLoading({
      title: '正在加载数据',
      mask: true
    });
    var that = this;
    wx.request({
      url: getApp().globalData.Config.apiHost + 'book/get_my_book',
      data: {
        id: id,
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 0) {
          // console.log(res.data.msg);
          that.setData(res.data.msg);
        }
      },
      fail: function (data) {
        wx.hideLoading();
        wx.showModal({
          title: '错误提示',
          content: '未能获取图书信息！',
          showCancel: false
        });
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
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  save: function (e) {

    var deposit = e.detail.value.deposit;
    var charge = e.detail.value.charge;
    var expire_charge = e.detail.value.expire_charge;
    var borrow_days = e.detail.value.borrow_days;

    e.detail.value.id = this.data.id;

    if (!/^\d+(\.\d+)*$/.test(deposit)) {
      wx.showModal({
        title: '操作提示',
        content: '押金格式不对！',
        showCancel: false
      });
      return;
    }
    if (deposit > this.data.price) {
      wx.showModal({
        title: '操作提示',
        content: '押金不得大于原书价格！',
        showCancel: false
      });
      return;
    }
    if (!/^\d+(\.\d+)*$/.test(charge)) {
      wx.showModal({
        title: '操作提示',
        content: '借阅价格格式不对！',
        showCancel: false
      });
      return;
    }
    if (charge > this.data.price * 0.1) {
      wx.showModal({
        title: '操作提示',
        content: '借阅价格不得大于原书价格的10%！',
        showCancel: false
      });
      return;
    }
    if (!/^\d+(\.\d+)*$/.test(expire_charge)) {
      wx.showModal({
        title: '操作提示',
        content: '逾期金额格式不对！',
        showCancel: false
      });
      return;
    }
    if (!/^\d+$/.test(borrow_days)) {
      wx.showModal({
        title: '操作提示',
        content: '借阅天数格式错误！',
        showCancel: false
      });
      return;
    }
    wx.showLoading({
      title: '正在发布',
      mask: true
    });

    //发布数据
    wx.request({
      url: getApp().globalData.Config.apiHost + 'book/publish?token=' + wx.getStorageSync('token'),
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
            confirmText: '返回',
            showCancel: false,
            success: function (res2) {
              wx.navigateBack({
                delta: 1
              });
            }
          });
        }
      },
      fail: function (data) {
        wx.hideLoading();
        wx.showModal({
          title: '错误提示',
          content: '未能发布图书, 请重试！',
          showCancel: false
        });
      }
    })

  }
})