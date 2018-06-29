<template>
  <div class="container" v-show="isShow">
    <!-- 赠险接口显示 -->
    <div id="wrapper">
      <div class="head">
        <p class="insuranceState"><img :src="myUrl"/><span id="status" v-text = "status">--</span></p>
        <p class="insurePrice">价格（元\年）<span>0元</span></p>
      </div>
      <div class="orderDetail">
        <h3>订单详情</h3>
        <p style="padding-top: 6px;"><span class="leftLabel">姓名：</span><span v-text="insured.name"></span></p>
        <p><span class="leftLabel">身份证号：</span><span v-text="insured.idNumber"></span></p>
        <p class="sex_jp" v-if="commodity.brand ==='金彭'">
          <span class="leftLabel">性别：</span><span v-text="insured.gender"></span>
        </p>
        <p><span class="leftLabel">手机号：</span><span v-text="insured.mobile"></span></p>
        <p class="address_jp" v-if="idAddress!==null&&idAddress!==''"><span class="leftLabel">户籍地址：</span><span v-text="idAddress"></span></p>
        <p class="address_jp" v-if="livingAddress!==null&&livingAddress!==''&&livingAddress!=='0'"><span class="leftLabel">常住地址：</span><span v-text="livingAddress"></span></p>
        <p class="car_price" v-if="commodity.price"><span class="leftLabel">车辆价格：</span><span v-text="commodity.price"></span></p>
        <p><span class="leftLabel">品牌：</span><span v-text="commodity.brand"></span></p>
        <p><span class="leftLabel">品类：</span><span v-text="commodity.category"></span></p>
        <p v-if="commodity.model"><span class="leftLabel">车辆型号：</span><span v-text="commodity.model"></span></p>
        <div class="identificatioNumberContent">
          <!--<p v-if="commodity.brand ==='宗申'" class="car_number">-->
          <!--<span class="leftLabel" style="width: 110px;" >车架号/兑换码：</span>-->
          <!--<span v-if="commodity.codeKey" v-text="commodity.codeKey"></span>-->
          <!--<span v-else v-text="commodity.vin"></span>-->
          <!--</p>-->
          <p class="car_number" v-if="commodity.vin"><span class="leftLabel">车架号：</span><span v-text="commodity.vin"></span></p>
          <p class="car_number2" v-if="commodity.codeKey"><span class="leftLabel">兑换码：</span><span v-text="commodity.codeKey"></span></p>
        </div>
        <p v-if="!insurancePolicies.length == 0"><span class="leftLabel" style="width: 68px;">保单号：</span>
          <span class="leftLabel" style="width: 76%;">
               <span v-for="item in insurancePolicies" style="display: block;">
                  <span v-text="item.insPlyNo"></span>
                  <a class="blue" v-if="item.url !== null && item.url !== '' && item.url !== undefined && !/[\s*]/g.test(item.url)" :href="item.url">查看</a>
              </span>
          </span>
        <div class="clear"></div>
        </p>
      </div>
      <div class="serviceDetail">
        <h3>产品信息</h3>
        <p style="padding-top: 6px;"><span class="leftLabel">产品名称：</span><span v-text="product.name"></span></p>
        <p><span class="leftLabel">服务期限：</span><span v-if="startTime!==0&&endTime!==0" v-text="servicePeriod">--</span></p>
        <p class="service_time" style="padding-bottom: 6px;">
          <span class="leftLabel">保障生效：</span>
          <span v-if="commodity.brand ==='力帆'">激活申请成功2天后零时生效</span>
          <span v-else>购买成功次日凌晨</span>
        </p>
      </div>
      <div class="serviceDetail">
        <!--<h3>服务内容</h3>-->
        <!--<div class="service" v-if="product.name === '雅迪安乘宝' || product.name === '淮海安行保' || product.name === '金彭安乘保'">-->
          <!--<p><img src="/static/img/yes.png"/><span>在骑行中发生的意外</span></p>-->
          <!--<p><img src="/static/img/yes.png"/><span>骑行意外门急诊保障2000元</span></p>-->
          <!--&lt;!&ndash; 雅迪&&淮海显示 &ndash;&gt;-->
          <!--<p v-if="product.name === '雅迪安乘宝' || product.name === '淮海安行保' " style="padding-bottom: 6px">-->
            <!--<img src="/static/img/yes.png"/><span>骑行意外身故、残疾最高保障5万元</span>-->
          <!--</p>-->
          <!--&lt;!&ndash; 金彭显示 &ndash;&gt;-->
          <!--<p v-if="product.name === '金彭安乘保'" style="padding-bottom: 6px">-->
            <!--<img src="/static/img/yes.png"/><span>骑行意外身故、残疾最高保障10万元</span>-->
          <!--</p>-->
        <!--</div>-->
        <!--<div v-if="product.name === '宗申骑行保'">-->
          <!--<p><img src="/static/img/yes.png"/><span>在骑行中发生的意外</span></p>-->
          <!--<p>-->
            <!--<img src="/static/img/yes.png"/><span>意外残疾最高保障5万2千元</span>-->
          <!--</p>-->
          <!--<p style="padding-bottom: 6px">-->
            <!--<img src="/static/img/yes.png"/><span>意外身故最高保障5万2千元</span>-->
          <!--</p>-->
        <!--</div>-->
        <!--<div v-if="product.name === '宗申安乘保'">-->
          <!--<p><img src="/static/img/yes.png"/><span>在骑行中发生的意外</span></p>-->
          <!--<p>-->
            <!--<img src="/static/img/yes.png"/><span>骑行意外门急诊保障2000元</span>-->
          <!--</p>-->
          <!--<p style="padding-bottom: 6px">-->
            <!--<img src="/static/img/yes.png"/><span>骑行意外身故、残疾最高保障7万元</span>-->
          <!--</p>-->
        <!--</div>-->
        <!--&lt;!&ndash; 力帆显示 &ndash;&gt;-->
        <!--<div v-if="product.name === '力帆骑行保'">-->
          <!--<p><img src="/static/img/yes.png"/><span>在骑行中发生的意外</span></p>-->
          <!--<p>-->
            <!--<img src="/static/img/yes.png"/><span>意外残疾最高保障20万</span>-->
          <!--</p>-->
          <!--<p style="padding-bottom: 6px">-->
            <!--<img src="/static/img/yes.png"/><span>意外身故最高保障20万</span>-->
          <!--</p>-->
        <!--</div>-->
        <!--<div class="service" v-if="product.name === '新大洲安乘保'" style="padding-bottom: 6px">-->
          <!--<p><img src="/static/img/yes.png"/><span>在骑行中发生的意外</span></p>-->
          <!--<p><img src="/static/img/yes.png"/><span>骑行意外门急诊保障2000元</span></p>-->
          <!--<p><img src="/static/img/yes.png"/><span>骑行意外身故、残疾最高保障5万元</span></p>-->
        <!--</div>-->
        <!--&lt;!&ndash; 金彭四轮电动车或者金彭品类为空情况下显示 &ndash;&gt;-->
        <!--<div class="service" v-if="insurerName === '华安' || (product.name==='金彭三责险'&& insurerName==='')">-->
          <!--<p><img src="/static/img/yes.png"/><span>在骑行中发生的意外</span></p>-->
          <!--<p><img src="/static/img/yes.png"/><span>年累计赔偿限额20万元，每次事故赔偿限额10万元</span></p>-->
          <!--<p><img src="/static/img/yes.png"/><span>每人人身伤亡赔偿限额8.8万元</span></p>-->
          <!--<p><img src="/static/img/yes.png"/><span>每人医疗费用赔偿限额1万元</span></p>-->
          <!--<p><img src="/static/img/yes.png"/><span>每次事故财产损失赔偿限额2000元</span></p>-->
          <!--<p style="padding-bottom: 6px"><img src="/static/img/yes.png"/><span>每次事故绝对免赔人民币300元</span></p>-->
        <!--</div>-->
        <!--&lt;!&ndash; 金彭阳光三责险&ndash;&gt;-->
        <!--<div class="service" v-if="insurerName === '阳光'">-->
          <!--<p><img src="/static/img/yes.png"/><span>在骑行中发生的低速四轮第三者意外</span></p>-->
          <!--<p><img src="/static/img/yes.png"/><span>年累积赔偿限额 20万，每次事故赔偿限额 12.2万元</span></p>-->
          <!--<p><img src="/static/img/yes.png"/><span>每次事故第三者人身伤亡赔偿限额 11万元</span></p>-->
          <!--<p><img src="/static/img/yes.png"/><span>每次事故第三者医疗赔偿限额 1万元</span></p>-->
          <!--<p><img src="/static/img/yes.png"/><span>每次事故第三者财产赔偿限额 2000元</span></p>-->
          <!--<p style="padding-bottom: 6px"><img src="/static/img/yes.png"/><span>每次事故免赔：第三者财产损失、第三者医疗 300元</span></p>-->
        <!--</div>-->
      </div>
      <div class="serviceDetail">
        <h3>服务内容</h3>
        <p v-for="item in serviceContent"><img src="/static/img/yes.png"/><span v-text="item"></span></p>
      </div>
      <!--<div class="footer service footer_new">-->
        <!--<img src="/static/img/icon_service.png" alt="icon_contect"/>-->
        <!--&lt;!&ndash; 金彭四轮 &ndash;&gt;-->
        <!--<a v-if="insurerName === '华安' || (product.name==='金彭三责险'&& insurerName==='')"-->
           <!--style="color: #666;text-decoration: none" href="tel:95556">华安财产保险客服热钱95556</a>-->
        <!--&lt;!&ndash;金彭阳光&ndash;&gt;-->
        <!--<a v-if="insurerName === '阳光'"-->
           <!--style="color: #666;text-decoration: none" href="tel:95510">阳光财产保险客服热线95510</a>-->
        <!--&lt;!&ndash; 雅迪/金彭/淮海二三轮 &ndash;&gt;-->
        <!--<a v-if="product.name === '雅迪安乘宝'|| product.name === '淮海安行保'||product.name === '金彭安乘保'"-->
           <!--style="color: #666;text-decoration: none" href="tel:95511">平安保险客服热线95511</a>-->
        <!--&lt;!&ndash; 宗申/力帆 &ndash;&gt;-->
        <!--<a v-if="product.name === '宗申骑行保' || product.name === '力帆骑行保'" style="color: #666;text-decoration: none" href="tel:10108848">珠峰财产保险客服热线10108848</a>-->
        <!--<a v-if="product.name === '宗申安乘保' || product.name === '新大洲安乘保'" style="color: #666;text-decoration: none" href="tel:95505">天安财产保险客服热线95505</a>-->
      <!--</div>-->
      <div class="footer service">
        <img src="/static/img/icon_service.png" alt="icon_contect"/>
        <a :href="insurerPhone"><span v-text="insurer.name"></span>财产保险客服热线<span v-text="insurer.phone"></span></a>
      </div>
    </div>
    <!--<div id="error">-->
    <!---->
    <!--</div>-->
  </div>
</template>
<script>
  export default {
    data() {
      return {
        isShow:false,                             // 显示
        myUrl:'',                                   // 状态icon
        status:'',                                  // 状态
        livingAddress:'',                            // 常驻地址
        idAddress:'',                            // 户籍地址
        insured:{},                          // 被保人信息
        commodity:{},                         // 车辆信息
        insurancePolicies:[],                   // 保单号
        startTime:'',                       // 开始时间
        endTime:'',                         // 结束时间
        product:{},                          // 产品信息
        servicePeriod:'',                    // 服务期限
        insurerName:'',                   // 保险公司
        insuranceNum:this.$route.params.insuranceNum,   // 订单号
        serviceContent:'',                    // 服务内容
        insurer:'',                        // 保险公司信息
        insurerPhone:'',                    // 保险公司客服电话
      }
    },
    mounted(){
      const self = this;
      self.openid = sessionStorage.getItem('openid');
      self.getAjaxNew(self);
    },
    methods:{
      // 时间戳转时间
      getDate(date){
        return new Date(parseInt(("/Date("+date+")/").substr(6, 13))).toLocaleDateString();
      },
      // 赠险接口
      getAjaxNew(self){
        self.$api.get('/bnhWechatOrder/id/'+self.insuranceNum,{openid:self.openid},null,r=>{
          // console.log(response);
          if(r.code === 200){
            let resData = r.data;
            self.insured = resData.insured;
            self.commodity = resData.commodity;
            for(let i=0;i<resData.insurancePolicies.length;i++){
              self.insurancePolicies[i] = resData.insurancePolicies[i];
            }
            if(self.insurancePolicies.length>0){
              self.insurerName = self.insurancePolicies[0].insurerProduct.insurer.name;
              self.serviceContent = eval(self.insurancePolicies[0].insurerProduct.serviceContent);
              self.insurer = self.insurancePolicies[0].insurerProduct.insurer;
              self.insurerPhone = 'tel:'+self.insurancePolicies[0].insurerProduct.insurer.phone;
            }else{
              self.insurerName = '';
            }
            
            self.product = resData.product;
            self.startTime = resData.startTime;
            self.endTime = resData.endTime;
            self.status = resData.status.value;
            if(resData.status.key === "Insured"){
              self.myUrl = "/static/img/icon_success.png";
            }else if(resData.status.key === "AwaitingInsure" || resData.status.key === "AwaitingPay"){
              self.myUrl = "/static/img/icon_wait.png";
            }else if(resData.status.key === "Processing"){
              self.myUrl = "/static/img/icon_process.png";
            }
          
            // 被保人信息
            if(self.insured.gender === "Female"){            // 性别
              self.insured.gender = "女"
            }else if(self.insured.gender === "Male"){
              self.insured.gender = "男"
            }
            self.insured.idNumber = self.formatIdNum(self.insured.idNumber);   // 身份证号
            self.insured.mobile = self.formatPhone(self.insured.mobile);       // 手机号
            self.livingAddress = (self.insured.livingProvince===null?'':self.insured.livingProvince) + (self.insured.livingCity===null?'':self.insured.livingCity) +
              (self.insured.livingDistrict===null?'':self.insured.livingDistrict) +self.insured.livingAddress;      // 常住地址
            self.idAddress = self.insured.idAddress;                      // 户籍地址
            if(self.livingAddress === 0){
              self.livingAddress = null;
            }
            self.commodity.category = resData.commodity.category.value;
            // 服务期限
            self.servicePeriod = self.getDate(self.startTime) + "-" + self.getDate(self.endTime);
            self.isShow = true;
          }else{
          
          }
        })
      },
    }
    
  }
</script>
