//引用小程序的工具类(不是ES6)--其实工具类也可以用ES6语法写，此处是用ES6语法写的类
var util = require("../../../../utils/util.js");

class Movie {
  //url 作为参数传进来
  constructor(url) {
    this.url = url;
  }

  // 方法ES6不用写function,此处方法接受一个回调函数
  getMovieData(callback) {
    this.callback = callback;
    // 此处绑定this是为了在processDoubanData方法中有相同的this指代（否则processDoubanData中的this指代的就是processDoubanData，没办法调用callback）
    util.http(this.url, this.processDoubanData.bind(this));
  }

  // 此处data是网络返回值
  processDoubanData(data) {
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

    // 此处是异步方法-return是没办法返回结果的，所以要用到上面的callback
    // return movie;
    this.callback(movie);//如果上面没有bind(this)则此处的this不是同一个
  }

}

// 把JS输出
export {
  Movie
}