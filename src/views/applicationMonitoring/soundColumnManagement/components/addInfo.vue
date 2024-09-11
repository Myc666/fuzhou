<template>
    <div>
        <el-dialog
            :close-on-click-modal="false"
            title="新增音柱"
            :visible.sync="dialogVisible"
            width="500px"
            @close="closed"
        >
            <el-form ref="form" :model="params" :rules="rules" label-width="120px">
                <el-form-item label="音柱服务器" prop="server">
                    <el-input v-model="params.server"></el-input>
                </el-form-item>
                <el-form-item label="音柱编号" prop="sn">
                    <el-input v-model="params.sn"></el-input>
                </el-form-item>
                <el-form-item label="音柱音量" prop="vol">
                    <el-radio-group v-model="params.vol">
                        <el-radio :label="20">低</el-radio>
                        <el-radio :label="40">中</el-radio>
                        <el-radio :label="60">高</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="型号">
                    <el-select v-model="params.type" placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="账号">
                    <el-input v-model="params.userName"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="params.password" show-password></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closed">取消</el-button>
                <el-button type="primary" @click="saveData" :loading="btnLoading">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { detailData,saveData } from "@/api/applicationMonitoring/soundColumnManagement";
export default {
    props:{
        currentId:{
            type:String,
            default:''
        }
    },
    data(){
        return{
            dialogVisible:true,
            options:[
                {
                    label:'粤浪',
                    value:'yuelang'
                }
            ],
            params:{
                server:'',
                sn:'',
                vol:'',
                type:'',
                userName:'',
                password:'',
            },
            rules:{
                server: [{ required: true, message: "请输入音柱服务器", trigger: "blur" }],
                sn: [{ required: true, message: "请输入音柱编码", trigger: "change" }],
            },
            btnLoading:false,
        }
    },
    created(){
        if(this.currentId){
            this.getDetail();
        }
    },
    methods:{
        async getDetail(){
           const res = await detailData({id:this.currentId})
           this.params = res.data;
        },
        closed(){
            this.$emit('closeAdd')
        },
        // 保存
        saveData(){
            this.btnLoading = true;
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let formData = new FormData();
                    formData.append("server", this.params.server);
                    formData.append("sn", this.params.sn);
                    formData.append("vol", this.params.vol);
                    formData.append("type", this.params.type);
                    formData.append("userName", this.params.userName);
                    formData.append("password", this.params.password);
                    if(this.currentId){
                        formData.append("id", this.params.id);
                    }
                    saveData(formData).then(res=>{
                        this.$message.success('保存成功');
                        this.btnLoading = false;
                        this.$emit('closeAdd');
                    }).catch(()=>{
                        this.btnLoading = false;
                    })
                } else {
                    this.btnLoading = false;
                    return false;
                }
            });
        }
    }
}
</script>
<style lang="scss">
</style>