<template>
    <el-dialog
    :close-on-click-modal="false"
      title="导出告警数据"
      :visible.sync="dialogVisible"
      width="600px"
      :append-to-body="true"
      @closed="closed"
    >
        <div class="tip">
            友情提示：导出人流量统计数据的Excel文件时，范围选择如下：<br/>
            当日：从0:00开始至当前时间；<br/>
            当周：从本周一开始至当前时间；<br/> 
            当月：从所在月份的第一天开始至当前时间。<br/> 
            您还可以根据实际需求，选择‘自定义’来精确控制导出的日期时间范围。
        </div>
        <el-form ref="form" :model="params" :rules="rules" label-width="140px">
            <el-form-item label="选择导出日期范围" prop="countType">
                <div class="radio-flex">
                    <div v-for="(item,index) in radioList" :key="index" :class="[item.check?'check-item item-sty':'item-sty']" @click="checkFun(index)">{{ item.name }}</div>
                </div>
            </el-form-item>
            <el-form-item v-if="isShow" prop="dateTime" label-width="0px">
                <el-date-picker
                    v-model="params.dateTime"
                    :default-time="['00:00:00', '23:59:59']"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    align="right"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
            </el-form-item>
        </el-form>
        <div style="text-align: right;margin-top: 20px;">
            <el-button @click="closed">取消</el-button>
            <el-button type="primary" @click="exportFun" :loading="dowloadLoading">导出</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { exportData } from "../api";
export default {
  props: {
    seachObj:{
        type:Object,
        default:{},
    }
  },
  data() {
    return {
        dowloadLoading:false,
        isShow:false,
        dialogVisible: true,
        params:{
            countType:null,
            dateTime:null,
        },
        rules:{
            countType:[{ required: true, message: "请选择导出日期范围", trigger: "change" }],
            dateTime: [{ required: true, message: '请选择日期时间范围', trigger: 'change' }],
        },
        radioList:[
            {
                value:0,
                name:'当日',
                check:false,
            },
            {
                value:1,
                name:'当周',
                check:false,
            },
            {
                value:2,
                name:'当月',
                check:false,
            },
            {
                value:9,
                name:'自定义',
                check:false,
            },
        ],
        pickerOptions: {
            shortcuts: [{
                text: '最近一周',
                onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近一个月',
                onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近三个月',
                onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
                }
            }]
        },
    };
  },
  created() {

  },

  methods: {
    // 关闭回调
    closed() {
      this.$emit("close");
    },
    checkFun(index){
        this.radioList.forEach((item,ind)=>{
            item.check = false;
            if(index==ind){
                item.check = true;
                this.params.countType = item.value;
                this.isShow=false;
                if(item.value==9){
                    this.isShow=true;
                }
            }
        })
    },
    exportFun(){
        this.$refs.form.validate(async (valid) => {
            if (valid) {
                this.dowloadLoading = true;
                let start = "";
                let end = "";
                if(this.params.dateTime&&this.params.dateTime.length>0){
                    start = this.params.dateTime[0];
                    end = this.params.dateTime[1];
                }
                let form = new FormData();
                form.append("countType", this.params.countType);
                form.append("startTimie",start);
                form.append("endTimie", end);
                exportData(form).then(res=>{
                    this.dowloadLoading = false;
                    var blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    var url = window.URL.createObjectURL(blob);
                    var linkElement = document.createElement('a');
                    linkElement.setAttribute('href', url);
                    linkElement.click();
                    document.body.removeChild(linkElement)
                }).catch(res=>{
                    this.dowloadLoading = false;
                })
            }else{
                return false;
            }
        })
    }
  },
};
</script>
<style scoped lang="scss">
.tip{
    font-size: 12px;
    color: #909399;
    line-height: 20px;
    margin-bottom: 20px;
}
.radio-flex{
    display: flex;
}
.item-sty{
    font-size: 14px;
    padding: 0px 20px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    margin-right: 20px;
    cursor: pointer;
}
.check-item{
    background: #ECF5FF;
    border: 1px solid #337ECC !important;
}
</style>