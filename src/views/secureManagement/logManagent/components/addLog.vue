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
            <el-form-item label="模块名称" prop="val">
                <el-input v-model="params.name"></el-input>
            </el-form-item>
            <el-form-item label="操作人" prop="name">
              <el-input v-model="params.name"></el-input>
            </el-form-item>
            <el-form-item label="操作人IP" prop="val">
                <el-input v-model="params.name"></el-input>
            </el-form-item>
            <el-form-item label="操作类型" prop="roleIds">
              <el-select
                style="width: 100%"
                v-model="params.roleIds"
                placeholder="请选择"
                multiple
              >
                <el-option
                  v-for="(item, index) in roleOptions"
                  :key="index"
                  :label="item.nameCh"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="日志类型" prop="val">
              <el-radio-group v-model="params.state">
                <el-radio label="0">登录日志</el-radio>
                <el-radio label="1">操作日志</el-radio>
              </el-radio-group>
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
export default {
    props: {
        currentObj: {
            type: Object,
            default: null,
        },
    },
    data() {
        return {
            loading: false,
            title: this.currentObj ? "编辑日志" : "新增日志",
            dialogVisible: true,
            roleOptions: [],
            params: {
                id: "",
                name: "",
                account: "",
                password: "",
                state: "0",
                roleIds: [],
            },
            rules: {
                name: [{ required: true, message: "请输入账号名称", trigger: "blur" }],
                roleIds: [{ required: true, message: "请选择操作类型", trigger: "blur" }],
            },
        };
    },
    async created() {
        if (this.currentObj) {//编辑
            
        }
    },
methods: {
    // 获取详情
    async getListDataDetail() {
        // const data = await getListDataDetail({ id: this.currentAccount.id });
        // Object.assign(this.params, {
        //     name: data.data.name,
        //     account: data.data.account,
        //     password: data.data.password,
        //     state: data.data.state,
        // });
    },
    //
    // 保存账号
    saveData() {
        this.$refs.form.validate(async (valid) => {
            if (valid) {
                
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
