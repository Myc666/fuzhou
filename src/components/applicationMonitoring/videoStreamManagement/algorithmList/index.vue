<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      title="统计配置"
      :visible.sync="dialogVisible"
      width="600px"
      @closed="closed"
    >
      <div>
        <div style="padding-bottom: 20px;">最多支持勾选8个</div>
        <el-checkbox-group v-model="checkList" :max="8">
          <el-checkbox
            :label="item.id"
            v-for="(item, index) in algorithmsList"
            :key="index"
            >{{ item.name }}</el-checkbox
          >
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveData">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAllAlgorithms,
  saveAlgorithms,
} from "@/api/applicationMonitoring/videoStreamManagement";
export default {
  data() {
    return {
      dialogVisible: true,
      algorithmsList: [],
      checkList: [],
    };
  },
  async created() {
    this.getAllAlgorithms();
  },
  methods: {
    // 获取算法列表
    async getAllAlgorithms() {
      const data = await getAllAlgorithms();
      this.algorithmsList = data.data;
      this.algorithmsList.forEach((item) => {
        if (item.staticsFlag) {
          this.checkList.push(item.id);
        }
      });
    },
    // 保存数据
    async saveData() {
      const data = await saveAlgorithms(this.checkList);
      this.$message.success('配置成功')
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
</style>
