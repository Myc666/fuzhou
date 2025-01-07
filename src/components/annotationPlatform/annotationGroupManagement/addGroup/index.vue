<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="dialogVisible"
      width="600px"
      @closed="closed"
    >
      <div>
        <el-form ref="form" :model="params" :rules="rules" label-width="80px">
          <el-form-item label="分组名称" prop="name">
            <el-input v-model="params.name"></el-input>
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
  updateData,
} from "@/api/annotationPlatform/annotationGroupManagement";
export default {
  props: {
    currentEditGroup: Object,
  },
  data() {
    return {
      loading: false,
      title: this.currentEditGroup ? "编辑分组" : "新增分组",
      dialogVisible: true,
      params: {
        name: "",
      },
      rules: {
        name: [{ required: true, message: "请输入分组名称", trigger: "blur" }],
      },
    };
  },
  async created() {
    Object.assign(this.params, this.currentEditGroup);
  },
  methods: {
    //
    // 保存账号
    saveData() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          if (this.currentEditGroup) {
            await updateData(this.params);
          } else {
            await saveData(this.params);
          }

          this.$message.success(this.currentEditGroup ? "编辑成功" : "新增成功");
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
