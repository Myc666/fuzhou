<template>
  <div>
    <el-row :gutter="24">
      <el-col :span="10">
        <el-card class="box-card">
          <div slot="header" class="clear-flex">
            <div>关联计算设备</div>
            <div class="alg">{{ algorithmName }}</div>
          </div>
          <el-checkbox-group v-model="formatData.boxIds">
            <el-checkbox
              v-for="(item, index) in boxList"
              :key="item.locationId"
              :label="item.locationId"
              :disabled="item.algorithmVersion?false:true"
              style="display: block; margin-top: 10px"
              >{{ item.boxName }}
              <span v-if="item.algorithmVersion">{{ "(" +item.algorithmVersion+")" }}</span>
              <span v-else style="color: red;">(无任何摄像头使用此算法，请先关联)</span>
            </el-checkbox>
          </el-checkbox-group>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>更新进度</span>
            
          </div>
          <ul>
            <li style="margin-top: 10px;" v-for="(item, index) in boxList" :key="item.locationId">
              <span style="color:#606266;font-size:14px;float: left;width: 200px;">{{ item.boxName }}:</span>
              <span style="color:#606266;font-size:12px;">{{ state(item.boxUpdateStatus) }}</span>
            </li>
          </ul>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>本地算法文件</span>
            <el-button style="float: right" type="primary" size="mini" :loading="changeLoading" @click="changeBoxAlgorithmVersion">切换版本</el-button>
          </div>
          <div class="title">最新版本</div>
          <div class="radio-sty" v-if="lastVersionFile&&lastVersionFile.name">
            <el-radio v-model="formatData.fileName" :label="lastVersionFile.name">{{ lastVersionFile.name }}</el-radio>
            <div style="width: 50%;">
              <el-progress
                class="percen-sty"
                :percentage="handleProcess(lastVersionFile.localLength,lastVersionFile.length)"
              ></el-progress>
            </div>
          </div>
          <div class="title">历史版本</div>
          <div class="radio-sty" v-for="(item,index) in fileList">
            <el-radio v-model="formatData.fileName" :label="item.name">{{ item.name }}</el-radio>
            <div style="width: 50%;">
              <el-progress
                class="percen-sty"
                :percentage="handleProcess(item.localLength,item.length)"
              ></el-progress>
            </div>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clear-flex">
            <div>上传算法版本文件</div>
            <div class="alg">{{ nameEn }}</div>
          </div>
          <ImportAlgorithm :platform="platform" :nameEn="nameEn" @closeImport="closeImport"/>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Cookies from "js-cookie"
import {
  getBoxAndHistoryVersion,
  changeBoxAlgorithmVersion
} from "@/api/applicationMonitoring/algorithmManagement";
import ImportAlgorithm from "@/components/applicationMonitoring/modelTesting/importAlgorithm";
export default {
  components:{
    ImportAlgorithm
  },
  data() {
    return {
      formatData: {
        boxIds:[],
        fileName:''
      },
      boxList: [],
      fileList: [],
      boxCheckList: '',
      fileCheckList: '',
      VUE_APP_API_BASE_URL,
      token: Cookies.get("X-Token"),
      file:'',
      // id:"",
      timer:null,
      lastVersionFile:{},
      changeLoading:false,
      // algorithmName:'',
    };
  },
  props:{
    id:{
        type:String,
        default:''
    },
    algorithmName:{
        type:String,
        default:''
    },
    platform:{
      type:String,
      default:''
    },
    nameEn:{
      type:String,
      default:''
    }
  },
  created() {
    this.getBoxAndHistoryVersion();
  },
  destroyed(){
    clearInterval(this.timer)
  },
  methods: {
    state(s){
      let obj = {
        0:"无更新任务",
        1:"等待更新",
        2:'更新中',
        3:'更新完成',
        4:'算法文件下载中'
      }
      return obj[s]
    },
    async getBoxAndHistoryVersion() {
      let { data } = await getBoxAndHistoryVersion({id: this.id });
      this.boxList = data.boxList;
      if(data.fileList.length>0){
          let newArr = data.fileList.filter(item=>{
          return item.name != data.lastVersionFile.name
          })
          this.fileList = newArr;
      }
      this.lastVersionFile = data.lastVersionFile
      let Arr = data.boxList.filter(item=>{
        return item.boxUpdateStatus!=0 
      })
      if(Arr.length>0){
        if(this.timer){
          clearInterval(this.timer)
        }
        let that = this;
        this.timer = setInterval(function () {
            that.getBoxAndHistoryVersion();
        }, 3000);
      }else{
        clearInterval(this.timer)
      }
    },
    changeBoxAlgorithmVersion(){
      //this.formatData.locationId = this.boxCheckList
      if(this.timer){
        clearInterval(this.timer)
      }
      let that = this;
      this.timer = setInterval(function () {
            that.getBoxAndHistoryVersion();
      }, 3000);
      this.changeLoading = true;
      let obj = {
        boxIds:this.formatData.boxIds+"",
        fileName:this.formatData.fileName,
        algorithmId:this.id
      }
      changeBoxAlgorithmVersion(obj).then(res=>{
        this.changeLoading = false;
        if(res.code == 0){
          this.$message.success('更新成功')
          this.formatData.fileName = "";
          this.formatData.boxIds = [];
          // this.getBoxAndHistoryVersion();
        }
      }).catch(()=>{
        this.changeLoading = false;
      })
      // let { code } = await changeBoxAlgorithmVersion({
        // boxIds:this.formatData.boxIds+"",
        // fileName:this.formatData.fileName,
        // algorithmId:this.id
      // });
      // if(code == 0){
      //   this.$message.success('更新成功')
      //   this.formatData.fileName = "";
      //   this.formatData.boxIds = [];
      //   this.getBoxAndHistoryVersion();
      // }
    },
    // 处理进度条
    handleProcess(local,total) {
      if(local && total){
        let num = Number(((Number(local) / Number(total)) * 100).toFixed(2))
        return  num > 100 ? Number('100.00') : num
      } else {
        return 0
      }
    },
    closeImport(){
      this.getBoxAndHistoryVersion();
    }
  },
};
</script>
<style scoped>
.item {
  padding: 10px 0;
  font-size: 14px;
  color: #666;
}
.title{
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
}
.radio-sty{
  display: flex;
  margin-bottom: 5px;
}
.clear-flex{
  display: flex;
  justify-content: space-between;
}
.alg{
  flex: 1;
  padding-left: 20px;
  text-align: right;
}
.box-card{
  margin-top: 10px;
}
</style>
<style lang="scss">
.percen-sty{
    .el-progress-bar{
        width: 92% !important;
        margin-right: -75px !important;
    }
    .el-progress__text{
        margin-left: 30px !important;
    }
  }
</style>
