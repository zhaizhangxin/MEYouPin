const reqUrl = require('../../utils/reqUrl');

// pages/recommend/recommend.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //点赞数据
    recommendMsg: [
      { id: 11, describe: "好棒,感觉还不错", num: 0 }, 
      { id: 16, describe: "你有我,我有小程序", num: 0 }, 
      { id: 26, describe: "Like", num: 0 }
    ],

    //赞状态
    imgStatus: [false, false, false, false, false, false, false, false],

    //广告id和赞id
    ad_id:'',
    praise_id:[],

    //任务完成弹窗和奖励
    modal: false,
    modalData: '',
  },


  /**
   * 事件处理函数
   */

  //点赞数据
  getPraise(res){
    
    if (!this.data.imgStatus[res.currentTarget.dataset.index]){

      //当前点赞id
      var id = res.currentTarget.dataset.id;
      //当前点赞index
      var index = res.currentTarget.dataset.index;

      this.data.praise_id.push({ id: id});
      this.data.imgStatus[index] = true;
      this.data.recommendMsg[index].num = ++this.data.recommendMsg[index].num;
      this.setData({
        praise_id: this.data.praise_id,
        imgStatus: this.data.imgStatus,
        recommendMsg: this.data.recommendMsg
      })
    }else{
      wx.showToast({
        title: '您已赞过该评论！',
        icon: 'none',
        duration: 2000
      })
    }

  },
  

  //发送点赞数据
  subPraise(res){

    if (this.data.praise_id != '' ){
      wx.showLoading({
        title: '加载中...',
        mask: true
      })

      wx.request({
        url: reqUrl + 'like',
        data: {
          likes: this.data.praise_id,
          ad_id: this.data.ad_id
        },
        header: {
          token: wx.getStorageSync('token')
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: res => {
          wx.hideLoading();
          if (res.statusCode == 200) {
            
            if(res.data.error_code == 0){
              //重新计算本地缓存用户积分
              let integral = Number(wx.getStorageSync('integral')) + Number(res.data.msg);
              wx.setStorageSync('integral', integral);
            }
            

            this.setData({
              modal: true,
              modalData: res.data.msg,
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
    }else{
      wx.showToast({
        title: '至少点赞一条，才能领取奖励',
        icon: 'none',
        duration: 1000
      })
    }

    
  },

  //关闭弹框
  close() {
    wx.redirectTo({
      url: '../me/me'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      ad_id:options.id
    })

    wx.showLoading({
      title:'加载中...',
      mask:true
    })

    wx.request({
      url: reqUrl + 'recommend',
      data: {
        id:options.id
      },
      header: {
        token:wx.getStorageSync('token')
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: res => {

        wx.hideLoading();
        if(res.statusCode == 200){
          this.setData({
            recommendMsg:res.data.msg
          })

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            mask: true
          })

        }
      },
      fail: function(res) {},
      complete: function(res) {},
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