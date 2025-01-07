<template>
    <div>
      <el-form ref="form5" :model="form5" label-width="140px">
        <el-form-item label="人脸识别地址">
          <el-input v-model="form5.FACE_HTTP_BASE_URL"></el-input>
        </el-form-item>
        <el-form-item label="人脸对比地址">
          <el-input v-model="form5.FACE_HTTP_BASE_URL_2"></el-input>
        </el-form-item>
        <!-- <el-form-item label="是否开启抽帧服务" prop="streamType">
          <el-radio v-model="form5.HTTP_FRAME_ENABLE" label="true">启用</el-radio>
          <el-radio v-model="form5.HTTP_FRAME_ENABLE" label="false">不启用</el-radio>
        </el-form-item>
        <el-form-item label="抽帧服务地址">
          <el-input v-model="form5.HTTP_FRAME_API_URL"></el-input>
        </el-form-item>
        <el-form-item label="抽帧回调地址">
          <el-input v-model="form5.HTTP_FRAME_CALLBACK_URL"></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="onSubmitForm('form5')"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </template>
  <script>
  export default {
    props: {
      form5: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
      };
    },
    async created() {
      console.log(this.form5)
    },
    methods: {
      onSubmitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            this.$emit("submitForm", "form5", this.form5);
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
    },
  };
  </script>
  <style scoped lang="scss">
  </style>
  