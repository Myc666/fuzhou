<template>
    <div class="user-add-cont">
        <el-form ref="form" :model="params" :rules="rules" label-width="100px">
            <el-form-item label="员工工号" prop="empNo">
                <el-input v-model="params.empNo"></el-input>
            </el-form-item>
            <el-form-item label="员工名称" prop="empName">
                <el-input v-model="params.empName"></el-input>
            </el-form-item>
            <el-form-item label="所属部门" prop="orgId">
                <el-cascader
                    v-model="params.orgId"
                    :options="orgList"
                    :props="{ value: 'id', label: 'name',checkStrictly: true }"
                    :show-all-levels="false"
                    clearable>
                </el-cascader>
            </el-form-item>
          </el-form>
          <div style="text-align: right;">
            <el-button type="primary" @click="saveData">保存</el-button>
            <el-button @click="cancelFun">取消</el-button>
          </div>
    </div>
</template>
<script>
import { saveIvUserV2,treeIvOrg } from "../api"
export default {
    props:{
        data:{
            type: Object,
            default: () => ({}),
        }
    },
    data() {
        return {
            orgList:[],
            params: {
                empNo: "",
                empName: "",
                orgId: "",
                orgIdHi: ""
            },
            rules: {
                empNo: [{ required: true, message: "请输入员工工号", trigger: "blur" }],
                empName: [{ required: true, message: "请输入员工姓名", trigger: "blur" }],
                orgId: [{ required: true, message: "请选择所属部门", trigger: "change" }],
            },
        };
    },
    async created() {
        Object.assign(this.params, this.data);
        this.params.orgIdHi = this.data.orgId;
        await this.getTree();
    },
    methods: {
        // 获取部门树
        async getTree(){
            const res = await treeIvOrg();
            if(res.data&&res.data.length>0){
                this.orgList = this.getData(res.data);
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
                    var orgId = '';
                    if(Array.isArray(this.params.orgId)) {
                        orgId = this.params.orgId[this.params.orgId.length - 1]
                    } else {
                        orgId = this.params.orgIdHi;
                    }

                    //let len =this.params.orgId.length-1;
                    let formData = new FormData();
                    formData.append("id", this.params.id ? this.params.id : '');
                    formData.append("empNo", this.params.empNo ? this.params.empNo : '');
                    formData.append("empName", this.params.empName ? this.params.empName : '');
                    formData.append("orgId", orgId);
                    //formData.append("orgId", this.params.orgId?this.params.orgId[len]:'');
                    const res = await saveIvUserV2(formData);
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
