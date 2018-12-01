const reqUrl = require('../../utils/reqUrl');

//index.js
Page({
  data: {
    hasUserInfo: true,

    //用户积分
    integral:0,

    // banner广告
    bannerMsg:null,

    //roll滚动数据
    rollMsg:[],

    //card广告
    cardMsg: [],
    //卡片页数
    cardPage:1,
    //card广告请求状态,初始为true,没有数据为false
    cardStatus:true,
    //做任务的card的index
    cardIndex: '',

    //任务adMsg,决定是否请求任务完成接口
    adMsg:'',

    //任务完成弹窗和奖励
    modal: false,
    // modal:true,
    modalData: '',

  },

  /**
   * 事件处理函数
   */

  //用户授权事件
  getUserInfo: function (e) {

    wx.showLoading({
      title: '授权登录中...',
      mask: true
    })

    if (e.detail.userInfo){
      wx.request({
        url: reqUrl + 'mesetinfo',
        data: {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        },
        header: {
          token: wx.getStorageSync('token')
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: res => {
          if (res.statusCode == 200) {
            this.setData({
              hasUserInfo: false
            })
            
            wx.hideLoading();
          }
        },
        fail: function (res) {},
        complete: function (res) {},
      })
    }else{
      wx.showToast({
        title: '授权失败！',
        icon: 'none',
        duration: 1000
      })
    }   
  },


  //上报card信息
  adClick(e) {
    wx.showLoading({
      title: '加载中...',
      mask:true
    })

    wx.request({
      url: reqUrl + 'meclick',
      data: {
        id: e.currentTarget.dataset.id
      },
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: res => { 

        wx.hideLoading();
        if(res.statusCode == 200){

          this.setData({
            adMsg: res.data.msg,
            cardIndex: e.currentTarget.dataset.index
          })

          wx.setStorageSync('adMsg', res.data.msg);

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

  //关闭弹框
  close() {
    this.setData({
      modal: false
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

     
    wx.showLoading({
      title:'加载中...',
      mask:true
    })

    //判断用户是否授权，决定是否显示授权页面
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          this.setData({
            hasUserInfo: false
          })
        }
      }
    })

    //异步登录执行完的 resolve 
    getApp().login().then( res => {
      if(res.statusCode == 200){

        //获取用户积分
        wx.request({
          url: reqUrl + 'meintegral',
          header: {
            token: wx.getStorageSync('token')
          },
          method: 'GET',
          dataType: 'json',
          responseType: 'text',
          success: res => {
            if (res.statusCode === 200) {

              //本地缓存存用户积分
              wx.setStorageSync('integral', res.data.msg.integral)

              this.setData({
                integral: res.data.msg.integral
              })

              // wx.hideLoading();
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


        //获取banner广告
        wx.request({
          url: reqUrl + 'banner',
          header: {
            token: wx.getStorageSync('token')
          },
          method: 'GET',
          dataType: 'json',
          responseType: 'text',
          success: res => {
            if (res.statusCode == 200) {
              this.setData({
                bannerMsg: res.data.msg
              })

              // wx.hideLoading();
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


        //roll请求
        wx.request({
          url: reqUrl + 'roll',
          header: {
            token: wx.getStorageSync('token')
          },
          method: 'GET',
          dataType: 'json',
          responseType: 'text',
          success: res => {
            if (res.statusCode == 200) {
              this.setData({
                rollMsg: res.data.msg
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

        //获取卡片广告
        wx.request({
          url: reqUrl + 'card',
          header: {
            token: wx.getStorageSync('token')
          },
          method: 'GET',
          dataType: 'json',
          responseType: 'text',
          success: res => {

            if (res.statusCode == 200) {

              //根据请求结果，set数据cardMsg
              this.setData({
                cardMsg: res.data.msg
              })
           
              wx.hideLoading();
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

      }else{

        wx.showToast({
          title: res.data.msg,
          icon:'none',
          duration:1000
        })

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


    //是否领取任务
    if(this.data.adMsg){

      wx.showLoading({
        title: '加载中...',
        mask: true
      })

      //任务完成情况
      wx.request({
        url: reqUrl + 'done',
        data: {
          sign: this.data.adMsg
        },
        header: {
          token : wx.getStorageSync('token')
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: res => {
          
          if (res.statusCode == 200) {

            this.setData({
              modal: true,
              modalData: res.data.msg,
              integral: this.data.integral
            })          
            
            // 任务完成
            if (res.data.error_code == 0){

              //更改任务完成这条数据的状态
              this.data.cardMsg[this.data.cardIndex].status = 0;
              this.setData({
                cardMsg: this.data.cardMsg,
              })

              //计算积分
              this.data.integral = Number(this.data.integral) + Number(res.data.integral);
              //本地缓存存用户积分
              wx.setStorageSync('integral', this.data.integral);

            }

            //回到页面顶部
            wx.pageScrollTo({
              scrollTop: 0
            })

            wx.hideLoading();

          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1000
            })
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      })

      //更改任务请求状态
      this.setData({
        adMsg: false
      })
      
    }

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
