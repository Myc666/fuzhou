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
          <el-form ref="form" :model="params" :rules="rules" label-width="110px">
            <el-form-item label="人员名称" prop="name">
                <el-input v-model="params.name" :disabled="!rolesData"></el-input>
            </el-form-item>
            <el-form-item label="账号" prop="account">
              <el-input v-model="params.account" :disabled="!rolesData"></el-input>
            </el-form-item>
            <el-form-item  label="密码" prop="password" v-if="!currentId || rolesData">
                <el-input v-model="params.password"></el-input>
            </el-form-item>
            <el-form-item v-if="rolesData" label="是否有效" prop="state">
              <el-radio-group v-model="params.state">
                <el-radio :label="0">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="rolesData" label="归属组织机构" prop="departId">
              <div class="depart" @click="getDepart">{{ departObj?.name }}</div>
            </el-form-item>
            <el-form-item v-if="secret_adm" label="归属角色" prop="roleIds">
              <el-select
                style="width: 100%"
                v-model="params.roleIds"
                placeholder="请选择"
                multiple
                clearable
              >
                <el-option
                  v-for="(item, index) in roleOptions"
                  :key="index"
                  :label="item.nameCh"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="secret_adm" label="岗位名称" prop="jobName">
                <el-input v-model="params.jobName"></el-input>
            </el-form-item>
            <el-form-item v-if="secret_adm" label="人员密级" prop="passTemplateId">
              <el-select
                style="width: 100%"
                v-model="params.passTemplateId"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="(item, index) in passTemplateList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
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

      <!-- 部门树 -->
      <TreeInfo v-if="departVisible" :treeData="treeData" :checkedKeys="checkedKeys" :departObj="departObj"  @close="closeHandle"/>
    </div>
  </template>
<script>
import { listData } from "../../roleManagent/api"
import { templateList } from "../../passwordTemplate/api"
import { listTree } from "../../organizationalStructure/api"
import { saveData,detailData,updateData } from "../api"
import TreeInfo from "./treeInfo.vue";
export default {
  components:{
    TreeInfo,
  },
  props: {
    currentId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
        loading: false,
        title: this.currentId ? "编辑用户" : "新增用户",
        dialogVisible: true,
        roleOptions: [],
        passTemplateList:[],
        departObj:null,
        checkedKeys:[],
        params: {
          name: "",
          account: "",
          password: "",
          state: null,
          departId: "",
          roleIds: [],
          jobName:'',
          passTemplateId:'',
        },
        rules: {
          name: [{ required: true, message: "请输入人员名称", trigger: "blur" }],
          account: [{ required: true, message: "请输入账号", trigger: "blur" }],
          password: [{ required: true, message: "请输入密码", trigger: "blur" }],
          state: [{ required: true, message: "请选择状态", trigger: "change" }],
          departId: [{ required: true, message: "请选择组织机构", trigger: "change" }],
          roleIds: [{ required: true, message: "请选择角色", trigger: "change" }],
          jobName: [{ required: true, message: "请输入昂贵为名称", trigger: "blur" }],
          passTemplateId: [{ required: true, message: "请选择密码模板", trigger: "blur" }],
        },
        departVisible:false,
        treeData:[],
    };
  },
  async created() {
    await this.getRole();
    await this.getTemplate();
    await this.getTree();
    if (this.currentId) {//编辑
      this.getDetail();
    }
  },
  computed:{
    rolesData:()=>{
      let role =  localStorage.getItem('rolesData').split(',')
      return (role.includes('admin') || role.includes('sys_user'))
    },
    secret_adm:()=>{
      let role =  localStorage.getItem('rolesData').split(',')
      return role.includes('secret_adm') 
    }
  },
  methods: {
    // 获取角色
    async getRole(){
      const res = await listData();
      this.roleOptions = res.data;
    },
    // 获取密码模板
    async getTemplate(){
      const res = await templateList();
      this.passTemplateList = res.data
    },
    // 获取部门树
    async getTree(){
        const res = await listTree();
        this.treeData = res.data;
    },
    // 获取详情
    async getDetail() {
        const res = await detailData({ id: this.currentId });
        let arr = [];
        if(res.data.roles&&res.data.roles.length>0){
          res.data.roles.forEach((item=>{
            arr.push(item.id)
          }))
        }
        Object.assign(this.params, {
          id:res.data.id,
          name: res.data.name,
          account: res.data.account,
          password: res.data.password,
          state: res.data.state,
          departId: res.data.departId,
          roleIds: arr,
          jobName:res.data.jobName,
          passTemplateId:res.data.passTemplateId,
        });
        if(res.data.departId){
          this.checkedKeys.push(res.data.departId);
          this.getDepartInfo(this.treeData)
        }
    },
    // 通过部门id获取部门信息
    getDepartInfo(tree){
      tree.forEach(item=>{
        if(this.params.departId == item.id){
          this.departObj = item;
        }
        if (item.children&&item.children.length) {
          this.getDepartInfo(item.children);
        }
      })
    },
    // 选择部门
    getDepart(){
      this.checkedKeys = [];
      if(this.departObj){
        this.checkedKeys.push(this.departObj.id)
      }
      this.departVisible = true;
    },
    //部门树关闭
    closeHandle(item){
      if(item){
        this.departObj = item;
        this.params.departId = item.id;
      }
      this.departVisible = false;
      this.getTree();
    },
    // 保存账号
    saveData() {
        this.$refs.form.validate(async (valid) => {
            if (valid) {
              if(this.currentId){
                const res = await updateData(this.params);
              }else{
                const res = await saveData(this.params);
              }
              this.$message.success("保存成功")
              this.$emit("close");
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
.depart{
  width: 100%;
  height: 32px;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  cursor: pointer;
  padding: 0px 10px;
}
</style>
