// pages/integralDetail/integralDetail.js
const reqUrl = require('../../utils/reqUrl.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listMsg:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    //获取积分明细
    wx.request({
      url: reqUrl + 'me_int_detail',
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      success: res => {
        // console.log(res);
        if (res.statusCode == 200) {
          this.setData({
            listMsg: res.data.msg
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            mask: true,
          })
        }

        wx.hideLoading()
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})