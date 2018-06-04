// pages/personal/personal.js
var app = getApp()

Page({

  data: {
  
  },

  onLoad: function (options) {
  
  },

  onMeeting: function(event) {
    wx.navigateTo({
      url: 'registerMeeting/registerMeeting',
    })
  },

  onLogout: function(event) {
    var SocketTask = app.globalData.SocketTask
    var socketOpen = false
    var socketMsgQueue =
    {
      "operation": "logout"
    }
    console.log(socketMsgQueue)
    var s = JSON.stringify(socketMsgQueue)
    SocketTask.send({
      data: s
    })
    SocketTask.onMessage(function (res) {
      console.log('收到服务器内容：' + res.data)
      var d = JSON.parse(res.data)
      if (d.result == "success") {
        console.log("操作成功")
        wx.redirectTo({
          url: '../welcome/welcome',
        })
      }
      if (d.result == "error") {
        console.log("注销失败")
      }
    })
  }
})