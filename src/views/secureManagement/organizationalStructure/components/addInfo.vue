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
            <el-form-item label="部门名称" prop="name">
                <el-input v-model="params.name"></el-input>
            </el-form-item>
            <el-form-item label="上级部门">
              <el-cascader v-model="parentId" :options="options" :props="{ value: 'id', label: 'name',checkStrictly: true}" clearable :show-all-levels="false"></el-cascader>
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
import { listTree,saveData,detailData } from "../api"
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
      title: this.currentObj ? "编辑部门" : "新增部门",
      dialogVisible: true,
      options: [],
      parentId:[],
      params: {
        name: "",
        parentId: 0,
      },
      rules: {
        name: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
      },
    };
  },
  async created() {
    this.getTree();
    if (this.currentObj) {//编辑
      this.getDetail();
    }
  },
  methods: {
    // 获取部门树
    getTree(){
        listTree().then(res=>{
            if(res.data&&res.data.length>0){
                this.options = this.getData(res.data);
                if(this.currentObj){
                  this.getList(res.data);
                }
            }
        })
    },
    getData(data) {
        data.forEach(item=>{
            if(item.children.length < 1){
                item.children = undefined;
            }else{
                this.getData(item.children);
            }
        })
        return data;
    },
    // 上级部门回显
    getList(tree){
      let _this = this;
      let retData = [];

      recursionData(tree, 0)

      // 递归函数
      async function recursionData(arr, level) {
        for (let i = 0; i < arr.length; i++) {
          retData[level] = arr[i].id;

          if(arr[i].id === _this.currentObj.parentId){
            _this.parentId = retData;
            return false
          }

          if(arr[i].children && arr[i].children.length > 0){
            await recursionData(arr[i].children, level += 1);
          }
        }
      }
    },
    // 获取详情
    getDetail() {
        detailData({id:this.currentObj.id}).then(res=>{
            Object.assign(this.params, {
                id: res.data.id,
                name: res.data.name,
                parentId: res.data.parentId,
            });
            this.getList(this.options);
        })
    },
    // 保存
    saveFun() {
      this.$refs.form.validate(async (valid) => {
          if (valid) {
            if(this.parentId&&this.parentId.length>0){
                let len = this.parentId.length-1
                this.params.parentId = this.parentId[len]
            }else{
              this.params.parentId = 0
            }
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
