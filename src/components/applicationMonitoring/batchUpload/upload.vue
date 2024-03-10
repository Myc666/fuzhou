<template>
    <div>
        <el-dialog
            :close-on-click-modal="false"
            title="批量导入摄像头"
            :visible.sync="dialogVisible"
            width="800px"
            top="8vh"
            :before-close="handleDialogClose"
        >
            <!-- 初始化 -->
            <div class="upload-cont" v-if="type=='upload'">
                <div class="left">
                    <div class="top-title">下载模板</div>
                    <div class="tip">
                        请使用以下模板来确保您的导入顺利进行。<br/>
                        1.当您开始填写 .csv 模板时，请不要删除任何列。如果这样做，导入时系统将无法识别 .csv 模板。<br/>
                        2.请确保CSV文件的编码为UTF-8，以避免特殊字符的问题。
                    </div>
                    <div class="download-file">
                        <div class="file-name">摄像头批量导入_模板.csv</div>
                        <div class="download-btn" @click="downLoadFun">下载</div>
                    </div>
                </div>
                <div class="right">
                    <div>
                        <div class="top-title">上传文件</div>
                        <div class="tip">请确保CSV文件数据准确无误。</div>
                    </div>
                    <div class="center">
                        <el-upload
                        action=""
                        :http-request="handleUpload"
                        :show-file-list="false"
                        accept=".csv"
                        style="display: inline"
                        >
                            <el-button icon="el-icon-upload2">{{isFail?'重新上传':'点击上传'}}</el-button>
                        </el-upload>
                        <div v-if="isFail" class="fail-tip">上传失败，请重试</div>
                        <div v-if="fileName" class="file-sty">
                            <div>
                                <span class="el-icon-document"></span>
                                <span style="padding-left: 10px;">{{ fileName }}</span>
                            </div>
                            <div class="el-icon-circle-check" style="color: #7bc139;margin-left: 10px;"></div>
                        </div>
                    </div>
                    <div class="center">
                        <div v-if="fileName">
                            <el-button type="primary" @click="startVerification">开始导入</el-button>
                            <el-button @click="closed">取消</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 校验状态下 -->
            <VerificationFeedback v-if="type=='verification'" :typeText="typeText" @feedbackFun="feedbackFun"/>
            <!-- 导入状态下 -->
            <ImportResults v-if="type=='import'" :typeText="typeText" @feedbackFun="feedbackFun" @getData="getData"/>
        </el-dialog>
    </div>
</template>
<script>
import VerificationFeedback from "./verificationFeedback.vue"
import ImportResults from "./importResults.vue"
import {upload,deleteAll} from "@/api/applicationMonitoring/batchUpload"
export default {
    components:{
        VerificationFeedback,
        ImportResults
    },
    props:{
        type:{
            type:String,
            default:'upload'
        },
        typeText:{
            type:String,
            default:''
        }
    },
    data() {
        return {
            dialogVisible:true,
            isFail:false,
            fileName:'',
            VUE_APP_API_BASE_URL,
            isClear:false,
        };
    },
    created() {

    },
    methods: {
        // 关闭之前
        handleDialogClose(){
            if(this.type=='import'&&this.isClear){
                deleteAll().then(res=>{
                    this.$emit("close");
                })
            }else{
                this.$emit("close");
            }
        },
        closed(){
            this.$emit("close");
        },
        // 上传
        handleUpload(files) {
            console.info(files)
            const file = files.file;
            let name = file.name
            let form = new FormData();
            form.append("file", file);
            upload(form).then(res=>{
                this.isFail = false;
                this.fileName = name
            }).catch(res => {
                this.isFail = true;
                this.fileName = ''
            })
        },
        // 开始校验
        startVerification(){
            this.type = 'verification';//校验
        },
        // 关闭校验弹窗
        feedbackFun(str){
            if(str=='import'){
                this.type = 'import';//导入
            }else{
                this.$emit("close");
            }
        },
        // 判断是否清除上传记录
        getData(item){
            this.isClear = item;
        },
        // 下载模板
        downLoadFun(){
            const url = VUE_APP_API_BASE_URL+'/cameraImport/downloadTemplateFile'
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
.upload-cont{
    display: flex;
    justify-content: space-between;
    .left,.right{
        width: 49%;
        border-radius: 6px;
        border: 1px solid #DCDCDC;
        padding: 16px;
        .top-title{
            font-size: 16px;
            font-weight: 500;
            line-height: 22px;
            color: #000;
        }
        .tip{
            margin-top: 8px;
            color: rgba(0, 0, 0, 0.40);
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: 20px; 
            letter-spacing: 0.5px;
        }
    }
    .left{
        .download-file{
            display: flex;
            justify-content: space-between;
            padding-top: 100px;
            font-size: 14px;
            .file-name{
                color: #000;
            }
            .download-btn{
                color: #409EFF;
                cursor: pointer;
            }
        }
    }
    .right{
        .center{
            text-align: center;
            width: 100%;
            margin-top: 60px;
        }
        .fail-tip{
            color: #D54941;
            font-size: 12px;
            margin-top: 10px;
        }
        .file-sty{
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 70%;
            margin-left: 15%;
            font-size: 12px;
            margin-top: 10px;
        }
    }
}
</style>
  