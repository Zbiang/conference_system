// pages/friends/friends.js
Page({
  data: {
    containerShow: true,
    searchPanelShow: false,
    xxImageShow: false,
  },

  onLoad: function (options) {

  },

  onDetail: function (event) {
    var groupsId = 0
    wx.navigateTo({
      url: 'groups-detail/groups-detail?groupsId=' + groupsId,
    })
  },

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
      url: 'groups-chat/groups-chat?groupsChatId=' + groupsChatId,
    })
  }
})