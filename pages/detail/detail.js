// pages/detail/detail.js
const reqUrl = require('../../utils/reqUrl.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg:null,

    show:true,

    options:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    this.setData({
      options: options
    })

    //获取商品详情
    wx.request({
      url: reqUrl + 'me_detail',
      header: {
        token: wx.getStorageSync('token')
      },
      data:{id:options.id},
      method: 'GET',
      success: res => {
        // console.log(res.data.msg)
        if (res.statusCode == 200) {
          this.setData({
            msg: res.data.msg
          })

          if (this.data.msg.integral < wx.getStorageSync('integral')) {
            this.setData({
              show: false
            })
          }

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            mask: true
          })
        }

        wx.hideLoading();

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

    if (this.data.msg){

      if (this.data.msg.integral < wx.getStorageSync('integral')) {
        this.setData({
          show: false
        })
      }
      
    };
    
  
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