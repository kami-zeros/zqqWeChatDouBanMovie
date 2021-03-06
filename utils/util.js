
// 1.时间转换
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


// 2.数字转换为 数组:如35-->[1,1,1,0,0]
function convertToStarsArray(stars) {
  var num = stars.toString().substring(0, 1);//截取数字的十位数 
  var array = [];

  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1);
    } else {
      array.push(0);
    }
  }
  // 返回如[1,1,1,0,0]数据
  return array;
}

// 3.相同的网络访问
function http(url, callBack) {
  wx.request({
    url: url,
    method: "GET",
    header: {
      "Content-Type": "json"
    },
    success: function (res) {
      callBack(res.data)
    },
    fail: function (error) {
      console.log(error)
      wx.showToast({
        title: error,
        icon: "none"
      })
    },
  });
}

// 4.字符串拼接-通过‘/’
function convertToCastString(casts) {
  var castsjoin = "";
  for (var idx in casts) {
    castsjoin = castsjoin + casts[idx].name + " / ";
  }
  return castsjoin.substring(0, castsjoin.length - 2);
}

// 5.重组json字符串
function convertToCastInfos(casts) {
  var castsArray = [];
  for (var idx in casts) {
    var cast = {
      img: casts[idx].avatars ? casts[idx].avatars.large : "",
      name: casts[idx].name
    }
    castsArray.push(cast);
  }
  return castsArray;
}

module.exports = {
  formatTime: formatTime,
  convertToStarsArray: convertToStarsArray,
  http: http,
  convertToCastString: convertToCastString,
  convertToCastInfos: convertToCastInfos
}
