<template>
  <div>
    <div class="head-container">
      <el-select
        placeholder="摄像头"
        clearable
        v-model="params.cameraId"
        class="head-container-input"
      >
        <el-option
          v-for="(item, index) in cameraOptions"
          :key="index"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-select
        placeholder="算法"
        clearable
        v-model="params.algorithmId"
        class="head-container-input"
      >
        <el-option
          v-for="(item, index) in algorithmOptions"
          :key="index"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-select
        placeholder="审核状态"
        clearable
        v-model="params.auditState"
        class="head-container-input"
      >
        <el-option
          v-for="(item, index) in auditStateOptions"
          :key="index"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-select
        placeholder="审核结果"
        clearable
        v-model="params.auditResult"
        class="head-container-input"
      >
        <el-option
          v-for="(item, index) in auditResultOptions"
          :key="index"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="getListData"
        >查询</el-button
      >
      <el-button icon="el-icon-refresh" @click="refreshData">重置</el-button>
    </div>
    <div class="ai_table">
      <el-button type="primary" icon="el-icon-upload" style="margin-bottom: 10px;" @click="exportVisible = true"
        >导出数据</el-button
      >
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column align="center" prop="cameraName" label="摄像头名称">
        </el-table-column>
        <el-table-column align="center" prop="algorithmName" label="算法名称">
        </el-table-column>
        <el-table-column align="center" prop="conf" label="置信度">
        </el-table-column>
        <el-table-column align="center" label="告警类型">
          <template slot-scope="scope">
            <template>{{ handleType(scope.row.type) }}</template>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createdStr" label="创建时间" width="140">
        </el-table-column>
        <el-table-column align="center" label="审核状态">
          <template slot-scope="scope">
            <template>{{ handleAuditState(scope.row.auditState) }}</template>
          </template>
        </el-table-column>
        <el-table-column align="center" label="审核结果">
          <template slot-scope="scope">
            <template>{{ handleAuditResult(scope.row.auditResult) }}</template>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="80">
          <template slot-scope="scope">
            <el-button type="text" @click="clickDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          :current-page="params.page"
          :page-size="params.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>
    </div>
    <AlarmDetail
      :currentId="currentId"
      v-if="alarmDetailVisible"
      @close="(alarmDetailVisible = false), getListData()"
    />
    <Export
      v-if="exportVisible"
      @close="(exportVisible = false), getListData()"
    />
  </div>
</template>
<script>
import {
  getListData,
  getCameraListData,
  getAlgorithmListData,
  getTypeListData,
} from "@/api/applicationMonitoring/incrementalRraining";
import AlarmDetail from "@/components/applicationMonitoring/incrementalRraining/alarmDetail";
import Export from "@/components/applicationMonitoring/incrementalRraining/export";
export default {
  components: {
    AlarmDetail,
    Export
  },
  data() {
    return {
      loading: false,
      alarmDetailVisible: false,
      exportVisible: false,
      tableData: [],
      currentId: "",
      params: {
        cameraId: "",
        algorithmId: "",
        auditState: "",
        auditResult: "",
        limit: 10,
        page: 1,
      },
      total: 0,
      cameraOptions: [],
      algorithmOptions: [],
      typeOptions: [],
      auditStateOptions: [
        {
          name: '待审核',
          id: 0,
        },
        {
          name: '已审核',
          id: 1,
        },
      ],
      auditResultOptions: [
      {
          name: '无',
          id: 0,
        },
        {
          name: '正确',
          id: 1,
        },
        {
          name: '错误',
          id: 2,
        },
      ],
    };
  },
  async created() {
    await this.getOptions();
    this.getListData();
  },
  methods: {
    // 获取下拉
    async getOptions() {
      const data1 = await getCameraListData();
      this.cameraOptions = data1.data;
      const data2 = await getAlgorithmListData();
      this.algorithmOptions = data2.data;
      const data3 = await getTypeListData();
      this.typeOptions = data3.data;
    },
    // 获取增量列表
    async getListData() {
      this.loading = true;
      const data = await getListData(this.params);
      this.tableData = data.data;
      this.total = Number(data.count);
      this.loading = false;
    },
    // 重置
    refreshData() {
      Object.assign(this.params, {
        cameraId: "",
        algorithmId: "",
        auditState: "",
        auditResult: "",
        limit: 10,
        page: 1,
      });
      this.getListData();
    },
    // 告警详情
    clickDetail(item) {
      this.currentId = item.id;
      this.alarmDetailVisible = true;
    },
    // 分页
    handleCurrentChange(val) {
      this.params.page = val;
      this.getListData();
    },
    handleSizeChange(val) {
      this.params.limit = val;
      this.params.page = 1;
      this.getListData();
    },
    handleType(type) {
      const obj = this.typeOptions.find((item) => item.id == type);
      return obj.name;
    },
    handleAuditState(auditState) {
      const obj = this.auditStateOptions.find((item) => item.id == auditState);
      return obj.name;
    },
    handleAuditResult(auditResult) {
      const obj = this.auditResultOptions.find((item) => item.id == auditResult);
      return obj.name;
    },
  },
};
</script>
<style scoped lang="scss">
</style>
