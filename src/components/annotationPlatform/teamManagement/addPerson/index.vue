<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      title="批量生成"
      :visible.sync="dialogVisible"
      width="600px"
      @closed="closed"
    >
      <div>
        <el-form ref="form" :model="params" :rules="rules" label-width="80px">
          <el-form-item label="角色" prop="roleIds">
            <el-select
              style="width: 100%"
              v-model="params.roleIds"
              placeholder="请选择角色"
              multiple
              :multiple-limit="1"
            >
              <el-option
                v-for="(item, index) in roleOptions"
                :key="index"
                :label="item.nameCh"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账号前缀" prop="prefix">
            <el-input
              style="width: 100%"
              v-model="params.prefix"
              placeholder="请输入账号前缀"
            ></el-input>
          </el-form-item>
          <el-form-item label="数量" prop="userNum">
            <el-input-number
              style="width: 100%"
              v-model="params.userNum"
              placeholder="请输入数量"
            ></el-input-number>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveBatchPerson">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getRoleList } from "@/api/annotationPlatform/teamManagement";
import { saveBatchPerson } from "@/api/annotationPlatform/teamManagement";
export default {
  data() {
    return {
      dialogVisible: true,
      roleOptions: [],
      params: {
        teamId: this.$route.query.id,
        roleIds: [],
        prefix: "",
        userNum: 1,
      },
      rules: {
        roleIds: [{ required: true, message: "请选择角色", trigger: "blur" }],
        prefix: [{ required: true, message: "请填写账号前缀", trigger: "blur" }],
        userNum: [{ required: true, message: "请选择数量", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const data = await getRoleList();
      this.roleOptions = data.data.filter(item=>{
        return item.nameEn =='plat_adm' || item.nameEn =='ap_admin' || item.nameEn =='ap_mark' || item.nameEn =='ap_review'
      });
    },
    // 保存账号
    saveBatchPerson() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          if(this.params.roleIds.length>1){
            this.$message.error('角色只能选择一个，请修改');
            return
          }
          await saveBatchPerson(this.params);
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
