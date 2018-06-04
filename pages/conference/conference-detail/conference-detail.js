// pages/conference/conference-detail/conference-detail.js
Page({

  data: {
    detailShow: true,
    signShow: false,
    scoreShow: false,
    lotteryShow: false,
    signIconShow: true,
    stars: [0, 0, 0, 0, 0]
  },

  onbmTap: function(event) {
    wx.navigateTo({
      url: 'https://meeting.maphical.cn/Meeting-Interactive-System/danmu.html',
    })
  },

  onLoad: function (options) {
    var socketOpen = false
    var socketMsgQueue = [
      {
        "operation": "loginToken",
        "parameter": {
          "token": wx.getStorageSync("token"),
          "username": wx.getStorageSync("userName"),
        }
      },
      {
        "operation": "getFriendsInfo",
        "userId": wx.getStorageSync("userid"),
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
        wx.sendSocketMessage({
          data: msg
        })
        console.log("发送的消息是：" + msg)
      } else {
        socketMsgQueue.push(msg)
      }
    }

    wx.onSocketMessage(function (res) {
      console.log('收到服务器内容：' + res.data)
      var d = JSON.parse(res.data)
      var friendsData = JSON.parse(base64_decode(d.friendsData))
      // var base = new Base64()
      // var friendsData = base.decode(d.friendsData)
      if (d.result == "success") {
        if (d.userId != undefined) {
          wx.setStorageSync('userid', d.userId)
          wx.setStorageSync('token', d.token)
        }
        wx.setStorageSync('friendsData', friendsData)
      }
    })
    // wx.closeSocket()
    // var friendsData = wx.getStorageSync('friendsData')
    // this.setData({
    //   friendsData: friendsData
    // })
  },

  onDetail: function (event) {
    this.setData({
      detailShow: true,
      signShow: false,
      scoreShow: false,
      lotteryShow: false,
    })
  },

  onSign: function(event) {
    this.setData({
      detailShow: false,
      signShow: true,
      scoreShow: false,
      lotteryShow: false,
    })
  },

  onScore: function (event) {
    this.setData({
      detailShow: false,
      signShow: false,
      scoreShow: true,
      lotteryShow: false,
    })
  },

  onLottery: function (event) {
    this.setData({
      detailShow: false,
      signShow: false,
      scoreShow: false,
      lotteryShow: true,
    })
  },

  onSignTap: function(event) {
    this.setData({
      signIconShow: !this.data.signShow
    })
    console.log(this.data.signShow)
  },

  onStarsTap: function(event) {
    var index = event.currentTarget.dataset.id
    var array = []
    for(var i = 0; i < 5; i++) {
      if(i <= index) {
        array.push(1)
      }
      else if (i >= index){
        array.push(0)
      }
    }
    this.setData({
      stars: array,
    })
  }
})