<template>
  <div>
    <Tables
      :pagination="pagination"
      :columns="columns"
      :dataSource="dataSource"
      :loading="loading"
      @pageChange="pageChange"
      :rowSelection="false"
      :selections.sync="selectedRowKeys"
    >
      <div slot="header" class="head-container">
        <el-row>
          <el-form label-position="left">
            <el-col :span="4">
              <el-form-item label="摄像头">
                <el-select
                  class="pr10"
                  style="width: 130px"
                  v-model="formatData.cameraId"
                  placeholder="请选择"
                  @change="changeCamera"
                >
                  <el-option
                    v-for="item in cameras"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="时间">
                <el-date-picker
                  style="width: 240px"
                  v-model="times"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-button class="pr10" type="primary" @click="getTable()"
                >搜索</el-button
              >
              <el-button @click="reset()">取消</el-button>
            </el-col>
          </el-form>
        </el-row>
      </div>
      <div slot="img" slot-scope="{ value }">
        <Images v-if="value" :imgUrl="value"></Images>
        <span v-else>--</span>
      </div>
    </Tables>
  </div>
</template>
<script>
import Tables from "@/components/Table/index.vue";
import { listPage, algorithm,cameraListData } from "./api";
import { getMyDate } from "@/utils/common.js";
import Images from './components/image.vue'
export default {
  data() {
    return {
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      rowSelection: {
        type: "checkbox",
        change: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys;
          this.selectedRows = selectedRows;
        },
      },
      selectedRowKeys: [],
      selectedRows: [],
      loading: false,
      dataSource: [],
      columns: Object.freeze([
        {
          key: "index",
          title: "序号",
          align: "center",
          width: 80,
          render(h,{$index}){
            return h('span',[$index+1])
          }
        },
        {
          key: "userId",
          title: "人员ID",
          align: "center",
          width: 80,
        },
        {
          key: "camera",
          title: "摄像头名称",
          align: "center",
          width: 80,
          render(h,{value}){

            return h('span',[value.name])
          }
        },
        {
           key: "enterPic",
           title: "进入照片",
           align: "center",
           slot:'img'
         },
         {
           key: "leavePic",
           title: "离开照片",
           align: "center",
           slot:'img'
         },
        {
          key: "enterTime",
          title: "进入时间",
          align: "center",
          width: 150,
          render(h,{value}){
           return h('span',[getMyDate(value)])
         }
        },
        {
          key: "leaveTime",
          title: "离开时间",
          align: "center",
          width: 150,
          render(h,{value}){
           return h('span',[getMyDate(value)])
         }
        },
        {
          key: "timeLen",
          title: "在场时间",
          align: "center",
          width: 100,
        }
         
      ]),
      formatData: {},
      cameras: [],
      times: [],
    };
  },
  components: {
    Tables,
    Images
  },
  created() {
    this.getTable();
    this.cameraListPage()
  },
  methods: {
    pageChange(page, pageSize) {
     
      this.pagination.currentPage = page;
      this.pagination.pageSize = pageSize;
      this.getTable();
    },
    async getTable() {
      if (this.times.length) {
        this.formatData.startDate = this.times[0];
        this.formatData.endDate = this.times[1];
      }
      
      this.formatData = {
        ...this.formatData,
        limit: this.pagination.pageSize,
        page: this.pagination.currentPage,
      };
      console.log(this.pagination.pageSize)
      this.loading = true;
      const { data, count } = await listPage(this.formatData);
      this.dataSource = data;
      this.pagination.total = parseInt(count);
      this.loading = false;
    },
    reset() {
      this.times = [];
      this.formatData = {};
      this.pagination.currentPage = 1;
      this.getTable();
    },
    async cameraListPage() {
      const { data } = await cameraListData();
      this.cameras = data;
      // if (this.cameras.length) {
      //   this.formatData.cameraId = this.cameras[0].id;
      //   this.changeCamera();
      // }
    },
    changeCamera() {
      this.getTable();
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
::v-deep .el-form-item{
    margin-bottom: 0px;
  }
</style>
