// pages/movies/more-movie/more-movie.js
var app = getApp();
var util = require("../../../utils/util.js");

Page({

  data: {
    movies: {},
    navigateTitle: "",
    requestUrl: "",
    totalCount: 0, //相当于页码
    isEmpty: true, //当前movies的数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var category = options.category;
    // console.log(category)
    this.data.navigateTitle = category;

    var dataUrl = "";
    // 分别加载三个---此处没有page字段，没法上拉加载
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "豆瓣Top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }

    // 动态设置标题
    wx.setNavigationBarTitle({
      title: category,
    })

    this.data.requestUrl = dataUrl;   //用于上拉加载时用到此URL
    // 访问网络
    util.http(dataUrl, this.processDoubanData);

  },

  onReady: function (event) {
    // wx.setNavigationBarTitle({
    //   title: this.data.navigateTitle,
    // })
  },

  //1. 网络访问---回调函数
  processDoubanData: function (moviesDouban) {
    var movies = [];

    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;

      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }

      // [1,1,1,1,1] [1,1,1,0,0]
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }

      movies.push(temp)
    }

    var totalMovies = {}

    //如果要绑定新加载的数据，那么需要同旧有的数据合并在一起（上拉加载）
    // 不是第一次加载，即isEmpty不为空所以需要合并
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    }
    // 是第一次加载
    else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }

    // 数据绑定
    this.setData({
      movies: totalMovies
    })

    this.data.totalCount += 20;//上拉加载页码

    // 隐藏导航条加载动画。
    wx.hideNavigationBarLoading();

    // 取消下拉刷新
    wx.stopPullDownRefresh();
  },


  //2. 跳转到详情页
  onMovieTap: function (event) {
    console.log(event)
    var movieId = event.currentTarget.dataset.movieid;
    
    wx.navigateTo({
      url: '../more-detail/more-detail?id=' + movieId,
    })
  },


  //3. 上拉加载
  // onScrollLower: function (event) {
  //   // 此处totalCount需要每次累加（上面的网络访问每次都会执行，所以在processDoubanData中进行累加）
  //   var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";

  //   // 访问网络
  //   util.http(nextUrl, this.processDoubanData);
  //   // 标题栏有加载loading
  //   wx.showNavigationBarLoading();
  // },

  //3. 触底加载更多
  onReachBottom: function () {
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";

    util.http(nextUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },



  //4. 下拉刷新
  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl + "?start=0&count=20";

    // 参数重置
    this.data.movies = {};
    this.data.isEmpty = true;
    this.data.totalCount = 0;

    // 访问网络
    util.http(refreshUrl, this.processDoubanData)
    // 标题栏有加载loading
    wx.showNavigationBarLoading();
  }


})