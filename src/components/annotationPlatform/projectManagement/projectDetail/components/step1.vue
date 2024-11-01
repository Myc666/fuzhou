<template>
  <div class="step1">
    <el-form
      ref="step1Form"
      :model="step1Form"
      :rules="step1Rules"
      label-width="80px"
    >
      <el-form-item label="项目名称" prop="projectName">
        <el-input
          v-model.trim="step1Form.projectName"
          placeholder="请输入项目名称"
          maxlength="64"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="项目描述" prop="projectDetail">
        <el-input
          v-model="step1Form.projectDetail"
          type="textarea"
          placeholder="请输入项目描述"
          maxlength="256"
          show-word-limit
          :rows="4"
        ></el-input>
      </el-form-item>
      <el-form-item label="标注示例">
        <el-upload
          action=""
          :http-request="handleUploadDemo"
          :show-file-list="false"
          accept=".doc,.docx"
          style="display: inline"
        >
          <el-button type="primary" icon="el-icon-plus">上传示例</el-button>
        </el-upload>
        {{ step1Form.demoFile }}
      </el-form-item>
      <el-form-item>
        <div class="demo">
          <p>1. 仅支持word格式文件上传</p>
          <p>2. 若不上传，默认使用当前项目分组下已有示例</p>
          <p>3. 新上传的标注示例会替换旧的标注示例</p>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="projectDetail.status == 99" @click="updateData">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  uploadDemo,
} from "@/api/annotationPlatform/projectManagement";
export default {
  props: {
    projectDetail: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      step1Form: {},
      step1Rules: {
        projectName: [
          { required: true, message: "请输入项目名称", trigger: "blur" },
        ],
      },
      submitData: {},
    };
  },
  watch: {
    projectDetail: {
      immediate: true,
      deep: true,
      handler(val) {
        this.step1Form = val;
      },
    },
  },
  async created() {},
  methods: {
    async handleUploadDemo(files) {
      console.info(files)
      const file = files.file;
      let form = new FormData();
      form.append("file", file);
      form.append("projectId", this.step1Form.id);
      form.append("fileType", 3);
      await uploadDemo(form);
      this.$set(this.step1Form,'demoFile',file.name)
      this.$message.success("上传成功");
    },
    updateData() {
      delete this.step1Form.docFileId
      delete this.step1Form.docPath
      this.$emit('updateData',this.step1Form)
    },
  },
};
</script>
<style scoped lang="scss">
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
</style>
