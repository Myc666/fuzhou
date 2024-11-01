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
        <div slot="header" class="head-container" v-if="rolesData">
            <!-- <el-input
              v-model="formatData.name"
              placeholder="名称"
              style="width: 200px; margin-right: 10px"
            ></el-input>
  
            <el-button type="primary" icon="el-icon-search" @click="getTable"
              >查询</el-button
            > -->
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="addData"
              >新增用户</el-button
            >
        </div>
        <div slot="roles" slot-scope="{ row }">
          <div v-if="row.roles.length>0">
            <span v-for="(item,index) in row.roles" :key="index">
              {{ item.nameCh }}{{ index==row.roles.length-1?'':'、' }}
            </span>
          </div>
        </div>
        <div slot="operate" slot-scope="{ row }">
            <el-button type="text"  @click="editData(row)">编辑</el-button>
            <!-- <el-button type="text"  @click="editPassword(row)">修改密码</el-button> -->
            <el-button type="text" style="color: #f56c6c !important" v-if="row.state==0 && rolesData" @click="delData(row.id)">删除</el-button>
        </div>
      </Tables>
      <AddUser
        v-if="addVisible"
        :currentId="currentId"
        @close="(addVisible = false), getTable()"
      />
      <el-dialog
        title="修改密码"
        :visible.sync="psdVisible"
        width="30%">
        <div>
          <el-input v-model="psd"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="psdVisible = false">取 消</el-button>
          <el-button type="primary" @click="passwardConfig()">确 定</el-button>
        </span>
      </el-dialog>

  </div>
</template>
<script>
import Tables from "@/components/Table/index.vue";
import AddUser from "./components/addUser.vue";
import { getMyDate } from "@/utils/common.js";
import { listData,deleteData,modifyPassword } from "./api"
export default {
  components: {
    Tables,
    AddUser
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
          key: "name",
          title: "名称",
          align: "center",
        },
        {
          key: "account",
          title: "账号",
          align: "center",
        },
        {
          key: "password",
          title: "密码",
          align: "center",
        },
        {
          key: "passTemplateName",
          title: "密级",
          align: "center",
        },
        {
          key: "state",
          title: "状态",
          align: "center",
          render(h,{value}){
            let obj = {
              '0':'正常',
              "1":"禁用",
            }
            return h('span',[obj[value]])
          }
        },
        {
          key: "departName",
          title: "归属组织机构",
          align: "center",
        },
        {
          key: "roles",
          title: "归属角色",
          align: "center",
          slot: "roles",
        },
        {
          key: "jobName",
          title: "岗位名称",
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
      addVisible: false,
      psdVisible: false,
      psd:''
    };
  },
  
  created() {
    this.getTable();
  },
  computed:{
    rolesData:()=>{
      let role = localStorage.getItem('rolesData').split(',')
      return (role.includes('admin') || role.includes('sys_user'))
    }
  },
  methods: {
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
        this.loading = true;
        const { data, count } = await listData(this.formatData);
        this.dataSource = data;
        this.pagination.total = parseInt(count);
        this.loading = false;
      },
      reset() {
          this.formatData = {};
          this.pagination.currentPage = 1;
          this.getTable();
      },
      // 新增
      addData() {
        console.log(12)
          this.currentId = null;
          this.addVisible = true;
      },
      // 编辑  
      editData(row){
          this.currentId = row.id;
          this.addVisible = true;
      },
      editPassword(row){
        this.currentId = row.id;
        this.psdVisible = true;
      },
      async passwardConfig(){
        const { code } = await modifyPassword({ id: this.currentId, password: this.psd })
        this.psdVisible = false;
        this.psd = ''
        this.$message.success('修改成功')
      },
      // 删除
      delData(Id){
          this.$confirm(`确定删除该条数据?`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
          }).then(async() => {
            let form = new FormData();
            form.append("accountId", Id);
            const res = await deleteData(form);
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
