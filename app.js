//app.js
App({
  onLaunch: function () {
    var that = this;
    console.log('app launch');
    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
        console.log(wx.getStorageSync('token') + '=== token');
        if (!wx.getStorageSync('token')) {
          console.log('token is null');
          that.login();
        } else {
          console.log('token is not null');
        }
        // console.log(getApp().globalData.Config.apiHost);
      },
      fail: function () {
        //登录态过期
        console.log('session 过期');
        that.login();
      }
    });
    this.getUserInfo();
  },

  login: function () {
    console.log('login');
    var that = this;
    wx.login({
      success: function (r) {
        //登录成功
        if (r.code) {
          var code = r.code;
          //获取用户信息
          wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo);
              //发起网络请求用于后台登录 保存用户 获取token
              wx.request({
                url: getApp().globalData.Config.apiHost + 'user/login',
                method: "POST",
                header: {
                  "Content-Type": 'application/x-www-form-urlencoded'
                },
                data: {
                  code: code,
                  encryptedData: res.encryptedData,
                  iv: res.iv
                },
                success: function (res) {
                  console.log('登录返回');
                  console.log(res.data);
                  if (typeof res.data == 'string') {
                    console.log('is string');
                    res.data = JSON.parse(res.data);
                  }
                  console.log(res.data);
                  if (res.data.code == 0 || res.data.code == "0") {
                    console.log("设置token");
                    wx.setStorageSync('token', res.data.msg);
                  } else {
                    console.log(" not === 0");
                  }
                  console.log(res.data.code);
                  console.log(res.data.code == 0);
                },
                fail: function (data) {
                  console.log(data);
                }
              });
            }
          });
        }
      }
    });
  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      console.log('已经有用户信息');
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      console.log('调用接口获取用户信息');
      //调用登录接口
      wx.getUserInfo({
        withCredentials: true,
        success: function (res) {
          console.log(res.userInfo);
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  globalData: {
    userInfo: null,
    Config: {
      "apiHost": "https://www.idaosh.com/php/lysj_api/index.php/"
    },
    if_redirect_to_my_books: false  //是否跳转到我的图书
  }
})
