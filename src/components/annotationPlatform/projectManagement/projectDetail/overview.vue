<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card">
          <div
            slot="header"
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
            "
          >
            <span>标注情况</span>
            <el-radio-group v-model="overviewRadio" @input="getOverviewData1">
              <el-radio-button label="1">整体</el-radio-button>
              <el-radio-button label="2">我的</el-radio-button>
            </el-radio-group>
          </div>
          <el-row>
            <el-col :span="6">
              <div class="overview-item">
                <p class="count">
                  {{ annotationData.annCount || 0 }}/{{
                    annotationData.annInfoCount || 0
                  }}
                </p>
                <span class="text">已标注图片 / 标注框</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="overview-item">
                <p class="count color2">{{ annotationData.noAnnoCount }}</p>
                <span class="text">未标注图片</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="overview-item">
                <p class="count color3">{{ annotationData.backCount }}</p>
                <span class="text">待修正图片</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="overview-item">
                <p class="count">{{ annotationData.finshRatio }}%</p>
                <span class="text">已完成</span>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div
            slot="header"
            style="
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: space-between;
            "
          >
            <span>质检情况</span>
          </div>
          <el-row>
            <el-col :span="6">
              <div class="overview-item">
                <p class="count">
                  {{ inspectionData.count }}/{{
                    inspectionData.noReviewCount
                  }}
                </p>
                <span class="text">质检总数 / 未质检图片</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="overview-item">
                <p class="count color1">{{ inspectionData.reviewCount }}</p>
                <span class="text">通过</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="overview-item">
                <p class="count color2">{{ inspectionData.backCount }}</p>
                <span class="text">退回</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="overview-item">
                <p class="count">{{ inspectionData.finshRatio }}%</p>
                <span class="text">已完成</span>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column label="标签名称" prop="label"></el-table-column>
      <el-table-column label="数量" prop="annCount"></el-table-column>
      <el-table-column label="比例">
        <template slot-scope="scope">
          <el-progress :percentage="scope.row.annRatio"></el-progress>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import {
  getOverviewData1,
  getOverviewData2,
  getOverviewData3,
} from "@/api/annotationPlatform/projectManagement";
export default {
  data() {
    return {
      projectId: this.$route.query.id,
      overviewRadio: "1",
      annotationData: {},
      inspectionData: {},
      tableData: [],
    };
  },
  async created() {
    this.getOverviewData1();
    this.getOverviewData2();
    this.getOverviewData3();
  },
  methods: {
    async getOverviewData1() {
      const data = await getOverviewData1({
        projectId: this.projectId,
        type: this.overviewRadio,
      });
      this.annotationData = data.data;
    },
    async getOverviewData2() {
      const data = await getOverviewData2({
        projectId: this.projectId,
      });
      this.inspectionData = data.data;
    },
    async getOverviewData3() {
      const data = await getOverviewData3({
        projectId: this.projectId,
      });
      this.tableData = data.data;
    },
  },
};
</script>
<style scoped lang="scss">
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
    font-size: 12px;
  }
}
</style>
