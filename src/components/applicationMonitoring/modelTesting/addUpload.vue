<template>
    <div>
        <el-dialog
            :close-on-click-modal="false"
            title="新增算法"
            :visible.sync="dialogVisible"
            width="500px"
            :before-close="handleDialogClose"
        >
            <el-form ref="form" :model="params" :rules="rules" label-width="120px">
                <el-form-item label="算法名称" prop="name">
                    <el-input v-model="params.name"></el-input>
                </el-form-item>
                <el-form-item label="上传模型文件" prop="file">
                    <el-upload
                        class="upload-demo"
                        action=""
                        :on-change="handleChange"
                        :on-remove="handleRemove"
                        :file-list="fileList"
                        :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">
                            <div v-if="tipText" style="color: red;">{{ tipText }}</div>
                            <div v-else>请确保文件未做变化</div>
                        </div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closed" v-if="!btnLoading">取消</el-button>
                <el-button type="primary" @click="saveData" :loading="btnLoading">开始导入</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {uploadZipSave} from "@/api/applicationMonitoring/modelTesting";
export default {
    data(){
        return{
            dialogVisible:true,
            params:{
                name:'',
                file:'',
            },
            rules:{
                name: [{ required: true, message: "请输入算法名称", trigger: "blur" }],
                file: [{ required: true, message: "请上传模型文件", trigger: "change" }],
            },
            fileList:[],
            btnLoading:false,
            tipText:'',
        }
    },
    created(){

    },
    methods:{
        handleDialogClose(){
            if(!this.btnLoading){
                this.$emit('closeAdd')
            }
        },
        closed(){
            this.$emit('closeAdd')
        },
        handleChange(file, fileList) {
            let Arr = [];
            Arr.push(file)
            this.fileList = Arr;
            this.params.file = file.raw;
            this.$refs.form.validate()
        },
        handleRemove(file, fileList){
            this.params.file = "";
            this.fileList = [];
            this.$refs.form.validate()
        },
        // 导入
        saveData(){
            this.btnLoading = true;
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let formData = new FormData();
                    formData.append("name", this.params.name);
                    formData.append("file", this.params.file);
                    uploadZipSave(formData).then(res=>{
                        this.tipText = "";
                        this.btnLoading = false;
                        if(res.code==0&&JSON.stringify(res.data) == "{}"){
                            this.$message.success('导入成功');
                            this.$emit('closeAdd')
                        }else{
                            this.tipText = res.data;
                        }
                        
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