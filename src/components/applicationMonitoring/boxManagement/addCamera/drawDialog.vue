<template>
    <div>
        <el-dialog
          :close-on-click-modal="false"
          width="80%"
          top="5vh"
          title="绘制"
          :visible.sync="innerVisible"
          @closed="closed"
          append-to-body>
          <div>
            <MarkDetail
                ref="markDetail"
                v-if="detailObj.fileName"
                :fileUrl="$common.handleCameraImgUrl(detailObj.fileName)"
                :dataList="newList"
                :nameEn="nameEn"
                :disabled="drawDisabled"
                :isShow="true"
                @saveList="saveList"
              />
          </div>
          <span slot="footer" class="dialog-footer">
            <!-- <el-button v-if="dataList.length>0" @click="deleteDraw">删除</el-button> -->
            <el-button @click="cancelDraw">取消绘制</el-button>
            <el-button type="primary" v-if="nameEn != 'person_tracker'" @click="newDraw">绘制下一区域</el-button>
            <el-button type="primary" v-if="nameEn == 'person_tracker'" @click="LineDraw">绘制线</el-button>
            <el-button type="primary" @click="saveDraw">保存绘制</el-button>
          </span>
        </el-dialog>
    </div>
  </template>
  <script>
  import MarkDetail from "./markDetail.vue";
  import {
    saveInfo,
    deleteInfo
  } from "@/api/applicationMonitoring/cameraManagement";
  export default {
    components: {
      MarkDetail,
    },
    props: {
        detailObj:{
            type: Object,
            default: () => {},
        },
        dataList:{
            type: Array,
            default:[]
        },
        algorithmId:{
            type:String,
            default:''
        },
        nameEn:{
          type:String,
          default:""
        },
    },
    data() {
      return {
        innerVisible:true,
        drawDisabled:true,
        newList:[],
      };
    },
    async created() {
      if(this.dataList&&this.dataList.length>0){
        this.drawDisabled = true;
      }else{
        this.drawDisabled = false;
      }
      this.newList = this.dataList
    },
    methods: {
      saveList(list){
        this.newList = JSON.parse(JSON.stringify(list));
      },
        //删除
        async deleteDraw(){
            let params={
                cameraId:this.detailObj.id,
                algorithmId:this.algorithmId
            }
            const data = await deleteInfo(params);
            this.$message.success("删除成功");
            this.dataList = []
            this.$refs.markDetail.clear();
        },
        //取消绘制
        async cancelDraw(){
          this.$emit('close');
        },
        //保存绘制
        async saveDraw(){
            let markPointsArr = [];
            let lineMarkPoints = [];
            let Arr = this.$refs.markDetail.save();
            if(Arr.length==1){
              if(Arr[0].pointList.length<3){
                this.$message.error("请先绘制区域，再画线");
                return;
              }
            }
            Arr.forEach((i) => {
                if(this.nameEn == "person_tracker" && i.pointList.length==2){
                  lineMarkPoints.push(i.pointList)
                }else{
                  markPointsArr.push(i.pointList);
                }
                
            });
            if(markPointsArr.length > 0){
              for(var i = 0; i<markPointsArr.length;i++){
                if(markPointsArr[i].length<3){
                  this.$message.error("请绘制区域");
                  return
                }
              }
            }
            // let params={
            //     cameraId:this.detailObj.id,
            //     algorithmId:this.algorithmId,
            //     markPoints:markPointsArr.length>0 ? JSON.stringify(markPointsArr):'',
            //     lineMarkPoints:lineMarkPoints.length>0 ? JSON.stringify(lineMarkPoints):''
            // }
            // const data = await saveInfo(params);
            // this.$message.success("保存成功");
            let obj = {
              algorithmId:this.algorithmId,
              lineMarkPoints:lineMarkPoints,
              markPointsArr:markPointsArr,
            }
            this.innerVisible = false;
            this.$emit('close',obj)
        },
        closed(){
            this.$emit('close')
        },
        newDraw(){
          this.$refs.markDetail.resetting();
        },
        LineDraw(){
          let Arr = this.$refs.markDetail.save();
          if(Arr.length==0){
            this.$message.warning("请先绘制区域");
            return;
          }
          this.$refs.markDetail.resetting();
        },
    },
  };
  </script>
  <style scoped lang="scss">

  </style>
  