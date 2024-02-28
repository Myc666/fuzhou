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
          <div style="margin-top:50px;padding-left:30px;color: #FFF;font-size: 14px;">版本：V1.0.1</div>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <el-header>
        <div class="userInfo">
          <!-- <span class="alarmSwitch">报警弹窗 <el-switch v-model="$store.state.alarmSwitch"> </el-switch></span> -->
          <div class="scan">
            <span class="el-icon" @mouseenter="onHover"  @mouseleave="hideMessage">扫码登录</span>
            <div class="scan-cont" v-if="isImg">
              <img :src="VUE_APP_API_BASE_URL + '/appLoginQRCode?phone='+userInfo.nickname+'&password='+userInfo.password" style="width: 100px;height: 100px;"/>
            </div>
          </div>
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
          <img src="@/assets/images/3D.png" v-if="!isShow" style="width: 15px; margin: 0px 10px;cursor: pointer;" @click="go3D"/>
          <i class="el-icon-right" v-if="isShow" style="color: #FFFFFF;" @click="goBigScreen3D"></i>
        </div>
      </el-header>
      <el-main
        class="main"
        :style="{ padding: $route.meta.noPadding ? '0px' : '20px' }"
      >
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import Cookies from "js-cookie";
import myitem from "./components/myitem.vue";
import allRoutes from "@/router/data";
import Axios from 'axios';
import {handlePublicUrl }from '@/utils/common'
export default {
  name: "LayoutIndex",
  components: {
    myitem,
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
      isShow:false,
      isImg:false,
    };
  },
  created() {
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
    let url = window.location.href;
    if(url.indexOf('XYHWeb')!=-1){
      this.isShow = true;
    }else{
      this.isShow = false;
    }
  },
  methods: {
     // 鼠标悬浮
     onHover(){
      this.isImg = true;
    },
    // 鼠标离开
    hideMessage() {
      this.isImg = false;
    },
    // 返回3D大屏
    goBigScreen3D(){
      if (window.vuplex) {
        this.sendMessageToCSharp();
      } else {
        window.addEventListener('vuplexready', this.sendMessageToCSharp());
      }
    },
    sendMessageToCSharp() {
        window.vuplex.postMessage({ funcname: 'UnityReturnScene', datas: '' });
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
        url: handlePublicUrl('/account/download?fileName=AI平台操作手册1.0.pdf'),
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
        link.setAttribute('download', 'AI平台操作手册1.0.pdf'); // 设置下载文件的名称和扩展名  
        document.body.appendChild(link);  
        link.click();
        document.body.removeChild(link)
      })

    },
    // 跳转3D
    go3D(){
      window.open('http://39.164.53.248:33029/XYHWeb/',"_blank")
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
      height: calc(100vh - 60px);
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
        // margin-right: 30px;
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
</style>
