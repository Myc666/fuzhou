<template>
  <div class="wrap video-dialog">
    <div class="flex-left" >
        <el-card class="box-card" style="height: calc(100vh - 150px) !important;">
        <div class="video-box" :class="'video' + params.limit">
        <div
            class="video-item"
            ref="videoItem"
          >
            <div
              class="video"
              v-if="videoUrl"
            >
            <iframe
                :src="videoUrl"
                width="100%" 
                height="100%"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
            ></iframe>
                <!-- <video :src="videoUrl" controls autoplay muted width="100%" height="100%" ></video> -->
            </div>
            <div class="dropdown">
              <el-select
                placeholder="视频源"
                v-model="boxId"
                class="head-container-input"
                @change="changeSelect()"
                style="width: 120px"
              >
                <el-option
                  v-for="(subItem, subIndex) in ipOptions"
                  :key="subIndex"
                  :label="subItem.ipAddr"
                  :value="subItem.id"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div
            class="video-item"
            v-if="!videoUrl"
          >
            <div style="width: 100%; text-align: center">
              暂无数据
            </div>
          </div> 
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
          <span>弹窗 <el-switch v-model="alarmSwitch"> </el-switch></span>
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
    <div class="video-dialog" v-if="detailVisible">
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
    <!-- 查看详情 -->
    <AlarmDetail :currentId="currentId" v-if="alarmDetailVisible" @close="alarmDetailVisible = false" />
  </div>
</template>
<script>
import Cookies from "js-cookie";
import "xgplayer/dist/index.min.css";
import AlgorithmList from "@/components/applicationMonitoring/videoStreamManagement/algorithmList";
import AlarmPopup from "@/components/applicationMonitoring/videoStreamManagement/alarmPopup/newPopup";
import AlarmManagement from "../alarmManagement"
import {
  getAlgorithms,
  getAlarms,
  getCounter,
  getPlayUrlByBox
} from "@/api/applicationMonitoring/videoStreamManagement";
import AlarmDetail from "@/components/applicationMonitoring/alarmManagement/alarmDetail";
import { listPage } from "@/api/applicationMonitoring/casketManagement";
export default {
  components: {
    AlgorithmList,
    AlarmPopup,
    AlarmManagement,
    AlarmDetail,
  },
  data() {
    return {
      VUE_APP_API_BASE_URL,
      detailVisible:false,
      alarmSwitch: true,
      algorithmListVisible: false,
      alarmVisible: false,
      alarmData: {},
      algorithmList: [],
      alarmsList: [],
      alarmsCount: 0,
      websocket: null,
      timer: null,
      params: {
        page: 1,
        limit: 1,
      },
      currentId:'',
      alarmDetailVisible:false,
      ipOptions:[],
      boxId:'',
      videoUrl:'',
    };
  },
  watch: {
    'params.limit': {
      deep: true,
      handler(val) {
        this.params.page = 1
        // this.getListPageActives();
      },
    },
  },
  async created() {
    this.getAlgorithms();
    this.getAlarms();
    this.getCounter();
    this.connectWebsocket();
    await this.getIPData();
    await this.getPlayUrl();
  },
  methods: {
    async getIPData() {
      const res = await listPage();
      this.ipOptions=res.data;
      if(res.data&&res.data.length>0){
          this.boxId = res.data[0].id;
      }
    },
    // 获取视频url
    async getPlayUrl(){
      const res = await getPlayUrlByBox({boxId:this.boxId})
      this.videoUrl = res.data;
    },
    // 获取算法列表
    async getAlgorithms() {
      const data = await getAlgorithms();
      this.algorithmList = data.data;
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
            if (this.alarmSwitch) {
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
    changeSelect() {
      this.getPlayUrl();
    },

    // 查看当日
    detailFun(){
      this.detailVisible = true;
    },
    // 关闭弹窗
    closeHandle(){
      this.detailVisible = false;
      this.getAlgorithms();
      this.getPlayUrl();
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
    // 新增摄像头后刷新
    refreshFun(){
      this.getPlayUrl();
      this.getCameraListData();
    }
  },
  beforeDestroy() {
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
.flex-left {
  flex: 1;
  .algorithms-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .video-box {
    width: 100%;
    height: 630px;
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
