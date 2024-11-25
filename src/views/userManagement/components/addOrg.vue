<template>
    <div>
        <el-dialog
            :close-on-click-modal="false"
            :title="title"
            :visible.sync="dialogVisible"
            width="600px"
            @closed="closed"
        >
            <div class="user-add-cont">
                <el-form ref="form" :model="params" :rules="rules" label-width="100px">
                    <el-form-item label="部门名称" prop="name">
                        <el-input v-model="params.name"></el-input>
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
import { deptTree,saveIvUser,saveIvOrg } from "../api"
export default {
    props:{
        data:{
            type: Object,
            default: () => ({}),
        }
    },
    data() {
        return {
            title: this.id ? "编辑部门" : "新增部门",
            dialogVisible: true,
            depList:[],
            params: {
                name: "",
            },
            rules: {
                name: [{ required: true, message: "请输入部门名称", trigger: "blur" }]
            },
        };
    },
    async created() {
        //await this.getRole();
        //await this.getTree();

        Object.assign(this.params, this.data)
    },
    methods: {
        // // 获取角色
        // async getRole(){
        //     const res = await listData();
        //     this.roleOptions = res.data;
        // },
        // 获取部门树
        async getTree(){
            if(this.pageType == 'access'){
                const res = await listTree();
                if(res.data&&res.data.length>0){
                    this.depList = this.getData(res.data);
                }
            }else{
                const res = await deptTree();
                if(res.data&&res.data.length>0){
                    this.depList = this.getData(res.data);
                }
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
                    let formData = new FormData();
                    formData.append("id", this.params.id ? this.params.id : '');
                    formData.append("parentId", this.params.parentId ? this.params.parentId : '0');
                    formData.append("name", this.params.name ? this.params.name : '');

                    const res = await saveIvOrg(formData);
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
