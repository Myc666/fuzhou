<template>
  <div>
    <div class="flex">
      <div class="flex-tree">
        <el-tree
          :data="treeData"
          :props="defaultProps"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span @click="handleNodeClick(data)">{{ node.label }}</span>
            <span style="margin-left: 10px;" @click="openTreeMenu(data)">
              <i class="el-icon-setting"></i>
            </span>
          </span>
        </el-tree>
      </div>
      <div class="flex-right">
        <div class="head-container">
          <el-input
            v-model="params.name"
            placeholder="摄像头名称"
            style="width: 200px; margin-right: 10px"
          ></el-input>
          <el-button type="primary" icon="el-icon-search" @click="getListData"
            >查询</el-button
          >
          <el-button icon="el-icon-refresh" @click="refreshData"
            >重置</el-button
          >
        </div>
        <div class="ai_table">
          <el-table
            :data="tableData"
            border
            style="width: 100%"
            v-loading="loading"
          >
            <el-table-column align="center" label="实况图" width="110">
              <template slot-scope="scope">
                <el-image 
                  style="width: 80px;margin-top: 5px;"
                  :src="$common.handleCameraImgUrl(scope.row.fileName)" 
                  :preview-src-list="[$common.handleCameraImgUrl(scope.row.fileName)]">
                </el-image>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="name" label="摄像头名称">
            </el-table-column>
            <el-table-column
              align="center"
              prop="locationName"
              label="所属区域"
            >
            </el-table-column>
            <!-- <el-table-column align="center" prop="intervalTime" label="流类型">
              <template slot-scope="scope">
                <el-dropdown style="margin-left: 10px">
                  <span class="el-dropdown-link">
                    <span v-if="scope.row.rtspType == 0">实时</span>
                    <span v-if="scope.row.rtspType == 1">备份</span>
                    <span v-if="scope.row.rtspType == 2">图片</span>
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      @click.native="switchRtspType(0, scope.row)"
                      >实时视频地址</el-dropdown-item
                    >
                    <el-dropdown-item
                      @click.native="switchRtspType(1, scope.row)"
                      >备份视频地址</el-dropdown-item
                    >
                    <el-dropdown-item
                      @click.native="switchRtspType(2, scope.row)"
                      >图片地址</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column> -->
            <!-- <el-table-column
              align="center"
              prop="alarmInterval"
              label="告警间隔(秒)"
            >
            </el-table-column> -->
            <el-table-column
              align="center"
              prop="intervalTime"
              label="推理间隔(秒)"
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="algorithmNames"
              label="关联算法"
            >
            </el-table-column>
            <el-table-column align="center" label="时段配置">
              <template slot-scope="scope">
                <el-button type="text" @click="configure(scope.row)"
                  >配置</el-button
                >
              </template>
            </el-table-column>
            <el-table-column align="center" label="运行状态">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.running"
                  @change="switchRunning(scope.row)"
                  :active-value="1"
                  :inactive-value="0"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="160">
              <template slot-scope="scope">
                <el-button type="text" @click="editData(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  class="danger"
                  @click="deleteData(scope.row)"
                  >删除</el-button
                >
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
      </div>
    </div>
    <div v-show="showTreeMenu" class="treeMenu">
      <div @click="addRegion">新增子区域</div>
      <div v-if="isDelete" @click="deleteRegion">删除该区域</div>
      <div @click="editRegion">编辑该区域</div>
      <div @click="addCamera">创建摄像头</div>
    </div>
    <ConfigureTime
      :currentId="currentId"
      v-if="configureTimeVisible"
      @close="(configureTimeVisible = false), getListData()"
    />
    <AddCamera
      :currentId="currentId"
      :currentData="currentNode"
      v-if="addCameraVisible"
      @close="(addCameraVisible = false), getListData()"
    />
    <AddRegion
      :currentData="currentNode"
      :type="addRegionType"
      v-if="addRegionVisible"
      @success="(addRegionVisible = false), getTreeData()"
      @close="addRegionVisible = false"
    />
  </div>
</template>
<script>
import {
  getTreeData,
  deleteRegion,
  getListData,
  switchRtspType,
  switchRunning,
  deleteData,
} from "@/api/applicationMonitoring/cameraManagement";
import ConfigureTime from "@/components/applicationMonitoring/cameraManagement/configureTime";
import AddCamera from "@/components/applicationMonitoring/cameraManagement/addCamera";
import AddRegion from "@/components/applicationMonitoring/cameraManagement/addRegion";
export default {
  components: {
    ConfigureTime,
    AddCamera,
    AddRegion,
  },
  data() {
    return {
      configureTimeVisible: false,
      addCameraVisible: false,
      addRegionVisible: false,
      loading: false,
      showTreeMenu: false,
      isDelete:false,
      treeData: [],
      tableData: [],
      currentId: "",
      currentNode: {},
      addRegionType: "add",
      params: {
        locationType: 1,
        name: "",
        locationId: "",
        limit: 10,
        page: 1,
      },
      total: 0,
      defaultProps: {
        children: "children",
        label: "text",
      },
    };
  },
  created() {
    this.getTreeData();
    this.getListData();
  },
  methods: {
    // 获取位置tree
    async getTreeData() {
      const data = await getTreeData({ locationType: 1 });
      this.treeData = data.data;
    },
    // 获取摄像头列表
    async getListData() {
      this.loading = true;
      const data = await getListData(this.params);
      this.tableData = data.data;
      this.total = Number(data.count);
      this.loading = false;
    },
    // 重置
    refreshData() {
      this.currentNode = {}
      Object.assign(this.params, {
        locationType: 1,
        name: "",
        locationId: "",
        limit: 10,
        page: 1,
      });
      this.getListData();
    },
    // 新增区域
    addRegion() {
      this.addRegionType = "add";
      this.addRegionVisible = true;
    },
    // 编辑区域
    editRegion() {
      this.addRegionType = "edit";
      this.addRegionVisible = true;
    },
    // 删除区域
    deleteRegion() {
      this.$confirm(`确定删除该条数据?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await deleteRegion({ id: this.currentNode.meId });
          if (res.code == 0) {
            this.$message.success("删除成功");
            await this.getTreeData();
          }
        })
        .catch(() => {});
    },
    // 新增摄像头
    addCamera() {
      this.currentId = "";
      this.addCameraVisible = true;
    },
    // 编辑摄像头
    editData(item) {
      this.currentId = item.id;
      this.addCameraVisible = true;
    },
    // 切换流类型
    async switchRtspType(val, item) {
      const params = {
        id: item.id,
        rtspType: val,
      };
      await switchRtspType(params);
      this.getListData();
    },
    // 配置
    configure(item) {
      this.currentId = item.id;
      this.configureTimeVisible = item;
    },
    // 切换运行状态
    async switchRunning(item) {
      await switchRunning({ id: item.id });
      this.loading = true;
      setTimeout(()=>{
        this.getListData();
      },500)
    },
    // 删除算法
    async deleteData(item) {
      this.$confirm(`确定删除该条数据?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await deleteData({ id: item.id });
          if (res.code == 0) {
            this.$message.success("删除成功");
            await this.getListData();
          }
        })
        .catch(() => {});
    },
    // 点击tree节点
    handleNodeClick(node) {
      Object.assign(this.params, {
        locationId: node.meId,
      });
      this.getListData();
    },
    openTreeMenu(data) {
      this.showTreeMenu = true; // 显示菜单
      this.currentNode = data; // 存储数据
      if(data.parent=='#'){
        this.isDelete = false;
      }else{
        this.isDelete = true;
      }
      document
        .querySelector(".treeMenu")
        .setAttribute(
          "style",
          `top:${event.clientY}px;left:${event.clientX}px;`
        );
      document.addEventListener("click", this.closeTreeMenu);
      document.addEventListener("contextmenu", this.closeTreeMenu);
    },
    closeTreeMenu() {
      this.showTreeMenu = false; // 关闭菜单
      document.removeEventListener("click", this.closeTreeMenu);
      document.removeEventListener("contextmenu", this.closeTreeMenu);
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
    // 关闭弹窗回调
    close() {
      this.configureTimeVisible = false;
      this.addCameraVisible = false;
      this.getListData();
    },
  },
};
</script>
<style scoped lang="scss">
.search_box {
  padding-bottom: 20px;
}
.flex {
  display: flex;
  .flex-tree {
    width: 240px;
    border-radius: 8px;
    background: #fff;
    padding: 10px;
    margin: 10px 10px 0 0;
    flex-shrink: 0;
    .custom-tree-node {
      font-size: 14px;
    }
  }
  .flex-right {
    flex: 1;
  }
}
.el-dropdown-link {
  color: #2099fa;
}
.treeMenu {
  position: fixed;
  z-index: 99999;
  top: 50%;
  left: 50%;
  background-color: white;
  overflow: hidden;
  border-radius: 5px;
  border: 1px solid #e6ebf5;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  div {
    padding: 3px 20px;
    box-sizing: border-box;
    //width: 50px;
    text-align: center;
  }
  div:hover {
    background-color: #eee;
    cursor: pointer;
  }
}

</style>
