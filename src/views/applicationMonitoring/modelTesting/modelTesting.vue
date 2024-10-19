<template>
  <div class="model-cont">
    <!-- <div class="top-tabs">
      <div v-for="(items,index) in tagList" :key="index" :class="[items.isCheck?'tab-check':'tab-item']" @click="checkFun(index)">
        <div :class="[items.isCheck?'tab-name':'']">
          {{ items.name }}
        </div>
      </div>
    </div> -->
    <div class="head-cont">
      <div class="head-txt">探索人工智能模型</div>
      <div style="display: flex;align-items: center;">
        <div style="font-size: 16px;">搜索场景:</div>
        <div style="margin: 0px 10px;">
          <el-input placeholder="请输入场景关键字" style="width: 300px;" v-model="name" size="mini"></el-input>
        </div>
        <div>
          <el-button size="mini" type="primary" @click="seachFun">搜索</el-button>
        </div>
      </div>
      <div class="flex-btn">
        <div class="level-btn" v-if="btnData.includes('algorithm-add')" @click="addData">
          <!-- <span class="el-icon-plus"></span> -->
          <span>新增算法</span>
        </div>
        <div class="level-btn" v-if="btnData.includes('algorithm-alarm-level')" @click="addAlarmLevelData">
          <span>告警等级管理</span>
        </div>
        <div class="level-btn"  v-if="btnData.includes('algorithm-alarm-voice')" @click="addAlarmVoice">
          <span>告警语音管理</span>
        </div>
      </div>
    </div>
    <div class="flex-cont">
      <div class="right-cont" id="rightCont" v-loading="loading">
        <div class="top-tip" v-if="isShow">
          <div class="go-back" @click="goBack">
            <span class="el-icon-back"></span>
            <span style="padding: 0px 32px 0px 5px;">返回查看更多模型</span>
          </div>
          <div>共{{ algorithmList.length }}个相关模型</div>
        </div>
        <div>
          <div :class="[type==0?'flex-item flex-item-w32':type==2?'flex-item flex-item-w19':'flex-item flex-item-w24']" v-if=" algorithmList.length>0">
            <div v-for="(items,ind) in algorithmList" :key="ind" class="algorithm-item" @click="items.image&&items.isShowImg&&isDetail?detailFun(items.id):''">
              <div v-if="items.hasUpdate" style="position: absolute;top: 0px;right: -1px;z-index: 99;">
                <img src="@/assets/images/modelTesting/update-icon.png" style="width: 60px;"/>
              </div>
              <div class="img-cont"  :style="{ filter: (!items.hasLocalFile&&!items.hasGitFile)?'grayscale(100%)':''}">
                <el-image v-if="items.image&&items.isShowImg" :src="VUE_APP_API_BASE_URL+`/algorithm/picStream?file=${items.image}`" style="width: 100%;height: 100%;" @error="handleImageError(ind)"></el-image>
                <img v-else src="@/assets/images/modelTesting/default.png" style="width: 100%;height: 100%;"/>
              </div>
              <div class="alg-cont">
                <div style="display: flex;">
                  <div class="alg-txt">{{ items.name }}</div>
                  <div v-if="items.alarmLevel.name" style="margin-left: 10px;">
                    <el-tag size="mini" style="font-size: 12px" :style="{
                      borderColor: items.alarmLevel.showColor,
                      color: items.alarmLevel.showColor,
                      backgroundColor: items.alarmLevel.showColorAlpha,
                    }">{{ items.alarmLevel.name }}</el-tag>
                  </div>
                </div>
                <div class="alg-tip">{{ items.marks }}</div>
                <div>
                  <!-- <div class="alg-btn-flex" v-if="items.hasGitFile||items.hasLocalFile">
                    <div class="alg-btn" @click.stop="upgradeFun(items)" v-if="items.hasLocalFile&&items.downloadState!='下载中'" style="margin-right: 10px;">
                      算法升级
                    </div>
                    <div class="alg-btn" @click.stop="editData(items)" :style="{marginRight: items.hasLocalFile?'10px':''}">
                      {{items.hasLocalFile?(items.downloadState=='已启用'?'编辑':items.downloadState):'下载'}}
                    </div>
                    <div class="alg-del-btn" v-if="items.hasLocalFile&&items.downloadState!='下载中'" @click.stop="deleteData(items)">
                      卸载
                    </div>
                  </div>
                  <div v-else class="alg-btn-flex">
                    <div class="optimize-btn">优化中，敬请期待</div>
                    <div class="upload-btn" @click.stop="uploadFun(items)">手动导入模型文件</div>
                  </div> -->
                    <div class="alg-btn-flex">
                      <div class="alg-btn" v-if="(items.hasGitFile||items.hasLocalFile)&&btnData.includes('algorithm-edit')" @click.stop="editData(items)">
                        {{items.hasLocalFile?(items.downloadState=='已启用'?'编辑':items.downloadState):'下载'}}
                      </div>
                      <!-- <div v-if="!items.hasGitFile||!items.hasLocalFile" class="alg-btn">
                        <div class="optimize-btn">优化中，敬请期待</div>
                        <div class="upload-btn" @click.stop="uploadFun(items)">导入模型文件</div>
                      </div> -->
                      <el-dropdown @command="(command) => handleCommand(command, items)" trigger="click">
                        <span class="more-btn"  @click.stop="">
                          更多<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item v-if="(items.hasLocalFile&&items.downloadState!='下载中')&&btnData.includes('algorithm-unload')" command="1" icon="el-icon-delete">卸载算法</el-dropdown-item>
                          <el-dropdown-item v-if="btnData.includes('algorithm-import')" command="2" icon="el-icon-upload2">导入模型文件</el-dropdown-item>
                          <el-dropdown-item v-if="(items.hasLocalFile&&items.downloadState!='下载中')&&btnData.includes('algorithm-version')" command="3" icon="el-icon-coin">版本管理</el-dropdown-item>
                          <el-dropdown-item v-if="btnData.includes('algorithm-delete')" command="4" icon="el-icon-circle-close">删除卡片</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                </div>
              </div>
            </div>
          </div>
          <el-empty :description="description" v-else>
            <el-button type="primary" v-if="isShow" @click="goBack">查看全部模型</el-button>
          </el-empty>
        </div>
      </div>
    </div>
    <AddAlgorithm
      :currentId="currentId"
      :hasLocalFile="hasLocalFile"
      v-if="addAlgorithmVisible"
      @close="(addAlgorithmVisible = false), getListData()"
    />
    <ListAlarmLevel
      v-if="listAlarmLevelVisible"
      @close="(listAlarmLevelVisible = false)"
    />
    <el-dialog
      title="盒子升级"
      :visible.sync="dialogVisible"
      width="80%"
      >
      <AlgorithmUpgrade v-if="dialogVisible" :id="rowId" :algorithmName="algorithmName"  :platform="platform" :nameEn="nameEn" @close="handleClose"/>
    </el-dialog>
    <!-- 新增算法--上传zip -->
    <AddPage v-if="addDialogVisible" @closeAdd="closeAdd"/>
    <!-- 手动上传算法文件 -->
    <el-dialog
      title="上传算法版本文件"
      :visible.sync="importDialog"
      width="500px"
      :before-close="handleDialogClose"
    >
      <ImportAlgorithm v-if="importDialog" :platform="platform" :nameEn="nameEn" pageType="1" @closeImport="closeImport"/>
    </el-dialog>
    <!-- 语音管理 -->
    <VoiceManagement v-if="voiceDialog" @closeHandle="closeHandle"/>
  </div>
</template>
<script>
import { getListData,getTagListData,deleteFile,checkAlgorithmVersion } from "@/api/applicationMonitoring/modelTesting";
import {deleteAlgorithm} from "@/api/applicationMonitoring/algorithmManagement";
import AddAlgorithm from "@/components/applicationMonitoring/modelTesting/addAlgorithm";
import AddPage from "@/components/applicationMonitoring/modelTesting/addPage/index";
import AlgorithmUpgrade from "@/components/applicationMonitoring/modelTesting/algorithmUpgrade";
import ListAlarmLevel from "@/components/applicationMonitoring/algorithmManagement/listAlarmLevel";
import ImportAlgorithm from "@/components/applicationMonitoring/modelTesting/importAlgorithm";
import VoiceManagement from "@/components/applicationMonitoring/modelTesting/voiceManagement/index.vue";
export default {
  components:{
    AddAlgorithm,
    ListAlarmLevel,
    AlgorithmUpgrade,
    AddPage,
    ImportAlgorithm,
    VoiceManagement
  },
  data() {
    return {
      name:'',
      algorithmList:[],
      tagList:[],
      isShow:false,
      tagId:'',
      description:'',
      addAlgorithmVisible:false,
      listAlarmLevelVisible:false,
      currentId:"",
      hasLocalFile:false,
      VUE_APP_API_BASE_URL,
      type:1,
      dialogVisible:false,
      rowId:'',
      algorithmName:'',
      platform:'',
      nameEn:'',
      notify:null,
      loading:false,
      addDialogVisible:false,
      importDialog:false,
      isImportClose:true,
      algorithmArr:[],
      voiceDialog:false,
      btnData:[],
      isDetail:false,
    };
  },
  watch:{
    "$store.state.algorithmDownload": {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          this.getListData();
        }
      },
    },
  },
  created() {
    this.getBtn();
    // this.checkVersion();
    // this.getListData();
    // this.getTagListData()
  },
  mounted(){
    window.addEventListener('resize', this.handleResize); // 添加窗口大小改变事件监听器
    this.handleResize()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize); // 移除窗口大小改变事件监听器
    if(this.notify){
      this.notify.close()
    }
  },
  methods: {
    getBtn(){
      this.btnData = [];
      this.isDetail = false;
      const menuArr = JSON.parse(sessionStorage.getItem('menuTree'));
      let newArr = [];
      this.getList(menuArr).filter((item,index)=>{
        newArr.push(item.auth)
      })
      this.btnData = newArr;
      let detailArr = menuArr.filter((items,i)=>{
        return items.path == '/algorithmManagement/modelDetail'
      })
      if(detailArr.length>0){
        this.isDetail = true;
      }
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
    handleResize() {
      const element = document.getElementById("rightCont");
      let width = element.offsetWidth
      if(width<=1000){
        this.type=0;
      }else if(width>=1480){
        this.type=2
      }else{
        this.type=1
      }
    },
    
    // 检查算法更新
    checkVersion(){
      checkAlgorithmVersion().then(res=>{
        let Arr = res.data;
        let Str = ""
        if(this.notify){
          this.notify.close()
        }
        if(Arr.length>0){
          Arr.forEach(item=>{
            Str+='<li style="font-size: 14px;line-height: 22px;color:#000;position: relative;margin-left: 20px;">'+item.name +'<span style="position: absolute; left: -10px;">•</span></li>'
          })
          this.notify = this.$notify({
            title: '算法版本有更新',
            dangerouslyUseHTMLString: true,
            message: '<div><div style="color: #666;font-size: 12px;">共'+Arr.length+'个算法有更新，请点击各自卡片“编辑”按钮进行下载操作。</div><ul style="margin-top:10px">'+Str+'</ul></div>',
            duration: 30000
          });
        }
      })
    },
    // 获取算法列表
    async getListData() {
      this.loading = true;
      let obj = {
        name:this.name,
        tagId:this.tagId
      }
      this.algorithmList = [];
      const data = await getListData(obj);
      this.loading = false;
      let arr = data.data //.filter(item => item.image&&item.marks )
      if(arr.length>0){
        arr.forEach(item=>{
          item.isShowImg = true;
        })
      }
      this.algorithmList = arr;
      this.algorithmArr = arr;
    },
    // 图片识别失败
    handleImageError(index){
      this.algorithmList[index].isShowImg = false
    },
    // 获取行业列表
    async getTagListData() {
      this.tagList = [];
      const data = await getTagListData({ type: 1 });
      data.data.forEach(item => {
        item.isCheck = false;
      });
      this.tagList = [
        {
          id:'',
          name:'全部',
          isCheck:true,
        },
        ...data.data
      ];
    },
    // 切换左侧选中
    checkFun(idx){
      this.tagId = this.tagList[idx].id
      this.tagList.map((item,index)=>{
        item.isCheck = false;
        if(idx == index){
          item.isCheck = true;
        }
      })
      this.description = ''
      if(idx==0){
        this.getListData()
        return;
      }
      if(this.algorithmArr.length>0){
        let newArr = [];
        this.algorithmArr.forEach(items=>{
          if(items.tagIds&&items.tagIds.length>0){
            items.tagIds.forEach(tagItem=>{
              if(this.tagList[idx].id==tagItem){
                newArr.push(items);
              }
            })
          }
        })
        this.algorithmList = JSON.parse(JSON.stringify(newArr))
      }
    },
    // 搜索
    seachFun(){
      this.isShow = true;
      this.description = '未搜索到相关模型'
      this.getListData()
    },
    // 返回
    goBack(){
      this.isShow = false;
      this.name = "";
      this.description = ''
      this.getListData()
    },
    detailFun(id){
      this.$router.push({
        path: '/algorithmManagement/modelDetail',
        query: {
          id: id,
        }
      })
    },
    // 删除文件
    async deleteData(item) {
      this.$confirm(`1.卸载后将自动停止所有摄像头上关于此算法的识别计算功能。<br/>2.卸载后已生成的告警记录仍保留。<br/>3.您可在卸载完成后重新下载，且需重新关联已有的摄像头。`, `是否卸载【${item.name}】`, {
        confirmButtonText: "卸载",
        cancelButtonText: "取消",
        confirmButtonClass: 'custom-confirm-class',
        dangerouslyUseHTMLString:true,
        customClass:"elmessagewidth"
      })
        .then(async () => {
          const res = await deleteFile({ id: item.id });
          if (res.code == 0) {
            this.$message.success("删除成功");
            await this.getListData();
          }
        })
        .catch(() => {});
    },
    // 算法下载--算法编辑
    editData(item) {
      this.currentId = item.id;
      this.hasLocalFile = item.hasLocalFile
      this.addAlgorithmVisible = true;
    },
    addAlarmLevelData() {
      this.listAlarmLevelVisible = true;
    },
    // 算法升级
    upgradeFun(items){
      this.rowId = items.id;
      this.algorithmName = items.name;
      this.platform = items.platform;
      this.nameEn = items.nameEn
      this.dialogVisible = true;
    },
    handleClose(){
      this.dialogVisible = false;
      this.getListData();
      this.getTagListData()
    },
    // 新增算法
    addData(){
      this.addDialogVisible = true;
    },
    closeAdd(){
      this.addDialogVisible = false;
      this.getListData();
    },
    // 手动导入模型文件
    uploadFun(items){
      this.platform = items.platform;
      this.nameEn = items.nameEn;
      this.importDialog = true
    },
    closeImport(item){
      if(item!=1){
        this.isImportClose = item;
        if(item){
          this.importDialog = false;
          this.getListData();
        }
      }else{
        this.isImportClose = true;
      }
    },
    handleDialogClose(){
      if(this.isImportClose){
        this.importDialog = false;
      }
    },
    // 告警语音管理
    addAlarmVoice(){
      this.voiceDialog = true
    },
    // 关闭语音管理
    closeHandle(){
      this.voiceDialog = false;
      this.getListData();
    },
    // 删除算法
    deleteFun(item){
      this.$confirm(`请谨慎删除。<br />1.将删除所有数据信息，包括卡片、识别记录等。<br />2.将自动停止所有使用此算法的摄像头播放。<br />3.若重新添加此算法，请前往【算法商城 > 新增算法】添加。`, `是否删除【${item.name}】`, {
        confirmButtonText: "确认删除",
        cancelButtonText: "取消",
        confirmButtonClass: 'custom-confirm-class',
        dangerouslyUseHTMLString:true,
        customClass:"elmessagewidth"
      })
        .then(async () => {
          const res = await deleteAlgorithm({ id: item.id });
          if (res.code == 0) {
            this.$message.success("删除成功");
            await this.getListData();
          }
        })
        .catch(() => {});
    },
    // 更多
    handleCommand(command,items){
      if(command==1){//卸载算法
        this.deleteData(items)
      }else if(command==2){//导入文件模型
        this.uploadFun(items)
      }else if(command==3){//版本管理
        this.upgradeFun(items)
      }else{//删除算法
        this.deleteFun(items)
      }
    }
  },
};
</script>
<style scoped lang="scss">
.model-cont{
  height:calc(100vh - 110px);
  background: #fff;
  border-radius: 8px;
  overflow: auto;
  .head-cont{
    margin: 0px 26px;
    padding: 20px 0px;
    border-bottom: 1px solid #EDF0F3;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .head-txt{
      font-size: 24px;
      color: #202B3D;
    }
    .flex-btn{
      display: flex;
    }
    .level-btn{
      border: 1px solid #DCDFE6;
      padding: 4px 15px;
      border-radius: 4px;
      font-size: 14px;
      color: #606266;
      text-align: center;
      cursor: pointer;
      margin-left: 10px;
    }
  }
  .flex-cont{
    display: flex;
    padding: 20px 26px;
  }
  .top-tabs{
  background: rgba(227, 227, 227, 0.17);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  display:flex;
  width: 100%;
  overflow-x: auto;
  .tab-item{
    flex-shrink: 0;
    padding: 0px 20px;
    margin: 10px 0px;
    border-left: 1px solid #c2c6cd;
    font-size: 18px;
    color: #8692AA;
    cursor: pointer;
  }
  .tab-item:first-child{
    border-left: none;
  }
  .tab-check{
    flex-shrink: 0;
    padding: 10px 10px 10px 10px;
    font-size: 18px;
    font-weight: bold;
    color: #202B3D;
    background: #FFF;
  }
  .tab-check+.tab-item{
    border-left: none;
  }
  .tab-name{
    border-left: 2px solid #F05924;
    padding-left: 8px;
  }
}
  // .left-cont{
  //   width: 100px;
  //   margin-right: 10px;
  //   height:calc(100vh - 268px);
  //   overflow-y: scroll;
  //   .left-item{
  //     padding: 13px 16px;
  //     border: 1px solid #E7E7E7;
  //     color: rgba(0, 0, 0, 0.60);
  //     background: #F3F3F3;
  //     cursor: pointer;
  //     font-size: 14px;
  //   }
  //   .left-item:nth-child(n+2){
  //     border-top: none!important;;
  //   }
  //   .left-item:hover{
  //     color: #FFFFFF;
  //     background: #54B5E9;
  //   }
  //   .bg-color{
  //     color: #FFFFFF !important;
  //     background: #54B5E9 !important;
  //   }
  // }
  .right-cont{
    flex: 1;
    height:calc(100vh - 278px);
    overflow-y: scroll;
    .flex-item{
      display: grid;
      justify-content: space-between;
      .algorithm-item{
        margin-bottom: 16px;
        cursor: pointer;
        border: 1px solid #EDF0F3;
        border-radius: 6px;
        // box-shadow: 0px 12px 32px 0px rgba(0, 0, 0, 0.04), 0px 8px 20px 0px rgba(0, 0, 0, 0.08);
        position: relative;
        .img-cont{
          height: 145px;
          // background: #54B5E9;
        }
        .alg-cont{
          // height: 125px;
          padding: 16px 16px 10px 16px;
          .alg-txt{
            color: #333333;
            font-size: 16px;
            font-weight: bold;
            white-space: nowrap; /* 不换行 */
            overflow: hidden; /* 超出部分隐藏 */
            text-overflow: ellipsis; /* 使用省略号表示被隐藏的部分 */
          }
          .alg-tip{
            color: #666666;
            margin-top: 10px;
            height: 58px;
            font-size: 14px;
            line-height: 29px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .alg-btn-flex{
            // text-align: center;
            margin-top: 10px;
            display: flex;
            justify-content: end;
            align-items: center;
            position: relative;
            font-size: 14px;
          }
          .alg-btn{
            color: #F05924;
            cursor: pointer;
            // border-right: 1px solid #F05924;
            padding-right: 10px
          }
          .alg-del-btn{
            color: #202B3D;
            cursor: pointer;
          }
          .optimize-btn{
            color: #202B3D;
          }
          .more-btn{
            color: #202B3D;
            padding: 10px;
          }
          .upload-btn{
            color: #F05924;
            cursor: pointer;
            display: none;
          }
        }
      }
      .algorithm-item:hover{
        // box-shadow: 0px 12px 32px 0px rgba(0, 0, 0, 0.08), 0px 8px 20px 0px rgba(0, 0, 0, 0.1);
        // border-bottom-left-radius: 6px;
        // border-bottom-right-radius: 6px;
        border: 1px solid #FFC693;
        .upload-btn{
          display: block;
        }
        .optimize-btn{
          display: none;
        }
      }
    }
    .flex-item-w24{
      grid-template-columns: repeat(auto-fill, 24%);
    }
    .flex-item-w32{
      grid-template-columns: repeat(auto-fill, 32%);
    }
    .flex-item-w19{
      grid-template-columns: repeat(auto-fill, 19%);
    }
  }
  .top-tip{
    padding-bottom: 16px;
    font-size: 14px;
    line-height: 22px;
    display: flex;
    .go-back{
      cursor: pointer;
    }
    .go-back:hover{
        color: #54B5E9;
      }
  }
}
</style>
<style lang="scss">
.model-cont{
  .head-cont{
    .el-button--default{
      background: transparent !important;
      height: 28px !important;
      border-radius: unset !important;
      border: none !important;
      margin-top: -6px !important;
    }
    .el-icon-search:before{
      color:#606266;
    }
    .el-button--default:hover{
      .el-icon-search:before{
        color:#54B5E9;
      }
    }
  }
}
.customClass{
  z-index: 9999 !important;
}
</style>