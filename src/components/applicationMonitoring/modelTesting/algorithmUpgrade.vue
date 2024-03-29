<template>
    <div>
      <el-row :gutter="24">
        <el-col :span="10">
          <el-card class="box-card">
            <div slot="header" class="clear-flex">
              <div>关联盒子</div>
              <div class="alg">{{ algorithmName }}</div>
            </div>
            <el-checkbox-group v-model="formatData.boxIds">
              <el-checkbox
                v-for="(item, index) in boxList"
                :key="item.locationId"
                :label="item.locationId"
                style="display: block; margin-top: 10px"
                >{{ item.boxName }} <span v-if="item.algorithmVersion">{{ "(" +item.algorithmVersion+")" }}</span></el-checkbox>
            </el-checkbox-group>
          </el-card>
        </el-col>
        <el-col :span="14">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>本地算法文件</span>
              <el-button style="float: right" type="primary" size="mini" @click="changeBoxAlgorithmVersion">切换版本</el-button>
            </div>
            <div class="radio-sty" v-for="(item,index) in fileList">
              <el-radio v-model="formatData.fileName" :label="item.fileName">{{ item.fileName }}</el-radio>
            </div>
          </el-card>
          <el-card class="box-card">
            <div slot="header" class="clear-flex">
              <div>本地算法文件</div>
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
    beforeDestroy() {
      // 在组件销毁前清除定时器
      this.fileList.map((item,ind)=>{
        clearInterval(item.timerObj);
        item.timerObj="";
      })
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
        this.fileList = data.fileList
      },
      async changeBoxAlgorithmVersion(){
        let { code } = await changeBoxAlgorithmVersion({
          boxIds:this.formatData.boxIds+"",
          fileName:this.formatData.fileName,
          algorithmId:this.id
        });
        if(code == 0){
          this.$message.success('更新成功')
          this.formatData.fileName = "";
          this.formatData.boxIds = [];
          this.getBoxAndHistoryVersion();
        }
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
    align-items: center;
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