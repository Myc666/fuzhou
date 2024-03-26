<template>
    <div>
      <el-form ref="params" :model="params" label-width="180px">
        <el-form-item label="是否推送语音通知" prop="voiceEnable">
          <el-radio v-model="params.voiceEnable" label="false">不启用</el-radio>
          <el-radio v-model="params.voiceEnable" label="true">启用</el-radio>
        </el-form-item>
        <el-form-item label="appId">
          <el-input v-model="params.voiceAppId"></el-input>
        </el-form-item>
        <el-form-item label="appSecret">
          <el-input v-model="params.voiceAppSecret" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="模板Id">
          <el-input v-model="params.voiceTemplateId" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmitForm('params')">提交</el-button>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item label="语音推送手机号码">
            <div style="margin-bottom: 10px">
                <el-button @click.prevent="addPhone()">新增</el-button>
            </div>
            <el-table :data="tableData" style="width: 500px" border v-loading="loading">
              <el-table-column prop="phone" align="center" label="手机号码">
              </el-table-column>
              <el-table-column align="center" label="关联告警等级" width="120">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.name" size="medium" :style="{ backgroundColor: scope.row.showColorAlpha, color: scope.row.showColor, borderColor: scope.row.showColor }">{{ scope.row.name }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button type="text" @click="addPhone(scope.row)">编辑</el-button>
                    <el-button type="text" style="color: red !important;" @click="deletePhone(scope.row)">删除</el-button>
                  </template>
              </el-table-column>
            </el-table>
        </el-form-item>
        
      </el-form>
      <!-- 新增手机号 -->
      <AddPhone v-if="isAddPhone" :alarmLevelList="alarmLevelList" :detailObj="detailObj" @close="close"/>
    </div>
  </template>
  <script>
  import { saveAlarmVoiceConfig,queryAlarmVoiceConfig,listData,deletePhone } from "@/api/applicationMonitoring/voiceManagement";
  import { getAlarmLevelList } from "@/api/applicationMonitoring/algorithmManagement";
  import AddPhone from "./components/addPhone.vue"
  export default {
    components:{
      AddPhone
    },
    data() {
      return {
        tableData: [],
        params: {
          voiceEnable:"false",
          voiceAppId:'',
          voiceAppSecret:'',
          voiceTemplateId:'',
        },
        isAddPhone:false,
        loading:false,
        alarmLevelList:[],
        detailObj:{},
      };
    },
    async created() {
      await this.listAlarmLevelData();
      await this.getInfo();
      await this.getPhoneList();
    },
    methods: {
      async listAlarmLevelData() {
          const data = await getAlarmLevelList();
          this.alarmLevelList = data.data;
      },
      async getInfo(){
        const res = await queryAlarmVoiceConfig();
        this.params = res.data || {};
      },
      // 获取电话号码列表
      async getPhoneList() {
        this.loading = true;
        const data = await listData();
        if(data.data&&data.data.length>0){
          data.data.forEach(item => {
            this.alarmLevelList.forEach(items=>{
              if(item.levelId==items.id){
                item.name = items.name;
                item.showColor = items.showColor;
                item.showColorAlpha = items.showColorAlpha;
              }
            })
          });
        }
        this.tableData = data.data;
        this.loading = false;
      },
      addPhone(row) {
        this.detailObj = {};
        if(row){
          this.detailObj = row
        }
        this.isAddPhone = true;
      },
      close(){
        this.isAddPhone = false;
        this.getPhoneList()
      },
      async deletePhone(item) {
        this.$confirm(`确定删除该条数据?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            const res = await deletePhone({ id: item.id });
            if (res.code == 0) {
              this.$message.success("删除成功");
              await this.getPhoneList();
            }
          })
          .catch(() => {});
      },
      onSubmitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const data = await saveAlarmVoiceConfig(this.params)
            this.$message.success('保存成功')
          } else {
            return false;
          }
        });
      },
    },
  };
  </script>
  <style scoped lang="scss">
  </style>
  