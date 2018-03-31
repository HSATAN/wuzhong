//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    step: 0,
    rankdata: [],
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  getRankData: function()
  {
    var that = this
    wx.request({
      url: 'https://www.myenger.cn/rankdata',
      data: {
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        that.setData({rankdata: res.data})
        console.log(that.rankdata)
      }
    })

  },
  getOpenId: function(){
    var that = this
    wx.request({
      url: 'https://www.myenger.cn/userinfo',
      data: {
        openid: app.globalData.openid

      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        that.setData({step: res.data.step})
        console.log(res.data)
      }
    })

  },

  clickMe: function(){
    this.setData({openid:app.globalData.openid})
    console.log(app.globalData.openid)
    
  },
  onShow: function() {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code;
        var that = this;
        wx.getWeRunData({
          success: function (res) {

            var data = res.encryptedData;
            var iv = res.iv;
            wx.getUserInfo({
              success: user => {
                var userInfo = user.userInfo //用户基本信息

                wx.request({
                  url: 'https://www.myenger.cn/rundata',
                  data: {
                    nickName: userInfo.nickName,
                    rundata: res.encryptedData,
                    code: code,
                    iv: res.iv
                  },
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  method: 'POST',
                  success: res => {
                    app.globalData.openid=res.data.openid
                    console.log(app.globalData.userInfo)
                    console.log(res.data)
                    that.clickMe()
                    that.getOpenId()
                    that.getRankData()

                  }
                })

              }
            })


          },
        })

      }
    })
    
  },
  onLoad: function () {
    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
