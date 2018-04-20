// pages/movies/movies.js
var util = require("../../utils/util.js")
var app = getApp();

Page({

  // RESTFul API JSON
  // SOAP XML
  //粒度 不是 力度

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},

    containerShow: true,   //内容初始是显示
    searchPanelShow: false,//搜索内容初始是隐藏
    searchResult: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // http://t.yushu.im/v2/movie/top250
  // https://api.douban.com/v2/movie/top250
  onLoad: function (options) {
    var inTheatersUrl = app.globalData.doubanBase +
      "/v2/movie/in_theaters" + "?start=0&count=3";//正在热映
    var comingSoonUrl = app.globalData.doubanBase +
      "/v2/movie/coming_soon" + "?start=0&count=3";//即将上映
    var top250Url = app.globalData.doubanBase +
      "/v2/movie/top250" + "?start=0&count=3";//top250

    // 同时加载三个数据
    // 此处是通过写的形式进行传递分类，其实在返回的数据（豆瓣）里已经存在title
    // 第二参数必须与上面data中预存的字段相同
    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieListData(top250Url, "top250", "豆瓣Top250");
  },

  //1. 获取网络信息---有一些不规则数据null需要处理
  getMovieListData: function (url, settedKey, categoryTitle) {
    var that = this

    // 标题栏有加载loading
    wx.showNavigationBarLoading();

    wx.request({
      url: url,
      // data: {},
      method: "GET",
      header: {
        'Content-Type': 'application/json' // 默认值
      },
      success: function (res) {
        // console.log(res)
        that.processDoubanData(res.data, settedKey, categoryTitle)

      },
      fail: function (error) {
        console.log("movies：", error);
        wx.hideNavigationBarLoading();
      }
    })

  },

  //2. 豆瓣返回的不规则数据处理
  processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
    var movies = [];

    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];

      // 电影标题
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }

      // 此处设置星星只设置整数，所以[1,1,1,1,1] [1,1,1,0,0]
      var temp = {
        title: title,
        average: subject.rating.average,
        stars: util.convertToStarsArray(subject.rating.stars),  //星星等级
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }

    // 设置key值是变化的json串
    var readyData = {};

    // <!--此处三个都要传递数据给下一层，所以需要有相同字段，此处可以通过.movies或者展开也行-- >
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    };

    this.setData(readyData);

    // 隐藏标题loading
    wx.hideNavigationBarLoading()
  },

  // -------------------以下执行按钮 状况----------------

  //3. 更多按钮--此处在more-list-template中，但是方法需要早调用他的地方写
  onMoreTap: function (event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category,
    })
  },

  // 3.5 跳转到详情页
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'more-detail/more-detail?id=' + movieId,
    })
  },


  // 4.搜索框获取到焦点
  onBindFoucs: function (event) {
    console.log(event)
    this.setData({
      containerShow: false,   //内容隐藏
      searchPanelShow: true,//搜索内容显示
    })
  },

// 请更改为bindconfirm。
  //5. 搜索框 失去焦点--开始网络搜索
  onBindBlur: function (event) {
    console.log(event)
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;

    // 网络搜索
    // 第二参数必须与上面data中预存的字段相同
    this.getMovieListData(searchUrl, "searchResult", "");
  },


  // 6.搜索框的 清空按钮
  onCancelImgTap: function (event) {
    this.setData({
      containerShow: true,   //内容是显示
      searchPanelShow: false,//搜索内容是隐藏
      searchResult: {}//数据清空
    })
  },


})