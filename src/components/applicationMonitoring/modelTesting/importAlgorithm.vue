<template>
    <div class="import-alg">
        <el-form ref="form"  label-width="80px">
            <div class="tip">手动上传算法模型文件，请保持Zip文件未经修改。</div>
            <el-form-item label="算法文件">
                <el-upload
                    class="upload-demo"
                    action=""
                    :http-request="handlePreview"
                    :show-file-list="false"
                >
                    <el-button slot="trigger" size="small" type="primary" icon="el-icon-plus" :loading="btnLoading">上传版本ZIp文件</el-button>
                </el-upload>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import {uploadAlgorithmFile} from "@/api/applicationMonitoring/modelTesting";
export default {
    props:{
        platform:{
          type:String,
          default:''
        },
        nameEn:{
          type:String,
          default:''
        },
        pageType:{
            type:String,
            default:''
        }
    },
    data(){
        return{
            btnLoading:false,
        }
    },
    created(){
    },
    methods:{
        handlePreview(file) {
            if(this.pageType==1){
                this.$emit('closeImport',false)
            }
            this.btnLoading = true;
            let formData = new FormData();
            formData.append("platform", this.platform);
            formData.append("nameEn", this.nameEn);
            formData.append("file", file.file);
            uploadAlgorithmFile(formData).then(res=>{
                this.btnLoading = false;
                this.$message.success('上传成功')
                this.$emit('closeImport',true)
            }).catch(()=>{
                this.btnLoading = false;
            })
        },
    }
}
</script>
<style scoped lang="scss">
.import-alg{
    .tip{
        font-size: 12px;
        line-height: 20px;
        color: #A8ABB2;
        padding: 0px 0px 10px 15px;
    }
}
</style>