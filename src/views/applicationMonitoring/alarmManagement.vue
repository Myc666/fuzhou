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
        <div style="display: flex;flex-wrap: wrap;">
          <div class="seach-flex">
            <div style="margin-right: 5px;color: #202B3D;">所属组织:</div>
            <div style="flex: 1;">
              <el-cascader
                v-model="params.departIds"
                :options="depList"
                :props="{ value: 'id', label: 'name',multiple: true,}"
                collapse-tags
                clearable>
              </el-cascader>
            </div>
          </div>
          <div class="seach-flex">
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
          <el-button size="mini" style="height: 34px;padding: 0px 15px;" type="primary" icon="el-icon-search" @click="getData()">查询</el-button>
          <el-button size="mini" style="height: 34px;padding: 0px 15px;" icon="el-icon-refresh" @click="refreshData">重置</el-button>
        </div>
        <div class="clear-flex">
          <div>
              <el-radio-group v-model="params.limit" style="margin-right: 10px;">
              <el-radio-button label="12">12图</el-radio-button>
              <el-radio-button label="4">4图</el-radio-button>
            </el-radio-group>
            <el-dropdown @command="handleCommand">
              <el-button type="primary">
                导出<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="btnData.includes('alarm-export-image')" command="img" >导出告警原图</el-dropdown-item>
                <el-dropdown-item v-if="btnData.includes('alarm-export-data')" command="data" >导出告警数据</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- <el-button type="primary" style="" @click="dowloadData" :loading="dowloadLoading" :disabled="this.tableData.length==0?true:false">导出</el-button> -->
          </div>
          <div style="display: flex;align-items: center;">
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
      </div>
      <div>
        <div v-if="tableData.length">
          <div :class="'table-sty'+params.limit">
            <div v-for="(item,index) in tableData" :key="item.id" class="item-sty">
              <AlarmCard
                :fileUrl="VUE_APP_API_BASE_URL+`/report/streamThumb?id=${item.id}`"
                :originalUrl="$common.handleStream(item.id)"
                :dataList="handleParams(item.params)"
                :index="index"
                :alarmData="item"
                :isAlarm="true"
                @videoFun="getVideoUrl"
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
    <alarmVideo v-if="videoVisible" :videoUrl="videoUrl" @close="videoVisible=false;videoUrl=''"></alarmVideo>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import {
  getListData,
  getCameraListData,
  saveclearReportDayConfig,
  getCloudRecord,
  listTabs,
  exportAlarm
} from "@/api/applicationMonitoring/alarmManagement";
import { getAfterSales } from "@/api/applicationMonitoring/systemManagement";
import AlarmDetail from "@/components/applicationMonitoring/alarmManagement/alarmDetail";
import AlarmCard from "@/components/applicationMonitoring/alarmManagement/newCard";
import alarmVideo from "@/components/applicationMonitoring/alarmManagement/alarmVideo";
import {listTree} from "@/api/applicationMonitoring/boxManagement";
import Download from "@/components/applicationMonitoring/alarmManagement/downLoad"
export default {
  components: {
    AlarmDetail,
    AlarmCard,
    Download,
    alarmVideo
  },
  props:{
    isDisabled:{
      type:Boolean,
      default:false,
    }
  },
  data() {
    return {
      depList:[],
      imgRatio:0.5,
      loading: false,
      tableData: [],
      date: [
        new Date(),
        new Date(),
      ],
      params: {
        departIds:[],
        cameraId: "",
        algorithmId: "",
        alarmLevelId: "",
        type: "",
        startDate: "",
        endDate: "",
        limit: 12,
        page: 1,
      },
      total: 0,
      cameraOptions: [],
      algorithmOptions: [],
      VUE_APP_API_BASE_URL,
      clearDayList:[
        {
          id:'999',
          name:'永久保存'
        },
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
      dowloadLoading:false,
      downloadVisible:false,
      videoVisible:false,
      videoUrl:'',
      btnData:[],
    };
  },
  watch: {
    'params.limit': {
      deep: true,
      handler(val) {
        this.params.page = 1
        this.getListData();
      },
    },
  },
  async created() {
    this.getBtn();
    this.getTree();
    this.date = [
      this.$moment(new Date(this.date[0].setHours(0, 0, 0))).format("YYYY-MM-DD HH:mm:ss"),
      this.$moment(new Date(this.date[1].setHours(23, 59, 59))).format("YYYY-MM-DD HH:mm:ss"),
    ];
    this.getDay()
    await this.getOptions();
    this.getListData();
    await this.getListTabs();
    this.connectWebsocket();
  },
  beforeDestroy() {
    this.websocket.close();
  },
  methods: {
    getVideoUrl(reportId){
      console.log(reportId,'reportId')
      this.videoVisible = true;
      getCloudRecord({reportId:reportId}).then(res=>{
        if(res.code==0){
          this.videoUrl = res.data;
          this.videoVisible = true;
        } else{
          this.$message.error(res.msg)
        }
      })
    },
    getBtn(){
      this.btnData = [];
      const menuArr = JSON.parse(sessionStorage.getItem('menuTree'));
      let newArr = [];
      this.getList(menuArr).filter((item,index)=>{
        newArr.push(item.auth)
      })
      this.btnData = newArr;
    },
    getList(data){
      let arr = []
      data.forEach(item=>{
          if(item.path==this.$route.path){
              arr = item.children.filter((items,ind)=>{
                return items.type==2
              })
          }else{
              this.getList(item.children);
          }
      })
      return arr
    },
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
      this.algorithmOptions = [];
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
      let obj = {
        id:'',
        name:'全部',
      }
      this.algorithmOptions.unshift(obj)
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
      if(this.date&&this.date.length>0){
        this.params.startDate = this.date[0];
        this.params.endDate = this.date[1];
      }
      let obj = {
        ...this.params
      };
      let arr =[];
      if(obj.departIds&&obj.departIds.length>0){
          obj.departIds.forEach((item,ind)=>{
              let len = item.length-1;
              arr.push(item[len])
          })
      }
      obj.departIds = arr.length>0?arr.join(','):''
      const data = await getListData(obj);
      this.tableData = data.data;
      this.total = Number(data.count);
      this.loading = false;
    },
    // 改变时间
    async dateChange(){
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
      let len = this.params.limit;
      Object.assign(this.params, {
        cameraId: "",
        algorithmId: "",
        alarmLevelId:'',
        type: "",
        limit: len,
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
    handleCommand(command){
      console.log(command)
      if(command=='img'){
        this.dowloadData();
      }else{
        this.downloadVisible = true;
      }
    },
    closeHandle(){
      this.downloadVisible = false;
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
    // 获取部门树
    getTree(){
        listTree().then(res=>{
            if(res.data&&res.data.length>0){
                this.depList = this.getTreeData(res.data);
            }
        })
    },
    getTreeData(data) {
        data.forEach(item=>{
            if(item.children.length < 1){
                item.children = undefined;
            }else{
                this.getTreeData(item.children);
            }
        })
        return data;
    },
  },
};
</script>
<style scoped lang="scss">
.alarm-M{
  padding: 16px;
  .seach-sty{
    // display: flex;
    // justify-content: space-between;
    // flex-wrap: wrap;
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
.table-sty12{
  display: grid;
  grid-template-columns: repeat(4,24%);
  justify-content: space-between;
  grid-row-gap: 20px;
}
.table-sty4{
  display: grid;
  grid-template-columns: repeat(2,49%);
  justify-content: space-between;
  grid-row-gap: 20px;
}
.item-sty{
  border: 1px solid #D3D7DD;
  // border-radius: 6px;
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
.pagination{
  text-align: right;
  margin-top: 10px;
}
</style>
<style lang="scss">
.clear-flex{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  .clear-title{
    font-size: 14px;
    position: relative;
    // padding-bottom: 8px;
    margin-left: 10px;
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
