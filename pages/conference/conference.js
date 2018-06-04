// pages/friends/friends.js
var app = getApp()

Page({
  data: {
    containerShow: true,
    searchPanelShow: false,
    xxImageShow: false,
  },

  onLoad: function (options) {
    var SocketTask = app.globalData.SocketTask
    var socketOpen = false
    var socketMsgQueue =
    {
      "operation": "getMeetingsInformation",
      "u_id": wx.getStorageSync("userid")
    }
    console.log(socketMsgQueue)
    var s = JSON.stringify(socketMsgQueue)
    SocketTask.send({
      data: s
    })
    SocketTask.onMessage(function (res) {
      console.log('收到服务器内容：' + res.data)
      var d = JSON.parse(res.data)
      // var friendsData = JSON.parse(base64_decode(d.friendsData))
      if (d.result == "getMeetingsInformation success") {
        console.log("操作成功")
      }
    })
  },

  // onDetail: function (event) {
  //   var groupsId = 0
  //   wx.navigateTo({
  //     url: 'groups-detail/groups-detail?groupsId=' + groupsId,
  //   })
  // },

  onBindFocus: function (event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true,
      xxImageShow: true,
    })
  },

  onCancelImgTap: function (event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      xxImageShow: false,
    })
  },

  onChat: function (evnet) {
    var groupsChatId = 0
    wx.navigateTo({
      url: 'conference-detail/conference-detail'
    })
  }
})