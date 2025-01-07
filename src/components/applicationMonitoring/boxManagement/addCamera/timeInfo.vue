<template>
    <div>
        <el-dialog
          :close-on-click-modal="false"
          width="600px"
          top="10vh"
          title="告警时段"
          :visible.sync="drawDisabled"
          @closed="closed"
          append-to-body>
            <div class="time-cont">
                <div class="tip">告警通知仅在设定的时段内进行，且单个算法支持配置多个告警时段。</div>
                <div class="list">
                    <div class="list-item" v-for="(item,index) in timeList" :key="index">
                        <el-time-picker
                            is-range
                            v-model="item.time"
                            format="HH:mm"
                            value-format="HH:mm"
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            placeholder="选择时间范围">
                        </el-time-picker>
                        <span class="el-icon-delete del-sty" v-if="timeList.length>1" @click="delFun(index)"></span>
                    </div>
                </div>
                <div class="add-btn" @click="addFun()">
                    <span class="el-icon-circle-plus-outline"></span>
                    <span style="margin-left: 6px;">新增时间段</span>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closed">取消</el-button>
                <el-button type="primary" @click="saveFun">确定</el-button>
            </span>
        </el-dialog>
    </div>
  </template>
  <script>
  export default {
    props: {
        alarmTimeList:{
            type: Array,
            default:[]
        },
        algorithmId:{
            type:String,
            default:''
        },
    },
    data() {
      return {
        drawDisabled:true,
        timeList:[{time:null}],
      };
    },
    watch:{
        alarmTimeList:{
            immediate: true,
            handler(val) {
                this.timeList = [];
                if(val.length>0){
                    val.forEach(item => {
                        let obj = {
                            time:[item.startTime,item.endTime]
                        }
                        this.timeList.push(obj)
                    });
                }else{
                    this.timeList = [{time:null}];
                }
            }
        }
    },
    methods: {
        //取消
        closed(){
          this.$emit('close');
        },
        //保存绘制
        async saveFun(){
            let newArr = [];
            this.timeList.forEach(item=>{
                if(item.time && item.time.length>0){
                    let params = {
                        startTime:item.time[0],
                        endTime:item.time[1],
                    }
                    newArr.push({
                        startTime:item.time[0],
                        endTime:item.time[1],
                    })
                }
            })
            let obj = {
              algorithmId:this.algorithmId,
              alarmTimeArr:newArr,
            }
            this.$emit('close',obj)
        },
        // 新增时间段
        addFun(){
            this.timeList.push({
                time:null,
            })
        },
        // 删除
        delFun(index){
            this.timeList.splice(index, 1)
        }
    },
  };
  </script>
<style scoped lang="scss">
.time-cont{
    .tip{
        color: #606266;
        font-size: 14px;
        line-height: 22px;
    }
    .list{
        padding-top: 20px;
    }
    .list-item{
        padding-bottom: 20px;
    }
    .del-sty{
        margin-left: 24px;
        cursor: pointer;
        padding: 8px;
    }
    .add-btn{
        border: 1px solid #DCDFE6;
        border-radius: 4px;
        padding: 6px 16px;
        width: 130px;
        text-align: center;
        cursor: pointer;
    }
}
  
</style>
  