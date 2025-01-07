<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      title="新增手机号码"
      :visible.sync="dialogVisible"
      width="400px"
      @closed="closed"
    >
      <div>
        <el-form label-width="80px">
          <el-form-item label="手机号码" prop="name">
            <el-input v-model="params.phone"></el-input>
          </el-form-item>
        </el-form>
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
  saveData,
} from "@/api/applicationMonitoring/messageManagement";
export default {
  data() {
    return {
      loading: false,
      dialogVisible: true,
      params: {
        phone: ''
      }
    };
  },
  created() {},
  methods: {
    async saveData() {
      const data = await saveData(this.params)
      this.$message.success('添加成功')
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
</style>
