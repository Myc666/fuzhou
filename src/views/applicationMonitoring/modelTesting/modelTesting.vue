<template>
  <div class="model-cont">
    <div class="head-cont">
      <div class="head-txt">探索人工智能模型</div>
      <div style="margin-left: 25%;width: 50%;margin-top: 20px;">
        <el-input placeholder="请输入场景关键字" v-model="name" size="mini">
          <el-button slot="append" icon="el-icon-search" @click="seachFun"></el-button>
        </el-input>
      </div>
      <div class="level-btn" @click="addAlarmLevelData">
        <span class="el-icon-s-operation"></span>
        <span style="margin-left: 4px;">告警等级管理</span>
      </div>
    </div>
    <div class="flex-cont">
      <div class="left-cont">
        <div v-for="(item,index) in tagList" :key="index" :class="item.isCheck?'left-item bg-color':'left-item'" @click="checkFun(index)">{{ item.name }}</div>
      </div>
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
            <div v-for="(items,ind) in algorithmList" :key="ind" class="algorithm-item"  :style="{ filter: items.hasGitFile?'':'grayscale(100%)'}" @click="items.hasGitFile?detailFun(items.id):''">
              <div class="img-cont">
                <el-image v-if="items.image" :src="VUE_APP_API_BASE_URL+`/algorithm/picStream?file=${items.image}`" style="width: 100%;height: 100%;"></el-image>
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
                  <div class="alg-btn-flex" v-if="items.hasGitFile">
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
                      <el-popover
                        placement="top"
                        width="240"
                        trigger="hover"
                        content="算法优化中，敬请期待。如有更新，系统会自动通知。">
                        <div slot="reference" class="alg-btn">优化中，敬请期待</div>
                      </el-popover>
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
      <AlgorithmUpgrade v-if="dialogVisible" :id="rowId" :algorithmName="algorithmName" @close="handleClose"/>
    </el-dialog>
  </div>
</template>
<script>
import { getListData,getTagListData,deleteFile,checkAlgorithmVersion } from "@/api/applicationMonitoring/modelTesting";
import {deleteData} from "@/api/applicationMonitoring/algorithmManagement";
import AddAlgorithm from "@/components/applicationMonitoring/modelTesting/addAlgorithm";
import AlgorithmUpgrade from "@/components/applicationMonitoring/modelTesting/algorithmUpgrade";
import ListAlarmLevel from "@/components/applicationMonitoring/algorithmManagement/listAlarmLevel";
export default {
  components:{
    AddAlgorithm,
    ListAlarmLevel,
    AlgorithmUpgrade
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
      notify:null,
      loading:false,
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
    this.checkVersion();
    // this.getListData();
    this.getTagListData()
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
      if(this.notify){
        this.notify.close()
      }
      checkAlgorithmVersion().then(res=>{
        let Arr = res.data;
        let Str = ""
        if(Arr.length>0){
          Arr.forEach(item=>{
            Str+='<li style="font-size: 14px;line-height: 22px;color:#000;position: relative;margin-left: 20px;">'+item.name +'<span style="position: absolute; left: -10px;">•</span></li>'
          })
          this.notify = this.$notify({
            title: '算法版本有更新',
            dangerouslyUseHTMLString: true,
            message: '<div><div style="color: #666;font-size: 12px;">共'+Arr.length+'个算法有更新，请点击各自卡片“编辑”按钮进行下载操作。</div><ul style="margin-top:10px">'+Str+'</ul></div>',
            duration: 0
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
      this.algorithmList = []
      const data = await getListData(obj);
      this.loading = false;
      let arr = data.data //.filter(item => item.image&&item.marks )
      this.algorithmList = arr;
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
      this.getListData()
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
      this.$confirm(`是否删除已下载的算法模型?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
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
      this.dialogVisible = true;
    },
    handleClose(){
      this.dialogVisible = false;
      this.getListData();
      this.getTagListData()
    }
  },
};
</script>
<style scoped lang="scss">
.model-cont{
  height: 100%;
  background: #fff;
  border-radius: 8px;
  padding: 32px 22px 20px 32px;
  .head-cont{
    background: #fff;
    margin-bottom: 12px;
    position: relative;
    .head-txt{
      color: #000;
      font-size: 32px;
      font-weight: 400;
      line-height: 22px;
      text-align: center;
    }
    .level-btn{
      width: 130px;
      border: 1px solid #DCDFE6;
      padding: 4px 0px;
      border-radius: 4px;
      font-size: 14px;
      color: #606266;
      text-align: center;
      cursor: pointer;
      position: absolute;
      right: 0;
      bottom: 8px;
    }
  }
  .flex-cont{
    display: flex;
  }
  .left-cont{
    width: 100px;
    margin-right: 10px;
    height:calc(100vh - 268px);
    overflow: scroll;
    .left-item{
      padding: 13px 16px;
      border: 1px solid #E7E7E7;
      color: rgba(0, 0, 0, 0.60);
      background: #F3F3F3;
      cursor: pointer;
      font-size: 14px;
    }
    .left-item:nth-child(n+2){
      border-top: none!important;;
    }
    .left-item:hover{
      color: #FFFFFF;
      background: #54B5E9;
    }
    .bg-color{
      color: #FFFFFF !important;
      background: #54B5E9 !important;
    }
  }
  .right-cont{
    flex: 1;
    height:calc(100vh - 268px);
    overflow: scroll;
    .flex-item{
      display: grid;
      justify-content: space-between;
      .algorithm-item{
        margin-bottom: 16px;
        cursor: pointer;
        border: 1px solid #E7E7E7;
        border-radius: 6px;
        box-shadow: 0px 12px 32px 0px rgba(0, 0, 0, 0.04), 0px 8px 20px 0px rgba(0, 0, 0, 0.08);
        .img-cont{
          height: 145px;
          // background: #54B5E9;
        }
        .alg-cont{
          // height: 125px;
          padding: 16px 16px 10px 16px;
          .alg-txt{
            font-size: 16px;
            font-weight: bold;
            white-space: nowrap; /* 不换行 */
            overflow: hidden; /* 超出部分隐藏 */
            text-overflow: ellipsis; /* 使用省略号表示被隐藏的部分 */
          }
          .alg-tip{
            margin-top: 8px;
            height: 44px;
            font-size: 14px;
            line-height: 22px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .alg-btn-flex{
            // text-align: center;
            margin-top: 6px;
            display: flex;
            justify-content: end;
            align-items: center;
            position: relative;
            font-size: 14px;
          }
          .alg-btn{
            color: #3587FA;
            cursor: pointer;
          }
          .alg-del-btn{
            color: #909399;
            cursor: pointer;
          }
        }
      }
      .algorithm-item:hover{
        box-shadow: 0px 12px 32px 0px rgba(0, 0, 0, 0.08), 0px 8px 20px 0px rgba(0, 0, 0, 0.1);
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
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
</style>
