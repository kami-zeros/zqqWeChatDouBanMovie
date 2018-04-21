// pages/movies/more-detail/more-detail.js
// var util = require("../../../utils/util.js");//已经在Movie.js中引入
import { Movie } from "class/Movie.js";
var app = getApp();

Page({

  data: {
    movie: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var movieId = options.id;
    console.log("detail:", movieId);

    var url = app.globalData.doubanBase + "/v2/movie/subject/" + movieId;

    var movie = new Movie(url);

    // var movieData = movie.getMovieData();//0.如果是同步则可以用此信息


    //1.传递一个回调函数(此处getMovieData方法中有异步方法所以用此回调函数)
    // var that = this
    // movie.getMovieData(function (movie) {
    //   // 当前this指代的是调用方的环境
    //   that.setData({
    //     movie: movie
    //   })
    // })

    //1.1 用箭头函数写（C#/Java/Python/lambda语法）
    movie.getMovieData((movie) => {
      // 箭头函数里面的this指代的环境就是当前定义函数的环境，而不是调用方的环境
      this.setData({
        movie: movie
      })
    })


    // util.http(url, this.processDoubanData);
  },


  // 查看图片
  viewMoviePostImg: function (e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src],// 需要预览的图片http链接列表
    })
  },

})



/**
 * util.http(url, this.processDoubanData);
 * 
 *   // 此处data是网络返回值
 *   processDoubanData: function (data) {
    if (!data) {
      return;
    }

    // 判空
    var director = {
      avatar: "",
      name: "",
      id: ""
    };

    // 因为data.directors[0]（二级属性数据）很可能为空
    if (data.directors[0] != null) {
      if (data.directors[0].avatars != null) {
        director.avatar = data.directors[0].avatars.large;
      }
      director.name = data.directors[0].name;
      // director.id = data.directors[0].id;
      director.id = data.id
    }

    var movie = {
      movieImg: data.images ? data.images.large : "",
      country: data.countries[0],
      title: data.title,   //中文名
      originalTitle: data.original_title,  //原名
      wishCount: data.wish_count,    //想看人数
      commentCount: data.comments_count,//短评数量
      year: data.year,  //年代
      generes: data.genres.join("、"),//影片类型，最多提供3个
      score: data.rating.average,
      summary: data.summary,//简介
      director: director,//上面的json对象

      // 以下用到工具类
      stars: util.convertToStarsArray(data.rating.stars),//数字转换为 数组:如35-->[1,1,1,0,0]评分
      casts: util.convertToCastString(data.casts),//拼接字符串通过‘/’
      castsInfo: util.convertToCastInfos(data.casts),//重组json--演员图+名
    }

    console.log("detail:", movie);

    this.setData({
      movie: movie
    })

  },
 */












