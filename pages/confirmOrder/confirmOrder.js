// pages/confirmOrder/confirmOrder.js
const reqUrl = require('../../utils/reqUrl');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    options:null,
    // address:null,
    orderMsg:null,
  },

  /**
   * 事件处理函数
   */

  //获取地址信息
  chooseAddress(e){

    wx.chooseAddress({
      success: res => {
        this.setData({
          'orderMsg.address':res
        })
      }
    })
  },

  //用户输入信息
  getMessage(e){
    console.log(e.detail.value)
  },

  //提交订单
  subOrder(e){

    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    if (this.data.orderMsg.address.telNumber == null || this.data.orderMsg.address.telNumber == ''){
      wx.showToast({
        title: '请完善地址信息',
        icon:'none',
        duration:1000
      })
      return ;
    }

    this.setData({
      'orderMsg.address.id': this.data.options.id,
    })

    
    wx.request({
      url: reqUrl + 'me_submit',
      header: {
        token: wx.getStorageSync('token')
      },
      data: this.data.orderMsg.address,
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: res => {

        wx.hideLoading();
        if (res.statusCode == 200) {         

          wx.showToast({
            title: '订单提交成功',
            icon: 'success',
            duration: 500
          })

          //重新计算本地缓存用户积分
          let integral = Number(wx.getStorageSync('integral')) - Number(this.data.orderMsg.integral);
          wx.setStorageSync('integral', integral);

          setTimeout(function (){
            wx.redirectTo({
              url: '../orderDetail/orderDetail',
              // success: function (e) {
              //   var page = getCurrentPages().pop();
              //   if (page == undefined || page == null) return;
              //   page.onLoad();
              // }
            })
          },500)
          

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            mask: true
          })

        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })

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

    //获取订单详情
    wx.request({
      url: reqUrl + 'me_order',
      header: {
        token: wx.getStorageSync('token')
      },
      data:{
        id: options.id,
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: res => {

        wx.hideLoading();
        if (res.statusCode == 200) {
          this.setData({
            orderMsg: res.data.msg
          })

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            mask: true
          })

        }
      },
      fail: function (res) { },
      complete: function (res) { },
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
    return {
      title: wx.getStorageSync('nickName') + '正在参与抽奖，拜托你为他助力',
      path: '',
      imageUrl: '../../image/banner.jpg',
    }
  }
})