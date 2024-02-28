<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>盒子列表</span>
          </div>
          <el-checkbox-group v-model="formatData.boxIds">
            <el-checkbox
              v-for="(item, index) in boxList"
              :key="item.locationId"
              :label="item.locationId"
              style="display: block; margin-top: 10px"
              >{{ item.boxName }} <span v-if="item.boxVersion">{{ "(" +item.boxVersion+")" }}</span></el-checkbox>
          </el-checkbox-group>
          <!-- <ul>
            <li class="item" v-for="(item,index) in boxList" :key="item.id">
            {{ item.name }}
            </li>
          </ul> -->
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>文件列表</span>
            <el-button style="float: right" type="primary" size="mini" @click="changeBoxAlgorithmVersion">切换版本</el-button>
          </div>
          <el-radio-group v-model="formatData.algorithmFileId">
            <el-radio
              v-for="item in fileList"
              :key="item.id"
              :label="item.id"
              style="display: block; margin-top: 10px"
            >{{  item.fileName }}</el-radio>
          </el-radio-group>
        </el-card>
      </el-col>
      <el-col :span="8">
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
    </el-row>
  </div>
</template>
<script>
import Cookies from "js-cookie"
import {
  getBoxAndHistoryVersion,
  changeBoxAlgorithmVersion
} from "@/api/applicationMonitoring/algorithmManagement";
export default {
  data() {
    return {
      formatData: {
        boxIds:[],
        algorithmFileId:''
      },
      boxList: [],
      fileList: [],
      boxCheckList: '',
      fileCheckList: '',
      VUE_APP_API_BASE_URL,
      token: Cookies.get("X-Token"),
      file:'',
      id:"",
      timer:null
    };
  },
  created() {
    this.id = this.$route.query.id
    this.getBoxAndHistoryVersion();
    let that = this;
    this.timer = setInterval(function () {
        that.getBoxAndHistoryVersion();
    }, 3000);
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
        3:'更新完成'
      }
      return obj[s]
    },
    async getBoxAndHistoryVersion() {
      let { data } = await getBoxAndHistoryVersion({id: this.id });
      this.boxList = data.boxList;
      this.fileList = data.fileList;
      console.log(data)
    },
    async changeBoxAlgorithmVersion(){
      //this.formatData.locationId = this.boxCheckList
      let { code } = await changeBoxAlgorithmVersion({
        boxIds:this.formatData.boxIds+"",
        algorithmFileId:this.formatData.algorithmFileId,
        algorithmId:this.id
      });
      if(code == 0){
        this.$message.success('更新成功')

      }
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
</style>