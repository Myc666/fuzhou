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
      <div slot="header" class="head-container" style="display: flex;justify-content: space-between;flex-wrap: wrap;">
        <div>
        <span class="headitem">
          <span class="headname">姓名</span>
          <el-input
          style="width: 100px"
          v-model="formatData.name"
          placeholder=""
        ></el-input>
        </span>
        <span class="headitem">
          <span class="headname">手机号</span>
          <el-input
            style="width: 100px"
            v-model="formatData.tel"
            placeholder=""
          ></el-input>
      </span>
      <span class="headitem">
        <span class="headname">分组</span>
        <el-select v-model="formatData.groupId" placeholder="请选择分组">
          <el-option
            v-for="item in listGroup"
            v-if="item.id"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </span>
        
        <el-button class="pr10" type="primary" @click="getTable()"
          >搜索</el-button
        >
        <el-button @click="reset()">重置</el-button>
      </div>
        <!-- <el-form label-position="left">
              <el-form-item label="姓名">
                
              </el-form-item>
              <el-form-item label="手机号">
                
              </el-form-item>
              <el-form-item label="分组">
                
              </el-form-item>
              
          </el-form> -->
        <div>
          <el-button class="pr10" type="primary" v-if="btnData.includes('face-add')" @click="addData()"
            >新增人脸</el-button
          >
          <el-button
            class="pr10"
            type="primary"
            v-if="btnData.includes('face-group')" 
            @click="grapDetailVisible = true"
            >分组管理</el-button
          >
          <el-button class="pr10" @click="uploadVisible = true"  v-if="btnData.includes('face-batch-upload')" 
            >批量上传</el-button
          >
        </div>
      </div>
      <div slot="operate" slot-scope="{ row }">
        <el-button type="text" v-if="btnData.includes('face-edit')" @click="editData(row)">编辑</el-button>
        <el-button type="text" v-if="btnData.includes('face-view')" @click="seeData(row)">查看</el-button>
        <el-button
          type="text"
          style="color: #f56c6c !important"
          v-if="btnData.includes('face-detele')"
          @click="delData(row.id)"
          >删除</el-button
        >
      </div>
      <template slot="index" slot-scope="{ $index }">
        {{ $index + 1 }}
      </template>
      <template slot="avatar" slot-scope="{ row }">
        <el-image
          style="height: 100px"
          :src="$common.handlePublicUrl(`/face/image/avatar?userId=${row.id}`)"
        ></el-image>
      </template>
    </Tables>
    <detail
      v-if="detailVisible"
      :currentItme="currentItme"
      :currentState="currentState"
      :visible.sync="detailVisible"
      @close="close()"
    ></detail>
    <grapDetailVue
      v-if="grapDetailVisible"
      :visible.sync="grapDetailVisible"
      @close="close()"
    ></grapDetailVue>
    <upload
      v-if="uploadVisible"
      :visible.sync="uploadVisible"
      @close="close()"
    ></upload>
  </div>
</template>
<script>
import Tables from "@/components/Table/index.vue";
import detail from "./components/detail.vue";
import { listPage, delect, listPageDGroup } from "./api";
import { getMyDate } from "@/utils/common.js";
import grapDetailVue from "./components/grapDetail.vue";
import upload from "./components/upload.vue";
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
          key: "avatar",
          title: "序号",
          align: "center",
          slot: "index",
        },
        {
          key: "avatar",
          title: "头像",
          align: "center",
          slot: "avatar",
        },
        {
          key: "name",
          title: "姓名",
          align: "center",
        },
        {
          key: "tel",
          title: "手机号",
          align: "center",
        },
        {
          key: "remark",
          title: "备注",
          align: "center",
          render(h, { value }) {
            let str = value;
            if (value == "undefined") {
              str = "";
            }
            return h("span", [str]);
          },
        },
        {
          key: "faceGroup",
          title: "所属分组",
          align: "center",
          render(h, { value }) {
            return h("span", [value.name]);
          },
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
      detailVisible: false,
      grapDetailVisible: false,
      uploadVisible: false,
      currentState: "",
      currentItme: {},
      listGroup: [],
      btnData:[],
      btnObjList:[],
    };
  },
  components: {
    Tables,
    detail,
    grapDetailVue,
    upload,
  },
  created() {
    this.getBtn();
    this.getTable();
    this.listPageDGroup();
  },
  methods: {
    getBtn(){
      this.btnData = [];
      this.btnObjList = [];
      this.isDetail = false;
      const menuArr = JSON.parse(sessionStorage.getItem('menuTree'));
      let newArr = [];
      this.getbtnList(menuArr);
      this.btnObjList.filter((item,index)=>{
        newArr.push(item.auth)
      })
      this.btnData = newArr;
    },
    getbtnList(data){
      let arr = []
      data.forEach(item=>{
          if(item.path==this.$route.path){
              arr = item.children.filter((items,ind)=>{
                return items.type==2
              })
              this.btnObjList = arr;
          }else{
              this.getbtnList(item.children);
          }
      })
    },
    async listPageDGroup() {
      const { data, count } = await listPageDGroup();
      this.listGroup = data;
    },
    pageChange(page, pageSize) {
      this.pagination.currentPage = page;
      this.pagination.pageSize = pageSize;
      this.getTable();
    },
    async getTable() {
      this.formatData = {
        ...this.formatData,
        limit: this.pagination.pageSize,
        page: this.pagination.currentPage,
      };
      this.loading = true;
      const { data, count } = await listPage(this.formatData);
      this.dataSource = data;
      this.pagination.total = parseInt(count);
      this.loading = false;
    },
    reset() {
      this.pagination.currentPage = 1;
      this.formatData = {};
      this.getTable();
    },
    addData() {
      this.currentItme = {};
      this.currentState = "add";
      this.detailVisible = true;
    },
    editData(item) {
      this.currentState = "edit";
      this.currentItme = item;
      this.detailVisible = true;
    },
    seeData(item) {
      this.currentState = "see";
      this.currentItme = item;
      this.detailVisible = true;
    },
    async delData(id) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const { code } = await delect({ id: id });
        if (code == 0) {
          this.$message.success("删除成功");
          this.getTable();
        }
      });
    },
    close() {
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
::v-deep .el-form-item {
  margin-bottom: 0px;
}
.headname{
  font-size: 14px;
  color: #666;
  padding-right: 10px;
}
.headitem{
  padding-right: 64px;
}
</style>
