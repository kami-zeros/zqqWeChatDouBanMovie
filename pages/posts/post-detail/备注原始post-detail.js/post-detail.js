
// 引入外部js文件
var postsData = require('../../../data/posts-data.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // currentPostId: 0,
    collected: false,
    isPlayingMusic: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(postId)
    var postId = options.id;
    this.data.currentPostId = postId;
    // this.setData({
    //   currentPostId: postId
    // })

    var postData = postsData.postList[postId];
    // console.log(postData)
    // 如果在onLoad方法中，不是异步的去执行一个数据绑定，则不需要使用this.setData方法，只需要对this.data赋值即可（但是最新那版本好像不行了）
    // this.data.postData = postData;//好像不起作用
    this.setData({
      postData: postData
    })

    // -------------------缓存简介----------------------------
    // 没有服务器则收藏就设置缓存了，直接从缓存读取
    // 缓存上限最大不能超过10MB
    // wx.setStorageSync("key", "data风暴")
    // wx.setStorageSync("key", {
    //   game: "风暴",
    //   developer: "暴雪"
    // })


    // 缓存的形式模拟
    // var postsCollected = {
    //   1: "true",
    //   2: "false",
    //   3: "true",
    //   ...
    // }
    // 此处有bug（因为是缓存所以有）当第一次进入时，postsCollected[x]是不存在的，所以在collected赋值时会报undefined错误
    // 从缓存获取收藏状态(初始化收藏状态)
    var postsCollected = wx.getStorageSync("posts_collected");

    if (postsCollected) {
      var postCollected = postsCollected[postId] //由模拟形式决定
      this.setData({
        collected: postCollected
      })

    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync("posts_collected", postsCollected)
    }

    // 以下是音乐部分
    // 如果全局是真说明音乐正在播放 && 还要等于当前ID，则需要改变状态
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
      this.setData({
        isPlayingMusic: true
      })
    }
    this.setMusicMonitor()
  },

  // ------------------------以下是音乐功能---------------------------
  // 全局音乐监听的两个函数
  setMusicMonitor: function () {
    var that = this
    //点击播放图标和总控开关都会触发这个函数
    // 音乐播放
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      })

      // 改变全局的状态
      app.globalData.g_isPlayingMusic = true
      app.globalData.g_currentMusicPostId = this.data.currentPostId;
    });

    // 音乐暂停
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      })

      // 改变全局的状态
      app.globalData.g_isPlayingMusic = false
      app.globalData.g_currentMusicPostId = null; //暂停时清空
    });

    // 音乐播放停止
    wx.onBackgroundAudioStop(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      // app.globalData.g_currentMusicPostId = null;
    });
  },

  // 音乐播放点击按钮
  onMusicTap: function (event) {
    var isPlayingMusic = this.data.isPlayingMusic;
    var currentPostId = this.data.currentPostId;

    var postData = postsData.postList[currentPostId];//数据，如果在data中定义了仍然要用this.data.postData来拿数据

    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();

      // this.data.isPlayingMusic = false;//这样对布局没有用
      this.setData({
        isPlayingMusic: false
      })

      // 改变全局状态
      // app.globalData.g_currentMusicPostId = null;
      app.globalData.g_isPlayingMusic = false;

    } else {
      // 此处音乐与图片都需要是网络的资源
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg,
      })

      // this.data.isPlayingMusic = true;//这样对布局没有用
      this.setData({
        isPlayingMusic: true
      })

      // 改变全局状态
      app.globalData.g_currentMusicPostId = this.data.currentPostId;
      app.globalData.g_isPlayingMusic = true;
    }

  },

  // -----------------以下是收藏功能-------------------------

  // 点击 收藏/取消收藏 按钮
  onColletionTap: function (event) {
    this.getPostsCollectedSyc();//同步收藏存储
    // this.getPostsCollectedAsy();//异步收藏测试
  },

  // 同步收藏存储
  getPostsCollectedSyc: function () {
    var postsCollected = wx.getStorageSync("posts_collected");

    // 此处postId是在onLoad中获取的，所以需要在data中赋值转换
    var postCollected = postsCollected[this.data.currentPostId];

    //取反操作 收藏的变成未收藏
    postCollected = !postCollected;

    postsCollected[this.data.currentPostId] = postCollected;  //更新缓存

    // 吐司
    this.showToast(postsCollected, postCollected)
  },

  // 吐司
  showToast: function (postsCollected, postCollected) {
    //更新文章是否的缓存值
    wx.setStorageSync('posts_collected', postsCollected);

    //更新数据绑定变量，从而实现切换图片
    this.setData({
      collected: postCollected
    })

    wx.showToast({
      title: postCollected ? '收藏成功' : '取消成功',
      duration: 800,
      icon: "success"
    })
    // wx.removeStorageSync("key") //清除key值缓存
    // wx.clearStorageSync();//清除所有缓存
  },


  // --------------------------此没用---------------------

  // 分享按钮
  onShareTap: function (event) {
    var itemList = [
      "分享到微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ]

    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function (res) {
        //res.cancel 用户点击取消按钮---最新版的已经没有此属性了
        //res.tapIndex数组元素的序号，从零开始
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: '用户是否取消？' + res.cancel,
        })
      }
    })

  },

  // Dialog提示框
  showModal: function (postsCollected, postCollected) {
    var that = this;
    wx.showModal({
      title: '收藏',
      content: postCollected ? '收藏该文章？' : "取消收藏该文章？",
      showCancel: "true",
      cancelText: "取消",
      cancelColor: "#333",
      confirmText: "确定",
      confirmColor: "#405f80",
      success: function (res) {
        if (res.confirm) {
          wx.setStorageSync('posts_collected', postsCollected);

          //更新数据绑定变量，从而实现切换图片
          that.setData({
            collected: postCollected
          })
        }
      }
    })
  },

  // -----------------------------------以下是拓展--------------------------
  // 异步写法（存储）
  getPostsCollectedAsy: function () {
    var that = this;
    wx.getStorage({
      key: 'posts_collected',
      success: function (res) {
        var postsCollected = res.data;
        var postCollected = postsCollected[that.data.currentPostId];

        postCollected = !postCollected;
        postsCollected[that.data.currentPostId] = postCollected;  //更新缓存

        // 吐司
        that.showToast(postsCollected, postCollected)
      },
    })
  },

})