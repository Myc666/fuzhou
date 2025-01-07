<template>
  <div>
    <el-tabs v-model="active" tab-position="left">
      <el-tab-pane label="基本信息" name="1">
        <Step1
          :projectDetail="projectDetail"
          @updateData="updateData"
          v-if="active == 1"
        />
      </el-tab-pane>
      <el-tab-pane label="标签设置" name="2">
        <Step2
          :projectDetail="projectDetail"
          @updateData="updateData"
          v-if="active == 2"
        />
      </el-tab-pane>
      <el-tab-pane label="人员设置" name="3">
        <Step3
          :projectDetail="projectDetail"
          @updateData="updateData"
          v-if="active == 3"
        />
      </el-tab-pane>
      <el-tab-pane label="交互设置" name="4">
        <Step4
          :projectDetail="projectDetail"
          @updateData="updateData"
          v-if="active == 4"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Step1 from "@/components/annotationPlatform/projectManagement/projectDetail/components/step1";
import Step2 from "@/components/annotationPlatform/projectManagement/projectDetail/components/step2";
import Step3 from "@/components/annotationPlatform/projectManagement/projectDetail/components/step3";
import Step4 from "@/components/annotationPlatform/projectManagement/projectDetail/components/step4";
import {
  getDetail,
  updateData,
} from "@/api/annotationPlatform/projectManagement";
export default {
  components: {
    Step1,
    Step2,
    Step3,
    Step4,
  },
  data() {
    return {
      projectId: this.$route.query.id,
      active: "1",
      projectDetail: {},
    };
  },
  async created() {
    this.getDetail();
  },
  methods: {
    async getDetail() {
      const data = await getDetail({ id: this.projectId });
      this.projectDetail = data.data;
    },
    async updateData(obj) {
      const params = obj;
      await updateData(params);
      this.$message.success("保存成功");
      this.getDetail();
    },
  },
};
</script>
<style scoped lang="scss">
</style>
