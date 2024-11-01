<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="图片预览" :visible.sync="dialogVisible" width="1200px" @closed="closed">
      <el-form label-width="80px" style="width: 600px; margin: 0 auto;">
        <el-form-item label="抽取范围">
          <div>
            <span style="margin-right: 10px">
              开始
              <el-input-number :controls="false" v-model="params.trainingBaseVo.begin" placeholder="开始"
                style="width: 100px" clearable @change="getPreview">
              </el-input-number>
            </span>
            <span style="margin-right: 10px">
              结束
              <el-input-number :controls="false" v-model="params.trainingBaseVo.end" placeholder="结束" style="width: 100px"
                clearable @change="getPreview">
              </el-input-number>
            </span>
            <span>共有图像{{ params.trainingBaseVo?.imageNum }}张</span>
          </div>
          <div style="color: #2099fa;">以最新生成的告警图像为1，选取图像创建范围。</div>
        </el-form-item>
        <el-form-item label="抽取间隔">
          <div>从每
            <el-input-number :controls="false" v-model="params.trainingBaseVo.interval" style="width: 100px" @change="getPreview"></el-input-number>
            张图片中抽取一张
          </div>
          <!-- <div style="color: #2099fa;">基于“抽取范围”得到的图像，支持设置抽取间隔进行二次筛选。</div> -->
        </el-form-item>

        <el-form-item label="抽取结果">
          共抽取图像{{ total }}张
        </el-form-item>
      </el-form>
      <el-row :gutter="20">
        <el-col :span="48" v-for="(item, index) in dataList" :key="index" class="item">
          <el-card :body-style="{ padding: '0px' }" shadow="hover">
            <AlarmCard :fileUrl="$common.handlePublicUrl(`/report/stream?id=${item.id}`)"
              :dataList="handleParams(item.params)" :alarmData="item" :ratio="1">
            </AlarmCard>
          </el-card>
        </el-col>
      </el-row>
      <div class="pagination">
        <el-pagination background :current-page="params.pageNum" :page-size="params.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="total" @current-change="handleCurrentChange"
          @size-change="handleSizeChange"></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getPreview } from "@/api/annotationPlatform/incrementalRraining";
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
      dialogVisible: true,
      params: {
        page: 1,
        limit: 10,
      },
      dataList: [],
      total: 0,
    };
  },
  created() {
    Object.assign(this.params, {
      trainingBaseVo: this.currentParams,
    });
    this.getPreview();
  },
  methods: {
    async getPreview() {
      const data = await getPreview(this.params);
      this.dataList = data.data;
      this.total = Number(data.count);
    },
    // 关闭回调
    closed() {
      this.$emit("close");
    },
    // 分页
    handleCurrentChange(val) {
      this.params.page = val;
      this.getPreview();
    },
    handleSizeChange(val) {
      this.params.limit = val;
      this.params.page = 1;
      this.getPreview();
    },
    handleParams(params) {
      try {
        return JSON.parse(params)
      } catch (err) {
        return []
      }
    },
  },
};
</script>
<style scoped lang="scss">
.item {
  margin-bottom: 20px;
}

::v-deep .el-col-48 {
  width: 20%;
}
</style>
