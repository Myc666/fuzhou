<template>
  <div style="background: #fff;border-radius: 8px;position: relative;">
    <div class="top-tabs">
      <div v-for="(items,index) in algorithmOptions" :key="index" :class="[items.isCheck?'tab-check':'tab-item']" @click="tabClick($event,index)">
        <div :class="[items.isCheck?'tab-name':'']">
          {{ items.name }}
        </div>
      </div>
    </div>
    <div class="alarm-M">
      <div class="seach-sty">
        <div style="flex: 1;display: flex;">
          <div class="seach-flex">
            <div style="margin-right: 5px;padding-bottom: 8px;">摄像头:</div>
            <div style="flex: 1;">
              <el-select
                placeholder="摄像头"
                clearable
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
          <div class="seach-flex" style="padding-bottom: 8px;margin-right: 15px;">
            <div style="margin-right: 5px;">时间:</div>
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
                @change="dateChange"
                :disabled="isDisabled"
                :clearable="false"
              >
              </el-date-picker>
            </div>
          </div>
          <el-button type="primary" icon="el-icon-search" @click="getData()">查询</el-button>
          <el-button icon="el-icon-refresh" @click="refreshData">重置</el-button>
        </div>
        <div class="clear-flex">
          <el-button type="primary" style="margin-bottom: 8px;" @click="dowloadData" :loading="dowloadLoading" :disabled="this.tableData.length==0?true:false">导出</el-button>
          <div class="clear-title">
            <el-popover
              placement="bottom-start"
              width="300"
              trigger="hover">
                <div style="font-size: 12px;line-height: 18px;">
                  数据保存期限指:告警管理内数据保存时间范围。例：“近30天”，指保存从当日起-30天内的数据，每日0点执行。
                </div>
                <span class="el-icon-warning-outline" slot="reference"></span>
            </el-popover>
            <span style="padding: 0px 10px 0px 5px;">数据保存期限:</span>
          </div>
          <el-select
            placeholder="请选择"
            v-model="clearReportDay"
            style="width: 100px;"
            @change="dayChange()"
          >
            <el-option
              v-for="(item, index) in clearDayList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div>
        <div v-if="tableData.length">
          <div class="table-sty">
            <div v-for="item in tableData" :key="item.id" class="item-sty">
              <AlarmCard
                :fileUrl="VUE_APP_API_BASE_URL+`/report/streamThumb?id=${item.id}`"
                :dataList="handleParams(item.params)"
                :alarmData="item"
                :isAlarm="true"
                @hoverFun="hoverFun"
              >
              </AlarmCard>
            </div>
          </div>
        </div>
        <div class="noData" v-else>
          <el-empty description="暂无数据"></el-empty>
        </div>
        <div class="pagination">
          <el-pagination
            background
            :current-page="params.page"
            :page-size="params.limit"
            :page-sizes="[10]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          ></el-pagination>
        </div>
      </div>
    </div>
    <div class="big-img" v-if="isBigImg">
      <MarkResult
            v-if="hoverId"
            :fileUrl="VUE_APP_API_BASE_URL+`/report/streamThumb?id=${hoverId}`"
            :dataList="hoverList"
            :imgRatio="imgRatio"
      />
    </div>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import MarkResult from "@/components/markResult";
import {
  getListData,
  getCameraListData,
  saveclearReportDayConfig,
  listTabs,
  exportAlarm
} from "@/api/applicationMonitoring/alarmManagement";
import { getAfterSales } from "@/api/applicationMonitoring/systemManagement";
import AlarmDetail from "@/components/applicationMonitoring/alarmManagement/alarmDetail";
import AlarmCard from "@/components/applicationMonitoring/alarmManagement/newCard";

export default {
  components: {
    AlarmDetail,
    AlarmCard,
    MarkResult
  },
  props:{
    isDisabled:{
      type:Boolean,
      default:false,
    }
  },
  data() {
    return {
      imgRatio:0.5,
      loading: false,
      tableData: [],
      date: [
        new Date(),
        new Date(),
      ],
      params: {
        cameraId: "",
        algorithmId: "",
        alarmLevelId: "",
        type: "",
        startDate: "",
        endDate: "",
        limit: 10,
        page: 1,
      },
      total: 0,
      cameraOptions: [],
      algorithmOptions: [],
      VUE_APP_API_BASE_URL,
      clearDayList:[
        {
          id:'30',
          name:'近30天'
        },{
          id:'20',
          name:'近20天'
        },{
          id:'14',
          name:'近14天'
        },{
          id:'10',
          name:'近10天'
        },{
          id:'7',
          name:'近7天'
        },{
          id:'5',
          name:'近5天'
        },{
          id:'3',
          name:'近3天'
        },{
          id:'1',
          name:'近1天'
        },
      ],
      clearReportDay:"30",
      oldDay:"30",
      isShowTip:false,
      isBigImg:false,
      hoverId:'',
      hoverList:[],
      dowloadLoading:false,
    };
  },
  async created() {
    this.date = [
      this.$moment(new Date(this.date[0].setHours(0, 0, 0))).format("YYYY-MM-DD HH:mm:ss"),
      this.$moment(new Date(this.date[1].setHours(23, 59, 59))).format("YYYY-MM-DD HH:mm:ss"),
    ];
    this.getDay()
    await this.getListTabs();
    await this.getOptions();
    this.getListData();
    this.connectWebsocket();
  },
  beforeDestroy() {
    this.websocket.close();
  },
  methods: {
    getData(){
      this.params.page = 1;
      this.getListData();
      this.getListTabs();
    },
    // 获取下拉
    async getOptions() {
      const data1 = await getCameraListData();
      this.cameraOptions = data1.data;
    },
    // 获取有告警的算法
    async getListTabs(){
      let formData = new FormData();
      if(this.date&&this.date.length>0){
        formData.append("startDate", this.date[0]);
        formData.append("endDate", this.date[1]);
      }
      const res = await listTabs(formData);
      if(res.data.length>0){
        res.data.forEach(item=>{
          item.isCheck=false;
        })
      }
      this.algorithmOptions = res.data;
    },
    // 选中算法
    tabClick(e,index){
      this.algorithmOptions.forEach((item,ind)=>{
        item.isCheck=false;
        if(index==ind){
          item.isCheck = true;
          this.params.algorithmId = item.id;
        }
      })
      this.params.page = 1;
      this.getListData()
    },
    // 获取告警列表
    async getListData() {
      this.loading = true;
      this.isBigImg = false;
      if(this.date&&this.date.length>0){
        this.params.startDate = this.date[0];
        this.params.endDate = this.date[1];
      }
      const data = await getListData(this.params);
      this.tableData = data.data;
      this.total = Number(data.count);
      this.loading = false;
    },
    // 改变时间
    async dateChange(){
      this.isBigImg = false;
      await this.getListTabs();
      await this.getListData();
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

      Object.assign(this.params, {
        cameraId: "",
        algorithmId: "",
        alarmLevelId:'',
        type: "",
        limit: 10,
        page: 1,
      });
      this.getListData();
      this.getListTabs();
    },
    // 创建链接
    connectWebsocket() {
      if (typeof WebSocket === "undefined") {
        console.log("您的浏览器不支持WebSocket");
        return;
      } else {
        let cookie = Cookies.get("X-Token") || this.$route.query.token
        let url = `${VUE_APP_WS_BASE_URL}/report/${cookie}`;
        // 打开一个websocket
        this.websocket = new WebSocket(url);
        // 建立连接
        this.websocket.onopen = () => {
          console.log("websocket连接成功：");
        };
        // 客户端接收服务端返回的数据
        this.websocket.onmessage = (evt) => {
          const data = JSON.parse(evt.data);
          if (data.type == "REPORT_SHOW") {
            this.getListData();
          }
        };
        // 发生错误时
        this.websocket.onerror = (evt) => {
          console.log("websocket错误：", evt);
        };
        // 关闭连接
        this.websocket.onclose = (evt) => {
          console.log("websocket关闭：", evt);
        };
      }
    },
    // 分页
    handleCurrentChange(val) {
      this.params.page = val;
      this.getListData();
    },
    handleSizeChange(val) {
      this.params.limit = val;
      this.params.page = 1;
      this.getListData();
    },
    handleParams(params) {
      try {
        return JSON.parse(params)
      } catch (err) {
        return []
      }
    },
    // 切换定时任务清除告警信息天数
    dayChange(){
      console.log(this.clearReportDay)
      let str = "";
      this.clearDayList.forEach(item=>{
        if(this.clearReportDay==item.id){
          str = item.name
        }
      })
      this.$confirm(`是否将报警数据保存期限修改为“${str}”?<div style="color: red;">(确认后保存${str}内的告警数据，每日0点执行。)</div>`, "提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
          type: "warning",
        }).then(() => {
          saveclearReportDayConfig({clearReportDay:this.clearReportDay}).then(res=>{
            this.$message({
              message: '保存成功',
              type: 'success',
              duration:500
            })
            this.oldDay = this.clearReportDay
          })
        }).catch(() => {
          this.clearReportDay = this.oldDay;
        });
    },
    //获取清除告警信息天数
    async getDay(){
        const res = await getAfterSales({tag:'clearReportDay'});
        this.clearReportDay = res.data?res.data:'30'
        this.oldDay = res.data?res.data:'30'
    },
     // 鼠标悬浮
     onHover(){
      this.isShowTip = true;
    },
    // 鼠标离开
    hideMessage() {
      this.isShowTip = false;
    },
    // 图片鼠标悬浮
    hoverFun(item){
      this.isBigImg=item.isShow;
      this.hoverId = item.id;
      this.hoverList = item.dataList
    },
    // 导出告警图片
    dowloadData() {
      this.dowloadLoading = true;
      let Obj={
        startDate:this.date[0],
        endDate:this.date[1],
        algorithmId:this.params.algorithmId,
        cameraId:this.params.cameraId
      }
      exportAlarm(Obj).then(res=>{
        this.dowloadLoading = false;
        var blob = new Blob([res.data], { type: "application/zip" });
        var url = window.URL.createObjectURL(blob);
        var linkElement = document.createElement('a');
        linkElement.setAttribute('href', url);
        linkElement.click();
        document.body.removeChild(linkElement)
      }).catch(res=>{
        this.dowloadLoading = false;
      })
      
    },
  },
};
</script>
<style scoped lang="scss">
.alarm-M{
  padding: 16px;
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
}
.noData {
  line-height: 120px;
  text-align: center;
}

.table-sty{
  display: grid;
  grid-template-columns: repeat(5,19%);
  justify-content: space-between;
  grid-row-gap: 20px;
  .item-sty{
    border: 1px solid #D3D7DD;
    border-radius: 6px;
  }
}


.top-tabs{
  background: #e7ebf0;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display:flex;
  width: 100%;
  overflow-x: auto;
  .tab-item{
    flex-shrink: 0;
    padding: 0px 20px;
    margin: 10px 0px;
    border-left: 1px solid #c2c6cd;
    font-size: 16px;
    font-weight: bold;
    line-height: 20px;
    color: #6c727d;
    cursor: pointer;
  }
  .tab-item:first-child{
    border-left: none;
  }
  .tab-check{
    flex-shrink: 0;
    padding: 10px 20px 10px 10px;
    font-size: 16px;
    line-height: 20px;
    font-weight: bold;
    color: #000;
    background: #FFF;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  .tab-check+.tab-item{
    border-left: none;
  }
  .tab-name{
    border-left: 2px solid #409EFF;
    padding-left: 8px;
  }
}
.big-img{
  width: 700px;
  padding: 10px;
  background: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow:  10px 10px 10px rgba(0,0,0,0.3);
  z-index: 99;
  pointer-events: none;
}
</style>
<style lang="scss">
.clear-flex{
  display: flex;
  align-items: center;
  .clear-title{
    font-size: 14px;
    position: relative;
    padding-bottom: 8px;
  }
  .el-icon-warning-outline:before{
    color: #b3b3b3;
  }
  .clear-tip{
    position: absolute;
    width: 290px;
    background: #FFF;
    z-index: 999;
    padding: 10px;
    top: 30px;
    right: -100px;
    border-radius: 8px;
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.3);
    font-size: 12px;
    line-height: 18px;
  }
}
</style>