<template>
  <div class="step4">
    <el-form
      ref="step4Form"
      :model="step4Form"
      :rules="step4Rules"
      label-width="80px"
    >
      <!-- <el-form-item label="导入标注">
        <el-radio-group v-model="step4Form.importAnnotation">
          <el-radio-button label="1">包含标注信息</el-radio-button>
          <el-radio-button label="2">不包含标注信息</el-radio-button>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item label="上传文件" prop="dataFile">
        <el-upload
          action=""
          :http-request="handleUploadFile"
          :show-file-list="false"
          accept=".zip"
          style="display: inline"
        >
          <el-button type="primary" icon="el-icon-plus">上传文件</el-button>
        </el-upload>
        {{ step4Form.dataFile }}
      </el-form-item>

      <el-form-item>
        <div class="demo">
          <p>1. 仅支持zip格式压缩包文件上传</p>
          <p>
            2. 压缩包内图片格式要求为： 图片格式为 * .jpg、 * .jpeg、 * .png、 *
            .bmp框定位对象的位置
          </p>
          <p>
            3.【图片分类/目标检测】已标注过的数据集都支持图片＋CoCo/VOC/json/xml格式
          </p>
          <p>
            4.压缩包文件内图片文件需放入images文件夹内，标注文件需放入annotations文件夹内
          </p>
        </div>
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
        {{ step4Form.demoFile }}
      </el-form-item>
      <el-form-item>
        <div class="demo">
          <p>1. 仅支持word格式文件上传</p>
          <p>2. 若不上传，默认使用当前项目分组下已有示例</p>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  getNextId,
  uploadDataset,
  uploadDemo,
} from "@/api/annotationPlatform/projectManagement";
export default {
  data() {
    return {
      step4Form: {
        id: "",
        importAnnotation: 1,
        dataFile: "",
        demoFile: "",
        dataFileId: '',
        docFileId: '',
      },
      step4Rules: {
        dataFile: [
          { required: true, message: "请上传文件", trigger: "change" },
        ],
      },
      submitData: {},
    };
  },
  async created() {},
  mounted() {},
  methods: {
    async handleUploadFile(files) {
      this.$emit("changeLoading", true);
      const file = files.file;
      if (!this.step4Form.id) {
        const data = await getNextId();
        this.step4Form.id = data.data;
      }
      const chunkList = [];
      const chunkSize = 5 * 1024 * 1024;
      const chunkCount = Math.ceil(file.size / chunkSize);
      let current = 0;
      let fileName = file.name;
      while (current < chunkCount) {
        chunkList.push({
          chunk: file.slice(current * chunkSize, (current + 1) * chunkSize),
          index: current,
        });
        current++;
      }
      for (let i = 0; i < chunkList.length; i++) {
        const item = chunkList[i];
        let a = new window.File(
          [item.chunk],
          `${file.name}_${item.index}.tmp`,
          { type: "application/x-zip-compressed" }
        );
        let form = new FormData();
        form.append("file", a);
        form.append("projectId", this.step4Form.id);
        form.append("end", item.index == chunkCount - 1 ? 1 : 0);
        const data = await uploadDataset(form);
        this.step4Form.dataFileId = data.data
      }
      this.$emit("changeLoading", false);
      this.step4Form.dataFile = fileName;
      console.info(this.step4Form);
      this.$message.success("上传成功");
    },
    async handleUploadDemo(files) {
      this.$emit("changeLoading", true);
      const file = files.file;
      if (!this.step4Form.id) {
        const data = await getNextId();
        this.step4Form.id = data.data;
      }
      let form = new FormData();
      form.append("file", file);
      form.append("projectId", this.step4Form.id);
      form.append("fileType", 3);
      const data = await uploadDemo(form);
      this.$emit("changeLoading", false);
      this.step4Form.demoFile = file.name;
      this.step4Form.docFileId = data.data;
      this.$message.success("上传成功");
    },
    async submit() {
      try {
        await this.$refs.step4Form.validate();
        this.submitData = this.step4Form;
        return true;
      } catch (error) {
        this.$message.error("信息不完善");
        return false;
      }
    },
  },
};
</script>
<style scoped lang="scss">
.step4 {
  width: 700px;
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
      &.first {
        margin-top: 20px;
      }
    }
  }
}
</style>
