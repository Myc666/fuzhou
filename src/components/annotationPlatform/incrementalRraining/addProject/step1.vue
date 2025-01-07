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
          @blur="nameBlur"
        ></el-input>
      </el-form-item>
      <el-form-item label="标注类型" prop="projectType">
        <el-radio-group v-model="step1Form.projectType">
          <el-radio-button
            :label="item.value"
            v-for="(item, index) in projectTypeOptions"
            :key="index"
            :disabled="item.value!=4"
            >{{ item.name }}</el-radio-button
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <div class="demo">
          <p>对图片中的所有物体（人、车等），进行自定义属性标注。</p>
          <img src="@/assets/images/projectManagement/demo.png" />
          <p>定义：框定图片中的对象并打标签。</p>
          <p>操作：拉框定位对象的位置，并给对象标注相应的类别和属性。</p>
        </div>
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
    </el-form>
  </div>
</template>
<script>
import { projectType } from "@/utils/commonData";
import {checkName} from "@/api/annotationPlatform/projectManagement.js"
export default {
  data() {
    return {
      projectTypeOptions: projectType,
      step1Form: {
        projectName: "BZ"+this.$moment(new Date()).format("YYYYMMDDHHmmssSSS"),
        projectType: 4,
        projectDetail: "",
      },
      step1Rules: {
        projectName: [
          { required: true, message: "请输入项目名称", trigger: "blur" },
        ],
        projectType: [
          { required: true, message: "请选择标注类型", trigger: "change" },
        ],
      },
      submitData: {},
      isRepeat:false
    };
  },
  async created() {
  },
  methods: {
    async nameBlur(){
      const res = await checkName({projectName:this.step1Form.projectName})
      if(!res.data){
        this.isRepeat = true;
        this.$message.error('项目名称不能重复')
      }
    },
    async submit() {
      try {
        if(!this.isRepeat){
          const res = await checkName({projectName:this.step1Form.projectName})
          if(!res.data){
            this.isRepeat = true;
            this.$message.error('项目名称不能重复')
            return false;
          }
          await this.$refs.step1Form.validate();
          this.submitData = this.step1Form;
          return true;
        }else{
          this.$message.error('项目名称不能重复')
        }
      } catch (error) {
        this.$message.error('信息不完善')
        return false;
      }
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
