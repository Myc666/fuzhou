<template>
  <div>
    <div class="head-container" style="display: flex;">
      <div style="flex: 1;">
        <el-select
          placeholder="摄像头"
          clearable
          v-model="params.cameraId"
          class="head-container-input"
        >
          <el-option
            v-for="(item, index) in cameraOptions"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-select
          placeholder="算法"
          clearable
          v-model="params.algorithmId"
          class="head-container-input"
        >
          <el-option
            v-for="(item, index) in algorithmOptions"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-select
          placeholder="告警等级"
          clearable
          v-model="params.alarmLevelId"
          class="head-container-input"
        >
          <el-option
            v-for="(item, index) in alarmLevelList"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          class="margin-right-10"
          @change="getListData"
          :disabled="isDisabled"
        >
        </el-date-picker>
        <el-button type="primary" icon="el-icon-search" @click="getData()"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" @click="refreshData">重置</el-button>
      </div>
      <div class="clear-flex">
        <div class="clear-title">
          <span class="el-icon-warning-outline"  @mouseenter="onHover"  @mouseleave="hideMessage"></span>
          <span style="padding: 0px 10px 0px 5px;">数据保存期限:</span>
          <div v-if="isShowTip" class="clear-tip">数据保存期限指:告警管理内数据保存时间范围。例：“近30天”，指保存从当日起-30天内的数据，每日0点执行。</div>
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
    <div class="ai_table">
      <el-row :gutter="12" v-if="tableData.length">
        <el-col :span="6" v-for="item in tableData" :key="item.id">
          <el-card :body-style="{ padding: '0px' }" shadow="hover">
            <AlarmCard
              :fileUrl="VUE_APP_API_BASE_URL+`/report/streamThumb?id=${item.id}`"
              :dataList="handleParams(item.params)"
              :alarmData="item"
              :isAlarm="true"
              @clickDetail="clickDetail"
            >
            </AlarmCard>
          </el-card>
        </el-col>
      </el-row>
      <div class="noData" v-else>
        <el-empty description="暂无数据"></el-empty>
      </div>
      <div class="pagination">
        <el-pagination
          background
          :current-page="params.page"
          :page-size="params.limit"
          :page-sizes="[8]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>
    </div>
    <AlarmDetail
      :currentId="currentId"
      v-if="alarmDetailVisible"
      @close="(alarmDetailVisible = false), getListData()"
    />
  </div>
</template>
<script>
import Cookies from "js-cookie";
import {
  getListData,
  getCameraListData,
  getAlgorithmListData,
  getTypeListData,
  pushData,
  saveclearReportDayConfig
} from "@/api/applicationMonitoring/alarmManagement";
import { getAlarmLevelList } from "@/api/applicationMonitoring/algorithmManagement";
import { getAfterSales } from "@/api/applicationMonitoring/systemManagement";
import AlarmDetail from "@/components/applicationMonitoring/alarmManagement/alarmDetail";
import AlarmCard from "@/components/applicationMonitoring/alarmManagement/alarmCard";

export default {
  components: {
    AlarmDetail,
    AlarmCard,
  },
  props:{
    isDisabled:{
      type:Boolean,
      default:false,
    }
  },
  data() {
    return {
      loading: false,
      alarmDetailVisible: false,
      tableData: [],
      currentId: "",
      date: [
        this.$moment(new Date()).format("YYYY-MM-DD"),
        this.$moment(new Date()).format("YYYY-MM-DD"),
      ],
      params: {
        cameraId: "",
        algorithmId: "",
        alarmLevelId: "",
        type: "",
        startDate: "",
        endDate: "",
        limit: 8,
        page: 1,
      },
      total: 0,
      cameraOptions: [],
      algorithmOptions: [],
      typeOptions: [],
      alarmLevelList: [],
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
    };
  },
  async created() {
    this.getDay()
    await this.getOptions();
    this.getListData();
    await this.listAlarmLevelList();
    this.connectWebsocket();
  },
  beforeDestroy() {
    this.websocket.close();
  },
  methods: {
    getData(){
      this.params.page = 1;
      this.getListData()
    },
    // 获取下拉
    async getOptions() {
      const data1 = await getCameraListData();
      this.cameraOptions = data1.data;
      const data2 = await getAlgorithmListData();
      this.algorithmOptions = data2.data;
      const data3 = await getTypeListData();
      this.typeOptions = data3.data;
    },
    // 获取告警列表
    async getListData() {
      this.loading = true;
      this.params.startDate = this.date[0];
      this.params.endDate = this.date[1];
      const data = await getListData(this.params);
      this.tableData = data.data;
      this.total = Number(data.count);
      this.loading = false;
    },
    //
    async listAlarmLevelList() {
      const data = await getAlarmLevelList();
      this.alarmLevelList = data.data;
    },
    // 重置
    refreshData() {
      this.date = [
        this.$moment(new Date()).format("YYYY-MM-DD"),
        this.$moment(new Date()).format("YYYY-MM-DD"),
      ];

      Object.assign(this.params, {
        cameraId: "",
        algorithmId: "",
        alarmLevelId:'',
        type: "",
        limit: 8,
        page: 1,
      });
      this.getListData();
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

    // 告警详情
    clickDetail(id) {
      this.currentId = id;
      this.alarmDetailVisible = true;
    },
    // 推送告警
    pushData(item) {
      this.$confirm(`确定推送吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await pushData({
          id: item.id,
        });
        if (res.code == 0) {
          this.$message.success("推送成功");
          await this.getListData();
        }
      });
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
    handleType(type) {
      const obj = this.typeOptions.find((item) => item.id == type);
      return obj.name;
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
  },
};
</script>
<style scoped lang="scss">
.margin-right-10 {
  margin-right: 10px;
  width: 20%;
}

.el-col {
  margin-bottom: 12px;
}

.noData {
  line-height: 120px;
  text-align: center;
}

.head-container-input {
  width: 15%;
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