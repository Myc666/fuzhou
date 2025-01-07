<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      title="清除数据"
      :visible.sync="dialogVisible"
      width="1200px"
      top="10vh"
      @closed="closed"
    >
      <div>
        <el-form ref="form" :model="params" label-width="80px">
          <el-form-item label="抽取频率">
            <el-input-number
              :controls="false"
              v-model="params.trainingBaseVo.interval"
              style="width: 100px"
              @change="getPreview"
            ></el-input-number>
            秒
          </el-form-item>
          <el-form-item label="抽取范围">
            <span style="margin-right: 10px">
              开始
              <el-input-number
                :controls="false"
                v-model="params.trainingBaseVo.begin"
                placeholder="开始"
                style="width: 100px"
                clearable
                @change="getPreview"
              >
              </el-input-number>
            </span>
            <span style="margin-right: 10px">
              结束
              <el-input-number
                :controls="false"
                v-model="params.trainingBaseVo.end"
                placeholder="结束"
                style="width: 100px"
                clearable
                @change="getPreview"
              >
              </el-input-number>
            </span>
          </el-form-item>
          <el-form-item label="抽取数量" prop="name">
            {{ total }}
          </el-form-item>
        </el-form>
        <div class="dataList">
          <el-row :gutter="20">
          <el-col
            :span="48"
            v-for="(item, index) in dataList"
            :key="index"
            class="item"
          >
            <el-card :body-style="{ padding: '0px' }" shadow="hover">
              <AlarmCard
                :fileUrl="
                  $common.handlePublicUrl(`/report/stream?id=${item.id}`)
                "
                :dataList="handleParams(item.params)"
                :alarmData="item"
              >
              </AlarmCard>
            </el-card>
          </el-col>
        </el-row>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="deleteImg">删除</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getPreview,
  deleteImg,
} from "@/api/annotationPlatform/incrementalRraining";
import AlarmCard from "@/components/applicationMonitoring/alarmManagement/alarmCard";
export default {
  components: {
    AlarmCard,
  },
  props: {
    currentParams: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      dialogVisible: true,
      params: {},
      dataList: [],
      total: 0,
    };
  },
  async created() {
    Object.assign(this.params, {
      trainingBaseVo: this.currentParams,
    });
    this.getPreview();
  },
  methods: {
    async deleteImg() {
      const data = await deleteImg(this.params);
      this.$message.success("删除成功");
      this.closed()
    },
    async getPreview() {
      const params = {
        page: 1,
        limit: 99999,
        ...this.currentParams,
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
    // 关闭回调
    closed() {
      this.$emit("close");
    },
  },
};
</script>
<style scoped lang="scss">
.dataList {
  height: 400px;
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
