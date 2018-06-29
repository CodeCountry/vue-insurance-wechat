<template>
    <div>
      <div v-for="(item,index) in dataArr" :class="getClass(index)" v-show="index===currentIndex">
        <div class="top_title">
          <Step :steps="item.steps" :currentStep="item.currentStep"></Step>
          <Title :title="item.title"></Title>
        </div>
        <div v-for="control in item.controls">
          <subTitle v-if="control.dataType==='SubTitle'" :label="control.label"></subTitle>
          <inputText v-if="control.dataType==='Text'" :model="control.model" :label="control.label" :placeholder="control.placeholder" :pattern="control.pattern" :required="control.required" v-on:transferParamSelect="getParamSelect($event)"></inputText>
          <blankLine v-if="control.dataType==='BlankLine'"></blankLine>
          <inputSelect v-if="control.dataType==='Select'" :model="control.model" :label="control.label" :placeholder="control.placeholder" :options="control.optionsM" :required="control.required" v-on:transferParamSelect="getParamSelect($event)"></inputSelect>
          <Date v-if="control.dataType==='Date'" :model="control.model" :label="control.label" :placeholder="control.placeholder" :required="control.required" v-on:transferParamSelect="getParamSelect($event)"></Date>
          <NationalDistrict v-if="control.dataType==='NationalDistrict'" :model="control.model" :label="control.label" :placeholder="control.placeholder" :required="control.required" v-on:transferParamSelect="getParamsNation($event)"></NationalDistrict>
          <multiSelect v-if="control.dataType==='MultiSelect'" :model="control.model" :label="control.label" :options="control.optionsM" v-on:transferData="getTransferData($event)"></multiSelect>
          <scanCard v-if="control.dataType==='IdCardScanner'" v-on:indexChanged = "changeIndex($event)"></scanCard>
          <scanVin v-if="control.dataType==='VinScanner'" :pattern="control.pattern" :error="control.error" v-on:indexChanged = "changeIndex2($event)"></scanVin>
          <!--<checkBox v-if="control.dataType==='CheckBox'" :label="control.label" :checked="control.checked" :required="control.required" v-on:transferData="getData($event)"></checkBox>-->
          <Agreement v-if="control.dataType==='Agreement'" ref="whateverName" :label="control.label" :checked="control.checked" :required="control.required" :options="control.optionsM" v-on:transferData="getData($event)"></Agreement>
        </div>
        <div v-for="action in item.actions">
          <buttonAction v-if="item.actions!==''" :name="action.name" :action="action.action" :currentIndex="currentIndex" v-on:formCommit="formCommit($event)"></buttonAction>
        </div>
        <tips v-if="item.tips" :text="item.tips"></tips>
        <div v-for="action in item.actions">
          <phoneCode v-if="action.action==='Verify'" v-show="isShow" v-on:transferFun="changeFun($event)" v-on:transferData="commitForm($event)"></phoneCode>
        </div>
      </div>
    </div>
</template>
<script>
  import Step from '../module/Step.vue';
  import Title from '../module/Title.vue';
  import subTitle from '../module/subTitle.vue';
  import inputText from '../module/inputText.vue';
  import blankLine from '../module/blankLine.vue';
  import inputSelect from '../module/inputSelect.vue';
  import Date from '../module/Date.vue';
  import NationalDistrict from '../module/NationalDistrict.vue';
  import multiSelect from '../module/multiSelect.vue';
  import scanCard from '../module/scanIdCard.vue';
  import scanVin from '../module/scanVin.vue';
  import checkBox from '../module/checkBox.vue';
  import Agreement from '../module/Agreement.vue';
  import buttonAction from '../module/buttonAction.vue';
  import tips from '../module/tips.vue';
  import phoneCode from '../module/phoneCode.vue';
  import Hub from '../../js/hub'    // 引入vue
    export default {
      data() {
        return {
          isShow:false,             // model框
          dataArr:[],
          id: this.$route.params.id, // brandId
          currentIndex:0,
          steps:'',
          labelArr:[],             // 字段数组
          valueArr:[],             // 字段值数组
          i:'',                     // 调取传参数函数的次数
          openid:'',
          accessories:[],         // 多选框
          Agreement:false,          // 勾选框
          vehicleBrand:'',         // 品牌
        }
      },
      components:{
        Step,Title,subTitle,inputText,blankLine,inputSelect,Date,NationalDistrict,multiSelect,scanCard,scanVin,checkBox,Agreement,buttonAction,tips,phoneCode
      },

      mounted(){
        const self = this;
        if(self.getUrlKey("source")!==null && self.getUrlKey("source")!==''){
          sessionStorage.setItem('source',self.getUrlKey('source'));
        }
        if(self.getUrlKey("openid")!==null && self.getUrlKey('openid')!==''){          // 如果是外部H5页面则从url中取openid并且存进session中
          self.openid = self.getUrlKey("openid");
          sessionStorage.setItem('openid',self.getUrlKey("openid"));
        }else{
          self.openid = sessionStorage.getItem('openid');
        }
        
//        console.log(self.openid);
//        self.$api.get('https://easy-mock.com/mock/5a12764bef842836ae773582/code/getMain',{'openid':self.openid},null,r=>{
        self.$api.get('/bnhWeichart/wizard/brand/'+ this.id,{'openid':self.openid},null,r=>{
          if(r.code===200){
            console.log(r.data);
            self.steps = r.data.length;
            for(let i = 0;i<r.data.length;i++){
              console.log();
              for(let j = 0;j<r.data[i].controls.length;j++){
                if(typeof(r.data[i].controls[j].options) === 'string'){
                  r.data[i].controls[j].optionsM = eval(r.data[i].controls[j].options);
                  console.log(r.data[i].controls[j].optionsM);
                }
                if(r.data[i].controls[j].dataType === 'Agreement'){
                  self.Agreement = r.data[i].controls[j].checked;
                }
                if(r.data[i].controls[j].model === 'vehicleCategory'){
                  Hub.$emit('changeCategory',{category:true}) //$emit触发监听方法
                }
                if(r.data[i].controls[j].dataType === 'HiddenText'){
                  self.labelArr.push(r.data[i].controls[j].model);
                  self.valueArr.push(r.data[i].controls[j].value);
                }
              }
            }
//            console.log(self.labelArr);
//            console.log(self.valueArr);
            self.vehicleBrand = r.data[0].brand.name;     // 品牌
            self.dataArr = r.data;
          }else{
            self.$dialog.alert({mes:r.message});
          }
        })
       
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', function() {         // 监听回退按钮
          if(self.currentIndex>0){
            history.pushState(null, null, document.URL);
            self.currentIndex--;
          }else{
            history.pushState(null, null, sessionStorage.getItem('brandUrl'));
            location.reload(sessionStorage.getItem('brandUrl'));
          }
        },false);
        
      },
      methods:{
        getClass(index){
          return 'step'+(index+1);
        },
        formCommit(msg){                    // 点击下一步
          const self = this;
          for(let i = 0;i<self.dataArr.length;i++){                    // 校验表单
            if(self.currentIndex === i){                             // 当前页面进行校验
              for(let j = 0;j<self.dataArr[i].controls.length;j++){
                if(self.dataArr[i].controls[j].dataType==='MultiSelect'){         // 如果是多选项，判断有没有操作多选框时，并将默认值带过去
                  for(let z = 0;z<self.dataArr[i].controls[j].optionsM.length;z++){
                    if(self.labelArr.indexOf(self.dataArr[i].controls[j].optionsM[z].key)<0){ // 如果labelArr中存在optionsM中某一条数据,则不做变动,如果不存在，则判断初始赋值checked状态并赋值。
                      self.labelArr.push(self.dataArr[i].controls[j].optionsM[z].key);
                      if(!self.dataArr[i].controls[j].optionsM[z].checked){             // 将初始checked状态赋值
                        self.valueArr.push(false);
                      }else{
                        self.valueArr.push(self.dataArr[i].controls[j].optionsM[z].checked);
                      }
                    }
                  }
//                  console.log(self.labelArr);
//                  console.log(self.valueArr);
                }
                if(self.dataArr[i].controls[j].required && self.dataArr[i].controls[j].model && (self.labelArr.indexOf(self.dataArr[i].controls[j].model)<0 || self.valueArr[self.labelArr.indexOf(self.dataArr[i].controls[j].model)] ==='' )){          // 如果是必填&(传过来的值里没有model字段||model字段对应的value值为空)时
                  if(self.dataArr[i].controls[j].dataType==='MultiSelect'){
                    if(self.accessories.length>0){
                    }else{
                      self.$dialog.alert({mes:self.dataArr[i].controls[j].label+'是必填项'});
                      return;
                    }
                  }else{
                    if(self.dataArr[i].controls[j].label!==null && self.dataArr[i].controls[j].label!==''){
                      self.$dialog.alert({mes:self.dataArr[i].controls[j].label+'是必填项'});
                      return;
                    }else{
                      self.$dialog.alert({mes:self.dataArr[i].controls[j].placeholder+'是必填项'});
                      return;
                    }
                  }
                }else if(self.dataArr[i].controls[j].pattern!==null&&!(self.valueArr[self.labelArr.indexOf(self.dataArr[i].controls[j].model)]).match(self.dataArr[i].controls[j].pattern)){                                                         // 不通过校验时
                  self.$dialog.alert({mes:self.dataArr[i].controls[j].label+self.dataArr[i].controls[j].error});
                  return ;
                }else if(self.dataArr[i].controls[j].model ===null && self.dataArr[i].controls[j].dataType==='NationalDistrict'&&self.labelArr.indexOf('province')<0 ){                                                    // 如果是省市区字段
                  self.$dialog.alert({mes:self.dataArr[i].controls[j].label+'是必填项'});
                  return;
                }else{
                }
              }
            }
          }
          if(self.steps>self.currentIndex+1){       // 是否是最后一步（否）
            self.currentIndex++;
          }else{                                   // 是最后一步
            if(!self.Agreement){
              self.$dialog.alert({mes:'请同意相关协议'});
            }else{
              self.isShow = true;
            }
          }
        },
        changeIndex(msg){                       // 身份证识别组件传值
          const self = this;
          self.currentIndex = msg.index;
          self.labelArr.push('insuredName');
          self.labelArr.push('insuredCardNo');
          self.labelArr.push('insuredAddress');
          self.valueArr.push(msg.name);
          self.valueArr.push(msg.idNumber);
          self.valueArr.push(msg.address);
//          console.log(self.labelArr);
//          console.log(self.valueArr);
        },
        changeIndex2(msg){                      // 车架号识别组件传值
          const self = this;
          self.currentIndex = msg.index;
          self.labelArr.push('vin');
          self.valueArr.push(msg.vin);
//          console.log(self.labelArr);
//          console.log(self.valueArr);
        },
        getParamSelect(msg){         // 下拉选择赋值
          const self = this;
          self.i = self.labelArr.length;
          if((self.labelArr).indexOf(msg.name)>=0){         // 是否是修改已选择数据
            self.valueArr[(self.labelArr).indexOf(msg.name)]=msg.value;
          }else{
            self.labelArr[self.i] = msg.name;
            self.valueArr[self.i] = msg.value;
            self.i++;
          }
//          console.log(self.labelArr);
//          console.log(self.valueArr);
        },
        getParamsNation(msg){                          // 省市区获取数据
          const self = this;
          self.i = self.labelArr.length;
          if(self.labelArr.indexOf('province')>=0){      // 省
            self.valueArr[(self.labelArr).indexOf('province')] = msg.province;
          }else{
            self.labelArr[self.i] = 'province';
            self.valueArr[self.i] = msg.province;
          }

          if(self.labelArr.indexOf('city')>=0){        // 市
            self.valueArr[(self.labelArr).indexOf('city')] = msg.city;
          }else{
            self.labelArr[self.i+1] = 'city';
            self.valueArr[self.i+1] = msg.city;
          }

          if(self.labelArr.indexOf('district')>=0){        // 区/县
            self.valueArr[(self.labelArr).indexOf('district')] = msg.district;
          }else{
            self.labelArr[self.i+2] = 'district';
            self.valueArr[self.i+2] = msg.district;
          }
//          console.log(self.labelArr);
//          console.log(self.valueArr);
        },
        getTransferData(msg){             // 多选框传值（multiSelect）
          const self = this;
          console.log(msg.accessories);
          self.accessories = msg.accessories;
          for(let i = 0;i<msg.labelS.length;i++){
            if(self.labelArr.indexOf(msg.labelS[i])>=0){                // 修改数据时传值。如果labelArr中存在labels中某一条数据，则将valueArr对应index替换为valueS的值
              self.valueArr[(self.labelArr).indexOf(msg.labelS[i])] = msg.valueS[i];
            }else{                                                     // 否则直接赋值。
              self.labelArr.push(msg.labelS[i]);
              self.valueArr.push(msg.valueS[i]);
            }
          }
//          console.log(self.labelArr);
//          console.log(self.valueArr);
        },
        getData(msg){                       // checkbox组件
          this.Agreement = msg.checkbox;
        },
        changeFun(msg){
          this.isShow = msg;
        },
        commitForm(msg){                  // 获取投保手机号和验证码&提交订单
          const self = this;
//          console.log(self.labelArr);
//          console.log(self.valueArr);
          let header = {
            openid:self.openid,
            VAILD_CODE_KEY:msg.value,
            VAILD_CODE_VALUE:msg.code,
          }
          let params={};
          for(let i=0;i<self.labelArr.length;i++){
            params[self.labelArr[i]]=self.valueArr[i];
          }
          params.requestId = self.guid();        // 随机生成的UUID
          params.source = sessionStorage.getItem('source');   // 来源
          params.insuredMobile = msg.phone;
          params.vehicleBrand = self.vehicleBrand;
          self.isShow = false;
          self.$api.post('/order/wechatOrder',header,params,r=>{
            if(r.code === 200){
              sessionStorage.setItem('orderId',r.data.orderId);
              self.$dialog.loading.close();
              self.$router.push({path:'/activation_finish'});
            }else{
              self.$dialog.alert({mes: r.message});
            }
            self.$dialog.loading.close();
          })
        },
      }
    }
</script>
