<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      title="导出报告"
      :visible.sync="dialogVisible"
      width="600px"
      @closed="closed"
    >
      <el-form label-width="120px">
        <el-form-item label="摄像头">
          <el-select
            placeholder="摄像头"
            clearable
            v-model="params.cameraId"
            class="head-container-input"
          >
            <el-option
              v-for="(item, index) in cameraOptions"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="算法">
          <el-select
            placeholder="算法"
            clearable
            v-model="params.algorithmId"
            class="head-container-input"
          >
            <el-option
              v-for="(item, index) in algorithmOptions"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="params.startText"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="params.endText"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-radio-group v-model="params.auditState">
            <el-radio-button label="0">全部</el-radio-button>
            <el-radio-button label="1">已审核</el-radio-button>
            <el-radio-button label="2">待审核</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item><span style="color: red;">导出数据请根据条件进行控制，因为需要把图片复制到指定目录才能打包，所以要考虑硬盘是否有充足的空间</span></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="exportData">导出</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getCameraListData,
  getAlgorithmListData,
  exportData,
} from "@/api/applicationMonitoring/incrementalRraining";
export default {
  data() {
    return {
      dialogVisible: true,
      cameraOptions: [],
      algorithmOptions: [],
      params: {
        cameraId: "",
        algorithmId: "",
        startText: "",
        endText: "",
        auditState: 0,
      },
    };
  },
  created() {
    this.getOptions();
  },
  methods: {
    // 获取下拉
    async getOptions() {
      const data1 = await getCameraListData();
      this.cameraOptions = data1.data;
      const data2 = await getAlgorithmListData();
      this.algorithmOptions = data2.data;
    },
    async exportData() {
      await exportData(this.params)
      this.$message.success('导出成功')
      this.dialogVisible = false
    },
    // 关闭回调
    closed() {
      this.$emit("close");
    },
  },
};
</script>
<style scoped lang="scss">
.image {
  width: 100%;
  height: auto;
  display: block;
}
.name {
  padding: 20px 0;
}
</style>
