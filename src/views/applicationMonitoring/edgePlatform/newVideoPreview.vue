<template>
  <div class="wrap video-dialog">
    <div class="flex-left">
      <el-card class="box-card">
        <div
          slot="header"
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
          "
        >
          <span>
            <span style="padding-right: 20px;font-size: 14px;">实时视频流</span>
          </span>
          <div>
            <el-button type="primary" style="margin-right: 20px;" @click="detailFun">查看当日</el-button>
            <el-radio-group v-model="params.limit">
              <el-radio-button label="1">一屏</el-radio-button>
              <el-radio-button label="4">四屏</el-radio-button>
              <el-radio-button label="6">六屏</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="video-box" :class="'video' + params.limit">
          <div
            class="video-item"
            ref="videoItem"
            v-for="(item, index) in activeList"
            :key="index"
          >
            <div style="position: absolute;width: 100%;height: 100%;" v-if="item.id">
              <VideoBox v-if="item.id" :cameraOptions="cameraOptions" :Id="item.id" :index="index" :ref="'video'+index"></VideoBox>
            </div>
          </div>
          <div
            class="video-item"
            v-for="i in Number(params.limit) > activeList.length
              ? Number(params.limit) - activeList.length
              : 0"
            :key="'key' + i"
          >
            <div style="width: 100%; text-align: center">
              <i class="el-icon-loading"></i> 视频源
            </div>
          </div>
        </div>
        <div class="pagination video-p">
          <el-pagination
            background
            :current-page="params.page"
            :page-size="params.limit"
            layout="slot, prev, pager, next, jumper"
            :total="total"
            @current-change="handleCurrentChange"
          >
          <template  #default>
            <span class="el-pagination__total is-first">共 {{ total }} 路</span>
          </template>
          </el-pagination>
        </div>
      </el-card>
    </div>
    <div class="flex-right">
      <el-card class="box-card">
        <div
          slot="header"
          style="
            display: flex;
            
            justify-content: space-between;
            font-size: 14px;
          "
        >
          <span>实时数据</span>
          <span>语音 <el-switch size="mini" v-model="VocieSwitch" @change="switchChange"> </el-switch></span>
          <span>弹窗 <el-switch v-model="$store.state.alarmSwitch"> </el-switch></span>
        </div>
        <div class="count">
          今日告警数量：<span>{{ alarmsCount }}</span>
        </div>
        <el-scrollbar class="scrollbar-wrapper">
          <ul class="list">
            <li v-for="(item, index) in alarmsList" :key="index">
              <el-image class="img" :src="VUE_APP_API_BASE_URL+`/report/streamThumb?id=${item.id}`" fit="cover">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
              <el-descriptions :column="1">
                <el-descriptions-item label="告警类型">{{
                  item.algorithmName
                }}</el-descriptions-item>
                <el-descriptions-item label="所属摄像机">{{
                  item.cameraName
                }}</el-descriptions-item>
                <el-descriptions-item label="区域名称">{{ item.wareName }}</el-descriptions-item>
                <el-descriptions-item label="告警时间">{{ item.alarmTime }}</el-descriptions-item>
              </el-descriptions>
            </li>
          </ul>
        </el-scrollbar>
      </el-card>
    </div>
    <AlgorithmList
      v-if="algorithmListVisible"
      @close="(algorithmListVisible = false), getAlgorithms()"
    />
    <AlarmPopup
      v-if="alarmVisible"
      :alarmData="alarmData"
      :fileUrl="VUE_APP_API_BASE_URL+`/report/streamThumb?id=${alarmData.id}`"
      @close="alarmVisible = false"
    />
    <!-- 查看当日 -->
    <el-dialog
      :close-on-click-modal="false"
      width="90%"
      top="5vh"
      title="查看当日"
      :visible.sync="detailVisible"
      @close="closeHandle"
    >
      <AlarmManagement :isDisabled="true" v-if="detailVisible"/>
    </el-dialog>
  </div>
</template>
  <script>
  import Cookies from "js-cookie";
  import AlgorithmList from "@/components/applicationMonitoring/videoStreamManagement/algorithmList";
  import AlarmPopup from "@/components/applicationMonitoring/videoStreamManagement/alarmPopup/newPopup";
  import AlarmManagement from "../alarmManagement"
  import {
    getAlgorithms,
    getListPageActives,
    getAlarms,
    getCounter,
    getCameraListData,
    playings,
  } from "@/api/applicationMonitoring/videoStreamManagement";
  import AlarmDetail from "@/components/applicationMonitoring/alarmManagement/alarmDetail";
  import VideoBox from "@/components/applicationMonitoring/videoStreamManagement/videoBox";
  export default {
    components: {
      AlgorithmList,
      AlarmPopup,
      AlarmManagement,
      AlarmDetail,
      VideoBox
    },
    data() {
      return {
        VUE_APP_API_BASE_URL,
        detailVisible:false,
        // alarmSwitch: true,
        VocieSwitch:sessionStorage.getItem('VocieSwitch')=='false'?false:true,
        algorithmListVisible: false,
        alarmVisible: false,
        alarmData: {},
        algorithmList: [],
        cameraOptions: [],
        activeList: [],
        alarmsList: [],
        playerList: [],
        alarmsCount: 0,
        websocket: null,
        timer: null,
        params: {
          page: 1,
          limit: 6,
        },
        total: 0,
        timerPlayings:'',
        playerKeyframe: [],
          timerKeyframe: '',
          checkKeyframeRun: false,
        playType:0,
        currentId:'',
        alarmDetailVisible:false,
      };
    },
    watch: {
      'params.limit': {
        deep: true,
        handler(val) {
          this.params.page = 1
          this.getListPageActives(1);
        },
      },
    },
    async created() {
      await this.getCameraListData();
      await this.getListPageActives();
      this.getAlarms();
      this.getCounter();
      this.connectWebsocket();
    },
    methods: {
      // 获取算法列表
      async getAlgorithms() {
        const data = await getAlgorithms();
        this.algorithmList = data.data;
      },
      // 获取摄像头列表
      async getCameraListData() {
        const data = await getCameraListData();
        let Arr = data.data.filter(item=>{
          return item.running == "1"
        })
        this.cameraOptions = Arr;
      },
      // 获取视频流并播放
      async getListPageActives(type) {
        let obj ={
          playType:this.playType,
          ...this.params
        }
        const data = await getListPageActives(obj);
        this.activeList = data.data;
        if(this.activeList.length>0&&type==1){
          this.activeList.forEach((item,index)=>{
            let obj = localStorage.getItem('playType'+item.id)
            if(obj !=null){
              let NewObj = JSON.parse(obj)
              if(NewObj.cameraId == item.id){
                this.$refs['video'+index][0].playType = NewObj.playType
              }
            }else{
              this.$refs['video'+index][0].playType = 0
            }
            this.$refs['video'+index][0].cameraId = this.activeList[index].id
            this.$refs['video'+index][0].getPlayUrl()
          })
        }
        this.total = Number(data.count);
      },
      // 分页
      handleCurrentChange(val) {
        this.params.page = val;
        this.getListPageActives(1);
      },
      async savePlayings(){
          let newArr = [];
          if(this.activeList.length>0){
              this.activeList.forEach((item)=>{
                  if(item.id){
                      newArr.push(item.id)
                  }
              })
          }
          playings({cameraIds:newArr}).then(res=>{
  
          }).catch(res => {
            clearInterval(this.timerPlayings);
            this.timerPlayings=''
          });;
      },
      // 获取实时告警数据
      async getAlarms() {
        const data = await getAlarms();
        this.alarmsList = data.data;
      },
      // 获取告警数量
      async getCounter() {
        const data = await getCounter();
        this.alarmsCount = data.data;
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
              if(this.VocieSwitch){
                let audio = new Audio(VUE_APP_API_BASE_URL+'/algorithm/sound/stream?id='+ data.algorithmId);
                // 播放音频
                audio.play();
              }
              if (this.$store.state.alarmSwitch) {
                this.alarmVisible = false;
                clearTimeout(this.timer);
                this.$nextTick(() => {
                  this.alarmData = data;
                  this.alarmVisible = true;
                  this.timer = setTimeout(() => {
                    this.alarmVisible = false;
                  }, 5000);
                });
              }
            }
            this.getAlarms();
            this.getCounter();
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
      switchChange(){
        sessionStorage.setItem('VocieSwitch',this.VocieSwitch)
      },
      // 查看当日
      detailFun(){
        this.detailVisible = true;
      },
      // 关闭弹窗
      closeHandle(){
        this.detailVisible = false;
        this.getAlgorithms();
        this.getListPageActives(1);
        this.getAlarms();
        this.getCounter();
        this.getCameraListData();
        this.connectWebsocket();
      },
      // 告警详情
      clickDetail(item) {
        this.currentId = item.id;
        this.alarmDetailVisible = true;
      },
    },
    beforeDestroy() {
      // clearInterval(this.timerKeyframe);
      // this.timerKeyframe=''
      // clearInterval(this.timerPlayings);
      // this.timerPlayings=''
      // this.playerList.forEach((item) => {
      //   item.destroy();
      // });
      this.websocket.close();
    },
  };
  </script>
  <style scoped lang="scss">
  .video-dialog{
  :deep(.el-dialog__body){
    background: #f1f5fb;
  }
}
.wrap {
  display: flex;
  .video-p{
    :deep(.el-pagination){
      text-align: left !important;
    }
  }
  .flex-left {
    flex: 1;
    .algorithms-list {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .video-box {
      width: 100%;
      height: 530px;
      background: rgba(47, 64, 86, 0.7);
      display: grid;
      overflow: hidden;
      .video-item {
        border: 1px #2f4056 solid;
        display: flex;
        align-items: center;
        position: relative;
        .video {
          position: absolute;
        }
        .dropdown {
          position: absolute;
          right: 10px;
          top: 10px;
          z-index: 10;
        }
      }
    }
    .video1 {
      grid-template-columns: 100%;
      grid-template-rows: 100%;
    }
    .video4 {
      grid-template-columns: 50% 50%;
      grid-template-rows: 50% 50%;
    }
    .video6 {
      grid-template-columns: 33.33% 33.33% 33.33%;
      grid-template-rows: 50% 50% 50%;
    }
  }
  .flex-right {
    width: 280px;
    margin-left: 20px;
    flex-shrink: 0;

    .count {
      font-size: 16px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        font-size: 24px;
        color: #f43838;
      }
    }
    .scrollbar-wrapper {
      height: calc(100vh - 265px);
      overflow: hidden !important;
    }
    .list {
      li {
        border-bottom: 1px #ccc solid;
        margin-top: 20px;
        .img {
          width: 100%;
          height: 100px;
        }
      }
    }
  }
}
</style>
  