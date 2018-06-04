// pages/friends/friend-chat/friend-chat.js
var app = getApp()

Page({

  data: {
    messageBody: "",
    friendId: "",
    reMessage: "",
  },

  onInputText: function(event) {
      var value = event.detail.value
      console.log(value)
      this.setData({
        messageBody: value
      })
  },

  onLoad: function (options) {
    var friendId = options.friendId
    this.setData({
      friendId: friendId
    })
  },

  onSendMessage: function(event) {
    function base64_encode(str) { // 编码，配合encodeURIComponent使用
      var c1, c2, c3;
      var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      var i = 0, len = str.length, strin = '';
      while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
          strin += base64EncodeChars.charAt(c1 >> 2);
          strin += base64EncodeChars.charAt((c1 & 0x3) << 4);
          strin += "==";
          break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
          strin += base64EncodeChars.charAt(c1 >> 2);
          strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
          strin += base64EncodeChars.charAt((c2 & 0xF) << 2);
          strin += "=";
          break;
        }
        c3 = str.charCodeAt(i++);
        strin += base64EncodeChars.charAt(c1 >> 2);
        strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        strin += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        strin += base64EncodeChars.charAt(c3 & 0x3F)
      }
      return strin
    }
    var SocketTask = app.globalData.SocketTask
    var socketOpen = false
    var message = base64_encode(this.data.messageBody)
    var socketMsgQueue =
    {
      "operation": "message",
      "parameter": {
        "targetUser": wx.getStorageSync("userid"),
        "sendTime": "2018",
      },
      "body": message
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
      if (d.result == "success") {
        console.log("操作成功")
      }
    })
  },

  // onBindBlur: function(event) {
  //   var text = event.detail.value
  //   this.data.sendMessage.push(text)
  // }
})