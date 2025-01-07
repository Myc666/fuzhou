<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      title="告警详情"
      :visible.sync="dialogVisible"
      width="1000px"
      top="5vh"
      @closed="closed"
    >
      <MarkResult
        :fileUrl="$common.handlePublicUrl(currentData.image)"
        :dataList="JSON.parse(currentData.params)"
      />
      <div class="name">{{ currentData.cameraName }}</div>
      <div class="name">{{ currentData.algorithmName }}</div>
      <div class="name">告警时间：{{ currentData.alarmTime }}</div>
      <span slot="footer" class="dialog-footer">
        <span v-if="currentData.wareName" style="margin-right: 20px">{{
          currentData.wareName
        }}</span>
        <span v-else>
          <el-button type="primary" @click="clickProcessed"
            >人员已处理</el-button
          >
          <el-button type="danger" @click="clickMisreport">人员误报</el-button>
        </span>

        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import MarkResult from "@/components/markResult";
import { processed, misreport } from "@/api/faceControl/faceRecognition";
export default {
  components: {
    MarkResult,
  },
  props: {
    currentData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      dialogVisible: true,
      detail: {},
      boxList: [],
    };
  },
  methods: {
    // 人员已处理
    clickProcessed() {
      this.$confirm(`确定该人员已处理吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await processed({ id: this.currentData.id });
        if (res.code == 0) {
          this.$message.success("删除成功");
          await this.getListData();
        }
      });
    },
    // 人员误报
    clickMisreport() {
      this.$confirm(`确定该人员已误报吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await misreport({ id: this.currentData.id });
        if (res.code == 0) {
          this.$message.success("删除成功");
          await this.getListData();
        }
      });
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
  padding: 5px 0;
}
</style>
