<template>
  <div id="app">
    <router-view />
    <AlarmDetail
      :currentId="currentId"
      v-if="alarmDetailVisible"
      @close="alarmDetailVisible = false"
    />
    <div class="afterSales" v-if="isShow && $store.state.afterSalesUrl" @mouseenter="onHover"  @mouseleave="hideMessage">
      <div class="txt" v-if="!isUrlShow">技术支持</div>
      <div v-else>
        <img :src="VUE_APP_API_BASE_URL + '/config/upload/stream?file=' + $store.state.afterSalesUrl" style="width: 80px;height: 80px;"/>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { getAppInfo } from "@/api/common";
import { getAfterSales } from "@/api/applicationMonitoring/systemManagement";
import AlarmDetail from "@/components/applicationMonitoring/alarmManagement/alarmDetail";
export default {
  components: {
    AlarmDetail,
  },
  name: "App",
  data() {
    return {
      websocket: null,
      downLoadWebsocket:null,
      alarmDetailVisible: false,
      currentId: '',
      isUrlShow:false,
      VUE_APP_API_BASE_URL,
      isShow:false,
    };
  },
  watch: {
    "$store.state.cookies": {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          this.connectWebsocket();
          this.downLoadWebsocketFun();
        }else {
          if(this.websocket){
            this.websocket.close();
          }
          if(this.downLoadWebsocket){
            this.downLoadWebsocket.close();
          }
          // this.websocket?.close();
          // this.downLoadWebsocket?.close();
        }
      },
    },
    "$route.query.token": {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          this.connectWebsocket();
          this.downLoadWebsocketFun();
        }else {
          if(this.websocket){
            this.websocket.close();
          }
          // this.websocket?.close();
        }
      },
    },
    "$route.path":{
      handler(val) {
        if (val) {
          if(val=='/bigScreen' || val=='/login' || val =='/' || val=="/dataManagement/alarmManagement1"){
            this.isShow = false;
          }else{
            this.isShow = true;
          }

          if (window.location.href.includes('?token')) {
            this.isShow = false;
          }
        }
      },
    },

  },
  created() {
    this.getAppInfo()
    this.getData();
    // this.getV()
    if(!localStorage.getItem('publicStyle')){
      localStorage.setItem('publicStyle',JSON.stringify({}))
    }
  },
  mounted () {
    window.clickDetail = (id) => {
      this.currentId = id
      this.alarmDetailVisible = true
    };

  },
  methods: {

    //获取售后二维码
    async getData(){
        const res = await getAfterSales({tag:'afterSalesQRCodes'});
        if(res.code==0){
          this.$store.commit('setAfterSalesUrl', res.data);
        }
    },
    // 鼠标悬浮
    onHover(){
      this.isUrlShow = true;
    },
    // 鼠标离开
    hideMessage() {
      this.isUrlShow = false;
    },
    async getAppInfo() {
      const data = await getAppInfo();
      this.appInfo = data.data
      this.$store.state.appInfo.appName = this.appInfo.appName
      this.$store.state.appInfo.logoUrl = this.appInfo.logoUrl
      this.$store.state.appInfo.screenName = this.appInfo.screenName
      this.$store.state.appInfo.screenLogoUrl = this.appInfo.screenLogoUrl
    },
    // 创建链接
    connectWebsocket() {
      if (typeof WebSocket === "undefined") {
        console.log("您的浏览器不支持WebSocket");
        return;
      } else {
        let url = `${VUE_APP_WS_BASE_URL}/message/${Cookies.get('X-Token')}`;
        // 打开一个websocket
        this.websocket = new WebSocket(url);
        // 建立连接
        this.websocket.onopen = () => {
          console.log("websocket连接成功：");
        };
        // 客户端接收服务端返回的数据
        this.websocket.onmessage = (evt) => {
          const data = JSON.parse(evt.data);
          this.$message({
            type: "warning",
            dangerouslyUseHTMLString: true,
            message: `${data.content}<span style="margin-left:20px;color:#2099fa;cursor:pointer;" onclick ='clickDetail("${data.data.reportId}")'>查看详情</span>`,
          });
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
    clickDetail (id) {
      console.log(222222222,id)
    },
    // 创建链接----推模型测试--下载文件结果
    downLoadWebsocketFun() {
      if (typeof WebSocket === "undefined") {
        console.log("您的浏览器不支持WebSocket");
        return;
      } else {
        let url = `${VUE_APP_WS_BASE_URL}/download/${Cookies.get('X-Token')}`;
        // 打开一个websocket
        this.downLoadWebsocket = new WebSocket(url);
        // 建立连接
        this.downLoadWebsocket.onopen = () => {
          console.log("websocket连接成功：");
        };
        // 客户端接收服务端返回的数据
        this.downLoadWebsocket.onmessage = (evt) => {
          const data = JSON.parse(evt.data);
          this.$store.commit('setAlgorithmDownload',data);
          this.$message({
            type: data.type==1?"error":"success",
            message: data.title,
          });
        };
        // 发生错误时
        this.downLoadWebsocket.onerror = (evt) => {
          console.log("websocket错误：", evt);
        };
        // 关闭连接
        this.downLoadWebsocket.onclose = (evt) => {
          console.log("websocket关闭：", evt);
        };
      }
    },

  },
  beforeDestroy() {
    if(this.websocket){
      this.websocket.close();
    }
    if(this.downLoadWebsocket){
      this.downLoadWebsocket.close();
    }
    // this.websocket?.close();
    // this.downLoadWebsocket?.close();
  },
};
</script>
<style lang="scss">
@import "@/style.scss";

* {
  margin: 0;
  padding: 0;
  list-style: none;
}
html {
  font-size: 100px;
  // height: 100%;
  // width: 100%;
  overflow: hidden;
}
body {
  font-size: 12px;
  // width: 100%;
  // height: 100%;
  overflow: hidden;
  box-sizing: inherit;
  text-rendering: optimizeLegibility;
  font-family: PingFang SC, Helvetica Neue, Helvetica, Hiragino Sans GB, Arial,
    sans-serif;
}
#app {
  // background: #041335;
}
.view-files-class {
  .el-avatar > img {
    width: 100% !important;
  }
}
.el-menu-item {
  min-width: 190px !important;
  span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.el-notification {
  z-index: 1000 !important;
  width: 390px !important;
}
.notify-all {
  p {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  h6 {
    margin: 4px auto !important;
    display: inline-block;
    border: 1px solid #17a1ff;
    padding: 6px 66px;
    color: #fff;
    background: #17a1ff;
    border-radius: 20px;
    cursor: pointer;
  }
}
.notify-class {
  .notify-class-btn {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    .btn {
      padding: 10px 30px;
      background: #409eff;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 20px;
      cursor: pointer;
    }
  }
}
html,
body {
  padding: 0;
  margin: 0;
}
.user {
  .el-table {
    width: 100%;
    .el-table__header-wrapper table,
    .el-table__body-wrapper table {
      width: 100% !important;
    }
    .el-table__body,
    .el-table__footer,
    .el-table__header {
      table-layout: auto;
    }
  }
}
.afterSales{
  position: fixed;
  top: 40%;
  right: 20px;
  z-index: 999;
  .txt{
    width: 30px;
    writing-mode: vertical-rl;
    text-orientation: upright;
    line-height: 2.2;
    border: 1px solid #cccccc;
    background: #fff;
    padding: 10px 0px;
    color: #2099fa;
    cursor: pointer;
    font-size: 12px;
    letter-spacing: 2px;
    border-top-left-radius: 7px;
    border-bottom-left-radius: 7px;
  }
}


/* 自定义整个滚动条 */
::-webkit-scrollbar {
  width: 5px; /* 设置滚动条的宽度 */
  height: 5px; /* 设置滚动条的高度 */
}

/* 自定义滚动条轨道 */
::-webkit-scrollbar-track {
  background: #f1f1f1; /* 设置轨道的背景颜色 */
}

/* 自定义滚动条的滑块（thumb） */
::-webkit-scrollbar-thumb {
  background: #f1f1f1; /* 设置滑块的背景颜色 */
}

/* 当滑块悬停或活动时自定义滚动条的滑块 */
::-webkit-scrollbar-thumb:hover {
  background: #555; /* 设置滑块在悬停状态下的背景颜色 */
}
</style>
