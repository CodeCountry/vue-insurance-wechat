/**
 * Created on 11:01 2018/05/09.
 * file name date
 * by sh01114
 */
// 日期
function getDate(){
  var year = [];
  for(var z = new Date().getFullYear(); z<new Date().getFullYear()+3; z++){
    var date_year = z;  //获取年(四位)
    var year1 = {};
    year1.id = z;
    year1.value = z + '年';
    var month = [];
    for(var i = 1; i<13; i++){
      var month1 ={};
      if(i<10){
        month1.id = "0"+i;
        month1.value ="0" +i+'月';
      }else{
        month1.id = i;
        month1.value = i+'月';
      }
      var day_num  = new Date(date_year,month1.id).toJSON().substring(8,10);
      var day = [];
      for(var j = 1;j<=day_num;j++){
        var day1 = {};
        if(j<10){
          day1.id ="0" +j;
          day1.value ="0" +j+'日';
        }else{
          day1.id = j ;
          day1.value = j+'日';
        }
        day.push(day1);
      }
      month1.childs = day;
      month.push(month1);
    }
    year1.childs = month;
    year.push(year1);
  }
  let date_option = year;
  return date_option;
}
export {getDate};

// var now_month = new Date().getMonth();
// var now_date = new Date().getDate();
//
// var date_option = year;
// 日期
// new MobileSelect({
//   trigger: '#J_date',
//   title: '日期',
//   wheels: [
//     {data: date_option}
//   ],
//   position:[0,now_month,now_date-1], //初始化定位 打开时默认选中的哪个 如果不填默认为0
//   transitionEnd:function(indexArr, data){
//     console.log(data);
//     clearInput(this);
//   },
//   callback:function(indexArr, data){
//     console.log(data);
//     if($('#J_date').hasClass('red')){
//       $('#J_date').val('').removeClass('red');
//     }
//     $('#J_date').val(data[0].value+data[1].value+data[2].value);
//     var value = $('#J_date').val();
//     value = value.slice(0,4) +'-'+ value.slice(5,7) +'-'+ value.slice(8,10);
//     $('#J_date').attr("data-id",value);
//   }
// });
