// pages/welcome/welcome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: 'Hello World',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  bindViewTap: function (event) {
    // 父级跳到子级界面
    // wx.navigateTo({
    //   url: '../posts/post',
    // });

    // 如果要跳转到一个带tab选项卡的页面，必须使用wx.switchTab方法。
    wx.switchTab({
      url: '../posts/post',
    })


    //关闭当前页面跳转
    // wx.redirectTo({
    //   url: '../posts/post'
    // });

    // wx.navigateTo({
    //   url: 'String',
    //   success: function(res){
    //     // success
    //   },
    //   fail: function() {
    //     // fail
    //   },
    //   complete: function() {
    //     // complete成功失败都执行
    //   }
    // });

  },


  onteztop: function () {
    console.log(" ssssonteztop")
  },

  onHide: function () {
    // 当页面隐藏
    console.log("onHide")
  },
  onUnload: function () {
    //当页面关闭
    console.log("onUnload")
  }

})