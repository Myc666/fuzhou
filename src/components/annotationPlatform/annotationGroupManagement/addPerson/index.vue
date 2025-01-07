<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      title="添加人员"
      :visible.sync="dialogVisible"
      width="600px"
      @closed="closed"
    >
      <div>
        <el-form ref="form" :model="params" :rules="rules" label-width="80px">
          <el-form-item label="选择人员" prop="userIds">
            <el-select v-model="params.userIds" multiple placeholder="请选择人员" style="width: 100%;">
              <el-option
                v-for="(item, index) in personOptions"
                :label="item.name"
                :value="item.id"
                :key="index"
              ></el-option>
            </el-select>
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
  getTeamPersonList,
  savePersonData,
} from "@/api/annotationPlatform/annotationGroupManagement";
export default {
  props: {
    personData: Array,
    currentSelectGroup: Object,
  },
  data() {
    return {
      loading: false,
      dialogVisible: true,
      personOptions: [],
      params: {
        userIds: [],
      },
      rules: {
        userIds: [{ required: true, message: "请选择人员", trigger: "change" }],
      },
    };
  },
  async created() {
    this.getTeamPersonList();
  },
  methods: {
    async getTeamPersonList() {
      const data = await getTeamPersonList();
      this.personOptions = data.data;
    },
    // 保存账号
    saveData() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let status = false
          this.params.userIds.forEach(ids => {
            this.personData.forEach(item => {
              if (ids == item.id) {
                status = true
              }
            });
          });
          if (status) {
            return this.$message.error('人员重复')
          }
          await savePersonData(this.params, this.currentSelectGroup.id);
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
