<template>
  <div>
    <el-form ref="form2" :model="form2" label-width="180px">
      <!-- <el-form-item label="第三方接口地址">
        <el-input v-model="form2.reportPushUrl"></el-input>
        <div class="tip__text">
          请填写第三方http接口地址，仅支持post方式；例如：http://domain.com:port/api/alarm_data
        </div>
      </el-form-item>
      <el-form-item label="是否推送图片" prop="streamType">
        <el-radio v-model="form2.reportPushImage" label="false"
          >不启用</el-radio
        >
        <el-radio v-model="form2.reportPushImage" label="true">启用</el-radio>
        <div class="tip__text">注意，图片以base64字符串形式传递</div>
      </el-form-item> -->
      <el-divider></el-divider>
      <el-form-item label="推送到企业微信群" prop="weworkEnable">
        <el-radio v-model="form2.weworkEnable" label="false">不启用</el-radio>
        <el-radio v-model="form2.weworkEnable" label="true">启用</el-radio>
      </el-form-item>
      <el-form-item label="企业微信群机器人地址">
        <el-input v-model="form2.weworkUrl"></el-input>
        <div class="tip__text">
          请先开通企业微信群机器人，然后复制粘贴群地址，例如：https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=1111111-2222-3333-4444444
        </div>
      </el-form-item>
      <el-divider></el-divider>
      <el-form-item label="推送到钉钉群信群" prop="weworkEnable">
        <el-radio v-model="form2.dingdingEnable" label="false">不启用</el-radio>
        <el-radio v-model="form2.dingdingEnable" label="true">启用</el-radio>
      </el-form-item>
      <el-form-item label="钉钉群签名">
        <el-input v-model="form2.dingdingSign" placeholder="选填" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="钉钉群地址">
        <el-input v-model="form2.dingdingUrl" ></el-input>
      </el-form-item>
      <el-divider></el-divider>
      <!-- <el-form-item label="是否推送短信通知" prop="smsEnable">
        <el-radio v-model="form2.smsEnable" label="false">不启用</el-radio>
        <el-radio v-model="form2.smsEnable" label="true">启用</el-radio>
      </el-form-item>
      <el-form-item label="短信平台APP_KEY">
        <el-input v-model="form2.smsAppKey"></el-input>
        <div class="tip__text">
          当前仅支持云片网，请先在云片网进行注册以获取APP_KEY
        </div>
      </el-form-item>
      <el-form-item label="短信平台模板ID">
        <el-input v-model="form2.smsTplId"></el-input>
        <div class="tip__text">
          当前仅支持云片网，请先在云片网申请短信模板，然后获取模板ID
        </div>
      </el-form-item>
      <el-form-item label="短信推送手机号码">
        <div style="margin-bottom: 10px">
          <el-row :gutter="4">
            <el-col :span="6">
              <el-input v-model="phone"></el-input>
            </el-col>
            <el-col :span="6">
              <el-button @click.prevent="addPhone()">新增</el-button>
            </el-col>
          </el-row>
        </div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="phone" label="手机号码" width="180">
          </el-table-column>
          <el-table-column align="center" label="操作" width="80">
            <template slot-scope="scope">
              <el-button type="text" @click="deletePhone(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item> -->
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
  getListData as getPhoneList,
  deleteData as deletePhoneData,
  saveData as addPhone
} from "@/api/applicationMonitoring/messageManagement";
import {
  getInfo,
} from "@/api/applicationMonitoring/systemManagement";
import { saveAlarmWeworkConfig } from "./api"
export default {
  props: {
    
  },
  data() {
    return {
      tableData: [],
      phone: "",
      form2: {
        reportPushUrl: "",
        reportPushImage: "false",
        weworkEnable: "false",
        weworkUrl: "",
        smsEnable: "false",
        smsAppKey: "",
        smsTplId: "",
        dingdingEnable:false,
        dingdingSign:'',
        dingdingUrl:''
      },
    };
  },
  async created() {
    this.getPhoneList();
    this.getInfo()
  },
  methods: {
    async getInfo(){
      const data = await getInfo();
      this.form2 = data.data.forms.form2 || {};
    },
    // 获取电话号码列表
    async getPhoneList() {
      this.loading = true;
      const data = await getPhoneList({});
      this.tableData = data.data;
      this.total = Number(data.count);
      this.loading = false;
    },
    async addPhone() {
      if (this.phone == null || this.phone == "") {
        this.$message.error("请填写手机号码");
        return;
      }
      const res = await addPhone({
        phone: this.phone,
      });
      if (res.code == 0) {
        this.$message.success("操作成功");
        await this.getPhoneList();
      }
    },
    async deletePhone(item) {
      this.$confirm(`确定删除该条数据?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await deletePhoneData({ id: item.id });
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
          const data = await saveAlarmWeworkConfig(this.form2)
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
