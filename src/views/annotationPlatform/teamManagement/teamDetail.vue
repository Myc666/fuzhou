<template>
  <div>
    <div class="head-container">
      <el-input
        v-model="params.name"
        placeholder="请输入账号名称"
        style="width: 200px; margin-right: 10px"
      ></el-input>
      <el-button type="primary" icon="el-icon-search" @click="getTeamPerson"
        >查询</el-button
      >
      <el-button
        type="primary"
        icon="el-icon-upload2"
        @click="exportData"
        style="float: right"
        >导出</el-button
      >
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="addData"
        style="float: right"
        >批量新增</el-button
      >
    </div>
    <div class="ai_table">
      <el-table
        :data="tableData"
        border
        style="width: 100%;margin-top: 16px;"
        v-loading="loading"
      >
        <el-table-column align="center" label="所属团队">
          <template slot-scope="scope">
            {{ scope.row.teams[0].name }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="name" label="账号名称">
        </el-table-column>
        <el-table-column align="center" label="密码">
          <template slot-scope="scope">
            {{ scope.row.password || "无" }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="userNum" label="角色">
          <template slot-scope="scope">
            {{ handleRoleData(scope.row.roles) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间">
          <template slot-scope="scope">
            {{ $moment(scope.row.updatedAt).format("YYYY-MM-DD HH:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="160">
          <template slot-scope="scope">
            <el-button
              type="text"
              class="danger"
              @click="deletePerson(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <AddPerson
      v-if="addPersonVisible"
      @close="(addPersonVisible = false), getTeamPerson()"
    />
  </div>
</template>
<script>
import {
  getTeamPerson,
  getRoleList,
  deletePerson,
  exportPerson,
} from "@/api/annotationPlatform/teamManagement";
import AddPerson from "@/components/annotationPlatform/teamManagement/addPerson";
export default {
  components: {
    AddPerson,
  },
  data() {
    return {
      addPersonVisible: false,
      loading: false,
      params: {
        teamId: this.$route.query.id,
        name: "",
      },
      roleOptions: [],
      tableData: [],
    };
  },
  async created() {
    await this.getRoleList();
    this.getTeamPerson();
  },
  methods: {
    async getRoleList() {
      const data = await getRoleList();
      this.roleOptions = data.data;
    },
    // 获取团队成员列表
    async getTeamPerson() {
      this.loading = true;
      const data = await getTeamPerson(this.params);
      this.tableData = data.data;
      this.loading = false;
    },
    // 新增团队
    addData() {
      this.addPersonVisible = true;
    },
    // 导出
    async exportData() {
      let form = new FormData();
      form.append("teamId", this.params.teamId);
      const data = await exportPerson({
        teamId: this.params.teamId,
      });
      const href = window.URL.createObjectURL(data.data); //转成url格式
      window.location.href = href;
    },
    // 删除团队成员
    async deletePerson(item) {
      this.$confirm(`确定删除该条数据?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await deletePerson({
            teamId: this.params.teamId,
            userId: item.id,
          });
          if (res.code == 0) {
            this.$message.success("删除成功");
            await this.getTeamPerson();
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
    close() {
      this.addPersonVisible = false;
      this.getTeamPerson();
    },
  },
};
</script>
<style scoped lang="scss">
.search_box {
  padding-bottom: 20px;
}
</style>
