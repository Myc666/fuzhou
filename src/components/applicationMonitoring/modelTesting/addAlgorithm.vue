<template>
    <div>
      <el-dialog
        :close-on-click-modal="false"
        :title="title"
        :visible.sync="dialogVisible"
        width="800px"
        @close="closed"
      >
        <div>
          <el-form ref="form" :model="params" :rules="rules" label-width="80px">
            <el-form-item label="算法名称" prop="name">
              <el-input v-model="params.name"></el-input>
            </el-form-item>
            <el-form-item label="算法英文" prop="nameEn">
              <el-input v-model="params.nameEn" @blur="blurCheck" :class="[isExist?'color-red':'']" disabled></el-input>
              <div v-if="isExist" style="color: #F56C6C; font-size: 12px;position: absolute;top: 30px;">算法英文名称已存在，请勿重复添加</div>
            </el-form-item>
            <el-form-item label="硬件平台" prop="platform">
              <el-select
                v-model="params.platform"
                placeholder="请选择硬件平台"
                style="width: 100%"
                :disabled="hasLocalFile"
              >
                <el-option
                  v-for="(item, index) in platformList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="告警等级" prop="alarmLevelId">
              <el-select
                v-model="params.alarmLevelId"
                placeholder="请选择告警等级"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, index) in alarmLevelList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="应用场景" prop="tagIds">
              <el-select
                v-model="params.tagIds"
                placeholder="请选择应用场景"
                style="width: 100%"
                multiple
                clearable
              >
                <el-option
                  v-for="(item, index) in tagList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div style="margin-bottom: 16px;">
          <el-button type="primary" @click="searchFun" :disabled="isExist" :icon="hasLocalFile?'el-icon-refresh':'el-icon-search'">{{ hasLocalFile?'版本更新':'搜索' }}</el-button>
        </div>
        <div>
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column align="center" prop="name" label="文件名称">
            </el-table-column>
            <el-table-column align="center" prop="thisVersion" label="状态" v-if="hasLocalFile">
              <template slot-scope="scope">
                {{ scope.row.thisVersion?'启用中':'已下载' }}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="md5Str" label="MD5核对结果" v-if="hasLocalFile">
            </el-table-column>
            <el-table-column align="center" prop="size" label="文件大小">
            </el-table-column>
            <el-table-column align="center" label="进度" width="260">
              <template slot-scope="scope">
                <el-progress
                    class="percen-sty"
                  :percentage="scope.row.process"
                ></el-progress>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="80">
              <template slot-scope="scope">
                <el-button type="text" v-if="scope.row.md5Str!='一致'" @click="downs(scope.row.md5Str,scope.row.name,scope.$index)">{{scope.row.md5Str=='下载中'?'重新下载':'下载'}}</el-button>
                <div v-else>
                  <el-button type="text" @click="startFun(scope.row.name)">{{isShowBtn?'切换此版本':'启用此版本'}}</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closed">取消</el-button>
          <el-button type="primary" @click="saveData" :disabled="isExist">提交</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
  <script>
  import {
    getTagListData,
    getListDataDetail,
    search,
    saveData,
    getAlarmLevelList,
    downloadCheck,
    downloadSingleFile,
    checkNameEn,
    reDownloadSingleFile,
    startFile
  } from "@/api/applicationMonitoring/algorithmManagement";
  export default {
    props: {
      currentId: {
        type: String,
        default: "",
      },
      hasLocalFile:{
        type:Boolean,
        default:false
      }
    },
    data() {
      return {
        platformList:[
          {
            name:'英伟达',
            id:'nvidia',
          },
          {
            name:'登临',
            id:'denglin',
          },
          {
            name:'灵汐',
            id:'lynxi',
          },
        ],
        loading: false,
        title: this.hasLocalFile ? "算法编辑" : "算法下载",
        dialogVisible: true,
        params: {
          id: this.currentId,
          name: "",
          nameEn: "",
          tagIds: [],
              alarmLevelId: "",
          platform:''
        },
        rules: {
          name: [{ required: true, message: "请输入算法名称", trigger: "blur" }],
          nameEn: [
            { required: true, message: "请输入算法英文", trigger: "blur" },
          ],
          platform: [{ required: true, message: "请选择硬件平台", trigger: "change" }]
        },
        tagList: [],
        tableData: [],
        alarmLevelList: [],
        listData:[],
        timerObj:null,
        isExist:false,
        isShowBtn:false,
      };
    },
    async created() {
        this.timerObj =null
      await this.getTagListData();
      await this.listAlarmLevelData();
      if (this.currentId) {
        await this.getListDataDetail();
        if(this.hasLocalFile){
          await this.searchFun();
        }
      }
    },
    beforeDestroy() {
      // 在组件销毁前清除定时器
      this.tableData.map((item,ind)=>{
        clearInterval(item.timerObj);
        item.timerObj="";
      })
    },
    methods: {
      // 获取行业列表
      async getTagListData() {
        const data = await getTagListData({ type: 1 });
        this.tagList = data.data;
      },
      // 获取算法详情
      async getListDataDetail() {
        const data = await getListDataDetail({ id: this.currentId });
        Object.assign(this.params, {
          name: data.data.name,
          nameEn: data.data.nameEn,
          tagIds: data.data.tagIds,
              alarmLevelId: (data.data.alarmLevelId&&data.data.alarmLevelId!='0') ? data.data.alarmLevelId : '',
          platform:data.data.platform
        });
      },
     
      // 保存算法
      saveData() {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            await saveData(this.params);
            // this.$message.success(this.currentId ? "编辑成功" : "新增成功");
            this.dialogVisible = false;
          } else {
            return false;
          }
        });
      },
  
      // 搜索
      async searchFun(funType){
        if(!this.params.nameEn){
          this.$message.error('请输入算法英文')
          return;
        }
        if(!this.params.platform){
          this.$message.error('请选择硬件平台')
          return;
        }
        if(this.tableData.length>0&&funType!=1){
          this.tableData.forEach(item=>{
            if(item.timerObj){
              clearInterval(item.timerObj);
              item.timerObj="";
            }
          })
        }
        const obj = {
          suanfa:this.params.nameEn,
          platform:this.params.platform
        };
        const res = await search(obj);
        if(res.data.length==0){
          this.$message('未搜索到算法文件')
        }
        let Arr = [];
        res.data.forEach((item,index)=>{
          if(item.thisVersion){
            Arr.push(item);
          }
          item.process=this.handleProcess(item.localLength,item.length)
          clearInterval(item.timerObj);
          item.timerObj="";
          if(item.md5Str=='下载中'&&funType!=1){
            let that = this;
            item.timerObj = setInterval(function () {
                that.inspectFun(item.name,index);
            },3000);
          }
        })
        if(Arr.length>0){
          this.isShowBtn = true;
        }else{
          this.isShowBtn = false;
        }
        
        this.tableData = res.data;
      },
       downs(md5Str,name,index){
        if(md5Str=="下载中"){
          clearInterval(this.tableData[index].timerObj);
            this.tableData[index].timerObj="";
          this.reDownload(name,index);
          return;
        }
        downloadSingleFile({
          suanfa:this.params.nameEn,
          platform:this.params.platform,
          fileName: name
        }).then(res=>{
          //console.log(1111);
          if(res.code == 0) {
            this.inspectFun(name,index);
            let that = this;
            this.tableData[index].timerObj = setInterval(function () {
                that.inspectFun(name,index);
            }, 3000);
          }
        }).catch(res=>{
        }).finally(res=>{
          
        })
      },
      // 重新下载
      reDownload(name,index){
        clearInterval(this.tableData[index].timerObj);
        this.tableData[index].timerObj="";
        reDownloadSingleFile({
          suanfa:this.params.nameEn,
          platform:this.params.platform,
          fileName: name
        }).then(res=>{
          //console.log(1111);
          if(res.code == 0) {
            let that = this;
            this.tableData[index].timerObj = setInterval(function () {
                that.inspectFun(name,index);
            }, 3000);
          }
        }).catch(res=>{
        })
      },
      // 检查
      inspectFun(fileName,index){
         downloadCheck({suanfa:fileName}).then(res=>{
          if(res.data.msg!='下载中'){
            clearInterval(this.tableData[index].timerObj);
            this.tableData[index].timerObj="";
            this.searchFun(1);
          }else{
            this.tableData[index].md5Str = res.data.msg;
            let tatal= this.tableData[index].length;
            this.tableData[index].process=this.handleProcess(res.data.length,tatal)
          }
         }).catch(res=>{
          if(res.msg!='下载中'||res!='下载中'){
            clearInterval(this.tableData[index].timerObj);
            this.tableData[index].timerObj="";
            this.searchFun(1);
          }
         })
        
      },
      // 关闭回调
      closed() {
        this.tableData.map((item,ind)=>{
          clearInterval(item.timerObj);
          item.timerObj="";
        })
        this.$emit("close");
      },
      // 处理进度条
      handleProcess(local,total) {
        if(local && total){
          if(Number(local) == Number(total)){
            return Number('100.00')
          }else{
            return  ((Number(local) / Number(total)) * 100).toFixed(2)>100?Number('100.00'):Number(((Number(local) / Number(total)) * 100).toFixed(2))
          }
        } else {
          return 0
        }
      },
      //
      async listAlarmLevelData() {
        const data = await getAlarmLevelList();
        this.alarmLevelList = data.data;
      },
      // 算法英文名失去焦点时，判断此算法是否存在
      blurCheck(){
        if(!this.params.nameEn){
          this.isExist = false;
          return
        }
        let obj = {
          id:this.currentId,
          nameEn:this.params.nameEn
        }
        checkNameEn(obj).then(res=>{
          this.isExist = res.data
        })
      },
      // 启用算法
      startFun(name){
        let obj ={
          id:this.params.id,
          fileName:name,
        }
        startFile(obj).then(res=>{
          this.searchFun(1)
          this.$message.success('启用成功')
        })
      }
    },
  };
  </script>
  <style lang="scss">
  .color-red{
    .el-input__inner{
      border-color: #F56C6C;
    }
  }
  .percen-sty{
    .el-progress-bar{
        width: 95% !important;
        margin-right: -75px !important;
    }
    .el-progress__text{
        margin-left: 30px !important;
    }
  }
  </style>
  