<template>
  <div>
    <el-form ref="form1" :model="form1" label-width="140px">
      <el-form-item
        label="IP地址"
        prop="ipAddr"
        :rules="[{ required: true, message: '请输入IP地址', trigger: 'blur' }]"
      >
        <el-input v-model="form1.ipAddr"></el-input>
        <div class="tip__text">
          应用程序外部访问IP或域名+端口号，例如：127.0.0.1:8080 或
          domain.com:8080, 不要加http/https
        </div>
      </el-form-item>
      <el-divider></el-divider>
      <!-- <el-form-item label="推理地址">
        <el-input v-model="form1.algorithmUrl"></el-input>
        <div class="tip__text">
          模型测试时调用的推理地址，一般由算法模型方提供
        </div>
      </el-form-item>
      <el-divider></el-divider> -->
      <!-- <el-form-item label="流媒体视频流类型" prop="streamType">
        <el-radio v-model="form1.streamType" label="rtsp">rtsp视频流</el-radio>
        <el-radio v-model="form1.streamType" label="algo">算法视频流</el-radio>
      </el-form-item>
      <el-divider></el-divider> -->
      <el-form-item label="流媒体服务器地址">
        <el-input v-model="form1.mediaUrl"></el-input>
        <div class="tip__text">
          流媒体服务器内网访问地址，例如：http://192.168.0.150:7088
        </div>
      </el-form-item>
      <el-form-item label="流媒体播放地址">
        <el-input v-model="form1.playUrl"></el-input>
        <div class="tip__text">
          流媒体播放外网访问地址，例如：http://domain:8088
        </div>
      </el-form-item>
      <el-divider></el-divider>
      <el-form-item label="算法推流IP">
        <el-input v-model="form1.pushIp"></el-input>
        <div class="tip__text">流媒体服务器内网IP地址，例如：192.168.0.150</div>
      </el-form-item>
      <el-form-item label="算法推流端口">
        <el-input v-model="form1.pushPort"></el-input>
        <div class="tip__text">流媒体服务器端口，例如：554</div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmitForm('form1')"
          >提交</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  getListDataDetail,
  saveData,
} from "@/api/applicationMonitoring/systemManagement";
export default {
  props: {
    form1: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      loading: false,
      title: this.currentId ? "编辑配置" : "新增配置",
      dialogVisible: true,
      params: {
        id: this.currentId,
        name: "",
        tag: "",
        val: "",
      },
      rules: {
        name: [{ required: true, message: "请输入配置名称", trigger: "blur" }],
        tag: [{ required: true, message: "请输入配置标识", trigger: "blur" }],
        val: [{ required: true, message: "请输入配置标识", trigger: "blur" }],
      },
      tableData: [],
    };
  },
  async created() {
    if (this.currentId) {
      await this.getListDataDetail();
    }
  },
  methods: {
    onSubmitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.$emit("submitForm", "form1", this.form1);
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
