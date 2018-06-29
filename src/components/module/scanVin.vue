<template>
  <div class="wrapper idCard_message">
    <div class="idCard_photos" :class="{'marginTop0':isShow}">
      <div class="photo">
        <img :src="dataUrl">
        <span class="file_picture" @click="wxScanQRCode"></span>
        <!--<input type="file" accept="image/*" capture="camera" @change="changeFile($event)" ref="file1" class="file_picture" >-->
      </div>
      <div class="tit">我的车架号(可扫描或手动输入)</div>
    </div>
    <!-- 证件信息 -->
    <div class="message" v-show="isShow">
      <div class="sub">
        <div class="subTitle">确认以下信息是否正确</div>
      </div>
      <div class="input_div">
        <div class="input_list">
          <yd-cell-item class="label_item">
            <span slot="left">车架号：</span>
          </yd-cell-item>
        </div>
        <div class="input_list">
          <yd-cell-item>
            <yd-input slot="right" v-model="vin" ref="vin" class="bigFont" :regex="pattern" required></yd-input>
          </yd-cell-item>
        </div>
      </div>
      <buttonAction :name="buttonLabel" :action="buttonAction" :currentIndex="currentIndex" v-on:formCommit="formCommit($event)"></buttonAction>
    </div>
    <!-- 证件信息 end-->
  </div>
</template>
<script>
    import wx from 'weixin-js-sdk'
    import buttonAction from '../module/buttonAction'
    export default {
      data() {
        return {
          dataUrl:'/static/img/vinScan.png',
          vin:'',
          isShow:true,
          buttonLabel:'确定',
          buttonAction:'next',
          currentIndex:1,
          openid:'',
        }
      },
      props:['pattern','error'],
      components:{
        buttonAction,
      },
      beforeRouteEnter(to, from, next) {
        // XXX: 修复iOS版微信HTML5 History兼容性问题
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        if (isiOS && to.path !== location.href.split('#')[1]) {
//          alert('/#'+to.fullPath);
          // 此处不可使用location.replace
          location.assign('/#'+to.fullPath);
        } else {
          next();
        }
      },
      mounted(){
        this.openid = sessionStorage.getItem('openid')
        this.initWXSaoyisao();
      },
      methods:{
        formCommit(msg){
          const self = this;
          if(self.vin ===null || self.vin === ''){
            self.$dialog.alert({mes:'请填写车架号'});
          }else if(!self.vin.match(self.pattern)){
            self.$dialog.alert({mes:self.error});
          }else {
            self.$emit('indexChanged',{index:this.currentIndex+1,vin:this.vin});
          }
        },
        wxScanQRCode() {
          const self = this;
          wx.scanQRCode({
            // 默认为0，扫描结果由微信处理，1则直接返回扫描结果
            needResult : 1,
            scanType: ["qrCode","barCode"],///"qrCode","barCode"
            desc : 'scanQRCode desc',
            success : function(res) {
              self.isShow = true;
              //扫码后获取结果参数赋值给Input
              var url = res.resultStr;
              //商品条形码，取","后面的
              if(url.indexOf(",")>=0){
                self.vin = url.split(',')[1];
              }else{
                self.vin = url;
              }
            }
          });
        },
        initWXSaoyisao() {         // 初始化微信接口
          let url = location.href;
          this.$api.get('/bnhWechat/wxSaoYiSao?url='+url,{'openid':this.openid},null,r=>{
            if(r.code === '200'){
              wx.config({
                debug : false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId : r.data.appId, // 必填，公众号的唯一标识
                timestamp : r.data.timestamp, // 必填，生成签名的时间戳
                nonceStr : r.data.nonceStr, // 必填，生成签名的随机串
                signature : r.data.signature,// 必填，签名
                jsApiList : [ 'scanQRCode' ]
                // 必填，需要使用的JS接口列表
              });
            }else{
//              this.$dialog.alert({mes:r.message});
            }
          })
        },
        next_btn(){

        }
      }
    }
</script>
