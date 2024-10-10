<template>
    <div class="flow-see">
        <div class="seach-sty">
           <div style="flex: 1;display: flex;">
                <div class="seach-flex" style="margin-right: 35px;">
                    <div style="margin-right: 5px;color: #202B3D;">摄像头:</div>
                    <div style="flex: 1;">
                        <el-select
                            placeholder="摄像头"
                            clearable
                            filterable
                            v-model="params.cameraId"
                            style="width: 150px;"
                        >
                            <el-option
                            v-for="(item, index) in cameraOptions"
                            :key="index"
                            :label="item.name"
                            :value="item.id"
                            ></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="seach-flex" style="margin-right: 15px;">
                    <div style="margin-right: 5px;">日期时间:</div>
                    <div  style="flex: 1;">
                        <el-date-picker
                            v-model="date"
                            :default-time="['00:00:00', '23:59:59']"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            style="width: 330px;"
                            :clearable="false"
                            :picker-options="pickerOptions"
                        >
                        </el-date-picker>
                    </div>
                </div>
            </div>
            <el-button size="mini" style="height: 34px;padding: 0px 15px;" type="primary" icon="el-icon-search" @click="queryFun()">查询</el-button>
            <el-button size="mini" style="height: 34px;padding: 0px 15px;" icon="el-icon-refresh" @click="refreshData">重置</el-button>
            <el-button size="mini" style="height: 34px;padding: 0px 15px;" type="primary" icon="el-icon-download" @click="downloadFun">导出统计数据</el-button>
        </div>
        <div style="display: flex;">
            <div class="left-list">
                <div v-for="(item,index) in summaryList" :key="index" class="left-item">
                    <div class="item-title">{{ getTitle(item.type) }}</div>
                    <div class="item-cont">
                        <div style="text-align: center;">
                            <div class="cont-title">进入</div>
                            <div class="cont-num">{{ item.enterCount }}</div>
                        </div>
                        <div style="text-align: center;">
                            <div class="cont-title">离开</div>
                            <div class="cont-num">{{ item.leaveCount }}</div>
                        </div>
                        <div style="text-align: center;">
                            <div class="cont-title">剩余</div>
                            <div class="cont-num">{{ item.remainCount }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right-chart">
                <div class="mar-tb" style="display: flex;justify-content: space-between;">
                    <div class="title">总人流量变化趋势</div>
                    <div>
                        <el-radio-group v-model="countType" size="small" @input="handleSelect">
                            <el-radio-button :label="0">当日</el-radio-button>
                            <el-radio-button :label="1">当周</el-radio-button>
                            <el-radio-button :label="2">当月</el-radio-button>
                            <el-radio-button :label="3">自定义</el-radio-button>
                        </el-radio-group>
                    </div>
                </div>
                <div class="chart" id="chart"></div>
            </div>
        </div>
        <div class="border-sty">
            <div class="title mar-tb">单台统计</div>
            <div>
                <div class="table-sty" v-if="tableData.length>0">
                    <div v-for="item in tableData" :key="item.id" class="item-sty">
                        <div class="list-flex">
                            <div class="list-title">{{item.cameraName}}</div>
                            <div class="list-title" style="color: #909399;">
                                {{item.departName}}{{ item.boxIp?"("+item.boxIp+")":'' }}
                            </div>
                        </div>
                        <div class="list-flex" style="margin-top: 16px;">
                            <div style="text-align: center;">
                                <div class="mini-title">进入</div>
                                <div class="list-num">{{item.enterCount}}</div>
                            </div>
                            <div style="text-align: center;">
                                <div class="mini-title">离开</div>
                                <div class="list-num">{{item.leaveCount}}</div>
                            </div>
                            <div style="text-align: center;">
                                <div class="mini-title">剩余</div>
                                <div class="list-num">{{item.remainCount}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="noData" v-else>
                <el-empty description="暂无数据"></el-empty>
                </div>
                <div class="pagination" style="text-align: right;">
                    <el-pagination
                        background
                        :current-page="params.page"
                        :page-size="params.limit"
                        :page-sizes="[params.limit]"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                        @current-change="handleCurrentChange"
                        @size-change="handleSizeChange"
                    ></el-pagination>
                </div>
            </div>
        </div>
        <Download v-if="downloadVisible" :seachObj="params" @close="closeHandle"/>
    </div>
</template>
<script>
import { summaryV2,listPage,timelineV2 } from "./api"
import {
  getCameraListData,
} from "@/api/applicationMonitoring/alarmManagement";
import * as echarts from "echarts";
import Download from "./components/download.vue"
export default {
    components:{
        Download
    },
    data() {
        return {
            countType:0,
            date: [],
            params: {
                cameraId: "",
                startDate: "",
                endDate: "",
                limit: 9,
                page: 1,
            },
            cameraOptions:[],
            summaryList:{},
            total: 0,
            tableData: [],
            downloadVisible:false,
            timer:null,
            timerObj:null,
            timerChart:null,
            pickerOptions: {
                shortcuts: [{
                    text: '当日',
                    onClick(picker) {
                        const start = new Date();
                        start.setHours(0, 0, 0, 0); // 设置为00:00:00
                        const end = new Date();
                        end.setHours(23, 59, 59, 999); // 设置为23:59:59
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '当周',
                    onClick(picker) {
                        const offset = 0
                        const now = new Date();
                        const dayOfWeek = now.getDay();
                        const start = new Date(now);
                        const end = new Date(now);
                    
                        // 调整日期到本周的开始日期（星期一）
                        if (dayOfWeek !== 0) {
                            start.setDate(start.getDate() - dayOfWeek + 1);
                        }
                    
                        // 调整日期到本周的结束日期（星期日）
                        if (dayOfWeek !== 6) {
                            end.setDate(end.getDate() + 7 - dayOfWeek);
                        }
                    
                        // 可以选择性地添加天数偏移量
                        start.setDate(start.getDate() + offset * 7);
                        start.setHours(0, 0, 0, 0); 
                        end.setDate(end.getDate() + offset * 7);
                        end.setHours(23, 59, 59, 999);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '当月',
                    onClick(picker) {
                        const start = new Date();
                        const now = new Date();
                        start.setDate(1); // 设置为本月的第一天
                        start.setHours(0, 0, 0, 0); // 设置为00:00:00
                        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                        end.setHours(23, 59, 59, 999); // 设置为23:59:59
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
        };
    },
    async created() {
        await this.getOptions();
        await this.getSummaryData();
        await this.getLine();
        await this.getListData();
        let that = this;
        this.timer = setInterval(function () {
            that.getSummaryData();
        }, 5000);
        this.timerObj = setInterval(function () {
            that.getListData();
        }, 5000);
        this.timerChart = setInterval(function () {
            that.getLine();
        }, 5000);
    },
    methods: {
        // 获取统计图数据
        async getLine(){
            let formData = new FormData();
            formData.append("type", this.countType);
            if(this.countType==3){
                if(this.date&&this.date.length>0){
                    formData.append("startTime", this.date[0]);
                    formData.append("endTime", this.date[1]);
                }else{
                    formData.append("startTime", "");
                    formData.append("endTime", "");
                }
            }
            const res = await timelineV2(formData);
            let obj = res.data;
            let xAxis = obj.labels;
            let enterCount = obj.enterCounts;
            let leaveCount = obj.leaveCounts;
            let remainCount = obj.remainCounts;
            let seriesData = [
                {
                    name: "进入",
                    type: "line",
                    data: enterCount,
                    itemStyle: {
                        color: '#409EFF' // 这里设置折线的颜色为红色
                    }
                },
                {
                    name: "离开",
                    type: "line",
                    data: leaveCount,
                    itemStyle: {
                        color: '#2EAB00' // 这里设置折线的颜色为红色
                    }
                },
                {
                    name: "剩余",
                    type: "line",
                    data: remainCount,
                    itemStyle: {
                        color: '#F56C6C' // 这里设置折线的颜色为红色
                    }
                },
            ];
            const chartDom = document.getElementById("chart");
            const myChart = echarts.init(chartDom);
            myChart.clear();
            const option = {
                backgroundColor: "#fff",
                tooltip: {
                    trigger: "axis",
                },
                legend: {
                    icon: 'rect',
                    // 图例的位置
                    left: 'center',
                    // 图例的标记的样式
                    itemWidth: 12,   // 图例标记图形宽度
                    itemHeight: 8,  // 图例标记图形高度
                    itemGap: 10,     // 图例每项之间的间隔
                    data: ["进入","离开", "剩余"],
                    top: "3%",
                    right: "3%",
                },
                grid: {
                    top: "15%",
                    left: "3%",
                    right: "3%",
                    bottom: 40,
                    containLabel: true,
                },
                xAxis: {
                    type: "category",
                    boundaryGap: false,
                    data: xAxis,
                },
                yAxis: {
                    type: 'value'
                },
                series: seriesData,
                dataZoom: [
                    {
                        height: 20, //时间滚动条的高度
                        type: 'slider', //type的作用是指定数据缩放的类型，slider表示使用滑动条进行缩放，inside表示使用鼠标滚轮进行缩放。
                        xAxisIndex: 0, //作用在x轴的下标（因为x轴可以有多个）
                        filterMode: 'filter', //间滚动条的过滤模式,'filter'表示滑动时间条时会直接过滤掉不在时间范围内的数据，'weakFilter'表示滑动时间条时会逐渐过滤掉不在时间范围内的数据。
                        start: 0,  //默认开始位置（百分比）
                        end: 100,  //默认结束位置（百分比）
                    },
                    {
                        type: 'inside',
                        xAxisIndex: 0,
                        filterMode: 'filter',
                        start: 0,
                        end: 100,
                    },
                ],
            };
            myChart.setOption(option);
        },
        // 获取下拉
        async getOptions() {
            const res = await getCameraListData();
            this.cameraOptions = res.data;
        },
        handleSelect() {
            this.getLine();
            let that = this;
            if(this.timerChart){
                clearInterval(this.timerChart);
                this.timerChart = null;
            }
            this.timerChart = setInterval(function () {
                that.getLine();
            }, 5000);
        },
        // 获取总数据
        async getSummaryData(){
            let formData = new FormData();
            if(this.date&&this.date.length>0){
                formData.append("startTime", this.date[0]);
                formData.append("endTime", this.date[1]);
            }else{
                formData.append("startTime", "");
                formData.append("endTime", "");
            }
            const res = await summaryV2(formData);
            this.summaryList = res.data;
        },
        // 重置
        refreshData() {
            let dateList=[
                new Date(),
                new Date(),
            ]
            this.date = [
                this.$moment(new Date(dateList[0].setHours(0, 0, 0))).format("YYYY-MM-DD HH:mm:ss"),
                this.$moment(new Date(dateList[1].setHours(23, 59, 59))).format("YYYY-MM-DD HH:mm:ss"),
            ];
            let len = this.params.limit;
            Object.assign(this.params, {
                cameraId: "",
                limit: len,
                page: 1,
            });
            this.queryFun();
        },
        // 查询
        queryFun(){
            this.getSummaryData();
            this.getLine();
            this.getListData();
            let that = this;
            if(this.timer){
                clearInterval(this.timer);
                this.timer = null;
            }
            if(this.timerObj){
                clearInterval(this.timerObj);
                this.timerObj = null;
            }
            if(this.timerChart){
                clearInterval(this.timerChart);
                this.timerChart = null;
            }
            this.timer = setInterval(function () {
                that.getSummaryData();
            }, 5000);
            this.timerObj = setInterval(function () {
                that.getListData();
            }, 5000);
            this.timerChart = setInterval(function () {
                that.getLine();
            }, 5000);
        },
        // 分页
        handleCurrentChange(val) {
            this.params.page = val;
            this.getListData();
            if(this.timerObj){
                clearInterval(this.timerObj);
                this.timerObj = null;
            }
            let that = this;
            this.timerObj = setInterval(function () {
                that.getListData();
            }, 5000);
        },
        handleSizeChange(val) {
            this.params.limit = val;
            this.params.page = 1;
            this.getListData();
            if(this.timerObj){
                clearInterval(this.timerObj);
                this.timerObj = null;
            }
            let that = this;
            this.timerObj = setInterval(function () {
                that.getListData();
            }, 5000);
        },
        // 获取表格数据
        async getListData(){
            let formData = new FormData();
            formData.append("page", this.params.page);
            formData.append("limit", this.params.limit);
            formData.append("cameraId", this.params.cameraId);
            if(this.date&&this.date.length>0){
                formData.append("startTime", this.date[0]);
                formData.append("endTime", this.date[1]);
            }else{
                formData.append("startTime", "");
                formData.append("endTime", "");
            }
            const res = await listPage(formData);
            this.tableData = res.data;
            this.total = Number(res.count);
        },
        // 导出
        downloadFun(){
            this.downloadVisible = true;
        },
        closeHandle(){
            this.downloadVisible = false;
        },
        getTitle(type){
            const str = {
                0: '当日',
                1: '当周',
                2: '当月',
                3: '自定义',
            }[type]
            return str
        }
    },
    beforeDestroy() {
        // 在组件销毁前清除定时器
        if(this.timerObj){
            clearInterval(this.timerObj);
            this.timerObj = null;
        }
        if(this.timer){
            clearInterval(this.timer);
            this.timer = null;
        }
        if(this.timerChart){
            clearInterval(this.timerChart);
            this.timerChart = null;
        }
    },
};
</script>
<style scoped lang="scss">
.flow-see{
    background: #FFF;
    border-radius: 6px;
    padding: 16px;
    .el-menu-demo{
        width: 272px;
        margin-left: 50%;
        transform:translate(-50%, 0)
    }
    :deep(.el-menu){
        border-bottom: solid 1px #e6e6e6 !important;
    }
    :deep(.el-menu--horizontal>.el-menu-item.is-active){
        border-bottom: 2px solid #409EFF;
        color: #409EFF;
    }
    :deep(.el-menu-item){
        min-width: 60px !important;
        text-indent: 0px;
        color: #000;
        font-weight: bold;
    }
    :deep(.el-menu .el-menu-item:hover){
        background: transparent !important;
        color: #409EFF;
    }
    .seach-sty{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 5px 0px 15px 0px;
        border-bottom: 1px solid #EDF0F3;
        margin-bottom: 20px;
        .seach-flex{
            display: flex;
            align-items: center;
            font-size: 14px;
            margin-right: 10px;
        }
    }
    .flex-cont{
        margin-top: 24px;
        display: flex;
    }
    .marg-lr{
        margin: 0px 16px;
    }
    .module-cont{
        padding: 16px;
        background: #FFF;
        border: 1px solid #EBEEF5;
        border-radius: 4px;
        box-shadow: 0px 12px 32px 4px rgba(0, 0, 0, 0.04), 0px 8px 20px 0px rgba(0, 0, 0, 0.08);
    }
    .title{
        font-size: 20px;
        line-height: 28px;
        color: #303133;
    }
    .num{
        padding: 16px 0px;
        font-size: 36px;
        color: #606266;
    }
    .mar-tb{
        margin: 16px 0px;
    }
    .table-sty{
        display: grid;
        grid-template-columns: repeat(3,32%);
        justify-content: space-between;
        grid-row-gap: 20px;
        margin-bottom: 16px;
    }
    .item-sty{
        border: 1px solid #EBEEF5;
        border-radius: 4px;
        padding: 24px;
    }
    .noData {
        line-height: 120px;
        text-align: center;
    }
    .chart {
        width: 100%;
        height: 558px;
    }
    .list-title{
        color: #303133;
        font-size: 16px;
        line-height: 24px;
    }
    .list-flex{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        align-items: center;
        .mini-title{
            color: #606266;
            font-size: 12px;
            line-height: 20px;
        }
        .list-num{
            color: #303133;
            font-size: 20px;
            line-height: 28px;
        }
    }
    .border-sty{
        border: 1px solid #EBEEF5;
        border-radius: 4px;
        padding: 16px;
    }
    .left-list{
        width: 346px;
        margin-right: 32px;
        .left-item{
            border: 1px solid #E4E7ED;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        .item-title{
            padding: 20px;
            text-align: center;
            color: #303133;
            font-size: 16px;
            line-height: 24px;
            border-bottom: 1px solid #E4E7ED;
        }
        .item-cont{
            padding: 20px;
            display: flex;
            justify-content: space-between;
        }
        .cont-title{
            color: #606266;
            font-size: 12px;
            line-height: 20px;
        }
        .cont-num{
            color: #303133;
            font-size: 16px;
            line-height: 24px;
        }
    }
    .right-chart{
        border: 1px solid #E4E7ED;
        border-radius: 4px;
        padding: 20px;
        flex: 1;
        margin-bottom: 20px;
    }
}
</style>
