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
            <el-form-item label="模板编码" prop="code">
                <el-input v-model="params.code"></el-input>
            </el-form-item>
            <el-form-item label="模板名称" prop="name">
              <el-input v-model="params.name"></el-input>
            </el-form-item>
            <el-form-item label="配置密码项" prop="rules">
              <el-table
                :data="rulesList"
                border
                height="360"
              >
                <el-table-column label="密码项" prop="remark" align="center">
                 
                </el-table-column>
                <el-table-column label="密码项值" prop="itemVal" align="center">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.itemVal"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="是否勾选" align="center">
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.isCheck" @change="changeFun"></el-checkbox>
                  </template>
                </el-table-column>
              </el-table>
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
import { listData,saveTemplate,detailTemplate } from "../api"
export default {
  props: {
    currentId: {
      type: String,
      default: null,
    },
  },
  data() {
      return {
          loading: false,
          title: this.currentId ? "编辑模板" : "新增模板",
          dialogVisible: true,
          rulesList: [],
          params: {
            code: "",
            name: "",
            rules: [],
          },
          rules: {
            code: [{ required: true, message: "请输入模板编码", trigger: "blur" }],
            name: [{ required: true, message: "请输入模板名称", trigger: "blur" }],
            rules: [{ required: true, message: "请选择密码项", trigger: "blur" }],
          },
      };
  },
  async created() {
    await this.getList()
    if (this.currentId) {//编辑
        await this.getDetail();
    }
  },
  methods: {
    // 获取密码项
    async getList(){
      const res = await listData({id:this.currentId?this.currentId:null});
      if(res.data&&res.data.length>0){
        res.data.forEach(item=>{
          item.isCheck = item.state==0?true:false;
        })
        this.rulesList = res.data;
      }
    },
    // 获取详情
    async getDetail() {
      const data = await detailTemplate({ id: this.currentId });
      Object.assign(this.params, {
          id: data.data.id,
          name: data.data.name,
          code: data.data.code,
          rules:[]
      });
      this.changeFun();
    },
    //勾选
    changeFun(){
      console.log(this.rulesList)
      let newArr = [];
      this.rulesList.forEach(item=>{
        newArr.push({
          itemId:item.id,
          code:item.code,
          state:item.isCheck?0:1,
          itemVal:item.itemVal
        })
      })
      this.params.rules = newArr;
    },
    // 保存账号
    saveData() {
      this.$refs.form.validate(async (valid) => {
          if (valid) {
            saveTemplate(this.params).then(res=>{
              this.$message.success("保存成功")
              this.$emit("close");
            })
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
