// pages/posts/post.js
// 此处只能用相对路径
var postsData = require('../../data/posts-data.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 小程序总是会读取data对象来做数据绑定，这个动作我们称之为动作A，而这个动作A的执行，是在onLoad事件执行后发生的。
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // this.data.posts_key = postsData.postList
    this.setData({
      posts_key: postsData.postList
    })

  },

  // 点击查看详情
  onPostTap: function (event) {
    console.log(event)
    var postId = event.currentTarget.dataset.postid;

    wx.navigateTo({
      // url: '../posts/post-detail/post-detail?id=' + postId
      url: 'post-detail/post-detail?id=' + postId

    })
  },


  // 轮播图点击事件
  onSwiperTap: function (event) {
    console.log(event)
    // target 和currentTarget
    // target指的是当前点击的组件 和currentTarget 指的是事件捕获的组件
    // target这里指的是image，而currentTarget指的是swiper
    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url: "post-detail/post-detail?id=" + postId
    })
  },


})