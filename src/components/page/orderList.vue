<template>
    <div class="wrapper_scroll orderList" ref="scrollBox">
      <div class="content" v-show="content" v-for="item in insuranceList">
        <router-link class="item weui-flex" :to="'/orderDetail/' + item.insuranceNum">
          <div>
            <div class="item-left">
              <img style="height:45px;" :src="item.icon" alt=""></div>
          </div>
          <div class="weui-flex__item">
            <div class="item-content">
              <span v-text="item.customerName"></span>
              <p class="weui-footer weui-footer__text">创建时间: <span v-text="item.createdTime"></span></p>
              <p class="weui-footer weui-footer__text">生效时间: <span v-text="item.workTime"></span></p>
            </div>
          </div>
          <div>
            <div class="item-right"><span v-text="item.status"></span><img src="/static/img/icon_silver.png"></div>
          </div>
        </router-link>
      </div>
      <div class="error" v-show="!content">
        <div style="position: fixed; left: 50%; top: 50%; width: 80%; margin-left: -40%;height: 130px;margin-top: -200px;">
          <div style="text-align: center;">
            <img style="width: 200px; height: 100%; margin-bottom: 20px" src="/static/img/noList.png">
            <div style="font-size:18px; color:#4a4a4a;">目前还没有保障订单记录</div>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
    export default {
      data() {
        return {
          insuranceList:{},
          openid:'',
          content:true,
        }
      },
      mounted(){
        const self = this;
        self.$dialog.loading.open('请稍等...');
        self.openid = self.getUrlKey("openid");
        if(self.openid!==null &&self.openid!==''){           // 如果不是从登陆跳过来的话需要存下openid
          sessionStorage.setItem('openid',self.openid);
        }else{                             // 如果是从登陆跳过来的话，直接拿session里的openid
          self.openid = sessionStorage.getItem('openid');
        }
        if(sessionStorage.getItem('phone') === null){
          self.phone = '';
        }else{
          self.phone = sessionStorage.getItem('phone');
        }
//        self.$api.get('https://easy-mock.com/mock/5a12764bef842836ae773582/code/getInsuranceList',{'openid':self.openid},null,r =>{
        self.$api.get('/bnhWechatOrder/mobile?mobile='+self.phone,{'openid':self.openid},null,r =>{
          if(r.code === 200){
            self.$dialog.loading.close();
            if(r.data.insuranceList.length <1){   // 如果没内容
              self.content = false;
            }else {
              for (let i = 0; i < r.data.insuranceList.length; i++) {
                if (r.data.insuranceList[i].insuranceStatusCode === "Insured") {
                  r.data.insuranceList[i].status = "通过";
                } else if (r.data.insuranceList[i].insuranceStatusCode === "Failed") {
                  r.data.insuranceList[i].status = "失败";
                } else if (r.data.insuranceList[i].insuranceStatusCode === "AwaitingInsure") {
                  r.data.insuranceList[i].status = "等待投保";
                } else if (r.data.insuranceList[i].insuranceStatusCode === "Processing") {
                  r.data.insuranceList[i].status = "正在处理";
                }
                r.data.insuranceList[i].icon = '/static/img/'+ r.data.insuranceList[i].productIcon;
              }
            }
            self.insuranceList = r.data.insuranceList;
            self.$nextTick(function(){            // 页面渲染完成时执行事件(取)
              setTimeout(function() {
                self.$refs.scrollBox.scrollTop = parseInt(sessionStorage.getItem('position'));      // 设置scrollTop值
              },20)
            })
          }else{
            self.$dialog.alert({mes:r.message});
          }
          self.$dialog.loading.close();
        },res=> {
          self.$dialog.loading.close();
          this.$router.push({
            path: '/login',
          });
        })
        self.$refs.scrollBox.addEventListener('scroll', () => {            // 监听scroll事件(存)
            sessionStorage.setItem('position', self.$refs.scrollBox.scrollTop)
        })
      },
    }
</script>
