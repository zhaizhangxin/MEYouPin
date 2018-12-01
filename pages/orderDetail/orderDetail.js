// pages/orderStatus/orderStatus.js
const reqUrl = require('../../utils/reqUrl.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listMsg:'',
    integral:null,
    page: 1,
    pageStatus:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    //获取商品列表
    wx.request({
      url: reqUrl + 'me_recode',
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      data: { page: 1, rows: 6 },// page:页数，rows:每页的数量
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
    //从缓冲中更新积分
    this.setData({
      integral: wx.getStorageSync('integral')
    })
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
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    if (this.data.pageStatus && this.data.listMsg.length % 6 == 0) {
      wx.request({
        url: reqUrl + 'me_product',
        header: {
          token: wx.getStorageSync('token')
        },
        method: 'GET',
        data: { page: ++this.data.page, rows: 6 },// page:页数，rows:每页的数量
        success: res => {
          // console.log(this.data.listMsg);
          if (res.statusCode == 200) {

            this.setData({
              listMsg: this.data.listMsg.concat(res.data.msg)
            })

            if (res.data.msg.length < 6){
              wx.showToast({
                title: '没有更多了',
                icon: 'none',
                mask: true
              })

              this.setData({
                pageStatus: false
              })
            }
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: none,
              mask: true
            })
          }

          wx.hideLoading()
        }
      })

    } else {
      wx.showToast({
        title: '没有更多了',
        icon: 'none',
        mask: true
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})