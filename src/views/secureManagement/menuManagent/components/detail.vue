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
        <el-form ref="form" :model="params" :rules="rules" label-width="100px">
          <el-form-item label="菜单名称" prop="name">
            <el-input v-model="params.name"></el-input>
          </el-form-item>
          <el-form-item label="菜单Icon" prop="icon" >
            <el-input v-model="params.icon"></el-input>
          </el-form-item>
          <el-form-item label="菜单路由" prop="path" >
            <el-input v-model="params.path"></el-input>
          </el-form-item>
          <el-form-item label="菜单路径" prop="filePath" >
            <el-input v-model="params.filePath"></el-input>
          </el-form-item>
          <el-form-item label="菜单编码" prop="auth" >
            <el-input v-model="params.auth"></el-input>
          </el-form-item>
          <el-form-item label="上级菜单" prop="parentId">
            <el-select
              style="width: 100%"
              v-model="params.parentId"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in roleOptions"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单类型" prop="type">
            <el-radio-group v-model="params.type">
              <el-radio-button label="0">目录</el-radio-button>
              <el-radio-button label="1">菜单</el-radio-button>
              <el-radio-button label="2">按钮</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否显示" prop="type">
            <el-radio-group v-model="params.isHidden">
              <el-radio-button :label="0">显示</el-radio-button>
              <el-radio-button :label="1">隐藏</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closed">取消</el-button>
        <el-button type="primary" @click="saveData">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  save,listData,detail
} from "../api";
export default {
  props: {
    currentAccount: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      title: this.currentAccount ? "编辑菜单" : "新增菜单",
      dialogVisible: true,
      roleOptions: [],
      params: {
        parentId:0,
        
      },
      rules: {
        // name: [{ required: true, message: "请输入", trigger: "blur" }],
        // path: [
        //   { required: true, message: "请输入", trigger: "blur" },
        // ],
        // roleIds: [{ required: true, message: "请选择角色", trigger: "blur" }],
      },
      tableData: [],
    };
  },
  async created() {
   this.getTable()
   if(this.currentAccount){
    this.getListDataDetail()
   }
  },
  methods: {
    async getTable() {
      const data = await listData({});
      if(data.data&&data.data.length>0){
        this.roleOptions = data.data;
      }
    },
    // 获取账号详情
    async getListDataDetail() {
      const data = await detail({ id: this.currentAccount.id });
      // Object.assign(this.params,{
      //   id:data.data.id,
      //   name:data.data.name,
      //   path:data.data.path,
      //   auth:data.data.auth,
      //   parentId:data.data.parent,
      //   type:data.data.type
      // });
      this.params = data.data
      this.params.parentId = data.data.parent || 0,
      console.log(this.params)
    },
    //
    // 保存账号
    saveData() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          await save(this.params);
          this.$message.success(this.currentAccount ? "编辑成功" : "新增成功");
          this.$emit("close",true);
        } else {
          return false;
        }
      });
    },
    // 关闭回调
    closed() {
      this.$emit("close",false);
    },
  },
};
</script>
<style scoped lang="scss">
</style>
