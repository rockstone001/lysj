// borrowed.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "title": "",
    "subtitle": "",
    "pic": "",
    "author": "",
    "summary": "",
    "publisher": "",
    "pubplace": "",
    "pubdate": "",
    "page": 0,
    "price": 0.00,
    "isbn": "",
    'msg': '',
    'borrow_state': 0,
    "borrow_days": 0,
    "is_android": 1,
    "winWidth": 0,
    "winHeight": 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.result) {
      var book = JSON.parse(options.result);
      this.setData(book);
    } else {
      //debug
      this.setData({
        "title": "书，是什么东东",
        "pic": "https://www.idaosh.com/php/swyj_api/images/20170804/1_1501804316_505.jpg",
        "author": " (法) 勒埃, 著绘",
        "publisher": "新蕾出版社",
        "pubplace": "2014-4",
        "page": "0",
        "isbn": "9787530759301",
        'msg': '没有此本图书',
        'borrow_state': 0,
        "borrow_days": 3,
        "rtn_msg": "返回重试",
      });
    }
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          is_android: res.platform == 'android',
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
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
  }
})