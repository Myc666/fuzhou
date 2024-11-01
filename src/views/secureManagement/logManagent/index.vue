<template>
    <div>
      <Tables
        :pagination="pagination"
        :columns="columns"
        :dataSource="dataSource"
        :loading="loading"
        @pageChange="pageChange"
        :rowSelection="false"
      >
        <div slot="header" class="head-container">
            <!-- <el-input
              v-model="formatData.name"
              placeholder="模块名称"
              style="width: 200px; margin-right: 10px"
            ></el-input> -->
            <el-form ref="form" v-model="formatData" label-width="80px" style="display: flex;flex-wrap: wrap;">
              <el-form-item label="日志类型">
                <el-select v-model="formatData.logType" placeholder="请选择日志类型" clearable style="width: 150px;">
                  <el-option v-for="(item,index) in logTypeList" :key="index" :label="item.name" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="模块">
                <el-select v-model="formatData.moduleCode" placeholder="请选择模块" clearable style="width: 150px;">
                  <el-option v-for="(item,index) in moduleList" :key="index" :label="item.name" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="操作时间" style="margin-left: 10px;">
                <el-date-picker
                  v-model="dateList"
                  type="daterange"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  style="width: 300px;"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              <div style="margin-left: 15px;">
                <el-button type="primary" icon="el-icon-search" @click="getTable">查询</el-button>
                <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
              </div>
            </el-form>
            
        </div>
      </Tables>
      <AddLog
        v-if="addVisible"
        :currentObj="currentObj"
        @close="(addVisible = false), getListData()"
      />
    </div>
  </template>
  <script>
  import Tables from "@/components/Table/index.vue";
  import AddLog from "./components/addLog.vue";
  import { getMyDate } from "@/utils/common.js";
  import { listPage,logModules,logTypes,getTypes } from "./api"
  export default {
    components: {
      Tables,
      AddLog
    },
    data() {
      return {
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0,
        },
        dateList:[],
        loading: false,
        dataSource: [],
        columns: Object.freeze([
          {
            key: "",
            title: "序号",
            align: "center",
            render(h, { $index }) {
              return h("span", [$index + 1]);
            },
          },
          {
            key: "moduleName",
            title: "模块名称",
            align: "center",
          },
          {
            key: "typeName",
            title: "操作类型",
            align: "center",
          },
          {
            key: "logName",
            title: "日志类型",
            align: "center",
          },
          {
            key: "moduleMethod",
            title: "调用方法",
            align: "center",
          },
          {
            key: "moduleParams",
            title: "调用方法参数",
            align: "center",
          },
          {
            key: "ipAddr",
            title: "IP地址",
            align: "center",
          },
          {
            key: "opByName",
            title: "账号",
            align: "center",
          },
          {
            key: "status",
            title: "操作状态",
            align: "center",
            render(h,{value}){
              let obj ={
                0:'成功',
                1:'失败'
              }
              return h('span',[obj[value]])
            }
          },
          {
            key: "opAt",
            title: "操作时间",
            align: "center",
            render(h,{value}){
                return h('span',[getMyDate(value)])
            }
          },
        ]),
        formatData: {},
        currentObj:null,
        addVisible: false,
        moduleList:[],//日志模块列表
        logTypeList:[],//日志类型列表
        typeList:[],//日志操作类型列表
      };
    },
    
    async created() {
      await this.getList();
      await this.getTable();
    },
    methods: {
      // 获取日志模块列表、操作类型列表、类型列表
      async getList(){
        const res = await logModules();
        this.moduleList = res.data;
        const data = await logTypes();
        this.logTypeList = data.data;
        const typeData = await getTypes();
        this.typeList = typeData.data;
      },
      pageChange(page, pageSize) {
          this.pagination.currentPage = page;
          this.pagination.pageSize = pageSize;
          this.getTable();
      },
      async getTable() {
        this.formatData = {
          ...this.formatData,
          pageSize: this.pagination.pageSize,
          pageNum: this.pagination.currentPage,
        };
        if(this.dateList&&this.dateList.length>0){
          this.formatData.startOpAt = this.dateList[0];
          this.formatData.endOpAt = this.dateList[1];
        }
        this.loading = true;
        const { data, count } = await listPage(this.formatData);
        if(data&&data.length>0){
          data.forEach(item => {
            item.moduleName = this.getModuleName(item.moduleCode);
            item.typeName = this.getType(item.moduleType);
            item.logName = this.getLogName(item.logType);
          });
        }
        this.dataSource = data;
        this.pagination.total = parseInt(count);
        this.loading = false;
      },
      reset() {
          this.formatData = {};
          this.dateList = [];
          this.pagination.currentPage = 1;
          this.getTable();
      },
      // 获取日志模块名称
      getModuleName(code){
        let str = "";
        this.moduleList.forEach(item=>{
          if(code == item.code){
            str = item.name
          }
        })
        return str
      },
      // 获取日志类型名称
      getLogName(code){
        let str = "";
        this.logTypeList.forEach(item=>{
          if(code == item.code){
            str = item.name
          }
        })
        return str
      },
      // 获取日志操作类型名称
      getType(code){
        let str = "";
        this.typeList.forEach(item=>{
          if(code == item.code){
            str = item.name
          }
        })
        return str
      },
    },
  };
  </script>
  <style scoped lang="scss">
  .pr10 {
    padding-right: 10px;
  }
  
  .mt10 {
    margin-top: 10px;
  }
  
  .telemetry {
    padding: 10px;
  }
  
  .label {
    font-size: 12px;
    color: #666;
  }
  
  .card {
    background: white;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    font-size: 13px;
    border-radius: 10px;
    overflow: hidden;
  
    .card-header {
      padding: 10px;
      border-bottom: 1px solid #ebeef5;
      box-sizing: border-box;
    }
  
    .card-content {
      padding: 10px;
    }
  }
  
  ::v-deep .el-form-item {
    margin-bottom: 0px;
  }
  </style>
  