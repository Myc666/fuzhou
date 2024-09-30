<template>
  <div>
    <div class="flex">
      <div class="flex-tree">
        <div style="font-size: 16px;line-height: 22px;padding: 0px 0px 10px 10px;">盒子总览</div>
        <div class="top-title" :style="{backgroundColor: isDefault?'#F5F7FA':''}" @click="allClick()">
          <div>全部</div>
        </div>
        <el-tree
          :data="treeData"
          :props="defaultProps"
          :highlight-current="true"
          :default-expand-all="true"
        >
          <div class="custom-tree-node" slot-scope="{ node, data }" style="width: 100%;line-height: 26px;">
            <div @click.stop="handleNodeClick(data)" class="label-color">
              <span :class="data.depart?'el-icon-office-building':'el-icon-cpu'" style="padding-right: 5px;"></span>
              <span>{{ node.label }}</span>
              <span v-if="!data.depart" style="margin-left: 10px;color: red;">
                {{ data.online?'':'离线' }}
              </span>
            </div>
            <!-- <span v-if="data.type == 2" style="margin-left: 10px">
              <span :class="{ 'tree-on': handleTreeData(data.meId) }">{{
                handleTreeData(data.meId) ? "开启" : "关闭"
              }}</span>
            </span>
            <span style="margin-left: 10px;" @click.stop="openTreeMenu(data)">
              <i class="el-icon-setting"></i>
            </span> -->
          </div>
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
            <div style="float: right;" v-if="btnData.includes('box-batch-add')">
              <el-button  @click="batchAdd" v-if="isBtnShow">批量新增</el-button>
              <el-button v-if="!isBtnShow" :class="{ 'el-import-hover': (stateObj.status == 1), 'el-fail-hover': (stateObj.status == 3) }" @click="batchAdd">
                <i :class="{ 'el-icon-loading el-import-text': (stateObj.status == 1), 'el-icon-warning el-fail-text': (stateObj.status == 3) }"></i>
                <span :class="{ 'el-import-text': (stateObj.status == 1), 'el-fail-text': (stateObj.status == 3) }">{{ stateObj.text }}</span>
              </el-button>
            </div>
        </div>
        <div class="table-cont">
          <div v-if="!currentNode.depart && isShow" class="add-box">
            
            <div style="display: flex;align-items: center;">
              <div>{{ currentNode.name }}</div>
              <div style="padding: 0px 16px;"  v-if="params.locationId&&btnData.includes('box-algorithm-overview')">
                <el-popover
                  placement="right"
                  width="800"
                  trigger="click"
                  @show="handleShow"
                  v-if="currentNode.online"
                >
                  <el-table :data="gridData" border max-height="300" class="popover-table">
                    <el-table-column align="center" property="algorithmName" label="算法名称"></el-table-column>
                    <el-table-column align="center" property="isRun" label="算法状态" width="80">
                      <template slot-scope="scope">
                        <span :style="{color:scope.row.isRun?'#2C8AFB':'#EB3A2F'}">{{ scope.row.isRun?'正在运行':'未运行' }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" property="cameraNames" label="已关联摄像头"></el-table-column>
                    <el-table-column align="center" property="currentVersion" label="当前使用版本"></el-table-column>
                    <el-table-column align="center" property="highVersion" label="本地最新版本"></el-table-column>
                    <el-table-column align="center" property="upgrade" label="操作" width="80">
                      <template slot-scope="scope">
                      <el-button type="text"  v-if="scope.row.upgrade" style="color: #2C8AFB;" @click="upgradeFun(scope.row)">算法升级</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-button slot="reference">本地算法总览</el-button>
                </el-popover>
                <el-button v-else @click="handleShow">本地算法总览</el-button>
              </div>
            </div>
            <el-button type="primary" icon="el-icon-plus" v-if="btnData.includes('box-add')" @click="addCamera">新增摄像头</el-button>
          </div>
          <div v-if="tableData.length>0">
            <el-table
              :data="tableData"
              border
              style="width: 100%"
              v-loading="loading"
            >
              <el-table-column align="center" label="实况图" width="90">
                <template slot-scope="scope" style="padding: 0px !important;">
                  <el-image 
                    v-if="scope.row.fileName&&scope.row.isShowImg"
                    style="width: 100%;margin-top: 5px;"
                    :src="$common.handleCameraImgUrl(scope.row.fileName)" 
                    :preview-src-list="[$common.handleCameraImgUrl(scope.row.fileName)]"
                     @error="handleImageError(scope.$index)"
                  >
                  </el-image>
                  <img v-else src="@/assets/images/no-img.png"  style="width: 100%;margin-top: 5px;"/>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="name" label="摄像头名称">
              </el-table-column>
              <el-table-column
                align="center"
                prop="locationName"
                label="盒子归属"
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
              <el-table-column
                align="center"
                prop="alarmInterval"
                label="告警间隔(秒)"
              >
              </el-table-column>
              <el-table-column
                align="center"
                prop="intervalTime"
                label="识别间隔(秒)"
              >
              </el-table-column>
              <el-table-column
                align="center"
                prop="algorithmNames"
                label="关联算法"
              >
              </el-table-column>
              <!-- <el-table-column align="center" v-if="btnData.includes('box-time-config')" label="时段配置">
                <template slot-scope="scope">
                  <el-button type="text" @click="configure(scope.row)"
                    >配置</el-button
                  >
                </template>
              </el-table-column> -->
              <el-table-column align="center" label="使用开关"  width="70">
                <template slot-scope="scope">
                  <!-- <el-switch
                    v-model="scope.row.running"
                    @change="switchRunning(scope.row)"
                    :active-value="1"
                    :inactive-value="0"
                    :disabled="!btnData.includes('box-run-state')"
                  ></el-switch> -->
                    <el-popover
                    v-if="lenghtNum==6&&scope.row.running==0"
                    placement="right"
                    title="无法开启更多路"
                    width="200"
                    trigger="click"
                  >
                    <div>
                      <div>最多支持6路同时计算,<br/>请先关闭其他路后再重试。</div>
                    </div>
                    <!-- <el-button slot="reference">click 激活</el-button> -->
                    <el-switch
                    v-model="scope.row.running"
                    slot="reference"
                    disabled
                  ></el-switch>
                  </el-popover>
                  <el-switch
                    v-else
                    v-model="scope.row.running"
                    @change="switchRunning(scope.row)"
                    :active-value="1"
                    :inactive-value="0"
                    :disabled="!btnData.includes('box-run-state')"
                  ></el-switch>
                </template>
              </el-table-column>
              <el-table-column align="center" label="运行状态">
                <div :class="[scope.row.aiboxExecStatus==1000?'green':'']">
                  {{ getStatus(scope.row.aiboxExecStatus) }}
                </div>
              </el-table-column>
              <el-table-column align="center" label="最后心跳时间">
                <template slot-scope="scope">
                  {{ getMyDate(Number(scope.row.aiboxExecTime)) }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="120">
                <template slot-scope="scope">
                  <el-button type="text" v-if="btnData.includes('box-edit')" @click="editData(scope.row)"
                    >编辑</el-button
                  >
                  <el-button
                    type="text"
                    class="danger"
                    v-if="btnData.includes('box-delete')"
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
          <div v-else style="text-align: center;padding: 60px 0px;">
            <img src="@/assets/images/security-camera.png" style="width: 120px;height: 120px;"/>
            <div style="color: #909399;font-size: 14px;margin-top: 16px;">请在左侧栏中点击需要添加摄像头的边缘盒子</div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div v-show="showTreeMenu" class="treeMenu">
      <div
        @click="addRegion"
        v-if="currentNode.type == 0 || currentNode.type == 1"
      >
        新增子区域
      </div>
      <div
        @click="editRegion"
        v-if="currentNode.type == 0 || currentNode.type == 1"
      >
        编辑该区域
      </div>
      <div @click="deleteRegion" v-if="currentNode.type == 1 && isShow">删除该区域</div>
      <div
        @click="addBox"
        v-if="currentNode.type == 0 || currentNode.type == 1"
      >
        新增盒子
      </div>
      <div @click="editBox" v-if="currentNode.type == 2">编辑盒子</div>
      <div @click="deleteRegion" v-if="currentNode.type == 2 && isShow">删除盒子</div>
    </div> -->
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
    <AddBox
      :currentData="currentNode"
      :type="addRegionType"
      v-if="addBoxVisible"
      @success="(addBoxVisible = false), getTreeData()"
      @close="(addBoxVisible = false), getTreeData()"
    />
    <!-- 批量导入 -->
    <UploadInfo v-if="uploadVisible" :status="stateObj.status" :typeText="stateObj.text" @close="closeHandel"/>

    <!-- 算法升级 -->
    <el-dialog
      title="算法升级"
      :visible.sync="dialogVisible"
      width="70%"
      >
      <AlgorithmUpgrade v-if="dialogVisible" :id="rowId" :algorithmName="algorithmName" :platform="platform" :nameEn="nameEn"/>
    </el-dialog>

    <div class="data-tip">
      <el-dialog
      :visible.sync="dataVisible"
      width="280px"
      top="40vh"
      :show-close="false"
      >
      <div v-if="dataVisible">
        <div v-if="isError">
          <div style="margin-bottom: 10px;">{{ errorCont }}</div>
          <div>1、请检查摄像头是否可以连接。</div>
          <div>2、请检查网络是否稳定。</div>
          <div>3、请检查摄像头账号密码是否正确。</div>
          <div style="margin-top: 15px;text-align: right;">
            <el-button @click="closeTip">取消</el-button>
          </div>
        </div>
        <div v-else>数据处理中，请稍等</div>
      </div>
    </el-dialog>
    </div>
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
  getHeart,
  getAlgorithmInfo
} from "@/api/applicationMonitoring/cameraManagement";
import {treeBasic} from "@/api/applicationMonitoring/boxManagement";
import {statusByTag} from "@/api/applicationMonitoring/batchUpload";
import ConfigureTime from "@/components/applicationMonitoring/boxManagement/configureTime";
import AddCamera from "@/components/applicationMonitoring/boxManagement/addCamera/newAdd.vue";
import AddRegion from "@/components/applicationMonitoring/boxManagement/addRegion";
import AddBox from "@/components/applicationMonitoring/boxManagement/addBox";
import UploadInfo from "@/components/applicationMonitoring/batchUpload/upload.vue";
import AlgorithmUpgrade from "@/components/applicationMonitoring/modelTesting/algorithmUpgrade";
import { getMyDate } from '@/utils/common.js'
export default {
  components: {
    ConfigureTime,
    AddCamera,
    AddRegion,
    AddBox,
    UploadInfo,
    AlgorithmUpgrade
  },
  data() {
    return {
      isDefault:true,//默认展示全部
      getMyDate:getMyDate,
      configureTimeVisible: false,
      addCameraVisible: false,
      addRegionVisible: false,
      addBoxVisible: false,
      loading: false,
      showTreeMenu: false,
      treeData: [],
      tableData: [],
      heartData: [],
      currentId: "",
      currentNode: {},
      addRegionType: "add",
      params: {
        locationType: 2,
        name: "",
        locationId: "",
        limit: 10,
        page: 1,
      },
      total: 0,
      defaultProps: {
        children: "children",
        label: "name",
      },
      timer: null,
      isShow:false,
      uploadVisible:false,
      stateObj:{},
      isBtnShow:true,
      timerState:null,
      statusBtn: 'primary',
      gridData:[],
      dialogVisible:false,
      rowId:'',
      algorithmName:'',
      platform:'',
      nameEn:'',
      btnData:[],
      btnObjList:[],
      lenghtNum:null,
      dataVisible:false,
      isError:false,
      errorCont:''
    };
  },
  async created() {
    this.getBtn();
    await this.getHeart();
    await this.getTreeData();
    this.getStateFun();
    this.getListData();
    this.timer = setInterval(() => {
      this.getHeart();
    }, 60000);
  },
  methods: {
    // 图片识别失败
    handleImageError(index){
      this.tableData[index].isShowImg = false
    },
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
    // 获取本地算法
    handleShow(){
      if(!this.currentNode.online && !this.isDefault){
        this.$message.error('操作失败，盒子已离线。请在盒子在线后重试。')
        return;
      }
      let formData = new FormData();
      formData.append("boxId ", this.params.locationId);
      getAlgorithmInfo(formData).then(res=>{
        this.gridData = res.data;
      })
    },
    upgradeFun(row){
      this.rowId = row.algorithmId;
      this.algorithmName = row.algorithmName;
      this.platform = row.platform;
      this.nameEn = row.algorithmNameEn
      this.dialogVisible = true;
    },
    // 获取批量上传的整体进度
    async getStateFun(){
      // 清除摄像头批量导入数据状态定时器
      clearInterval(this.timerState);
      this.timerState=null;
      // 查询摄像头批量导入数据状态
      let params = {
        tag:this.$store.state.tagInfo
      }
      const res = await statusByTag(params)
      let obj = {};
      let str = res.data;
      // str.status 0-无导入 1-正在导入 2-导入完成(全部成功) 3-导入完成(包含错误)
      if(str.status == 0 || str.status == 2) {
        this.isBtnShow = true;
        this.stateObj = {
          status: str.status,
          text: '',
          typeStr: 'upload'
        };
      } else {
        this.isBtnShow = false;
        this.stateObj = {
          status: str.status,
          text: str.text,
          typeStr: 'upload'
        }
        // 开启导入数据定时器
        if(str.percentage!=100){
          this.timerState = setInterval(() => {
                this.getStateFun();
          }, 3000);
        }
      }
    },
    // 获取位置tree
    async getTreeData() {
      // const data = await getTreeData({ locationType: 2 });
      const data = await treeBasic();
      this.treeData = data.data;
    },
    // 监测盒子是否在线
    async getHeart() {
      this.count++;
      const data = await getHeart();
      this.heartData = data.data;
    },
    // 获取摄像头列表
    async getListData() {
      this.loading = true;
      const data = await getListData(this.params);
      this.tableData = data.data;
      if(this.tableData.length>0){
        this.tableData.forEach(item=>{
          item.isShowImg = true;
        })
      }
      let arr = this.tableData.filter(item=>{
        return item.running == 1
      })
      this.lenghtNum = arr.length;
      this.total = Number(data.count);
      this.loading = false;
    },
    // 重置
    refreshData() {
      this.currentNode = {}
      Object.assign(this.params, {
        locationType: 2,
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
    // deleteRegion() {
    //   this.$confirm(`确定删除该条数据?`, "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(async () => {
    //       const res = await deleteRegion({ id: this.currentNode.meId });
    //       if (res.code == 0) {
    //         this.$message.success("删除成功");
    //         await this.getTreeData();
    //       }
    //     })
    //     .catch(() => {});
    // },
    // 新增盒子
    addBox() {
      this.addRegionType = "add";
      this.addBoxVisible = true;
    },
    // 编辑盒子
    editBox(item) {
      this.addRegionType = "edit";
      this.addBoxVisible = true;
    },
    // 新增摄像头
    addCamera() {
      if(!this.currentNode.online && !this.isDefault){
        this.$message.error('操作失败，盒子已离线。请在盒子在线后重试。')
        return;
      }
      this.currentId = "";
      this.addCameraVisible = true;
    },
    // 编辑摄像头
    editData(item) {
      if(!this.currentNode.online && !this.isDefault){
        this.$message.error('操作失败，盒子已离线。请在盒子在线后重试。')
        return;
      }
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
      this.loading = true;
      this.dataVisible = true;
      switchRunning({ id: item.id }).then(res=>{
        this.dataVisible = false;
        setTimeout(()=>{
          this.getListData(1);
        },500)
      }).catch(res=>{
        this.errorCont = res;
        this.isError = true;
        this.loading = false;
        this.getListData();
      })
    },
    closeTip(){
      this.dataVisible = false;
      this.isError = false;
      this.errorCont = '';
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
    // 点击全部
    allClick(){
      this.isDefault = true;
      this.currentNode = {};
      this.isShow = false;
      Object.assign(this.params, {
          departId: "",
          locationId: "",
      });
      this.getListData()
    },
    // 点击tree节点
    handleNodeClick(node) {
      this.isDefault = false;
      this.currentNode = node;
      if(node.depart){
        this.params.locationId = "";
        Object.assign(this.params, {
          departId: node.id,
        });
        this.isShow = false;
        this.getListData();
      }else{
        this.params.departId = "";
        Object.assign(this.params, {
          locationId: node.id,
        });
        this.isShow = true;
        this.getListData();
      }
    },
    openTreeMenu(data) {
      this.showTreeMenu = true; // 显示菜单
      this.currentNode = data; // 存储数据
      if(data.parent=='#'){
        this.isShow = false;
      }else{
        this.isShow = true;
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
    handleTreeData(id) {
      const obj = this.heartData.find((i) => i.id == id);
      if (obj.online == 1) {
        return true;
      } else {
        return false;
      }
    },
    // 关闭弹窗回调
    close() {
      this.configureTimeVisible = false;
      this.addCameraVisible = false;
      this.getListData();
    },
    // 获取状态
    getStatus(item){
      const str = {
          1000: '推理中',
          2000: '下载算法中',
          3000: '未使用',
          8000: '等待唤醒',
          9000: '预处理',
      }[item]
      return str
    },
    // 批量新增
    batchAdd() {
      this.uploadVisible = true;
    },
    // 关闭批量新增的弹窗
    closeHandel(){
      this.uploadVisible = false;
      this.getListData()
      this.getStateFun()
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.timerState);
    this.timerState=null
  }
};
</script>
<style scoped lang="scss">
.el-import-hover:hover {
  border: 1px solid #d1d1d1 !important;
}
.el-success-hover:hover {
  border: 1px solid #7bc139 !important;
}
.el-fail-hover:hover {
  border: 1px solid #E6A23C !important;
}
.el-import-text {
  color: #041335 !important;
}
.el-success-text {
  color: #7bc139 !important;
}
.el-fail-text {
  color: #E6A23C !important;
}
.search_box {
  padding-bottom: 20px;
}
.flex {
  display: flex;
  .flex-tree {
    width: 280px;
    border-radius: 8px;
    background: #fff;
    padding: 10px;
    margin: 10px 10px 0 0;
    flex-shrink: 0;
    .top-title{
      font-size: 14px;
      padding: 5px 25px;
    }
    .custom-tree-node {
      font-size: 14px;
      .tree-on {
        color: #2099fa;
      }
    }
    .custom-tree-node:hover{
        .label-color{
          color: #2099fa !important;
        }
      }
  }
  .flex-right {
    margin-top: 10px;
    flex: 1;
    .head-container{
      background: #FFF;
      padding: 10px 16px;
    }
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
.add-box {
  padding-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.button-sty{
  border: 1px solid #DCDFE6;
  border-radius: 8px;
  margin-left: 20px;
  padding: 0px 15px;
  line-height: 32px;
  font-size: 13px;
  cursor: pointer;
  .icon-succes{
    color: red;
  }
}
.table-cont{
  background: #FFF;
  padding: 16px;
  margin-top: 10px;
  border-radius: 6px;
  :deep(.el-table--border .el-table__cell:first-child .cell){
    padding: 0px !important;
  }
}
.green{
  color: #67c23a;
}
.red{
  color: red;
}
.data-tip{
  :deep(.el-dialog__header){
    padding: 0px;
  }
}
</style>
