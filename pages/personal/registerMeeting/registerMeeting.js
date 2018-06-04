// pages/personal/registerMeeting/registerMeeting.js
var app = getApp()

Page({

  data: {
    meetingTitle: "",
    meetingTime: "",
    meetingAddress: "",
    meetingText: "",
  },

  onBindTitle: function (event) {
    var title = event.detail.value
    this.setData({
      meetingTitle: title
    })
  },

  onBindTime: function (event) {
    var time = event.detail.value
    this.setData({
      meetingTime: time
    })
  },

  onBindAddress: function (event) {
    var address = event.detail.value
    this.setData({
      meetingAddress: address
    })
  },

  onBindText: function (event) {
    var text = event.detail.value
    this.setData({
      meetingText: text
    })
  },

  onRegister: function (event) {
    var SocketTask = app.globalData.SocketTask
    var socketOpen = false
    var socketMsgQueue =
    {
      "operation": "mRegister",
      "parameter": {
        "m_title": this.data.meetingTitle,
        "b_time": this.data.meetingTime,
        "m_place": this.data.meetingAddress,
        "m_content": this.data.meetingText,
        "mCreator_id": wx.getStorageSync("userid"),
        "mLabel": "2018",
      }
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
      if (d.result == "mRegister success") {
        console.log("操作成功")
      }
    })
  },

  onLoad: function (options) {

  }
})