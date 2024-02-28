<template>
  <div>
    <div class="head-container">
      <el-input
        v-model="params.name"
        placeholder="请输入团队名称"
        style="width: 200px; margin-right: 10px"
      ></el-input>
      <el-button type="primary" icon="el-icon-search" @click="getListData"
        >查询</el-button
      >
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="addData"
        style="float: right"
        >新增团队</el-button
      >
    </div>
    <div class="ai_table">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column align="center" prop="name" label="团队名称">
        </el-table-column>
        <el-table-column align="center" prop="description" label="团队描述">
        </el-table-column>
        <el-table-column align="center" prop="createdName" label="创建人">
        </el-table-column>
        <el-table-column align="center" prop="userNum" label="团队人数">
        </el-table-column>
        <el-table-column align="center" label="创建时间">
          <template slot-scope="scope">
            {{ $moment(scope.row.updatedAt).format("YYYY-MM-DD HH:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="text" @click="clickTeamDetail(scope.row)"
              >管理</el-button
            >
            <el-button type="text" class="danger" @click="deleteData(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <AddTeam
      v-if="addTeamVisible"
      @close="(addTeamVisible = false), getListData()"
    />
  </div>
</template>
<script>
import {
  getListData,
  deleteData,
} from "@/api/annotationPlatform/teamManagement";
import AddTeam from "@/components/annotationPlatform/teamManagement/addTeam";
export default {
  components: {
    AddTeam,
  },
  data() {
    return {
      addTeamVisible: false,
      loading: false,
      params: {
        pageNum: 1,
        pageSize: 10,
        name: "",
      },
      tableData: [],
    };
  },
  created() {
    this.getListData();
  },
  methods: {
    // 获取团队列表
    async getListData() {
      this.loading = true;
      const data = await getListData(this.params);
      this.tableData = data.data;
      this.loading = false;
    },
    // 新增团队
    addData() {
      this.addTeamVisible = true;
    },
    // 删除团队
    async deleteData(item) {
      this.$confirm(`确定删除该条数据?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await deleteData({ teamId: item.id });
          if (res.code == 0) {
            this.$message.success("删除成功");
            await this.getListData();
          }
        })
        .catch(() => {});
    },
    // 跳转团队详情
    clickTeamDetail(item) {
      this.$router.push({
        path: "/annotationPlatform/teamManagement/teamDetail",
        query: {
          id: item.id,
        },
      });
    },
    close() {
      this.addTeamVisible = false;
      this.getListData();
    },
  },
};
</script>
<style scoped lang="scss">
.search_box {
  padding-bottom: 20px;
}
</style>
