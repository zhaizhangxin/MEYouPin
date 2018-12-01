// pages/mall/mall.js
const reqUrl = require('../../utils/reqUrl.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    integral:null,

    adMsg:null,
    
    listMsg:null,

    page:1,
    pageStatus:true,

    i:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    
    //异步登录执行完的 resolve 
    getApp().login().then(res => {
      if (res.statusCode == 200) {    

        //获取运营位广告
        wx.request({
          url: reqUrl + 'me_ad',
          header: {
            token: wx.getStorageSync('token')
          },
          method: 'GET',
          success: res => {
            // console.log(res.data.msg)
            if (res.statusCode == 200) {
              this.setData({
                adMsg: res.data.msg
              })
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                mask: true
              })
            }

          }
        })

        //获取商品列表
        wx.request({
          url: reqUrl + 'me_product',
          header: {
            token: wx.getStorageSync('token')
          },
          method: 'GET',
          data: { page: 1, limit: 6 },// page:页数，limit:每页的数量
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
                mask: true
              })
            }

            wx.hideLoading()
          }
        })

      } else {

        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
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

    //带 shareTicket 的转发
    wx.showShareMenu({
      withShareTicket: true
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

    if (this.data.pageStatus && this.data.listMsg.length % 6 == 0){
      wx.request({
        url: reqUrl + 'me_product',
        header: {
          token: wx.getStorageSync('token')
        },
        method: 'GET',
        data: { page: ++this.data.page, limit: 6 },// page:页数，limit:每页的数量
        success: res => {
          console.log(this.data.listMsg);
          if (res.statusCode == 200) {
            this.setData({
              listMsg: this.data.listMsg.concat(res.data.msg)
            })

            if (res.data.msg.length < 6) {
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

    }else{
      wx.showToast({
        title: '没有更多了',
        icon:'none',
        mask:true
      })
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    var arr = ['豪礼火热领取中！名额有限，先到先得！','优品选的好，生活少烦恼！','给你个东西敢要吗？'];
    this.data.i++;
    if (this.data.i == 3) { this.data.i=0};

    return {
      title: arr[this.data.i],
      path: '/pages/mall/mall',
      imageUrl: options.target.dataset.img,
      success: res => {
      
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
              mask: true
            })

            wx.request({
              url: reqUrl + 'meshare',
              data: {
                encryptedData: res.encryptedData,
                iv: res.iv,
                id: options.target.dataset.id
              },
              header: {
                token: wx.getStorageSync('token')
              },
              method: "POST",
              success: res => {
                if (res.statusCode) {
                  
                  console.log(res)
                  wx.hideLoading();

                  // this.setData({
                  //   modal: true,
                  //   error_code: res.data.error_code,
                  //   modalData: res.data.msg
                  // })
              
                  if (res.data.error_code == 0) {

                    wx.showToast({
                      title:'获得' + res.data.msg +'钻石',
                      icon: 'success',
                      mask:true,
                      duration: 2000
                    })

                    //重新计算本地缓存用户积分
                    let integral = Number(wx.getStorageSync('integral')) + Number(res.data.msg);
                    wx.setStorageSync('integral', integral);
                  }else{
                    wx.showToast({
                      title: res.data.msg,
                      icon: 'none',
                      duration: 2000
                    })
                  }


                }
              },
              fail: function (e) { }
            });
          }
        })
      },
      fail: function (res) {
        // 转发失败
        console.log('fail');
      }
    }
  }
})