<template>
    <div>
      <el-form ref="form2" :model="form2" label-width="100px">
        <el-form-item label="IP音柱服务器">
          <el-input v-model="form2.soundColumnServer"></el-input>
        </el-form-item>
        <el-form-item label="IP音柱编号">
          <el-input v-model="form2.soundColumnSn"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmitForm('form2')"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </template>
  <script>
  import {
    getInfo,
  } from "@/api/applicationMonitoring/systemManagement";
  import { saveSoundColumnConfig } from "./api"
  export default {
    props: {
      
    },
    data() {
      return {
        tableData: [],
        phone: "",
        form2: {
            soundColumnServer:'',
            soundColumnSn:'',
        },
      };
    },
    async created() {
      this.getInfo()
    },
    methods: {
      async getInfo(){
        const data = await getInfo();
        let params = data.data.forms.form2 || {};
        this.form2 = {
            soundColumnServer:params.soundColumnServer,
            soundColumnSn:params.soundColumnSn,
        }
      },
      onSubmitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const data = await saveSoundColumnConfig(this.form2)
            this.$message.success('保存成功')
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
  