<template>
    <div>
        <div class="feed-back">
            <div class="top-title">上传文件</div>
            <div class="center-cont">
                <div class="in-progress" v-if="isProgress">
                    <div class="progress-title">校验中</div>
                    <div class="tip">预计校验时间较长，您可离开此界面，并可随时返回</div>
                    <div class="progress">
                        <el-progress :percentage="percentage"></el-progress>
                    </div>
                </div>
                <div class="success" v-if="params.countFail==0&&!isProgress">
                    <div>校验共{{params.countAll}}条</div>
                    <div style="margin-left: 10px;">0条错误</div>
                </div>
                <div class="error" v-if="params.countFail>0&&!isProgress">
                    <div class="error-tip">
                        <div>校验共{{params.countAll}}条</div>
                        <div style="margin-left: 10px;"><span style="color: #F56C6C;">{{params.countFail}}</span>条错误</div>
                    </div>
                    <div class="error-btn">
                        <div style="width: 100px;cursor: pointer;" @click="viewFun">
                            <span style="margin-right: 10px;">立即查看</span>
                            <span class="el-icon-arrow-right"></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="btn-cont">
                <el-button type="primary" @click="goBack" v-if="isProgress">暂时隐藏</el-button>
                <div v-if="params.countFail==0&&!isProgress">
                    <el-button type="primary" style="margin-right: 20px;" @click="startImportFun">开始导入</el-button>
                    <el-popover
                        placement="top"
                        width="200"
                        v-model="visible">
                        <div>
                            <span class="el-icon-question" style="color: #E6A23C;"></span>
                            <span style="margin-left: 10px;">是否取消本次导入</span>
                        </div>
                        <div style="display: flex;justify-content: end;margin-top: 15px;">
                            <div style="cursor: pointer;border-radius: 2px;border: 1px solid rgba(0, 0, 0, 0.10);font-size: 12px;line-height: 20px;padding: 0px 12px;color: #000;" @click="visible = false">取消</div>
                            <div style="cursor: pointer;border-radius: 2px;font-size: 12px;line-height: 20px;padding: 0px 12px;color: #FFF;background: #409EFF;margin-left: 10px;" @click="cancelImport">取消导入</div>
                        </div>
                        <el-button slot="reference" >取消</el-button>
                    </el-popover>
                </div>
                <div v-if="params.countFail>0&&!isProgress">
                    <el-popover
                        placement="top"
                        width="200"
                        v-model="visible">
                        <div>
                            <span class="el-icon-question" style="color: #E6A23C;"></span>
                            <span style="margin-left: 10px;">是否取消本次导入</span>
                        </div>
                        <div style="display: flex;justify-content: end;margin-top: 15px;">
                            <div style="cursor: pointer;border-radius: 2px;border: 1px solid rgba(0, 0, 0, 0.10);font-size: 12px;line-height: 20px;padding: 0px 12px;color: #000;" @click="visible = false">取消</div>
                            <div style="cursor: pointer;border-radius: 2px;font-size: 12px;line-height: 20px;padding: 0px 12px;color: #FFF;background: #409EFF;margin-left: 10px;" @click="cancelImport">取消导入</div>
                        </div>
                        <el-button slot="reference" >取消</el-button>
                    </el-popover>
                </div>
            </div>
        </div>
        <!-- 校验结果 -->
        <VerificationFailedList v-if="checkVisible" @checkColse="checkColse"/>
    </div>
</template>
<script>
import VerificationFailedList from './verificationFailedList.vue';
import {startCheck,getCheckSchedule,getCheckResult,deleteAll} from "@/api/applicationMonitoring/batchUpload"
export default {
    components:{
        VerificationFailedList
    },
    data() {
        return {
            visible:false,
            checkVisible:false,
            percentage:0,
            timerObj:null,
            isProgress:true,
            params:{},
        };
    },
    props:{
        typeText:{
            type:String,
            default:''
        },
    },
    created() {
        if(this.typeText=="校验完成"||this.typeText=="校验成功"){
            this.getResult()
        }else{
            this.startCheckFun()
        }
    },
    beforeDestroy() {
      // 在组件销毁前清除定时器
        clearInterval(this.timerObj);
        this.timerObj="";
    },
    methods: {
        // 开始校验
        startCheckFun(){
            startCheck().then(res=>{
                this.getSchedule();
                let that = this;
                that.timerObj = setInterval(function () {
                    that.getSchedule();
                },3000);
            })
        },
        // 获取校验进度
        getSchedule(){
            getCheckSchedule().then(res=>{
                let num = res.data?res.data.split("%")[0]:'';
                this.percentage = num?Number(num):0
                if(res.data=='100.00%'){
                    clearInterval(this.timerObj);
                    this.timerObj="";
                    setTimeout(()=>{
                        this.getResult()
                    },500)
                }
            }).catch(res => {
                clearInterval(this.timerObj);
                this.timerObj="";
            })
        },
        // 获取校验结果
        getResult(){
            getCheckResult().then(res=>{
                this.params = res.data;
                this.isProgress = false;
            }).catch(res=>{
                this.isProgress = true;
            })
        },
        // 取消导入
        cancelImport(){
            deleteAll().then(res=>{
                this.visible = false;
                this.$emit("feedbackFun");
            })
        },
        // 暂时隐藏
        goBack(){
            clearInterval(this.timerObj);
            this.timerObj="";
            this.$emit("feedbackFun");
        },
        // 开始导入
        startImportFun(){
            clearInterval(this.timerObj);
            this.timerObj="";
            this.$emit("feedbackFun","import");
        },
        // 立即查看
        viewFun(){
            clearInterval(this.timerObj);
            this.timerObj="";
            this.checkVisible = true;
        },
        // 关闭弹窗
        checkColse(item){
            if(item){
                this.percentage = 0;
                this.isProgress = true;
                this.startCheckFun();
            }
            this.checkVisible = false
        }
    },
};
</script>
<style scoped lang="scss">
.feed-back{
    width: 100%;
    border-radius: 6px;
    border: 1px solid #DCDCDC;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    height: 280px;
    .top-title{
        font-size: 16px;
        font-weight: 500;
        line-height: 22px;
        color: #000;
    }
    .center-cont{
        width: 100%;
        .success{
            font-size: 16px;
            font-weight: 500;
            line-height: 22px;
            color: #000;
            display: flex;
            justify-content: center;
        }
        .error-tip{
            font-size: 16px;
            font-weight: 500;
            line-height: 22px;
            color: #000;
            display: flex;
            justify-content: center;
        }
        .error-btn{
            font-size: 18px;
            font-weight: 600;
            color: #409EFF;
            margin-top: 10px;
            display: flex;
            justify-content: center;
            :deep(.el-icon-arrow-right:before){
                font-weight: bold;
                cursor: pointer;
            }
        }
        .in-progress{
            text-align: center;
            .progress-title{
                font-size: 14px;
                font-weight: 600;
                line-height: 22px;
                color: #000;
            }
            .tip{
                margin: 10px 0px;
                font-size: 14px;
                line-height: 20px;
                color: rgba(0, 0, 0, 0.40);
            }
            .progress{
                width: 50%;
                margin-left: 25%;
            }
        }
    }
    .btn-cont{
        width: 100%;
        display: flex;
        justify-content: center;
    }
}
</style>
  