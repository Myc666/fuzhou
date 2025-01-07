<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      title="新增团队"
      :visible.sync="dialogVisible"
      width="600px"
      @closed="closed"
    >
      <div>
        <el-form ref="form" :model="params" :rules="rules" label-width="80px">
          <el-form-item label="团队名称" prop="name">
            <el-input v-model="params.name"></el-input>
          </el-form-item>
          <el-form-item label="团队描述" prop="description">
            <el-input
              v-model="params.description"
              type="textarea"
              placeholder="请输入团队描述"
              :rows="4"
            ></el-input>
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
import { saveData } from "@/api/annotationPlatform/teamManagement";
export default {
  data() {
    return {
      loading: false,
      dialogVisible: true,
      params: {
        name: "",
        description: "",
      },
      rules: {
        name: [{ required: true, message: "请输入团队名称", trigger: "blur" }],
      },
    };
  },
  methods: {
    //
    // 保存账号
    saveData() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          await saveData(this.params);
          this.$message.success("新增成功");
          this.dialogVisible = false;
        } else {
          return false;
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
</style>
