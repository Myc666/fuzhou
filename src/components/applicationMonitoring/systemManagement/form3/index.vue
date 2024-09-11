<template>
  <div>
    <el-form ref="form3" :model="form3" label-width="180px">
      <el-form-item label="应用名称">
        <el-input
          v-model="form3.appName"
          placeholder="请填写应用名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="应用LOGO">
        <el-upload
          action=""
          :http-request="handleUploadImg1"
          :show-file-list="false"
          accept=".jpg,.jpeg,.png,.gif"
          style="display: inline"
        >
          <div v-if="(form3.logoUrl || logoUrl)&&!showUploadButton" class="file-img">
            <img
              :src="VUE_APP_API_BASE_URL + logoUrl"
              class="logo"
              @error="handleImageError" 
            />
            <div class="del-sty">
              <div class="el-icon-delete" @click.stop="delFun()"></div>
            </div>
          </div>
          <el-button type="primary" icon="el-icon-plus" v-else
            >上传LOGO</el-button
          >
        </el-upload>
      </el-form-item>
      <el-form-item label="大屏名称">
        <el-input
          v-model="form3.screenName"
          placeholder="大屏名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="应用LOGO">
        <el-upload
          action=""
          :http-request="handleUploadImg2"
          :show-file-list="false"
          accept=".jpg,.jpeg,.png,.gif"
          style="display: inline"
        >
          <!-- <img
            v-if="form3.screenLogoUrl || screenLogoUrl"
            :src="VUE_APP_API_BASE_URL + screenLogoUrl"
            class="logo"
          /> -->
          <div v-if="(form3.screenLogoUrl || screenLogoUrl)&&!showScreenButton" class="file-img">
            <img
              :src="VUE_APP_API_BASE_URL + screenLogoUrl"
              class="logo"
              @error="handleImageError1" 
            />
            <div class="del-sty">
              <div class="el-icon-delete" @click.stop="delFun1()"></div>
            </div>
          </div>
          <el-button type="primary" icon="el-icon-plus" v-else
            >上传LOGO</el-button
          >
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmitForm('form3')"
          >提交</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { upload } from "@/api/applicationMonitoring/systemManagement";
export default {
  props: {
    form3: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      VUE_APP_API_BASE_URL,
      logoUrl: "",
      screenLogoUrl: "",
      showUploadButton:false,
      showScreenButton:false,
    };
  },
  watch: {
    form3: {
      handler(val) {
        console.info(val);
        if(val.logoUrl){
          this.logoUrl = "/config/upload/stream?file=" + val.logoUrl;
        }
        this.screenLogoUrl = val.screenLogoUrl;
      },
      deep: true,
      immediate: true,
      
    },
  },
  async created() {},
  methods: {
    handleImageError() {
      this.showUploadButton = true;
    },
    handleImageError1() {
      this.showScreenButton = true;
    },
    // 上传
    async handleUploadImg1(files) {
      const file = files.file ? files.file : files[0];
      // 渲染上传文件
      let formData = new FormData();
      formData.append("file", file);
      const data = await upload(formData);
      this.logoUrl = "/config/upload/stream?file=" + data.data;
    },
    // 上传
    async handleUploadImg2(files) {
      const file = files.file ? files.file : files[0];
      // 渲染上传文件
      let formData = new FormData();
      formData.append("file", file);
      const data = await upload(formData);
      this.screenLogoUrl = "/config/upload/stream?file=" + data.data;
    },
    onSubmitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.form3.logoUrl = this.logoUrl.substring(27, this.logoUrl.length);
          this.form3.screenLogoUrl = this.screenLogoUrl.substring(27, this.screenLogoUrl.length);
          this.$emit("submitForm", "form3", this.form3);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除
    delFun(){
      this.logoUrl = ""
    },
    delFun1(){
      this.screenLogoUrl = ""
    }
  },
};
</script>
<style scoped lang="scss">
.logo {
  width: 80px;
  height: 80px;
  object-fit: cover;
}
.file-img{
  width: 80px;
  height: 80px;
  position: relative;
}
.file-img:hover{
  .del-sty{
      width: 100%;
      height: 100%;
      position: absolute;
      background: rgba(0, 0, 0, 0.40);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFF;
      font-size: 20px;
      top: 0px;
  }
}
.del-sty{
    display: none;
}
</style>
