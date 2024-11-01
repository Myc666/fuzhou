<template>
  <div class="step4">
    <el-form ref="step4Form" :model="step4Form" label-width="80px" style="width: 600px; margin: 0 auto;">

      <el-form-item label="抽取范围">
        <div>
          <span style="margin-right: 10px">
            开始
            <el-input-number :controls="false" v-model="step4Form.begin" placeholder="开始" style="width: 100px" clearable
              @change="getPreview">
            </el-input-number>
          </span>
          <span style="margin-right: 10px">
            结束
            <el-input-number :controls="false" v-model="step4Form.end" placeholder="结束" style="width: 100px" clearable
              @change="getPreview">
            </el-input-number>
          </span>
          <span>共有图像{{ step4Form.imageNum }}张</span>
        </div>
        <div style="color: #2099fa;">以最新生成的告警图像为1，选取图像创建范围。</div>
      </el-form-item>
      <el-form-item label="抽取间隔">
        <div>
          从每
          <el-input-number :controls="false" v-model="step4Form.interval" style="width: 100px"
            @change="getPreview"></el-input-number>
            张图片中抽取一张
        </div>
        <!-- <div style="color: #2099fa;">基于“抽取范围”得到的图像，支持设置抽取间隔进行二次筛选。</div> -->
      </el-form-item>
      <el-form-item label="抽取结果" prop="name">
        共抽取图像{{ total }}张
      </el-form-item>
    </el-form>
    <div class="dataList">
      <el-row :gutter="20">
        <el-col :span="48" v-for="(item, index) in dataList" :key="index" class="item">
          <el-card :body-style="{ padding: '0px' }" shadow="hover">
            <AlarmCard :fileUrl="$common.handlePublicUrl(`/report/stream?id=${item.id}`)"
              :dataList="handleParams(item.params)" :alarmData="item">
            </AlarmCard>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import {
  getPreview,
} from "@/api/annotationPlatform/incrementalRraining";
import AlarmCard from "@/components/applicationMonitoring/alarmManagement/alarmCard";
export default {
  components: {
    AlarmCard,
  },
  props: {
    currentParams: {
      type: Object,
      default: () => { },
    },
  },
  data() {
    return {
      step4Form: {
        interval: "",
        begin: "",
        end: "",
      },
      submitData: {},
      dataList: [],
      total: 0,
    };
  },
  async created() {
    Object.assign(this.step4Form, this.currentParams);
    this.getPreview();
  },
  mounted() { },
  methods: {
    async getPreview() {
      const params = {
        page: 1,
        limit: 99999,
        ...this.step4Form,
      };
      const data = await getPreview({ trainingBaseVo: params });
      this.dataList = data.data;
      this.total = Number(data.count);
    },
    handleParams(params) {
      try {
        return JSON.parse(params);
      } catch (err) {
        return [];
      }
    },
    async submit() {
      this.submitData = this.step4Form;
      return true;
    },
  },
};
</script>
<style scoped lang="scss">
.step4 {
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

.dataList {
  height: 320px;
  overflow-x: hidden;
  overflow-y: auto;
}

.item {
  margin-bottom: 20px;
}

::v-deep .el-col-48 {
  width: 20%;
}
</style>
