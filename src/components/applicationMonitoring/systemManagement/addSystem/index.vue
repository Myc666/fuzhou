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
          <el-form-item label="配置名称" prop="name">
            <el-input v-model="params.name"></el-input>
          </el-form-item>
          <el-form-item label="配置标识" prop="tag">
            <el-input v-model="params.tag"></el-input>
          </el-form-item>
          <el-form-item label="配置值" prop="val">
            <el-input v-model="params.val"></el-input>
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
  getListDataDetail,
  saveData,
} from "@/api/applicationMonitoring/systemManagement";
export default {
  props: {
    currentId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading: false,
      title: this.currentId ? "编辑配置" : "新增配置",
      dialogVisible: true,
      params: {
        id: this.currentId,
        name: "",
        tag: "",
        val: "",
      },
      rules: {
        name: [{ required: true, message: "请输入配置名称", trigger: "blur" }],
        tag: [
          { required: true, message: "请输入配置标识", trigger: "blur" },
        ],
        val: [
          { required: true, message: "请输入配置标识", trigger: "blur" },
        ],
      },
      tableData: [],
    };
  },
  async created() {
    if (this.currentId) {
      await this.getListDataDetail();
    }
  },
  methods: {
    // 获取配置详情
    async getListDataDetail() {
      const data = await getListDataDetail({ id: this.currentId });
      Object.assign(this.params, {
        name: data.data.name,
        tag: data.data.tag,
        val: data.data.val,
      });
    },
    //
    // 保存配置
    saveData() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          await saveData(this.params);
          this.$message.success(this.currentId ? "编辑成功" : "新增成功");
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
