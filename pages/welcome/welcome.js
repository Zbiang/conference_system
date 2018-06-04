var app = getApp()

Page({

  data: {
    userName: "",
    passWord: "",
  },

  onTap: function () {
    // wx.navigateTo({
    //   url: '../posts/post',
    // })

    wx.switchTab({
      url: '../friends/friends',
    })
  },

  onRegrister: function(event) {
    wx.navigateTo({
      url: '../regrister/regrister',
    })
  },

  onBindName: function(event) {
    var name = event.detail.value
    this.setData({
      userName: name
    })
  },

  onBindPassword: function(event) {
    var password = event.detail.value
    this.setData({
      passWord: password
    })
  },

  onLoginTap: function(event) {
    // wx.switchTab({
    //   url: '../friends/friends',
    // })
    var socketOpen = false
    var socketMsgQueue = [
      {
        "operation": "loginPassword",
        "parameter": {
          "password": this.data.passWord,
          "username": this.data.userName,
        }
      }
    ]
    var SocketTask = wx.connectSocket({
      url: 'wss://meeting.maphical.cn/Meeting-Interactive-System/endpoint',
      header: {
        'content-type': 'application/json'
      },
      method: "POST",
      success:function(){
        console.log("success")
        
      },
      fail: function() {
        console.log("fail")
      },
    })

    app.globalData.SocketTask = SocketTask

    wx.setStorageSync("SocketTask", SocketTask)

    SocketTask.onOpen(function (res) {
      console.log("连接成功")
      socketOpen = true
      for (var i = 0; i < socketMsgQueue.length; i++) {
        var s = JSON.stringify(socketMsgQueue[i])
        sendSocketMessage(s)
      }
      socketMsgQueue = []
    })

    function sendSocketMessage(msg) {
      console.log("发送消息")
      if (socketOpen) {
        SocketTask.send({
          data: msg
        })
        console.log("发送的消息是：" + msg)
      } else {
        socketMsgQueue.push(msg)
      }
    }
    var userName = this.data.userName
    SocketTask.onMessage(function (res) {
      console.log('收到服务器内容：' + res.data)
      var d = JSON.parse(res.data)
      // var base = new Base64()
      // var friendsData = base.decode(d.friendsData)
      if(d.result == "success") {
        if(d.userId != undefined) {
          wx.setStorageSync('userid', d.userId)
          wx.setStorageSync('token', d.token)
          wx.setStorageSync('userName', userName)
        }
        // wx.setStorageSync('friendsData', friendsData)
        // wx.setStorageSync('username', that.daata.userName)
        wx.switchTab({
          url: '../friends/friends',
        })
      }
      else {
        if(d.error == "passwordError") {
          wx.showToast({
            title: '密码错误',
            icon: 'loading',
            duration: 1000
          })
        }
        if(d.error == "ss") {
          wx.showToast({
            title: '没有该用户',
            icon: 'loading',
            duration: 1000
          })
        }
      }
      // wx.closeSocket()
    })



    wx.onSocketClose(function (res) {
      console.log('WebSocket 已关闭！')
    })
  },
  
  onLoad: function(event){
    // var socketOpen = false
    // var socketMsgQueue = [
    //   {
    //     "operation": "loginToken",
    //     "parameter": {
    //       "token": wx.getStorageSync('key'),
    //       "username": wx.getStorageSync('username'),
    //     }
    //   }
    // ]
    // wx.connectSocket({
    //   url: 'wss://meeting.maphical.cn/Meeting-Interactive-System/endpoint',
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   method: "POST",
    //   success:function(){
    //     console.log("success")
    //   },
    //   fail: function() {
    //     console.log("fail")
    //   }
    // })

    // wx.onSocketOpen(function (res) {
    //   socketOpen = true
    //   for (var i = 0; i < socketMsgQueue.length; i++) {
    //     var s = JSON.stringify(socketMsgQueue[i])
    //     sendSocketMessage(s)
    //   }
    //   socketMsgQueue = []
    // })

    // function sendSocketMessage(msg) {
    //   if (socketOpen) {
    //     wx.sendSocketMessage({
    //       data: msg
    //     })
    //   } else {
    //     socketMsgQueue.push(msg)
    //   }
    // }

    // wx.onSocketMessage(function (res) {
    //   console.log('收到服务器内容：' + res.data)
    //   var d = JSON.parse(res.data)
    //   var that = this
    //   if(d.result == "success") {
    //     wx.setStorageSync('userid', d.userId)
    //     wx.setStorageSync('token', d.token)
    //     wx.setStorageSync('username', that.data.userName)
    //     wx.switchTab({
    //       url: '../friends/friends',
    //     })
    //   }
    //   else {
    //     if(d.error == "passwordError") {
    //       wx.showToast({
    //         title: '密码错误',
    //         icon: 'loading',
    //         duration: 1000
    //       })
    //     }
    //     else {
    //       wx.showToast({
    //         title: '没有该用户',
    //         icon: 'loading',
    //         duration: 1000
    //       })
    //     }
    //   }
    // })
  }

})