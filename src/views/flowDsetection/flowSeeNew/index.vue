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
                        >
                        </el-date-picker>
                    </div>
                </div>
            </div>
            <el-button size="mini" style="height: 34px;padding: 0px 15px;" type="primary" icon="el-icon-search" @click="getListData">查询</el-button>
            <el-button size="mini" style="height: 34px;padding: 0px 15px;" icon="el-icon-refresh" @click="refreshData">重置</el-button>
            <el-button size="mini" style="height: 34px;padding: 0px 15px;" type="primary" icon="el-icon-download" @click="downloadFun">导出统计数据</el-button>
        </div>
        <div>
            <el-menu :default-active="countType" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                <el-menu-item index="0">当日</el-menu-item>
                <el-menu-item index="1">当周</el-menu-item>
                <el-menu-item index="2">当月</el-menu-item>
                <el-menu-item index="9">所有</el-menu-item>
            </el-menu>
            <div style="display: flex;justify-content: center;">
                <div class="flex-cont">
                    <div class="module-cont">
                        <div class="title">进入总人数</div>
                        <div class="num">{{ summaryObj.enterCount }}</div>
                    </div>
                    <div class="module-cont marg-lr">
                        <div class="title">离开总人数</div>
                        <div class="num">{{ summaryObj.leaveCount }}</div>
                    </div>
                    <div class="module-cont">
                        <div class="title">剩余总人数</div>
                        <div class="num">{{ summaryObj.remainCount }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="title mar-tb">总人流量变化趋势</div>
        <div>
            <div class="chart" id="chart"></div>
        </div>
        <div class="title mar-tb">具体摄像机人流量统计</div>
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
                            <div class="mini-title">进入人数</div>
                            <div class="list-num">{{item.enterCount}}</div>
                        </div>
                        <div style="text-align: center;">
                            <div class="mini-title">离开人数</div>
                            <div class="list-num">{{item.leaveCount}}</div>
                        </div>
                        <div style="text-align: center;">
                            <div class="mini-title">剩余人数</div>
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
        <Download v-if="downloadVisible" :seachObj="params" @close="closeHandle"/>
    </div>
</template>
<script>
import { summary,listPage,timeline } from "./api"
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
            countType:'0',
            date: [
                new Date(),
                new Date(),
            ],
            params: {
                cameraId: "",
                startDate: "",
                endDate: "",
                limit: 9,
                page: 1,
            },
            cameraOptions:[],
            summaryObj:{},
            total: 0,
            tableData: [],
            downloadVisible:false,
            timer:null,
            timerObj:null,
        };
    },
    async created() {
        this.date = [
            this.$moment(new Date(this.date[0].setHours(0, 0, 0))).format("YYYY-MM-DD HH:mm:ss"),
            this.$moment(new Date(this.date[1].setHours(23, 59, 59))).format("YYYY-MM-DD HH:mm:ss"),
        ];
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
    },
    methods: {
        // 获取统计图数据
        async getLine(){
            const res = await timeline();
            let arr = res.data;
            if(arr && arr.length>0){
                let xAxis = arr.map((v) => {
                    return v.label;
                });
                let enterCount = arr.map((v) => {
                    return v.enterCount;
                });
                let leaveCount = arr.map((v) => {
                    return v.leaveCount;
                });
                let remainCount = arr.map((v) => {
                    return v.remainCount;
                });
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
                        name: "停留",
                        type: "line",
                        data: remainCount,
                        itemStyle: {
                            color: '#F56C6C' // 这里设置折线的颜色为红色
                        }
                    },
                ];
                const chartDom = document.getElementById("chart");
                const myChart = echarts.init(chartDom);
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
                        data: ["进入","离开", "停留"],
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
                };
                myChart.setOption(option);
            }
        },
        // 获取下拉
        async getOptions() {
            const res = await getCameraListData();
            this.cameraOptions = res.data;
        },
        handleSelect(key, keyPath) {
            this.countType = key
            if(this.timer){
                clearInterval(this.timer);
                this.timer = null;
            }
            this.getSummaryData();
            let that = this;
            this.timer = setInterval(function () {
                that.getSummaryData();
            }, 5000);
        },
        // 获取总数据
        async getSummaryData(){
            let form = new FormData();
            form.append("countType", this.countType);
            const res = await summary(form);
            this.summaryObj = res.data;
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
        height: 600px;
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
}
</style>
