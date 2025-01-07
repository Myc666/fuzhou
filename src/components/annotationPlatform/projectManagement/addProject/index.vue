<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      title="新建项目"
      :visible.sync="dialogVisible"
      width="1200px"
      top="10vh"
      @closed="closed"
      v-loading="loading"
      element-loading-text="文件上传中，请勿关闭页面"
    >
      <el-steps :active="active" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="标签管理"></el-step>
        <el-step title="其他信息"></el-step>
        <el-step title="上传数据集"></el-step>
      </el-steps>
      <div class="step-box">
        <Step1 ref="step1" v-show="active == 0" />
        <Step2 ref="step2" v-show="active == 1" />
        <Step3 ref="step3" v-show="active == 2" />
        <Step4
          ref="step4"
          v-show="active == 3"
          @changeLoading="loading = $event"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="active == 0" @click="clickPrev">上一步</el-button>
        <el-button
          type="primary"
          @click="clickNext"
          v-text="active < 3 ? '下一步' : '保存'"
        ></el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { projectType } from "@/utils/commonData";
import { saveData } from "@/api/annotationPlatform/projectManagement";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";
export default {
  components: {
    Step1,
    Step2,
    Step3,
    Step4,
  },
  data() {
    return {
      dialogVisible: true,
      loading: false,
      active: 0,
      projectTypeOptions: projectType,
      step1Form: {
        projectName: "",
        projectType: 1,
        projectDetail: "",
      },
      step1Rules: {
        projectName: [
          { required: true, message: "请输入项目名称", trigger: "blur" },
        ],
        projectType: [
          { required: true, message: "请选择标注类型", trigger: "change" },
        ],
        projectDetail: [
          { required: true, message: "请输入项目描述", trigger: "blur" },
        ],
      },
    };
  },
  async created() {},
  methods: {
    // 上一步
    clickPrev() {
      this.active--;
    },
    // 下一步
    async clickNext() {
      let status = false;
      if (this.active == 0) {
        console.info(2222222, status);
        status = await this.$refs.step1.submit();
      }
      if (this.active == 1) {
        status = this.$refs.step2.submit();
      }
      if (this.active == 2) {
        status = this.$refs.step3.submit();
      }
      if (this.active == 3) {
        status = await this.$refs.step4.submit();
      }
      if (status) {
        if (this.active < 3) {
          this.active++;
        } else {
          const params = {
            projectName: this.$refs.step1.submitData.projectName,
            projectType: this.$refs.step1.submitData.projectType,
            projectDetail: this.$refs.step1.submitData.projectDetail,
            labels: this.$refs.step2.submitData,
            needReview: this.$refs.step3.submitData.needReview,
            reviewRatio: this.$refs.step3.submitData.reviewRatio,
            userGroupId: this.$refs.step3.submitData.userGroupId,
            algorithmIds: this.$refs.step3.submitData.algorithmIds,
            id: this.$refs.step4.submitData.id,
            dataFileId: this.$refs.step4.submitData.dataFileId,
            docFileId: this.$refs.step4.submitData.docFileId,
          };
          await saveData(params);
          this.$message.success("上传成功");
          this.dialogVisible = false
        }
      }
    },
    // 关闭回调
    closed() {
      this.$emit("close");
    },
  },
};
</script>
<style scoped lang="scss">
.step-box {
  height: 550px;
  overflow-y: auto;
}
.step1 {
  width: 600px;
  padding: 20px 0;
  margin: 0 auto;
  .demo {
    img {
      width: 100%;
      display: block;
      margin: 10px 0;
    }
    p {
      line-height: 20px;
      margin: 0;
    }
  }
}
.step2 {
  width: 600px;
  padding: 20px 0;
  margin: 0 auto;
}
</style>
