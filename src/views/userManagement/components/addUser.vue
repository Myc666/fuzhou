<template>
    <div class="user-add-cont">
        <el-form ref="form" :model="params" :rules="rules" label-width="100px">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="params.name"></el-input>
            </el-form-item>
            <el-form-item label="所属组织" prop="departId">
                <el-cascader
                    v-model="params.departId"
                    :options="depList"
                    :props="{ value: 'deptCode', label: 'deptName',checkStrictly: true }"
                    :show-all-levels="false"
                    clearable>
                </el-cascader>
            </el-form-item>
            <el-form-item label="所属角色" prop="roleIds">
              <el-select
                style="width: 100%"
                v-model="params.roleIds"
                placeholder="请选择"
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
            <el-form-item label="启用状态" prop="state">
              <el-radio-group v-model="params.state">
                <el-radio :label="0">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div style="text-align: right;">
            <el-button type="primary" @click="saveData">保存</el-button>
            <el-button @click="cancelFun">取消</el-button>
          </div>
    </div>
</template>
<script>
import { listData } from "../../applicationMonitoring/systemManage/roleManagement/api"
import { deptTree,saveIvUser } from "../api"
export default {
    props:{
        currentId:{
            type:String,
            default:'',
        },
    },
    data() {
        return {
            roleOptions:[],
            depList:[],
            params: {
                name: "",
                phone:'',
                account: "",
                password: "",
                state: null,
                departId: [],
                roleIds: "",
            },
            rules: {
                name: [{ required: true, message: "请输入人员名称", trigger: "blur" }],
                state: [{ required: true, message: "请选择状态", trigger: "change" }],
                departId: [{ required: true, message: "请选择所属组织", trigger: "change" }],
                roleIds: [{ required: true, message: "请选择所属角色", trigger: "change" }],
            },
        };
    },
    async created() {
        await this.getRole();
        await this.getTree();
    },
    methods: {
        // 获取角色
        async getRole(){
            const res = await listData();
            this.roleOptions = res.data;
        },
        // 获取部门树
        async getTree(){
            const res = await deptTree();
            if(res.data&&res.data.length>0){
                this.depList = this.getData(res.data);
            }
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
        // 新增
        saveData(){
            this.$refs.form.validate(async (valid) => {
                if (valid) {
                    let len =this.params.departId.length-1;
                    let obj = {
                        name: this.params.name,
                        state: this.params.state,
                        departId: this.params.departId?this.params.departId[len]:'',
                        roleIds: this.params.roleIds?this.params.roleIds.split(","):'',
                    }
                    const res = await saveIvUser(obj);
                    this.$message.success("保存成功")
                    this.$emit("close");
                } else {
                    return false;
                }
            });
        },
        // 取消
        cancelFun(){
            this.$emit("close");
        }
    },
};
</script>
<style scoped lang="scss">
.user-add-cont{
    padding: 16px;
    .title{
        font-size: 16px;
        font-weight: bold;
        padding: 16px 0px;
    }
}
</style>
  