var app = getApp()

Page({
  data: {
    containerShow: true,
    searchPanelShow: false,
    xxImageShow: false,
    friendsData: {},
  },

  onLoad: function (options) {
    function base64_decode(input) { // 解码，配合decodeURIComponent使用
      var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      var output = "";
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
      while (i < input.length) {
        enc1 = base64EncodeChars.indexOf(input.charAt(i++));
        enc2 = base64EncodeChars.indexOf(input.charAt(i++));
        enc3 = base64EncodeChars.indexOf(input.charAt(i++));
        enc4 = base64EncodeChars.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 != 64) {
          output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
          output = output + String.fromCharCode(chr3);
        }
      }
      return utf8_decode(output);
    }
    function utf8_decode(utftext) { // utf-8解码
      var string = '';
      let i = 0;
      let c = 0;
      let c1 = 0;
      let c2 = 0;
      while (i < utftext.length) {
        c = utftext.charCodeAt(i);
        if (c < 128) {
          string += String.fromCharCode(c);
          i++;
        } else if ((c > 191) && (c < 224)) {
          c1 = utftext.charCodeAt(i + 1);
          string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
          i += 2;
        } else {
          c1 = utftext.charCodeAt(i + 1);
          c2 = utftext.charCodeAt(i + 2);
          string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
          i += 3;
        }
      }
      return string;
    }

    var SocketTask = app.globalData.SocketTask

    var socketOpen = false

    var socketMsgQueue = 
    {
      "operation": "getFriendsInfo",
      "userId": wx.getStorageSync("userid"),
    }

    var s = JSON.stringify(socketMsgQueue)

    SocketTask.send({
      data: s
    })

    SocketTask.onMessage(function (res) {
      console.log('收到服务器内容：' + res.data)
      var d = JSON.parse(res.data)
      var friendsData = JSON.parse(base64_decode(d.friendsData))
      if (d.result == "success") {
        wx.setStorageSync('friendsData', friendsData)
      }
    })

    // wx.closeSocket()

    var friendsData = wx.getStorageSync('friendsData')
    console.log(friendsData.friends[0].userId)
    this.setData({
      friendsData: friendsData
    })
  },

  onChat:function(event) {
    var friendId = event.currentTarget.dataset.friendid
    wx.navigateTo({
      url: 'friend-chat/friend-chat?friendId=' + friendId,
    })
  },

  onBindFocus:function(event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true,
      xxImageShow: true,
    })
  },

  onCancelImgTap:function(event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      xxImageShow: false,
    })
  },

  onDetail:function(evnet) {
    wx.navigateTo({
      url: 'friend-detail/friend-detail',
    })
  }
})