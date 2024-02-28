<template>
  <div>
    <div class="head-container">
      <div>
        项目状态：
        <el-tag v-if="projectDetail.status == 11">标注中</el-tag>
        <el-tag v-if="projectDetail.status == 99">已交付</el-tag>
      </div>
      <div v-if="projectDetail.status == 11">
        <el-button type="primary" @click="clickAnnotation">去标注</el-button>
        <el-button type="primary" @click="clickSubmit">交付</el-button>
      </div>
    </div>
    <div class="ai_table">
      <el-tabs v-model="active">
        <el-tab-pane label="总览" name="1">
          <Overview v-if="active == 1" />
        </el-tab-pane>
        <el-tab-pane label="数据集" name="2">
          <Dataset v-if="active == 2" />
        </el-tab-pane>
        <el-tab-pane label="文档" name="3">
          <Document v-if="active == 3" />
        </el-tab-pane>
        <el-tab-pane label="设置" name="4">
          <Setup v-if="active == 4" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import Overview from '@/components/annotationPlatform/projectManagement/projectDetail/overview';
import Dataset from '@/components/annotationPlatform/projectManagement/projectDetail/dataset';
import Document from '@/components/annotationPlatform/projectManagement/projectDetail/document';
import Setup from '@/components/annotationPlatform/projectManagement/projectDetail/setup';
import { getDetail, submitProject } from '@/api/annotationPlatform/projectManagement';
export default {
  components: {
    Overview,
    Dataset,
    Document,
    Setup
  },
  data() {
    return {
      active: '1',
      projectId: this.$route.query.id,
      projectDetail: {}
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
    clickAnnotation() {
      if (this.projectDetail.projectType == 1) {
        this.$router.push({
          path: '/annotationPlatform/projectManagement/markTool/classifyBatch',
          query: {
            id: this.projectId,
            type: 1
          }
        });
      } else {
        this.$router.push({
          path: '/annotationPlatform/projectManagement/markTool/annotate',
          query: {
            id: this.projectId,
            type: 1
          }
        });
      }
    },
    async clickSubmit() {
      await submitProject({ projectId: this.projectId });
      this.$message.success('交付成功');
    }
  }
};
</script>
<style scoped lang="scss">
.head-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.overview-item {
  text-align: center;

  .count {
    font-size: 20px;
    margin: 10px 0;

    &.color1 {
      color: #409eff;
    }

    &.color2 {
      color: #f56c6c;
    }

    &.color3 {
      color: #e6a23c;
    }
  }

  .text {
    font-size: 14px;
  }
}
</style>
