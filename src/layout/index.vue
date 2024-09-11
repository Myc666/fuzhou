<template>
  <el-container class="container">
    <div class="logo">
      <img v-if="!imageError" :src="VUE_APP_API_BASE_URL + this.$store.state.appInfo.logoUrl" @error="handleImageError" />{{
        this.$store.state.appInfo.appName
      }}
      <!-- <img src="@/assets/img3/logs.png" style="width: 150px;height: 34px;" alt=""> -->
    </div>
    <el-aside class="aside" :style="{width: isCollapse ? '70px': '190px'}">
      <el-menu
          :default-active="activeIndex"
          class="elMenu"
          background-color="#fff"
          text-color="#333333"
          active-text-color="#EB3A2F"
          :unique-opened="true"
          router
          ref="elMenu"
          :collapse="isCollapse"
        >
          <myitem :data="menuArr" />
        </el-menu>
        <div class="version-sty" >
          <div style="display: flex;align-items: center;" >
            <i v-if="isCollapse" @click="isCollapse = !isCollapse" style="margin-right: 14px;font-size: 18px;" class="el-icon-s-unfold
"></i>
            <i v-else @click="isCollapse = !isCollapse" style="margin-right: 14px;font-size: 18px;" class="el-icon-s-fold"></i>
            <div v-if="!isCollapse">

                <div>版本：{{ versionNum?versionNum:'1.2.6' }}</div>
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
      </div>
    </el-aside>
    <el-container>
      <el-header>
        <div class="userInfo">
          <!-- <div class="scan">
            <span class="el-icon" style="font-size: 18px;
color: #202B3D;" @mouseenter="onHover"  @mouseleave="hideMessage">扫码登录</span>
            <div class="scan-cont" v-if="isImg">
              <img :src="VUE_APP_API_BASE_URL + '/appLoginQRCode?phone='+userInfo.nickname+'&password='+userInfo.password" style="width: 100px;height: 100px;"/>
            </div>
          </div> -->
          <!-- <span class="el-icon" style="font-size: 18px;
color: #202B3D;" @click="downFile()">使用手册下载<i class="el-icon-download"></i></span> -->
          <el-image
            style="width: 30px; height: 30px;border-radius: 50%;"
            :src="avatar"
            fit="cover"
          ></el-image>
          <el-dropdown @command="handleCommand">
            <span class="userName"
              style="font-size: 20px;
color: #202B3D;">{{ userInfo.nickname
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
        :style="{ padding: $route.meta.noPadding ? '0px' : '20px'}"
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
import Cookies from "js-cookie";
import myitem from "./components/myitem.vue";
import allRoutes from "@/router/data";
import Axios from 'axios';
import {handlePublicUrl }from '@/utils/common'
import {getLastFileOrigin }from '@/api/common'
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
          if(to.name=="算法详情"){
            this.activeIndex = "/algorithmManagement/modelTesting";
          }else{
            this.activeIndex = to.path;
          }
        }
        
      },
    },
  },
  data() {
    return {
      isCollapse:false,
      VUE_APP_API_BASE_URL,
      activeIndex: this.$route.path,
      menuArr: [],//allRoutes[0].children,
      userInfo: {
        nickname: localStorage.getItem('nickname')?localStorage.getItem('nickname'):"admin",
        password: localStorage.getItem('pw')?localStorage.getItem('pw'):"66$",
      },
      avatar: require("@/assets/images/man.png"),
      isImg:false,versionObj:{},
      isNew:true,
      isNewVersion:false,
      isHistorical:false,
      version: '',
      versionNum:'',
      imageError:false,
    };
  },
  created() {
    this.int();
    // this.getV();
    // this.handleBreadcrumb(this.$route);
  },
  methods: {
    int() {
      let menuArr = JSON.parse(JSON.stringify(allRoutes[0].children));
      if(sessionStorage.getItem("menu")){
        this.menuArr = [...menuArr,...JSON.parse(sessionStorage.getItem("menu"))]
      } else {
        this.menuArr = menuArr
      }
    },
    handleImageError(){
      this.imageError = true
    },
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
      sessionStorage.removeItem('path');
      this.$router.push('/bigScreen');
      setTimeout(function () {
        window.location.reload();
      }, 90);
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
      sessionStorage.removeItem('VocieSwitch')
      sessionStorage.removeItem('menu');
      sessionStorage.removeItem('menuTree');
      sessionStorage.removeItem('path');
      this.$store.state.routerNav = [];
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
    color: #000;
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
    // background: #041335;
    overflow: hidden;
    padding-top: 60px;

    // .scrollbar-wrapper {
    //   height: calc(100vh - 100px);
    //   overflow-x: hidden !important;
    // }
  }
  .el-header {
    // background: #041335;
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
        color: #202B3D;
        font-size: 14px;
        cursor: pointer;
      }
      .el-icon-s-unfold{
        color: #202B3D;
        font-size: 22px;
        margin-right: 30px;
        cursor: pointer;
      }
      .el-icon-download{
        color: #202B3D;
        font-size: 16px;
        margin-right: 30px;
        cursor: pointer;
      }
      .alarmSwitch {
        color: #202B3D;
        margin-right: 20px;
      }
      .userInfo-message {
        display: flex;
        align-items: center;
        margin-right: 10px;
      }
      .userName {
        color: #202B3D;
        padding: 0 10px;
        cursor: pointer;
      }
    }
  }
  .main {
    // border-radius: 20px;
    background: #f8f7f8;
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
      left: 5px;
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

::v-deep .el-menu .el-menu-item:hover{
  background: #FFE6E1 !important;
}
::v-deep .el-menu-item{
  // text-indent: 29px;
  i{
    margin-right: 20px;
  }
}
::v-deep .el-submenu__title{
  padding: 0 !important;
  i{
    margin-left: 20px;
    margin-right: 20px;
  }
}

::v-deep .el-submenu.is-active .el-submenu__title {
  background: #FFE6E1 !important;
  border-left: 3px solid #EB3A2F;
  i{
    color: #EB3A2F;
  }
  span{
    color: #EB3A2F;
  }
  
}

::v-deep .el-menu--collapse  .el-submenu__icon-arrow{
  display: none;
}

::v-deep .el-menu--collapse{
  overflow: hidden;
}

::v-deep .el-submenu__title:hover{
  background: #FFE6E1 !important;
}
.version-sty{
  font-size: 14px;
  color: #909399;
  cursor: pointer;
  padding-left: 20px;
  position: absolute;
  bottom: 40px;
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
