<template>
  <div>
    <div class="head-container">
      <div>
        <el-input
          v-model="params.name"
          placeholder="账号名称"
          style="width: 200px; margin-right: 10px"
        ></el-input>
        
        <el-button type="primary" icon="el-icon-search" @click="getListData"
          >查询</el-button
        >
      </div>
      <div>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addData"
          style="float: right"
          >新建账号</el-button
        >
      </div>
    </div>
    <div class="ai_table">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column align="center" prop="name" label="账号名称">
        </el-table-column>
        <el-table-column align="center" label="账号状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state == 0">正常</span>
            <span v-if="scope.row.state == 1">禁用</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="账号密码">
          <template slot-scope="scope">
            {{ scope.row.password }}
            <el-button type="text" @click="resetPassword(scope.row)"
              >重置</el-button
            >
          </template>
        </el-table-column>
        <el-table-column align="center" prop="name" label="用户角色">
          <template slot-scope="scope">
            {{ handleRoleData(scope.row.roles) }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="name" label="所属团队">
          <template slot-scope="scope">
            {{ scope.row.teams[0]?.name || "--" }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间">
          <template slot-scope="scope">
            {{ $moment(scope.row.createdAt).format("YYYY-MM-DD HH:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="text" @click="editData(scope.row)">编辑</el-button>
            <el-button type="text" class="danger" @click="deleteData(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          :current-page="params.pageNum"
          :page-size="params.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>
    </div>
    <AddAccount
      :currentAccount="currentAccount"
      v-if="addAccountVisible"
      @close="(addAccountVisible = false), getListData()"
    />
  </div>
</template>
<script>
import {
  getListData,
  getRoleList,
  resetPassword,
  deleteData,
} from "@/api/applicationMonitoring/accountManagement";
import AddAccount from "@/components/applicationMonitoring/accountManagement/addAccount";
export default {
  components: {
    AddAccount,
  },
  data() {
    return {
      addAccountVisible: false,
      loading: false,
      tableData: [],
      currentAccount: null,
      params: {
        name: "",
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      roleOptions: [],
    };
  },
  async created() {
    await this.getRoleList();
    this.getListData();
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      const data = await getRoleList();
      this.roleOptions = data.data;
    },
    // 获取账号列表
    async getListData() {
      this.loading = true;
      const data = await getListData(this.params);
      this.tableData = data.data;
      this.total = Number(data.count);
      this.loading = false;
    },
    // 新增账号
    addData() {
      this.currentAccount = null;
      this.addAccountVisible = true;
    },
    // 编辑账号
    editData(item) {
      this.currentAccount = item;
      this.addAccountVisible = true;
    },
    // 重置密码
    async resetPassword(item) {
      this.$confirm(`确定重置密码?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await resetPassword({ accountId: item.id });
          if (res.code == 0) {
            this.$message.success("重置成功");
            await this.getListData();
          }
        })
        .catch(() => {});
    },
    // 删除账号
    async deleteData(item) {
      this.$confirm(`确定删除该条数据?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await deleteData({ accountId: item.id });
          if (res.code == 0) {
            this.$message.success("删除成功");
            await this.getListData();
          }
        })
        .catch(() => {});
    },
    handleRoleData(roles) {
      const list = [];
      roles.forEach((item) => {
        const obj = this.roleOptions.find((i) => i.id == item.id);
        if (obj) {
          list.push(obj.nameCh);
        }
      });
      return list.join(",") || "--";
    },
    // 分页
    handleCurrentChange(val) {
      this.params.pageNum = val;
      this.getListData();
    },
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.params.pageNum = 1;
      this.getListData();
    },
    close() {
      this.addAccountVisible = false;
      this.getListData();
    },
  },
};
</script>
<style scoped lang="scss">
.head-container {
  display: flex;
  justify-content: space-between;
}
</style>
