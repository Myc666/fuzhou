<template>
  <div>
    <div class="head-container">
      <div>
        <el-input
          v-model="params.projectName"
          placeholder="项目名称"
          style="width: 200px; margin-right: 10px"
        ></el-input>
        <el-select
          v-model="params.status"
          placeholder="项目状态"
          style="width: 200px; margin-right: 10px"
          clearable
        >
          <el-option
            v-for="(item, index) in statusOptions"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select
          v-model="params.projectType"
          placeholder="标注类型"
          style="width: 200px; margin-right: 10px"
          clearable
        >
          <el-option
            v-for="(item, index) in projectTypeOptions"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="getListData"
          >查询</el-button
        >
      </div>
      <div>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addData"
          v-if="!isexport"
          style="float: right"
          >新建项目</el-button
        >
      </div>
    </div>
    <div class="ai_table" style="margin-top: 16px;">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column align="center" label="项目名称">
          <template slot-scope="scope">
            <el-button type="text" @click="clickProjectDetail(scope.row)">{{
              scope.row.projectName
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="标注类型">
          <template slot-scope="scope">
            <el-tag
              :type="
                scope.row.projectType == 1 || scope.row.projectType == 3
                  ? 'success'
                  : ''
              "
              >{{ handleProjectType(scope.row.projectType) }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column align="center" prop="itemCount" label="图片数量">
        </el-table-column>
        <el-table-column
          align="center"
          prop="reviewNum"
          label="质检未通过图片数"
        >
          <template slot-scope="scope">
            <template v-if="scope.row.reviewNum == 0">未开始</template>
            <template v-else>{{ scope.row.noPassImageNum }}</template>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="status" label="项目状态">
          <template slot-scope="scope">
            <template v-if="scope.row.status == 99">已交付</template>
            <template v-else>标注中</template>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="nameEn" label="创建时间">
          <template slot-scope="scope">
            {{ $moment(scope.row.createdAt).format("YYYY-MM-DD HH:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="220">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="clickAnnotation(scope.row)"
              :disabled="scope.row.status == 99 || isMark"
              >进入标注</el-button
            >
            <el-button
              type="text"
              @click="clickReview(scope.row)"
              :disabled="
                !Boolean(scope.row.needReview) ||
                scope.row.status == 99 ||
                isCheck
              "
              >进入质检</el-button
            >
            <el-button type="text" :disabled="isexport" @click="dowloadData(scope.row)"
              >导出</el-button
            >
            <el-button type="text" class="danger" :disabled="isDel(scope.row)" @click="deleteData(scope.row)"
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
    <AddProject
      v-if="addProjectVisible"
      @close="(addProjectVisible = false), getListData()"
    />
    <DownloadFile
      v-if="downloadFileVisible"
      :currentId="currentId"
      :currentProjectType="currentProjectType"
      @close="(downloadFileVisible = false), getListData()"
    />
  </div>
</template>
<script>
import {
  getListData,
  deleteData,
  dowloadData,
} from "@/api/annotationPlatform/projectManagement";
import { projectType } from "@/utils/commonData";
import AddProject from "@/components/annotationPlatform/projectManagement/addProject";
import DownloadFile from "@/components/annotationPlatform/projectManagement/downloadFile";
import Cookies from "js-cookie";
export default {
  components: {
    AddProject,
    DownloadFile,
  },
  data() {
    return {
      addProjectVisible: false,
      downloadFileVisible: false,
      loading: false,
      statusOptions: [
        {
          name: "数据读取中",
          value: 1,
        },
        {
          name: "智能标注中",
          value: 2,
        },
        {
          name: "标注中",
          value: 11,
        },
        {
          name: "已交付",
          value: 99,
        },
      ],
      projectTypeOptions: projectType,
      params: {
        projectName: "",
        status: "",
        projectType: "",
        pageNum: 1,
        pageSize: 10,
      },
      tableData: [],
      total: 0,
      currentId: 0,
      currentProjectType:null,
    };
  },
  async created() {
    this.getListData();
  },
  computed: {
    isMark() {
      if (Cookies.get("roleCodes").search("ap_mark") > -1) {
        return false;
      }else{
        return true
      }
    },
    isCheck() {
      if (Cookies.get("roleCodes").search("ap_review") > -1) {
        return false;
      }else{
        return true
      }
    },
    isexport() {
      if (Cookies.get("roleCodes").search("admin") > -1 || Cookies.get("roleCodes").search("ap_admin") > -1) {
        return false;
      }else{
        return true
      }
    },
    isDel() {

      return (item)=>{
        if(Cookies.get("roleCodes").search("admin") > -1){
          if(item.status == 99 || item.reviewNum == 0){
            return false
          } else {
            return true
          }
        }
        if(Cookies.get("roleCodes").search("ap_admin") > -1){
          if(item.reviewNum == 0){
            return false
          } else {
            return true
          }
        }
        if(Cookies.get("roleCodes").search("admin") > -1 || Cookies.get("roleCodes").search("ap_admin") > -1){
          return false
        }else {
          return true
        }
      }
    },
  },
  methods: {
    // 获取项目列表
    async getListData() {
      this.loading = true;
      const data = await getListData(this.params);
      this.tableData = data.data;
      this.total = Number(data.count);
      this.loading = false;
    },
    // 新增项目
    addData() {
      this.addProjectVisible = true;
    },
    // 跳转项目详情
    clickProjectDetail(item) {
      this.$router.push({
        path: "/annotationPlatform/projectManagement/projectDetail",
        query: {
          id: item.id,
        },
      });
    },
    // 进入标注
    clickAnnotation(item) {
      if (item.projectType == 1) {
        this.$router.push({
          path: "/annotationPlatform/projectManagement/markTool/classifyBatch",
          query: {
            id: item.id,
            type: 1,
          },
        });
      } else {
        this.$router.push({
          path: "/annotationPlatform/projectManagement/markTool/annotate",
          query: {
            id: item.id,
            type: 1,
          },
        });
      }
    },
    // 进入质检
    clickReview(item) {
      if (item.projectType == 1) {
        this.$router.push({
          path: "/annotationPlatform/projectManagement/markTool/classify",
          query: {
            id: item.id,
            type: 2,
          },
        });
      } else {
        this.$router.push({
          path: "/annotationPlatform/projectManagement/markTool/annotate",
          query: {
            id: item.id,
            type: 2,
          },
        });
      }
    },
    async dowloadData(item) {
      this.currentId = item.id;
      this.currentProjectType = item.projectType;
      this.downloadFileVisible = true;
    },
    // 删除项目
    async deleteData(item) {
      this.$confirm(`确定删除该条数据?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await deleteData({ projectId: item.id });
          if (res.code == 0) {
            this.$message.success("删除成功");
            await this.getListData();
          }
        })
        .catch(() => {});
    },
    // 处理项目类型
    handleProjectType(val) {
      const data = this.projectTypeOptions.find((i) => i.value == val);
      return data.name;
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
  },
};
</script>
<style scoped lang="scss">
.head-container {
  display: flex;
  justify-content: space-between;
}
</style>
