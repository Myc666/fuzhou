<template>
    <div>
      <Tables
        :pagination="false"
        :columns="columns"
        :dataSource="dataSource"
        :loading="loading"
        :rowSelection="false"
      >
        <div slot="header" class="head-container"  v-if="rolesData">
            <!-- <el-input
              v-model="formatData.nameCh"
              placeholder="角色名称"
              style="width: 200px; margin-right: 10px"
            ></el-input>
  
            <el-button type="primary" icon="el-icon-search" @click="getTable"
              >查询</el-button
            > -->
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="addData"
              >新增角色</el-button>
        </div>

        <div slot="operate" slot-scope="{ row }">
            <el-button type="text" @click="editData(row)">编辑</el-button>
            <el-button v-if="rolesData" type="text" style="color: #f56c6c !important" @click="delData(row.id)">删除</el-button>
        </div>
      </Tables>
      <AddRole
        v-if="addVisible"
        :currentId="currentId"
        @close="(addVisible = false), getTable()"
      />
    </div>
  </template>
  <script>
  import Tables from "@/components/Table/index.vue";
  import AddRole from "./components/addRole.vue";
  import { getMyDate } from "@/utils/common.js";
  import { listData,deleteData } from "./api"
  export default {
    components: {
      Tables,
      AddRole
    },
    data() {
      return {
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0,
        },
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
            key: "nameCh",
            title: "⻆⾊名称",
            align: "center",
          },
          {
            key: "nameEn",
            title: "⻆⾊编码",
            align: "center",
          },
          {
            key: "createdAt",
            title: "创建时间",
            align: "center",
            render(h,{value}){
                return h('span',[getMyDate(value)])
            }
          },
          {
            key: "Base",
            title: "操作",
            align: "center",
            flex: "right",
            slot: "operate",
            },
        ]),
        formatData: {},
        currentId:null,
        addVisible: false
      };
    },
    computed:{
      rolesData:()=>{
        let role = localStorage.getItem('rolesData').split(',')
        return (role.includes('admin') || role.includes('sys_user'))
      }
    },
    created() {
        this.getTable();
    },
    methods: {
        // pageChange(page, pageSize) {
        //     this.pagination.currentPage = page;
        //     this.pagination.pageSize = pageSize;
        //     this.getTable();
        // },
        async getTable() {
          this.formatData = {
            ...this.formatData,
          };
          this.loading = true;
          listData(this.formatData).then(res=>{
            this.dataSource = res.data&&res.data.length>0?res.data:[];
            this.loading = false;
          }).catch(()=>{
            this.loading = false;
          })
          
        },
        reset() {
          this.formatData = {};
          // this.pagination.currentPage = 1;
          this.getTable();
        },
        // 新增
        addData() {
          this.currentId = null;
          this.addVisible = true;
        },
        // 编辑  
        editData(row){
          this.currentId = row.id;
          this.addVisible = true;
        },
        // 删除
        delData(Id){
          this.$confirm(`确定删除该条数据?`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
          }).then(async() => {
              const res = await deleteData({id:Id});
              this.$message.success("删除成功");
              this.getTable()
          }).catch(() => {});
        }
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
    margin-bottom: 20px;
  }
  </style>
  