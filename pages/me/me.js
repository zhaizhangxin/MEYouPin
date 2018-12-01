const reqUrl = require("../../utils/reqUrl")

// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',
    data:'',

    //未体验评论对象、状态和页数
    experience:[],
    experienceStatus:true,
    experiencePage:1,

    //分享弹窗和奖励
    modal:false,
    modalData:'',
    error_code:'',

    //签到记录
    signInMsg:{
      signCont: [0,0,0,0,0,0,]
    }
  },

  /**
   * 事件处理函数
   */

  //未评论过请求函数，用户初始加载调用和下拉加载调用
  reqExperience: e => {

    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    //获取未评论过小程序
    wx.request({
      url: reqUrl + 'experience',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        page: e[0],
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: res => {

        wx.hideLoading();
        if (res.statusCode == 200) {

          //根据请求结果，set数据experience
          e[1].setData({
            experience: e[1].data.experience.concat(res.data.msg)
          })
          if (res.data.msg.length < 5) {
            e[1].setData({
              experienceStatus: false
            })
          }

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
  close(){
    this.setData({
      modal:false
    })
  },

  //签到天数
  subSignIn(e){

    // console.log(e.target.dataset.index, this.data.signInMsg.sign_num)
    if (e.target.dataset.index == this.data.signInMsg.sign_num){

      wx.showLoading({
        title: '加载中...',
        mask: true
      })

      //发送用户签到数据
      wx.request({
        url: reqUrl + 'sign',
        header: {
          token: wx.getStorageSync("token")
        },
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: res => {

          if (res.statusCode == 200) {
            wx.showToast({
              title: '获得' + res.data.msg + '钻石',
              icon: 'none',
              mask: true
            })
            
            //更新缓存积分
            var integral = Number(this.data.signInMsg.integral) + Number(res.data.msg)
            wx.setStorageSync('integral', integral)

            //更新签到天数
            this.data.signInMsg.status = 1;
            this.setData({
              signInMsg: this.data.signInMsg
            })

          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              mask: true
            })
          }

          wx.hideLoading();
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }else{
      wx.showToast({
        title: '请按顺序签到',
        icon:'none',
        mask:true
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  wx.showLoading({
    title: '加载中...',
    mask: true
  })

  //获取用户签到数据
  wx.request({
    url: reqUrl + 'signinfo',
    data: '',
    header: {
      token: wx.getStorageSync("token")
    },
    method: 'GET',
    dataType: 'json',
    responseType: 'text',
    success: res => {
  
      if (res.statusCode == 200) {
        this.setData({
          signInMsg: res.data.msg
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

  //初始调用评论广告，传入页数，当前this引用
  this.reqExperience([this.data.experiencePage++, this]);


  //带 shareTicket 的转发
  wx.showShareMenu({
    withShareTicket: true
  })
  
  //年月日
  this.data.data += new Date().getFullYear();
  this.data.data += ("/" + (new Date().getMonth() + 1) + "/");
  this.data.data += new Date().getDate();
  this.setData({
    data: this.data.data
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
    switch(new Date().getDay()){
      case 1:
        this.setData({
          day: '周一'
        })
        break;
      case 2:
        this.setData({
          day: '周二'
        })
        break;
      case 3:
        this.setData({
          day: '周三'
        })
        break;
      case 4:
        this.setData({
          day: '周四'
        })
        break;
      case 5:
        this.setData({
          day: '周五'
        })
        break;
      case 6:
        this.setData({
          day: '周六'
        })
        break;
      case 7:
        this.setData({
          day: '周日'
        })
        break;
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

    wx.stopPullDownRefresh()

    // if (this.data.experienceStatus) {
    //   this.reqCard([this.data.experiencePage++, this]);
    // } else {
    //   wx.showToast({
    //     title: '没有更多数据了！',
    //     icon: 'none',
    //     duration: 2000
    //   })
    // }

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
    //用户上拉触底请求
    if (this.data.experienceStatus) {
      this.reqExperience([this.data.experiencePage++, this]);
    } else {
      wx.showToast({
        title: '没有更多数据了！',
        icon: 'none',
        duration: 2000
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
    return {
      title:'【觅有品】优品推荐，还有好礼兑换！',
      path:'/pages/index/index',
      imageUrl:'../../img/share-img.jpg',
      success:res => {

        if (res.shareTickets === undefined) {

          wx.showToast({
            title: '分享到微信群才能领取奖励',
            icon: 'none',
            duration: 2000
          })

          return;
        }
        
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: res => {
            // console.log(res)

          wx.showLoading({
            title: '加载中...',
            mask:true
          })

            wx.request({
              url: reqUrl + 'meshare',
              data: {
                encryptedData: res.encryptedData,
                iv: res.iv
              },
              header: {
                token: wx.getStorageSync('token')
              },
              method: "POST",
              success: res => {
                if (res.statusCode){    
                  
                    wx.hideLoading();
                    
                    this.setData({
                      modal:true,
                      error_code: res.data.error_code,
                      modalData: res.data.msg
                    })

                  if (res.data.error_code == 0) {
                    //重新计算本地缓存用户积分
                    let integral = Number(wx.getStorageSync('integral')) + Number(res.data.msg);
                    wx.setStorageSync('integral', integral);
                  }
                  
                    
                }
              },
              fail: function (e) {}
            });
          }
        })
      },
      fail: function (res) {
        // 转发失败
        console.log('fail');
      }
    }
  },

    
    
  
})