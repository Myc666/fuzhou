<template>
    <div class="user-cont">
        <el-form ref="form" :model="params" :rules="rules" label-width="100px">
            <div class="title">用户信息</div>
            <el-form-item label="姓名" prop="name">
                <el-input v-model="params.name"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="params.phone"></el-input>
            </el-form-item>
            <el-form-item label="所属组织" prop="departId">
                <el-cascader
                    v-model="params.departId"
                    :options="depList"
                    :props="{ value: 'id', label: 'name',checkStrictly: true }"
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
            <div class="title">账号信息</div>
            <el-form-item  label="账号名称" prop="account">
                <el-input v-model="params.account"></el-input>
            </el-form-item>
            <el-form-item  label="账号密码" prop="password" v-if="!currentId">
                <el-input v-model="params.password"></el-input>
                <div style="font-size: 12px; color: #939393;">8~26个字符,使用大小写字母、数字和特殊字符的组合</div>
            </el-form-item>
            <el-form-item label="启用状态" prop="state">
              <el-radio-group v-model="params.state">
                <el-radio :label="0">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div>
            <el-button type="primary" @click="saveData">保存</el-button>
            <el-button @click="cancelFun">取消</el-button>
          </div>
    </div>
</template>
<script>
import { listData } from "../../roleManagement/api"
import { listTree,saveAccount,updateAccount,accountDetail } from "../api"
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
                phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
                account: [{ required: true, message: "请输入账号", trigger: "blur" }],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                    {
                        validator: function(rule, value, callback) {
                            const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{8,26}$/;
                            if (!regex.test(value)) {
                                callback(new Error('请输入正确格式的密码'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur',
                    },
                ],
                state: [{ required: true, message: "请选择状态", trigger: "change" }],
                departId: [{ required: true, message: "请选择所属组织", trigger: "change" }],
                roleIds: [{ required: true, message: "请选择所属角色", trigger: "change" }],
            },
        };
    },
    async created() {
        await this.getRole();
        await this.getTree();
        if(this.currentId){
            await this.getDetail();
        }
    },
    methods: {
         // 获取详情
        async getDetail() {
            let formData = new FormData();
            formData.append("accountId", this.currentId);
            const res = await accountDetail(formData);
            let str = "";
            if(res.data.roles&&res.data.roles.length>0){
                res.data.roles.forEach((item=>{
                    str = item.id
                }))
            }
            Object.assign(this.params, {
                id:res.data.id,
                name: res.data.name,
                phone:res.data.phone,
                account: res.data.account,
                // password: res.data.password,
                state: res.data.state,
                departId: this.getFathersById(res.data.departId,this.depList),
                roleIds: str,
            });
        },
        // 上级部门回显
        getFathersById(id, data, prop = 'id') {
            var arrRes = []
            const rev = (data, nodeId) => {
                for (var i = 0, length = data.length; i < length; i++) {
                const node = data[i]
                if (node[prop] === nodeId) {
                    arrRes.unshift(node[prop])
                    return true
                } else {
                    if (node.children && node.children.length) {
                    if (rev(node.children, nodeId)) {
                        arrRes.unshift(node[prop])
                        return true
                    }
                    }
                }
                }
                return false
            }
            rev(data, id)
            return arrRes
        },
        // 获取角色
        async getRole(){
            const res = await listData();
            this.roleOptions = res.data;
        },
        // 获取部门树
        async getTree(){
            const res = await listTree();
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
                        phone:this.params.phone,
                        account: this.params.account,
                        password: this.params.password,
                        state: this.params.state,
                        departId: this.params.departId?this.params.departId[len]:'',
                        roleIds: this.params.roleIds?this.params.roleIds.split(","):'',
                    }
                    if(this.currentId){
                        obj.id = this.params.id;
                        const res = await updateAccount(obj);
                    }else{
                        const res = await saveAccount(obj);
                    }
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
.user-cont{
    padding: 16px;
    .title{
        font-size: 16px;
        font-weight: bold;
        padding: 16px 0px;
    }
}
</style>
  