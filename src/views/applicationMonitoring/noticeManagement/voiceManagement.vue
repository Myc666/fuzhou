<template>
  <div>
    <el-form ref="params" :model="params" label-width="180px">
      <el-form-item label="是否推送语音通知" prop="voiceEnable">
        <el-radio v-model="params.voiceEnable" label="false">不启用</el-radio>
        <el-radio v-model="params.voiceEnable" label="true">启用</el-radio>
      </el-form-item>
      <el-form-item label="AccessKey ID">
        <el-input v-model="params.voiceAppId"></el-input>
        <div class="tip-text">请在阿里云平台点击您的头像进入【AccessKey管理】。首次需创建新的子用户AccessKey,获取并粘贴ID至此。</div>
      </el-form-item>
      <el-form-item label="AccessKey Secret">
        <el-input v-model="params.voiceAppSecret" type="textarea"></el-input>
        <div class="tip-text">当您创建Acceesskey时会附带Secret信息，获取并粘贴Secret至此，请务必妥善保管此信息。</div>
      </el-form-item>
      <el-form-item label="文本转语音模板ID">
        <el-input v-model="params.voiceTemplateId" ></el-input>
        <div class="tip-text">请前往【语音服务控制台】的语音消息-语音通知，创建并粘贴“文本转语音模板”下的模板ID。例如TTS_287395390</div>
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
          <div class="tip-text">添加可正常收听语音的手机号，并关联已创建的语音推送方式。</div>
          <el-form-item>
            <el-button type="primary" @click="onSubmitForm('params')" style="margin-top: 16px;">提交</el-button>
            <div class="tip-text">开通语音服务教程，请联系我们后获取。</div>
          </el-form-item>
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
.tip-text{
  font-size: 12px;
  color: rgba(0, 0, 0, 0.60);
}
</style>
