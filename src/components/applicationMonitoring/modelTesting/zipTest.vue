<template>
    <el-dialog
        :close-on-click-modal="false"
        width="1200px"
        top="5vh"
        title="zip测试"
        :visible.sync="zipVisible"
        @closed="closed"
        append-to-body>
        <div class="zipTest-cont">
            <el-card class="left-card">
                <div slot="header">
                    <span>zip识别</span>
                </div>
                <el-form label-width="80px">
                    <el-form-item label="zip文件" class="upload-zip">
                        <el-upload
                            action=""
                            multiple
                            accept=".zip"
                            :show-file-list="false"
                            :http-request="handleUploadZip"
                        >
                            <el-button size="small" type="primary" :loading="uploadLoading">点击上传</el-button>
                            <div v-if="zipName" style="color: #606266 !important;">
                            <i class="el-icon-folder"></i>
                            <span style="padding-left: 10px;">{{ zipName }}</span>
                            </div>
                            <div slot="tip" class="el-upload__tip">只能上传zip文件,且压缩包里只能是图片</div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submit">开始识别</el-button>
                        <el-button @click="refreshParams">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
            <el-card class="right-card">
                <div slot="header">
                    <span>测试结果</span>
                </div>
                <div style="height: 100px;" v-loading="loading" element-loading-text="正在识别中，请稍等" element-loading-spinner="el-icon-loading">
                    <div v-if="zipUrl">
                        <el-button type="primary" @click="downloadZipFun()">导出zip</el-button>
                    </div>
                </div>
            </el-card>
        </div>
    </el-dialog>
</template>
<script>
import { detectZip} from "@/api/applicationMonitoring/modelTesting";
import { upload } from "@/api/common";
export default {
    data() {
        return {
            zipVisible:true,
            loading:false,
            uploadLoading:false,
            params:{
                file:''
            },
            zipName:'',
            zipUrl:'',
            VUE_APP_API_BASE_URL,
        };
    },
    props:{
        detailObj:{
            type:Object,
            default:{}
        }
    },
    created() {
    },
    methods: {
        // 关闭弹窗
        closed(){
            this.$emit('close')
        },
        // 重置
        refreshParams(){
            this.zipName = '';
            this.zipUrl="";
            this.params={
                file:''
            }
        },
        // 上传zip
        handleUploadZip(files){
            this.refreshParams();
            this.uploadLoading = true;
            const file = files.file ? files.file : files[0];
            let formData = new FormData();
            formData.append("file", file);
            upload(formData).then((res)=>{
                if(res.code==0){
                this.params.file = res.data;
                const lastIndex = res.data.lastIndexOf("/");
                this.zipName = res.data.substring(lastIndex + 1);
                }
                this.uploadLoading = false;
            }).catch(() => {
                this.uploadLoading = false;
            });
        },
        // zip识别
        submit(){
            this.zipUrl = "";
            this.loading = true;
            let arr = [];
            arr.push(this.detailObj.id);
            let obj = {
                file:this.params.file,
                algorithms:JSON.stringify(arr),
            }
            detectZip(obj).then((res)=>{
                if(res.code==0){
                this.zipUrl = res.data.file;
                this.loading = false;
                }
            }).catch((res) => {
                this.loading = false;
            });
        },
        // 下载
        downloadZipFun(){
            const url = VUE_APP_API_BASE_URL+'/model/test/downloadZip?file='+this.zipUrl
            const link = document.createElement('a');  
            link.href = url;  
            document.body.appendChild(link);  
            link.click();
            document.body.removeChild(link)
        }
    },
};
</script>
<style scoped lang="scss">
.zipTest-cont{
    display: flex;
    justify-content: space-between;
    .left-card{
        width: 45%;
    }
    .right-card{
        width: 50%;
    }
}
</style>
<style lang="scss">
.zipTest-cont{
    .upload-zip{
        .el-upload{
        text-align: left;
        }
    }
}

</style>
  