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
            <el-form-item v-if="rolesData" label="角色编码" prop="nameEn">
                <el-input v-model="params.nameEn"></el-input>
            </el-form-item>
            <el-form-item v-if="rolesData" label="角色名称" prop="nameCh">
              <el-input v-model="params.nameCh"></el-input>
            </el-form-item>
            <el-form-item v-if="secret_adm" label="关联菜单" prop="menusIds">
              <el-tree
              ref="tree"
                :data="menuOptions"
                show-checkbox
                node-key="id"
                :default-checked-keys="checkedKeys"
                @check="handleNodeClick"
                :props="defaultProps">
              </el-tree>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveFun">提交</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
<script>
import { saveData,detailData } from "../api"
import { listData } from "../../menuManagent/api"
export default {
  props: {
    currentId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      checkedKeys:[],//默认选中的id
      loading: false,
      title: this.currentId ? "编辑角色" : "新增角色",
      defaultProps:{
        children: 'children',
        label: 'name'
      },
      dialogVisible: true,
      menuOptions: [],
      params: {
        nameEn: "",
        nameCh: "",
        menusIds: [],
      },
      rules: {
        nameEn: [{ required: true, message: "请输入角色编码", trigger: "blur" }],
        nameCh: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        roleIds: [{ required: true, message: "请选择关联菜单", trigger: "change" }],
      },
    };
  },
  async created() {
    this.getMenuList();
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
    // 获取菜单列表
    async getMenuList(){
      const res = await listData({id:this.currentId?this.currentId:null});
      if(res.data&&res.data.length>0){
        this.menuOptions = res.data;
        if(this.currentId){
          this.checkedKeys=[];
          this.getCheck(res.data);
        }
      }
    },
    // 数据回显
    getCheck(tree){
      tree.forEach((item) => {
        if(item.checked){
          this.checkedKeys.push(item.id);
          this.params.menusIds.push(item.id)
        }
        let isChecked = false;
        if (item.children&&item.children.length) {
          item.children.forEach(items=>{
            if(!items.checked){
              this.checkedKeys = this.checkedKeys.filter(i=>{
                console.log()
                return i != item.id
              })
            }
          })
          this.getCheck(item.children);
        }
      })
    },
    // 获取详情
    getDetail() {
      detailData({id:this.currentId}).then(res=>{
        Object.assign(this.params, {
          id: res.data.id,
          nameEn: res.data.nameEn,
          nameCh: res.data.nameCh
        });
      })
    },
    handleNodeClick(data, node, self) {
      let checkedKeys = this.$refs.tree.getCheckedKeys();
      let halfCheckedKeys  = this.$refs.tree.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      this.params.menusIds = checkedKeys;
    },
    // 保存
    saveFun() {
      this.$refs.form.validate(async (valid) => {
          if (valid) {
            const res = await saveData(this.params);
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
</style>
