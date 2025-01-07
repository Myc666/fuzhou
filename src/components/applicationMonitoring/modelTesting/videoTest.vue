<template>
    <el-dialog
        :close-on-click-modal="false"
        width="1300px"
        top="5vh"
        title="视频测试"
        :visible.sync="videoVisible"
        @closed="closed"
        append-to-body>
        <div class="videoTest-cont">
            <el-card class="left-card">
                <el-form label-width="80px">
                    <el-form-item label="视频" class="upload-demo">
                        <el-upload
                        drag
                        action=""
                        multiple
                        accept=".mp4"
                        :limit="1"
                        :show-file-list="false"
                        :http-request="handleUploadMP4"
                        :before-upload="beforeUpload"
                        v-if="!params.file"
                        >
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        </el-upload>
                        <div v-else>
                        <div class="videoItem">
                            <VideoItem :cameraUrl="params.file" :index="1"></VideoItem>
                        </div>
                        </div>
                        <div class="el-upload__tip">只能上传mp4文件，且不超过100MB</div>
                    </el-form-item>
                    <el-form-item label="配置区域">
                        <MarkDetail
                            ref="markDetail"
                            v-if="firstFile"
                            :fileUrl="$common.handleImgUrl(firstFile)"
                            :dataList="dataList"
                            @dataChange="dataChange"
                        />
                    </el-form-item>
                    <el-form-item label="禁入区域">
                        <el-input
                            placeholder="请输入内容"
                            v-model="params.marks"
                            readonly
                        >
                            <el-button type="primary" slot="append" @click="refreshMarks">重置</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <div style="display: flex;">
                            <el-button type="primary" @click="submit">开始识别</el-button>
                            <el-button @click="refreshParams">重置</el-button>
                            <el-upload
                                action=""
                                :show-file-list="false"
                                accept=".mp4"
                                :http-request="handleUploadMP4"
                                :before-upload="beforeUpload"
                                >
                                <el-button type="primary" style="margin-left: 10px;">重新上传</el-button>
                            </el-upload>
                        </div>
                    </el-form-item>
                </el-form>
            </el-card>
            <el-card class="right-card">
                <div slot="header">
                    <span>测试结果</span>
                </div>
                <div class="tip-sty" v-loading="loading" element-loading-text="正在识别中，请稍等" element-loading-spinner="el-icon-loading">
                    <div v-if="videoUrl">
                        <div class="videoItem">
                            <VideoItem  :cameraUrl="videoUrl" :index="2"></VideoItem>
                        </div>
                        <div style="margin-top: 20px;">
                            <el-button type="primary" @click="downloadFun()">导出视频</el-button>
                        </div>
                    </div>
                </div>
            </el-card>
        </div>
    </el-dialog>
</template>
<script>
import { getTestVideo,firstPicFromMp4,detectMp4} from "@/api/applicationMonitoring/modelTesting";
import { upload } from "@/api/common";
import VideoItem from "./videoItem"
import MarkDetail from "@/components/applicationMonitoring/modelTesting/markDetail";
export default {
    components:{
        VideoItem,
        MarkDetail
    },
    data() {
        return {
            videoVisible:true,
            videoUrl:'',
            params:{
                file:'',
                marks:'',
            },
            firstFile:'',
            dataList:[],
            loading:false,
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
        this.getVideo()
    },
    methods: {
        // 获取测试视频
        getVideo(){
            getTestVideo({suanfa:this.detailObj.nameEn}).then(res => {
                this.$set(this.params, 'file', res.data[0]);
                this.getImg()
            })
        },
        // 关闭弹窗
        closed(){
            this.$emit('close')
        },
        // 重置
        refreshParams(){
            this.params={
                file:''
            };
            this.videoUrl="";
            this.firstFile = '';
            this.dataList = []
        },
        // 编辑禁区
        dataChange(val) {
            const arr = []
            val.forEach(item => {
                arr.push(item.pointList)
            });
            this.$set(this.params, 'marks', JSON.stringify(arr))
        },
        // 重置禁区
        refreshMarks() {
            this.dataList = [];
            this.params.marks = "";
        },
        // 视频限制大小
        beforeUpload(file) {
            const isLimit = file.size / 1024 / 1024 < 100;
            if (!isLimit) {
                this.$message.error("上传视频大小不能超过100MB!");
                return;
            }
        },
        // 上传视频
        async handleUploadMP4(files){
            this.refreshParams();
            const file = files.file ? files.file : files[0];
            let formData = new FormData();
            formData.append("file", file);
            const data = await upload(formData);
            if(data.code==0){
                this.params.file = data.data;
                this.getImg()
            }
        },
        // 获取第一帧图片
        async getImg() {
            const res = await firstPicFromMp4({file:this.params.file})
            this.firstFile = res.data;
        },
        submit(){
            this.videoUrl = '';
            this.loading = true;
            let arr = [];
            arr.push(this.detailObj.id);
            let obj = {
                file:this.params.file,
                algorithms:JSON.stringify(arr),
                marks:this.params.marks,
                imgHeight: this.$refs.markDetail.$refs.draw_img.offsetHeight
            }
            detectMp4(obj).then((res)=>{
                if(res.code==0){
                this.videoUrl = res.data.file;
                this.loading = false;
                }
            }).catch((res) => {
                this.loading = false;
            });
        },
        // 导出视频
        downloadFun(){
            const url = VUE_APP_API_BASE_URL+'/model/test/download?file='+this.videoUrl
            const link = document.createElement('a');  
            link.href = url;  
            document.body.appendChild(link);  
            link.click();
            document.body.removeChild(link)
        },
    },
};
</script>
<style scoped lang="scss">
.videoTest-cont{
    display: flex;
    justify-content: space-between;
    .left-card{
        width: 60%;
    }
    .right-card{
        width: 39%;
    }
}
</style>
<style lang="scss">
.upload-demo{
    .el-upload-dragger {
        width: 428px;
        height: 300px;
    }
    .el-upload-dragger .el-icon-upload{
        margin: 90px 0 16px;
    }
    .videoItem{
    width: 428px;
    height: 300px;
  }
  .tip-sty{
    height: 352px;
  }
}
</style>
  