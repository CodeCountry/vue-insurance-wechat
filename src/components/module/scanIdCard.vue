<template>
  <div class="wrapper idCard_message">
    <div class="idCard_photos" :class="{'marginTop0':isShow}">
      <div class="photo">
        <img class="idCardImg" :src="dataUrl">
        <input type="file" accept="image/*" capture="camera" @change="changeFile($event)" ref="file1" class="file_picture" >
      </div>
      <div class="tit">身份证信息(可扫描或手动输入)</div>
    </div>
    <!-- 证件信息 -->
    <div class="message" v-show="isShow">
      <div class="sub">
        <div class="subTitle">确认我的身份信息是否正确</div>
      </div>
      <div class="input_div">
        <div class="input_list" >
          <yd-cell-item>
            <span slot="left">姓名：</span>
            <yd-input slot="right" v-model="name" ref="name" regex="^[·\u4e00-\u9fa5]+$" required></yd-input>
          </yd-cell-item>
        </div>
        <div class="input_list">
          <yd-cell-item class="label_item">
            <span slot="left">身份证号码：</span>
          </yd-cell-item>
        </div>
        <div class="input_list">
          <yd-cell-item>
            <yd-input slot="right" v-model="idNumber" ref="idNumber" regex="(^\d{15}$)|(^\d{17}([0-9]|X|x)$)" required></yd-input>
          </yd-cell-item>
        </div>
        <div class="input_list">
          <yd-cell-item class="label_item">
            <span slot="left">详细地址：</span>
          </yd-cell-item>
        </div>
        <div class="input_list">
          <yd-cell-item>
            <yd-input slot="right" v-model="address" ref="address" required></yd-input>
          </yd-cell-item>
        </div>
        <!--<div class="input_list">-->
          <!--<yd-cell-item>-->
            <!--<yd-input slot="right" v-model="address" required></yd-input>-->
          <!--</yd-cell-item>-->
        <!--</div>-->
      </div>
      <buttonAction :name="buttonLabel" :action="buttonAction" :currentIndex="currentIndex" v-on:formCommit="formCommit($event)"></buttonAction>
    </div>
    <!-- 证件信息 end-->
  </div>
</template>
<script>
  import buttonAction from '../module/buttonAction'
    export default {
      data() {
        return {
          file1:'',
          dataUrl:'/static/img/idCard.png',
          input_num:'',
          input_name:'',
          isShow: true,
          name:'',
          idNumber:'',
          address:'',
          buttonLabel:'确定',
          buttonAction:'next',
          currentIndex:0,
          openid:'',
        }
      },
      components:{
        buttonAction,
      },
      mounted(){
        this.openid = sessionStorage.getItem('openid')
      },
      methods:{
        formCommit(msg){
          if(!this.$refs.name.valid){
            this.$dialog.alert({mes:'请填写正确的姓名'});
            return;
          }else if(!this.$refs.idNumber.valid){
            this.$dialog.alert({mes:'请填写正确的身份证号'});
            return;
          }else if(!this.$refs.address.valid){
            this.$dialog.alert({mes:'请填写地址'});
            return;
          }else{
            this.$emit('indexChanged',{index:this.currentIndex+1,name:this.name,idNumber:this.idNumber,address:this.address});
          }
        },
        convertBase64UrlToBlob(urlData){    // base64转文件
          var bytes=window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte
          //处理异常,将ascii码小于0的转换为大于0
          var ab = new ArrayBuffer(bytes.length);
          var ia = new Uint8Array(ab);
          for (var i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
          }
          return new Blob( [ab] , {type : 'image/png'});
        },
        reduce(path,callback) {       // 压缩图片
          var img = new Image();
          img.src = path;
          img.onload = function() {
            var canvas = document.createElement("canvas");
            //	var canvas = document.getElementById("myCanvas");
            var width = img.width/1.5;
            var height = img.height/1.5;
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
//          var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
            callback( canvas.toDataURL("image/jpeg",.7));
          }
        },
        changeFile($event) {
          const self = this;
          let $target = $event.target;
          if ($target.files && $target.files[0]) {
            let reader = new FileReader();
            reader.readAsDataURL($target.files[0]);
            reader.onload = function(evt){
              var baseStr;
              self.$dialog.loading.open('正在处理，请稍等');
              let base64 = evt.target.result;
              if(base64.length > 840000) {
                self.reduce(base64, function (base) {
                  self.dataUrl = base;
                  baseStr = base.split(",")[1];
                });
              }else{
                self.dataUrl = base64;
                baseStr = base64.split(",")[1];
              }
              setTimeout(() => {
                let formData = new FormData();
//                  formData.append("buf1",self.convertBase64UrlToBlob(hide_img));
                formData.append("buf1",baseStr);
                formData.append("code1","05-1");
                formData.append("type","05");
                let url = '/bnhWechat/uploadPicList';
                self.$api.post(url,{'openid':self.openid},formData,r=>{
                  if(r.code === "001"){
                    self.name = r.data.name;
                    self.idNumber = r.data.idNo;
                    self.address = r.data.address;
                    sessionStorage.setItem('accessoryId',r.data.accessoryId);
                    self.$dialog.loading.close();
                  }else {
                    self.$dialog.loading.close();
                    self.$dialog.alert({mes:r.message});
                  }
                });
              }, 1000);
//              let hide_img = self.dataUrl;
//              console.log(hide_img);
//                  if(hide_img.length > 840000){
//              this.reduce(self.dataUrl,function(base){
//                self.dataUrl = base;
//                baseStr = base.split(",")[1];
//              })
//                  }else{
//                    baseStr = hide_img.split(",")[1];
//                  }
            
            }
          }
        },
        // 获取图片旋转的角度
//        getOrientation(file, callback) {
//          let reader = new FileReader();
//          reader.readAsArrayBuffer(file);
//          reader.onload = function(e) {
//            let view = new DataView(e.target.result);
//            if (view.getUint16(0, false) !== 0xFFD8) return callback(-2);
//            let length = view.byteLength, offset = 2;
//            while (offset < length) {
//              let marker = view.getUint16(offset, false);
//              offset += 2;
//              if (marker === 0xFFE1) {
//                if (view.getUint32(offset += 2, false) !== 0x45786966) return callback(-1);
//                let little = view.getUint16(offset += 6, false) == 0x4949;
//                offset += view.getUint32(offset + 4, little);
//                let tags = view.getUint16(offset, little);
//                offset += 2;
//                for (let i = 0; i < tags; i++)
//                  if (view.getUint16(offset + (i * 12), little) === 0x0112)
//                    return callback(view.getUint16(offset + (i * 12) + 8, little));
//              }
//              else if ((marker & 0xFF00) !== 0xFF00) break;
//              else offset += view.getUint16(offset, false);
//            }
//            return callback(-1);
//          };
//        },
        // 将图片旋转到正确的角度
        resetOrientation(srcBase64, srcOrientation, callback) {
          let img = new Image();
          img.onload = function() {
            let width = img.width,
              height = img.height,
              canvas = document.createElement('canvas'),
              // canvas = document.getElementById("myCanvas"),
              ctx = canvas.getContext("2d");
            // set proper canvas dimensions before transform & export
            if ([5,6,7,8].indexOf(srcOrientation) > -1) {
              canvas.width = height;
              canvas.height = width;
            } else {
              canvas.width = width;
              canvas.height = height;
            }
            // transform context before drawing image
            switch (srcOrientation) {
              case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
              case 3: ctx.transform(-1, 0, 0, -1, width, height ); break;
              case 4: ctx.transform(1, 0, 0, -1, 0, height ); break;
              case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
              case 6: ctx.transform(0, 1, -1, 0, height , 0); break;
              case 7: ctx.transform(0, -1, -1, 0, height , width); break;
              case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
              default: ctx.transform(1, 0, 0, 1, 0, 0);
            }
            // draw image
            ctx.drawImage(img, 0, 0);
            // export base64
            callback(canvas.toDataURL('image/jpeg'));
          };
          img.src = srcBase64;
        },
        next_btn() {
//          if(this.input_num === "123123213213232"){
//            this.$router.push({ path: '/loan/face_recognition'})
//          }else{
//            this.$dialog.notify({
//              mes: '身份信息核实失败，请检查后重新提交',
//              timeout: 3000,
//              callback: () => {
//                console.log('我走咯！');
//              }
//            });
//          }
        },
        
      },
    }
</script>
