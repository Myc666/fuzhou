<template>
  <el-container class="container">
    <div class="logo">
      <img :src="VUE_APP_API_BASE_URL + this.$store.state.appInfo.logoUrl" />{{
        this.$store.state.appInfo.appName
      }}
    </div>
    <el-aside class="aside" width="200px">
      <el-scrollbar class="scrollbar-wrapper">
        <el-menu
          :default-active="activeIndex"
          class="elMenu"
          background-color="#041335"
          text-color="#fff"
          active-text-color="#fff"
          :unique-opened="true"
          router
          ref="elMenu"
        >
          <myitem :data="menuArr" />
        </el-menu>
      </el-scrollbar>
      <div class="version-sty">
        <div style="display: flex;align-items: center;">
          <div>版本：{{ versionNum }}</div>
          <div class="tip-icon" v-if="isNew&&versionNum" @click="versionFun()">有更新</div>
          <div v-else>
            <el-popover
              placement="top"
              trigger="hover"
              v-if="versionNum"
            >
              <div style="font-size: 12px;">
                <span>当前已是最新版本,</span>
                <span style="color: #409EFF;cursor: pointer;" @click="historicalFun()">查看往期版本更新记录</span>
              </div>
              <div class="tip-btn" slot="reference">版本检查</div>
            </el-popover>
          </div>
        </div>
      </div>
    </el-aside>
    <el-container>
      <el-header>
        <div class="userInfo">
          <div class="scan">
            <span class="el-icon" @mouseenter="onHover"  @mouseleave="hideMessage">扫码登录</span>
            <div class="scan-cont" v-if="isImg">
              <img :src="VUE_APP_API_BASE_URL + '/appLoginQRCode?phone='+userInfo.nickname+'&password='+userInfo.password" style="width: 100px;height: 100px;"/>
            </div>
          </div>
          <!-- <span class="alarmSwitch">报警弹窗 <el-switch v-model="$store.state.alarmSwitch"> </el-switch></span> -->
          <span class="el-icon" @click="downFile()">使用手册下载<i class="el-icon-download"></i></span>
          <el-image
            style="width: 30px; height: 30px;border-radius: 50%;"
            :src="avatar"
            fit="cover"
          ></el-image>
          <el-dropdown @command="handleCommand">
            <span class="userName"
              >{{ userInfo.nickname
              }}<i class="el-icon-arrow-down el-icon--right"></i
            ></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <i class="el-icon-s-unfold" @click="changePath"></i>
        </div>
      </el-header>
      <el-main
        class="main"
        :style="{ padding: $route.meta.noPadding ? '0px' : '20px' }"
      >
        <router-view />
        <!-- 最新版本 -->
        <NewVersion v-if="isNewVersion" :title="title" :versionObj="versionObj" @closeNewVersion="closeNewVersion"/>
        <!-- 查看历史版本 -->
        <HistoricalVersion v-if="isHistorical" @closeHistory="closeHistory"/>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { getLastFileOrigin } from "@/api/common";
import Cookies from "js-cookie";
import myitem from "./components/myitem.vue";
import allRoutes from "@/router/data";
import Axios from 'axios';
import {handlePublicUrl }from '@/utils/common'
import NewVersion from "@/components/versionInfo/newVersion.vue";
import HistoricalVersion from "@/components/versionInfo/historicalVersion.vue"
export default {
  name: "LayoutIndex",
  components: {
    myitem,
    NewVersion,
    HistoricalVersion,
  },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      handler(to) {
        let x = to.path.indexOf("/");
        for (let i = 0; i < 2; i++) {
          x = to.path.indexOf("/", x + 1);
        }
        if (x > -1) {
          this.activeIndex = to.path.substring(0, x);
        } else {
          this.activeIndex = to.path;
        }
      },
    },
  },
  data() {
    return {
      VUE_APP_API_BASE_URL,
      activeIndex: this.$route.path,
      menuArr: allRoutes[0].children,
      userInfo: {
        nickname: localStorage.getItem('nickname')?localStorage.getItem('nickname'):"admin",
        password: localStorage.getItem('pw')?localStorage.getItem('pw'):"66$",
      },
      avatar: require("@/assets/images/man.png"),
      isImg:false,
      versionObj:{},
      isNew:false,
      isNewVersion:false,
      isHistorical:false,
      version: '',//当前版本
      versionNum:'',//页面展示版本号
    };
  },
  created() {
    this.getV()
    // this.handleBreadcrumb(this.$route);
    class VuplexPolyfill {
      constructor() {
        this._listeners = {};
        window.addEventListener('message', this._handleWindowMessage.bind(this));
      }
      addEventListener(eventName, listener) {
        if (!this._listeners[eventName]) {
          this._listeners[eventName] = [];
        }
        if (this._listeners[eventName].indexOf(listener) === -1) {
          this._listeners[eventName].push(listener);
        }
      }
      removeEventListener(eventName, listener) {
        if (!this._listeners[eventName]) {
          return;
        }
        const index = this._listeners[eventName].indexOf(listener);
        if (index !== -1) {
          this._listeners[eventName].splice(index, 1);
        }
      }
      postMessage(message) {
        // Don't pass a string to JSON.stringify() because it adds extra quotes.
        const messageString = typeof message === 'string' ? message : JSON.stringify(message);
        parent.postMessage({
          type: 'vuplex.postMessage',
          message: messageString
        }, '*')
      }
      _emit(eventName, ...args) {
        if (!this._listeners[eventName]) {
          return;
        }
        for (const listener of this._listeners[eventName]) {
          try {
            listener(...args);
          } catch (error) {
            console.error(`An error occurred while invoking the '${eventName}' event handler.`, error);
          }
        }
      }
      _handleWindowMessage(event) {
        if (event.data && event.data.type === 'vuplex.postMessage') {
          this._emit('message', { data: event.data.message });
        }
      };
    }
    if (!window.vuplex) {
      window.vuplex = new VuplexPolyfill();
    }
  },
  methods: {
    async getV(){
      const res = await getLastFileOrigin();
      this.versionObj = res.data;
      this.versionNum = res.data.version;
      // if(!this.version){
      //   this.versionNum = res.data.version;
      //   this.isNew = true;
      // }else{
      //   if(this.version==res.data.version){
      //     this.versionNum = res.data.version;
      //     this.isNew = false;
      //   }else{
      //     this.versionNum = this.version;
      //     this.isNew = true;
      //   }
      // }
    },
    // 鼠标悬浮
    onHover(){
      this.isImg = true;
    },
    // 鼠标离开
    hideMessage() {
      this.isImg = false;
    },
    changePath() {
      this.$router.push('/bigScreen');
      setTimeout(function () {
        window.location.reload();
      }, 100);
    },
    goBack() {
      window.history.go(-1);
    },
    handleCommand() {
      this.$store.state.userInfo = this.$store.state.menu = null;
      this.$store.state.cookies = "";
      Cookies.remove("X-Token");
      localStorage.removeItem('nickname')
      localStorage.removeItem('pw')
      this.$router.push("/login");
    },
    downFile(){
      // Axios({
      //   url:handlePublicUrl('/account/download?fileName=使用说明.txt'),

      // })

      Axios({
        url: handlePublicUrl('/account/download?fileName=AI视觉监控产品使用手册.zip'),
        method:'get',  //默认get方法，可以不写
        responseType:'blob',  //或者是blob
        headers:{
          'X-Token':Cookies.get('X-Token'),
          'Access-Control-Allow-Origin': '*',  
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',  
          'Access-Control-Allow-Headers': 'Content-Type, Authorization' 
        }
      }).then(res=>{
        const url = window.URL.createObjectURL(new Blob([res.data]));  
        const link = document.createElement('a');  
        link.href = url;  
        link.setAttribute('download', 'AI视觉监控产品使用手册.zip'); // 设置下载文件的名称和扩展名  
        document.body.appendChild(link);  
        link.click();
        document.body.removeChild(link)
      })

    },
    // 查看最新版本
    versionFun(){
      this.title = "AI视频监控平台 "+this.versionObj.version+" 正式发布"
      this.isNewVersion = true;
    },
    // 关闭最新版本
    closeNewVersion(){
      this.isNewVersion = false;
    },
    // 查看历史版本
    historicalFun(){
      this.isHistorical = true;
    },
    closeHistory(){
        this.isHistorical = false;
    }
  },
};
</script>
<style scoped lang="scss">
.container {
  height: 100vh;
  .logo {
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 3;
    img {
      max-height: 40px;
      margin-right: 10px;
    }
  }
  .aside {
    background: #041335;
    overflow: hidden;
    padding-top: 60px;

    .scrollbar-wrapper {
      height: calc(100vh - 100px);
      overflow-x: hidden !important;
    }
  }
  .el-header {
    background: #041335;
    color: #333;
    line-height: 60px;
    box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.12);
    position: relative;
    z-index: 2;
    .userInfo {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .el-icon{
        color: #fff;
        font-size: 14px;
        cursor: pointer;
      }
      .el-icon-s-unfold{
        color: #fff;
        font-size: 22px;
        margin-right: 30px;
        cursor: pointer;
      }
      .el-icon-download{
        color: #fff;
        font-size: 16px;
        margin-right: 30px;
        cursor: pointer;
      }
      .alarmSwitch {
        color: #fff;
        margin-right: 20px;
      }
      .userInfo-message {
        display: flex;
        align-items: center;
        margin-right: 10px;
      }
      .userName {
        color: #fff;
        padding: 0 10px;
        cursor: pointer;
      }
    }
  }
  .main {
    border-radius: 20px;
    background: #f1f5fb;
    margin: 0 20px 20px 0;
    position: relative;
    .subMain {
      background: #fff;
      .subMain-title {
        height: 50px;
        background: #f9f9f9;
        padding: 0 15px;
        display: flex;
        align-items: center;
      }
      .subMain-content {
        padding: 15px;
      }
    }
  }
  .header {
    display: flex;
    align-items: center;
  }
  .scan{
    padding-right: 20px;
    position: relative;
    .scan-cont{
      position: absolute;
      background-color: #fff;
      top: 45px;
      height: 100px;
      box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.3);
    }
  }
}
::v-deep .el-scrollbar__wrap {
  overflow-x: hidden;
}
::v-deep .el-menu {
  border: none;
}
::v-deep .el-menu .el-menu-item.is-active {
  background: #2099fa !important;
}
.version-sty{
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  padding-left: 20px;
  .tip-icon{
    background: #67C23A;
    border: 1px solid #fff;
    font-size: 12px;
    line-height: 22px;
    border-radius: 22px;
    padding: 0px 6px;
    margin-left: 5px;
  }
  .tip-btn{
    font-size: 12px;
    line-height: 22px;
    border-radius: 22px;
    padding: 0px 6px;
    margin-left: 5px;
    border: 1px solid #FFF;
    background: #4C4C4C;
  }
}
</style>
