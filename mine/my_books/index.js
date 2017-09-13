// index.js
var util = require('/../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    books: [],
    pageNum: 10,
    "is_android": 1,
    "tips": [],
    currentId: 0,
    "winWidth": 0,
    "winHeight": 0,
    'tags': [
      '已发布', '未发布', '已借出', '已下架',
    ],
    'types': [
      1, 0, 2, -1
    ],
    'templates': [
      1, 2, 4, 3
    ],
    "currentTab": 0,
    "data_options": [],
    //"data_options": [{expire_time: 11212121, start_id: 1, end_id: 100, is_loading: 0, noMore: 0}],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var tips = [];
    for (var i = 0; i < that.data.tags.length; i++) {
      tips.push('正在加载');
    }
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          tips: tips,
          is_android: res.platform == 'android'
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
    var that = this;
    this.refresh_list();
    //当前标签不在已发布标签时， 切换到已发布时也需要刷新
    if (this.data.currentTab != 0) {
      var data_options = that.data.data_options;
      data_options[0] = {
        start_id: 0,
        end_id: 0,
        expire_time: 0,
        is_loading: 1,
        noMore: 0
      };
      that.setData({
        data_options: data_options
      });
    }
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

  /** 
   * 滑动切换tab 
   */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
    if (that.data.data_options.length <= e.detail.current
      || !that.data.data_options[e.detail.current]
      || !that.data.data_options[e.detail.current].expire_time
      || that.data.data_options[e.detail.current].expire_time < util.getTime()) {
      that.refresh_list();
    }
  },
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  refresh_list: function () {
    var id = 0;
    var that = this;
    var data_options = that.data.data_options;
    var currentTab = that.data.currentTab;
    data_options[currentTab] = {
      start_id: 0,
      end_id: 0,
      expire_time: 0,
      is_loading: 1,
      noMore: 0
    };

    that.setData({
      data_options: data_options
    });

    wx.request({
      url: getApp().globalData.Config.apiHost + 'user/get_my_books',
      data: {
        "id": id,
        "type": that.data.types[that.data.currentTab],
        "token": wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.code == 0) {
          //第一次获取数据之后
          var books = that.data.books;
          var currentTab = that.data.currentTab;
          var tips = that.data.tips;
          var data_options = that.data.data_options;
          books[currentTab] = res.data.msg;
          var start_id = 0;
          var end_id = 0;
          var expire_time = util.getTime() + 5 * 60; //五分钟内免刷新
          var noMore = 0;
          if (res.data.msg.length == 0) {
            tips[currentTab] = '暂无数据';
            noMore = 1;
          } else {
            start_id = res.data.msg[res.data.msg.length - 1].id;
            end_id = res.data.msg[0].id;
            if (res.data.msg.length < that.data.pageNum) {
              tips[currentTab] = '哥, 真没有了！';
            }
          }
          data_options[currentTab] = {
            start_id: start_id,
            end_id: end_id,
            expire_time: expire_time,
            is_loading: 0,
            noMore: noMore
          };
          that.setData({
            books: books,
            tips: tips,
            data_options: data_options
          });
        } else {
          wx.showModal({
            title: '错误提示',
            content: '未能获取我的图书, 请稍后重试！',
            showCancel: false
          });
        }
      },
      fail: function (data) {
        wx.showModal({
          title: '错误提示',
          content: '未能获取我的图书！',
          showCancel: false
        });
      }
    })
  },
  loadMore: function (e) {
    var that = this;
    var data_options = that.data.data_options;
    var currentTab = that.data.currentTab;
    var options = data_options[currentTab];
    if (!options.is_loading && !options.noMore) {
      //没有正在加载 且 不是没有更多了
      data_options[currentTab].is_loading = 1;
      that.setData({
        data_options: data_options
      });
      setTimeout(function () {
        that.get_more_books(options);
      }, 100);

    }
  },
  get_more_books: function (options) {
    var id = options.start_id;
    var that = this;
    wx.request({
      url: getApp().globalData.Config.apiHost + 'user/get_my_books',
      data: {
        id: id,
        "type": that.data.types[that.data.currentTab],
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.code == 0) {
          var books = that.data.books;
          var currentTab = that.data.currentTab;
          var tips = that.data.tips;
          var data_options = that.data.data_options;
          books[currentTab] = books[currentTab].concat(res.data.msg)

          var start_id = data_options[currentTab].start_id;
          var end_id = data_options[currentTab].end_id;
          var expire_time = util.getTime() + 5 * 60; //五分钟内免刷新
          var noMore = 0;
          if (res.data.msg.length == 0) {
            tips[currentTab] = '哥, 真没有了！';
            noMore = 1;
          } else {
            start_id = res.data.msg[res.data.msg.length - 1].id;
            if (res.data.msg.length < that.data.pageNum) {
              noMore = 1;
              tips[currentTab] = '哥, 真没有了！';
            }
          }
          data_options[currentTab] = {
            start_id: start_id,
            end_id: end_id,
            expire_time: expire_time,
            is_loading: 0,
            noMore: noMore
          };
          that.setData({
            books: books,
            tips: tips,
            data_options: data_options
          });
        }
      },
      fail: function (data) {
        wx.showModal({
          title: '错误提示',
          content: '未能获取更多图书信息！',
          showCancel: false
        });
      }
    });
  },
  edit: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'edit?id=' + id,
    });
  },
  setting: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'setting?id=' + id + '&source=' + e.currentTarget.dataset.source
    })
  },
  remove: function(e) {
    var id = e.currentTarget.dataset.id;
    var that = this;
    wx.showModal({
      title: '操作提示',
      content: '确定要下架此本图书吗？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在下架',
            mask: true
          });
          wx.request({
            url: getApp().globalData.Config.apiHost + 'book/remove?token=' + wx.getStorageSync('token'),
            method: "POST",
            header: {
              "Content-Type": 'application/x-www-form-urlencoded'
            },
            data: {
              id: id
            },
            success: function (res1) {
              wx.hideLoading();
              if (res1.data.code == 0) {
                // that.cancel();
                wx.showModal({
                  title: '操作提示',
                  content: '下架成功！',
                  showCancel: false,
                  success: function (res2) {
                    var currentTab = that.data.currentTab;
                    var books = that.data.books;
                    //删除已发布图书中的记录
                    for (var i = 0; i < books[currentTab].length; i++) {
                      if (books[currentTab][i].id == id) {
                        books[currentTab].splice(i, 1);
                        that.setData({
                          books: books
                        })
                        break;
                      }
                    }
                    //触发已下架的切换更新
                    var data_options = that.data.data_options;
                    data_options[3] = {
                      start_id: 0,
                      end_id: 0,
                      expire_time: 0,
                      is_loading: 1,
                      noMore: 0
                    };
                    that.setData({
                      data_options: data_options
                    });
                  }
                });
              } else {
                wx.showModal({
                  title: '错误提示',
                  content: res1.data.msg,
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
      }
    })
  },
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  }
})