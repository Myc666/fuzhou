<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      title="编辑摄像头"
      :visible.sync="dialogVisible"
      width="1200px"
      top="8vh"
      @closed="closed"
    >
      <div class="camera-dialog">
        <div class="camera-left">
          <el-form label-width="120px">
            <el-form-item label="摄像头名称">
              <el-input
                placeholder="请输入摄像头名称"
                v-model="detail.name"
              ></el-input>
            </el-form-item>
            <el-form-item label="RTSP流地址">
              <el-input
                placeholder="请输入RTSP流地址"
                v-model="detail.rtspUrl"
                type="textarea"
                :rows="2"
              ></el-input>
            </el-form-item>
            <el-form-item label="识别间隔(秒)">
              <el-input
                placeholder="请输入识别间隔"
                v-model="detail.intervalTime"
              ></el-input>
            </el-form-item>
            <el-form-item label="告警间隔(秒)">
              <el-input
                placeholder="请输入告警间隔"
                v-model="detail.alarmInterval"
              ></el-input>
            </el-form-item>
            <el-form-item label="算法关联">
              <el-table
                :data="tableData"
                border
                v-loading="loading"
                height="390"
              >
                <el-table-column
                  label="算法名称"
                  prop="name"
                  align="center"
                ></el-table-column>
                <el-table-column label="置信度" width="120" align="center">
                  <template slot-scope="scope">
                    <!-- :min="0.3" -->
                    <el-input-number
                      v-model="scope.row.confidence"
                      :controls="false"
                      :precision="2"
                      :max="1"
                      style="width: 80px"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="选择" width="60" align="center">
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.checked" />
                  </template>
                </el-table-column>
                <el-table-column label="识别区域" align="center">
                  <template slot-scope="scope">
                    <!-- <div
                      v-if="scope.row.status == 1"
                      @click="changeStatus(scope.row, 2)"
                    >
                      <el-button type="text" v-if="scope.row.markPoints"
                        >已标记</el-button
                      >
                      <el-button type="text" v-else>标记</el-button>
                    </div>
                    <el-button
                      type="text"
                      v-if="scope.row.status == 2"
                      @click="changeStatus(scope.row, 1)"
                      >标记中</el-button
                    > -->
                    <el-button type="text" @click="drawFun(scope.row)">{{ scope.row.markPoints?'已绘制':'绘制' }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-form>
        </div>
        <div class="camera-right">
          <div style="padding-bottom: 20px">区域标记</div>
          <div class="image-box" v-loading="photoLoading">
            <MarkDetail
              ref="markDetail"
              v-if="detail.fileName"
              :fileUrl="$common.handleCameraImgUrl(detail.fileName)"
              :dataListAll="dataListAll"
              :disabled="drawDisabled"
            />
          </div>

          <div class="btn-list">
            <span>
              <el-button type="primary" @click="takePhoto">拍照取图</el-button>
              <!-- <el-button type="success" @click="clickNewMark">新标记</el-button>
              <el-button type="warning" @click="clickSaveMark"
                >保存当前标记</el-button
              > -->
            </span>
            <!-- <span>
              <el-button type="danger" @click="clickClearMark"
                >重置选区</el-button
              >
            </span> -->
          </div>
        </div>
      </div>
      <!-- 绘制弹窗 -->
      <DrawDialog :detailObj="detail" :dataList="dataList" :nameEn="nameEn" :algorithmId="algorithmId" v-if="innerVisible" @close="closeHandle"/>


      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveData" :loading="btnLoading">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import MarkDetail from "@/components/markDetail";
import DrawDialog from "./drawDialog";
import {
  getAlgorithmListData,
  getListDataDetail,
  saveCameraDetail,
  takePhoto,
} from "@/api/applicationMonitoring/cameraManagement";
export default {
  components: {
    MarkDetail,
    DrawDialog
  },
  props: {
    currentId: {
      type: String,
      default: "",
    },
    currentData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      loading: false,
      btnLoading:false,
      photoLoading: false,
      dialogVisible: true,
      params: {
        cameraId: this.currentId,
        limit: 10,
        page: 1,
      },
      detail: {},
      currentAlgorithmId: "",
      tableData: [],
      dataList: [],
      dataListAll:[],
      drawDisabled: true,
      innerVisible:false,
      algorithmId:'',
      nameEn:'',
    };
  },
  async created() {
    if (this.currentId) {
      this.getListDataDetail();
    }
    this.getAlgorithmListData();
  },
  methods: {
    // 获取摄像头详情
    async getListDataDetail() {
      const data = await getListDataDetail({ id: this.currentId });
      this.detail = data.data;
    },
    // 获取关联算法列表
    async getAlgorithmListData(str) {
      this.loading = true;
      const data = await getAlgorithmListData(this.params);
      this.loading = false;
      this.dataListAll = [];
      data.data.forEach((item) => {
        item.status = 1;
        item.confidence = item.confidence?item.confidence:0.5;
        if(item.markPoints){
          let mArr = JSON.parse(item.markPoints);
          let newArr = [];
          mArr.forEach((item) => {
            let pointText = "";
            item.forEach((i) => {
              pointText = pointText + ` ${i.x},${i.y}`;
            });
            newArr.push({
              pointList: item,
              pointText: pointText,
            });
          });
          if(item.lineMarkPoints){
            let lArr = JSON.parse(item.lineMarkPoints);
            lArr.forEach((item) => {
              let pointText = "";
              item.forEach((i) => {
                pointText = pointText + ` ${i.x},${i.y}`;
              });
              newArr.push({
                pointList: item,
                pointText: pointText,
              });
            });
          }
          let r = Math.floor(Math.random() * 256)
          let g = Math.floor(Math.random() * 256)
          let b = Math.floor(Math.random() * 256)
          let obj = {
            markPoints:newArr,
            name:item.name,
            color: 'rgb('+r+','+g+','+b+')',
            r:r,
            g:g,
            b:b,
          }
          this.dataListAll.push(obj)
        }
      });
      if(str=='drawDialog'){
        this.tableData.forEach((item)=>{
          data.data.forEach((items) => {
            if(item.id == items.id){
              item.markPoints = items.markPoints
            }
          })
        })
      }else{
        this.tableData = data.data;
      }
    },
    // 切换算法标记状态
    changeStatus(obj, val) {
      let drawDisabled = true;
      this.tableData.forEach((item) => {
        item.status = 1;
        if (item.id == obj.id) {
          item.status = val;
          this.currentAlgorithmId = obj.id;
          this.dataList = obj.markPoints ? JSON.parse(obj.markPoints) : [];
          if (val == 2) {
            drawDisabled = false;
          }
        }
      });
      this.drawDisabled = drawDisabled;
      if (this.drawDisabled) {
        this.dataList = [];
      }
    },
    // 保存摄像头数据
    saveData() {
      // 处理缩放参数
      this.btnLoading = true;
      if(this.$refs.markDetail) {
        let scaleRatio = this.$refs.markDetail.scaleRatio();
        this.detail.scaleRatio = scaleRatio;
      } else {
        this.detail.scaleRatio = 0;
      }
      //
      let algorithmvosArr = [];
      let confidencevosArr = [];
      let markpointsvosArr = [];
      let lineMarkPointsStr = "";
      this.tableData.forEach((item) => {
        if (item.checked) {
          algorithmvosArr.push(item.id);
          confidencevosArr.push(item.confidence);
          markpointsvosArr.push(item.markPoints ? item.markPoints : "[]");
          lineMarkPointsStr = item.lineMarkPoints
        }
      });
      const params = {
        id: this.detail.id,
        name: this.detail.name,
        rtspUrl: this.detail.rtspUrl,
        intervalTime: this.detail.intervalTime,
        alarmInterval: this.detail.alarmInterval,
        locationId: this.detail.locationId || this.currentData.meId,
        algorithmvos: algorithmvosArr.join(","),
        params: this.detail.params,
        fileName: this.detail.fileName,
        fileWidth: this.detail.fileWidth,
        fileHeight: this.detail.fileHeight,
        canvasWidth: this.detail.canvasWidth,
        canvasHeight: this.detail.canvasHeight,
        scaleRatio: this.detail.scaleRatio,
        confidencevos: confidencevosArr.join(","),
        updatePoint: this.detail.updatePoint,
        locationType: 1,
      };
      let formData = new FormData();
      formData.append("markpointsvos", markpointsvosArr.join("#"));
      formData.append("lineMarkPoints", lineMarkPointsStr);
      saveCameraDetail(params, formData).then((data)=>{
        this.$message.success("保存成功");
        this.dialogVisible = false;
        this.btnLoading = false;
      }).catch(() => {
        this.btnLoading = false;
      });
      
    },
    // 拍照
    async takePhoto() {
      this.photoLoading = true;
      const data = await takePhoto({ rtspUrl: this.detail.rtspUrl });
      this.detail.fileName = data.data;
      this.photoLoading = false;
      this.$message.success("拍照成功");
    },
    clickNewMark() {
      this.$refs.markDetail.resetting();
    },
    clickSaveMark() {
      let a = this.$refs.markDetail.save();
      this.tableData.forEach((item) => {
        if (item.id == this.currentAlgorithmId) {
          const markPoints = [];
          a.forEach((i) => {
            markPoints.push(i.pointList);
          });
          item.markPoints = JSON.stringify(markPoints);
        }
      });
    },
    clickClearMark() {
      this.$refs.markDetail.clear();
    },

    // 关闭回调
    closed() {
      this.$emit("close");
    },
    //展示绘制弹窗
    async drawFun(obj){
      if(!this.detail.id){
        this.$message.warning("请先保存再绘制");
        return;
      }
      this.tableData.forEach((item) => {
        item.status = 1;
        if (item.id == obj.id) {
          this.dataList = obj.markPoints ? JSON.parse(obj.markPoints) : [];
          if(obj.lineMarkPoints){
            this.dataList.push(JSON.parse(obj.lineMarkPoints)[0])
          }
          this.algorithmId = obj.id;
          this.nameEn = obj.nameEn
        }
      });
      this.innerVisible = true;
    },
    //关闭弹窗回调
    closeHandle(item){
      this.$data.innerVisible = false;
      this.getAlgorithmListData('drawDialog');
    },
  },
};
</script>
<style scoped lang="scss">
.camera-dialog {
  width: 100%;
  display: flex;

  .camera-left {
    width: 500px;
    margin-right: 20px;
    flex-shrink: 0;
  }

  .camera-right {
    flex: 1;
  }
}

.image-box {
  width: 100%;
  min-height: 200px;
  border: 2px solid #1e9fff;
}

.image {
  width: 100%;
  height: auto;
  display: block;
}

.btn-list {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}
</style>
