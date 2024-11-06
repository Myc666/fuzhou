<template>
  <div class="wrap">
    <el-row :gutter="20">
      <el-col :span="10">
        <el-card class="box-card">
          <div
            slot="header"
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
            "
          >
            <span>标注组管理</span>
            <div>
              <el-button type="primary" @click="addGroup">创建分组</el-button>
            </div>
          </div>
          <el-table
            ref="groupTable"
            :data="groupData"
            border
            v-loading="loading"
            highlight-current-row
            @current-change="handleCurrentChange"
          >
            <el-table-column label="分组名称" prop="name"></el-table-column>
            <el-table-column
              label="成员数量"
              prop="memberNum"
            ></el-table-column>
            <el-table-column label="创建日期">
              <template slot-scope="scope">
                {{ $moment(scope.row.createdAt).format("YYYY-MM-DD") }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click.stop="editGroup(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  class="danger"
                  @click="deleteGroup(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-card class="box-card">
          <div
            slot="header"
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
            "
          >
            <span>
              <span v-if="currentSelectGroup&&currentSelectGroup.name">
                {{ currentSelectGroup.name }}：
              </span>
              人员管理
            </span>
            <div style="font-size: 0">
              <el-button
                type="primary"
                icon="el-icon-plus"
                style="margin-right: 10px"
                @click="addPersonVisible = true"
                >添加人员</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                style="margin-right: 10px"
                @click="deletePerson(2)"
                >批量删除</el-button
              >
              <!-- <el-input
                placeholder="人员名称"
                style="width: 200px; margin-right: 10px"
              ></el-input>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="getGroupPersonList"
                >查询</el-button
              > -->
            </div>
          </div>
          <el-table
            ref="personData"
            :data="personData"
            border
            v-loading="loading"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              label="序号"
              width="60"
              align="center"
            ></el-table-column>
            <el-table-column label="账号名称" prop="name"></el-table-column>
            <!-- <el-table-column label="账号角色"></el-table-column> -->
            <el-table-column label="创建时间">
              <template slot-scope="scope">
                {{ $moment(scope.row.createdAt).format("YYYY-MM-DD HH:mm:ss") }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  class="danger"
                  @click="deletePerson(1, scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <AddGroup
      :currentEditGroup="currentEditGroup"
      v-if="addGroupVisible"
      @close="(addGroupVisible = false), getListData('edit')"
    />
    <AddPerson
      :currentSelectGroup="currentSelectGroup"
      :personData="personData"
      v-if="addPersonVisible"
      @close="(addPersonVisible = false), getGroupPersonList('edit')"
    />
  </div>
</template>
<script>
import {
  getListData,
  deleteData,
  deletePersonData,
  getGroupPersonList,
} from "@/api/annotationPlatform/annotationGroupManagement";
import AddGroup from "@/components/annotationPlatform/annotationGroupManagement/addGroup";
import AddPerson from "@/components/annotationPlatform/annotationGroupManagement/addPerson";
import Cookies from "js-cookie";
export default {
  components: {
    AddGroup,
    AddPerson,
  },
  data() {
    return {
      loading: false,
      addGroupVisible: false,
      addPersonVisible: false,
      currentEditGroup: null,
      currentSelectGroup: null,
      groupData: [],
      personData: [],
      multipleSelection: [],
    };
  },
  created() {
    this.getListData("init");
  },
  computed:{
    isexport() {
      if (Cookies.get("roleCodes").search("admin") > -1 || Cookies.get("roleCodes").search("ap_admin") > -1) {
        return false;
      }
    }
  },
  methods: {
    async getListData(source) {
      this.loading = true;
      const data = await getListData();
      this.loading = false;
      this.groupData = data.data;
      // source为init时，代表页面新加载，默认选中第一条标注组
      // source为edit时，代表修改完新加载，默认选中之前的标注组
      if (source == "init" && this.groupData.length) {
        this.currentSelectGroup = this.groupData[0];
      } else {
        const obj = this.groupData.find(
          (i) => i.id == this.currentSelectGroup.id
        );
        this.currentSelectGroup = obj;
      }
      this.$refs.groupTable.setCurrentRow(this.currentSelectGroup);
    },
    async getGroupPersonList() {
      const data = await getGroupPersonList({
        groupId: this.currentSelectGroup?.id,
      });
      this.personData = data.data;
    },
    // 新建分组
    addGroup() {
      this.currentEditGroup = null;
      this.addGroupVisible = true;
    },
    // 编辑分组
    editGroup(item) {
      this.currentEditGroup = item;
      this.addGroupVisible = true;
    },
    // 删除分组
    deleteGroup(item) {
      this.$confirm(`确定删除该条数据?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await deleteData({ groupId: item.id });
        if (res.code == 0) {
          this.$message.success("删除成功");
          await this.getListData();
        }
      });
    },
    // 删除人员 type为1是单个删除，2是批量删除
    deletePerson(type, item) {
      let message = "";
      let delArr = [];
      if (type == 1) {
        message = "确定删除该条数据?";
        delArr = [item.id];
      } else {
        message = "确定批量删除选中的数据?";
        delArr = this.multipleSelection;
      }
      if (!delArr.length) {
        return this.$message.error('未选中要删除的人员')
      }
      this.$confirm(message, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await deletePersonData(delArr, this.currentSelectGroup.id);
        if (res.code == 0) {
          this.$message.success("删除成功");
          await this.getGroupPersonList();
          this.$refs.personData.clearSelection();
        }
      });
    },
    handleCurrentChange(row) {
      this.currentSelectGroup = row;
      this.getGroupPersonList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val.map((i) => {
        return i.id;
      });
    },
  },
};
</script>
<style scoped lang="scss">
.wrap {
  min-width: 1200px;
}

::v-deep .el-input {
  margin-bottom: 0 !important;
}
</style>
