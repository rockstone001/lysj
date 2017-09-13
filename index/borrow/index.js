// index.js
var util = require('/../../utils/util.js');
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
    "borrow_date": ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var data = JSON.parse(options.data);
    var borrow_date = [];
    var today = new Date();
    var nDays = new Date((util.getTime() + 86400 * data.borrow_days) * 1000);
    borrow_date.push(util.formatDate(today));
    borrow_date.push(util.formatDate(nDays));
    data.borrow_date = borrow_date.join('-');

    this.setData(data);
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示depositdepositdeposit
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

  //下单
  save: function() {
    if (this.data.state == 2) {
      return;
    }
    var id = this.data.id;
    wx.showLoading({
      title: '正在下单',
      mask: true
    });
    var that = this;
    wx.request({
      url: getApp().globalData.Config.apiHost + 'order/order?token=' + wx.getStorageSync('token'),
      method: "POST",
      header: {
        "Content-Type": 'application/x-www-form-urlencoded'
      },
      data: {
        id: id
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res);
        if (res.data.code == 0) {
          if (res.data.jsparams) {
            wx.requestPayment({
              timeStamp: res.data.jsparams.timeStamp,
              nonceStr: res.data.jsparams.nonceStr,
              package: res.data.jsparams.package,
              signType: res.data.jsparams.signType,
              paySign: res.data.jsparams.paySign,
              success: function (res) {
                wx.showModal({
                  title: '操作提示',
                  content: '借阅成功',
                  showCancel: false,
                  success: function(r) {
                    if (r.confirm) {
                      that.back();
                    }
                  }
                });
              },
              fail: function (res) {
                console.log(res);
              }
            })
          } else {
            wx.showModal({
              title: '操作提示',
              content: '借阅成功',
              showCancel: false,
              success: function (r) {
                if (r.confirm) {
                  that.back();
                }
              }
            });
          }
          
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
  }
  
})