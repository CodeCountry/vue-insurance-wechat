/**
 * Created on 14:42 2018/05/03.
 * file name base
 * by sh01114
 */
// 全局函数
exports.install = function (Vue) {
  // 时间
  function formatDate(time){
    return time<10 ? time='0'+time : time;
  }
  Vue.prototype.getDate = function(ns) {
    let d = new Date(ns);
    if(ns!==0 && ns!== null && ns!== ''){
      return [ d.getFullYear(), formatDate(d.getMonth() + 1), formatDate(d.getDate()) ].join('-')
        + ' ' + [ formatDate(d.getHours()), formatDate(d.getMinutes()), formatDate(d.getSeconds()) ].join(':');
    }else{
      return null;
    }
  }
  // 时间转时间戳
  Vue.prototype.getTimeStamp = function(year,month,day){
    let date = new Date(year,month-1,day);
    return date.getTime();
  }
  // 时间戳转时间（yyyy:mm:dd）
  Vue.prototype.getTimeDate = function (time){
    var date = new Date(time);
    var y = date.getFullYear();
    var m = date.getMonth()+1;
    var d = date.getDate();
    return y + '-' + m + '-' + d;
  }
  // 获取url中的参数
  Vue.prototype.getUrlKey = function(name){
    // return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
    var href=window.location.href;
    if(href && href.split("?").length>=2){
      var totalParam = href.split("?")[1];
      var params = totalParam.split("&");
      for(var i=0; i<params.length; i++){
        var param = params[i].split("=");
        if(param[0]===name){
          return param[1];
        }
      }
    }
    return '';
  }
  // 身份证号处理
  Vue.prototype.formatIdNum = function(idNum){
    // return idNum.replace(/(\d{4})\d{10}(\d{4})/, '$1** **** **** $2');
    var reg = /^(\d{4})(\d*)(.{4})$/;
    idNum = idNum.replace(reg, function(a, b, c, d) {
      return b + c.replace(/\d/g, "*") + d;
    });
    return idNum;
  }
  // 手机号处理
  Vue.prototype.formatPhone = function (phone){
    let a = phone.toString();
    let temp = [];
    temp[0] = a.slice(0,3);
    temp[1] = a.slice(3,7);
    temp[2] = a.slice(7);
    return temp.join(" ");
  }
  // 随机生成requestId
  //随机生成UUID
  Vue.prototype.guid = function() {
    function S4() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }
};
