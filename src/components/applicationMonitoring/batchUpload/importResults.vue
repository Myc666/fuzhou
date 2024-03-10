<template>
    <div>
        <div class="results-cont">
            <div class="top-title">导入摄像头</div>
            <div class="center-cont">
                <div class="in-progress"  v-if="isProgress">
                    <div class="progress-title">导入中</div>
                    <div class="tip">预计导入时间较长，您可离开此界面，并可随时返回</div>
                    <div class="progress">
                        <el-progress :percentage="percentage"></el-progress>
                    </div>
                </div>
                <div class="success" v-if="params.countFail==0&&!isProgress">
                    <div>导入共{{params.countAll}}条</div>
                    <div style="margin-left: 10px;">0条错误</div>
                </div>
                <div class="error" v-if="params.countFail>0&&!isProgress">
                    <div class="error-tip">
                        <div>导入共{{params.countAll}}条</div>
                        <div style="margin-left: 10px;"><span style="color: #F56C6C;">{{params.countFail}}</span>条错误</div>
                    </div>
                    <div class="error-btn">
                        <div style="width: 100px;cursor: pointer;">
                            <span style="margin-right: 10px;" @click="viewFun">立即查看</span>
                            <span class="el-icon-arrow-right"></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="btn-cont">
                <el-button type="primary" @click="goBack" v-if="isProgress">暂时隐藏</el-button>
                <el-button type="primary" @click="completeFun" v-if="params.countFail==0&&!isProgress">完成</el-button>
                <div v-if="params.countFail>0&&!isProgress">
                    <el-button type="primary" style="margin-right: 20px;" @click="reImportFun">重新导入</el-button>
                    <el-button @click="completeFun">关闭</el-button>
                </div>
            </div>
        </div>
        <!-- 导入结果列表 -->
        <ImportFailedList v-if="importVisible" @importColse="importColse"/>
    </div>
</template>
<script>
import ImportFailedList from './importFailedList.vue';
import {startImport,getImportSchedule,getImportResult,deleteAll} from "@/api/applicationMonitoring/batchUpload"
export default {
    components:{
        ImportFailedList
    },
    data() {
        return {
            visible:false,
            importVisible:false,
            timerObj:null,
            percentage:0,
            params:{},
            isProgress:true,
        };
    },
    props:{
        typeText:{
            type:String,
            default:''
        },
    },
    created() {
        if(this.typeText=="导入完成"||this.typeText=="导入成功"){
            this.getResult()
        }else{
            this.startImportFun()
        }
    },
    beforeDestroy() {
      // 在组件销毁前清除定时器
        clearInterval(this.timerObj);
        this.timerObj="";
    },
    methods: {
        // 开始导入
        startImportFun(){
            startImport().then(res=>{
                this.getSchedule();
                let that = this;
                that.timerObj = setInterval(function () {
                    that.getSchedule();
                },3000);
            }).catch(res => {
                this.$emit('getData',false)
            })
        },
        // 获取导入进度
        getSchedule(){
            getImportSchedule().then(res=>{
                let num = res.data?res.data.split("%")[0]:'';
                this.percentage = num?Number(num):0
                this.$emit('getData',false)
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
        // 获取导入结果
        getResult(){
            getImportResult().then(res=>{
                this.params = res.data;
                this.isProgress = false;
                this.$emit('getData',true)
            }).catch(res=>{
                this.isProgress = true;
            })
        },
        // 取消导入
        cancelImport(){
            this.visible = false;
        },
        // 暂时隐藏
        goBack(){
            this.$emit("feedbackFun");
        },
        // 重新导入
        reImportFun(){
            this.isProgress = true;
            this.params = {};
            this.$emit('getData',false)
            this.startImportFun()
        },
        // 完成、关闭
        completeFun(){
            deleteAll().then(res=>{
                this.$emit("feedbackFun"); 
            })
        },
        // 立即查看
        viewFun(){
            this.importVisible = true
        },
        // 关闭导入结果列表
        importColse(item){
            if(item){
                this.percentage = 0;
                this.isProgress = true;
                this.$emit('getData',false)
                this.startImportFun();
            }
            this.importVisible = false;
        }
    },
};
</script>
<style scoped lang="scss">
.results-cont{
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
  