Page({
  data: {
    userName: "",
    passWord: "",
    email: "",
  },

  onBindUsername: function(event) {
    var userName = event.detail.value
    this.setData({
      userName: userName
    })
  },

  onBindPassword: function (event) {
    var passWord = event.detail.value
    this.setData({
      passWord: passWord
    })
  },

  onBindEmail: function (event) {
    var email = event.detail.value
    this.setData({
      email: email
    })
  },

  onRegister: function(event) {
    var socketOpen = false
    var socketMsgQueue = [
      {
        "operation": "register",
        "parameter": {
          "password": this.data.passWord,
          "username": this.data.userName,
          "email": this.data.email,
        }
      }
    ]
    wx.connectSocket({
      url: 'wss://meeting.maphical.cn/Meeting-Interactive-System/endpoint',
      header: {
        'content-type': 'application/json'
      },
      method: "POST",
      success: function () {
        console.log("success")
      },
      fail: function () {
        console.log("fail")
      }
    })

    wx.onSocketOpen(function (res) {
      socketOpen = true
      for (var i = 0; i < socketMsgQueue.length; i++) {
        var s = JSON.stringify(socketMsgQueue[i])
        sendSocketMessage(s)
      }
      socketMsgQueue = []
    })

    function sendSocketMessage(msg) {
      if (socketOpen) {
        wx.sendSocketMessage({
          data: msg
        })
      } else {
        socketMsgQueue.push(msg)
      }
    }

    wx.onSocketMessage(function (res) {
      console.log('收到服务器内容：' + res.data)
      var d = res.data
      // var that = this
      if (d.result == "success") {
        wx.setStorageSync('userid', d.userId)
        wx.setStorageSync('token', d.token)
        // wx.setStorageSync('username', that.data.userName)
        // wx.showToast({
        //   title: '注册成功',
        //   icon: 'loading',
        //   duration: 1000
        // })
        wx.navigateTo({
          url: '../welcome/welcome',
        })
      }
      else {
        wx.showToast({
          title: '用户名重复',
          icon: 'loading',
          duration: 1000
        })
      }
      wx.closeSocket()
    })

    wx.onSocketClose(function (res) {
      console.log('WebSocket 已关闭！')
    })
  },
  //userid,token进缓存

  onLoad: function(event) {

  }
})