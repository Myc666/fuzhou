<template>
    <div>
      <el-dialog
      :close-on-click-modal="false"
        title="告警详情"
        :visible.sync="dialogVisible"
        width="900px"
        :append-to-body="true"
        @closed="closed"
      >
            <MarkDetail 
            v-if="alarmData.id"
            :fileUrl="$common.handleStream(alarmData.id)"
            :dataList="dataList"
            :ratio="ratio"
            pageType="detail"
            :dataListAll="dataListAll"/>
        <!-- <MarkResult
            v-if="alarmData.id"
            :fileUrl="$common.handleStream(alarmData.id)"
            :dataList="dataList"
        /> -->
        <!--  <div>
             <el-image
                 id="img"
                 style="width: 100%"
                 :src="$common.handleStream(alarmData.id)"
             >
                 <div slot="error" class="image-slot">
                 <i class="el-icon-picture-outline"></i>
                 </div>
                 <div slot="placeholder" class="image-slot">
                 加载中<span class="dot">...</span>
                 </div>
             </el-image>
         </div>-->
         <div class="alarm-cont">
             <div class="title">{{ alarmData.algorithmName }}</div>
             <div class="big-btn">
                 <span @click="bigImgFun">查看大图</span>
                 <el-image-viewer
                     v-if="isShowPics"
                     style="z-index: 9999 !important;"
                     :on-close="closeViewer"
                     :url-list="[originalUrl]"
                 />
             </div>
             <div class="tip">{{ alarmData.cameraName }}</div>
             <div class="tip">{{ alarmData.createdStr }}</div>
         </div>
         <span slot="footer" class="dialog-footer">
           <el-button @click="dialogVisible = false">取消</el-button>
         </span>
       </el-dialog>
     </div>
   </template>
 <script>
 import MarkResult from "@/components/markResult";
 import ElImageViewer from "element-ui/packages/image/src/image-viewer";
 import MarkDetail from "../markDetail.vue";
 export default {
     components: {
       MarkResult,
       ElImageViewer,
       MarkDetail
     },
     props: {
         dataList: {
             type: Array,
             default: () => [],
         },
         alarmData: {
             type: Object,
             default: () => { },
         },
         originalUrl:{
             type:String,
             default:""
         },
         Index:{
            type:Number,
            default:null
        },  
        dataListAll:{
            type:Array,
            default:()=>[],
        },
        fileUrl: {
            type: String,
            default: "",
        },
     },
     data() {
         return {
             dialogVisible: true,
             isShowPics:false,
             ratio:1
         };
     },
     created() {
     },
     destroyed() {
     },
     methods: {
         // 关闭回调
         closed() {
             this.$emit("close");
         },
         bigImgFun(){
             this.isShowPics = true;
         },
         closeViewer() {
             this.isShowPics = false;
         },
     },
 };
 </script>
 <style scoped lang="scss">
     .alarm-cont{
         margin-top: 10px;
         .title{
             font-size: 14px;
             font-weight: bold;
             line-height: 24px;
         }
         .big-btn{
             font-size: 14px;
             font-weight: bold;
             line-height: 24px;
             color: #1e9fff;
             cursor: pointer;
         }
         .tip{
             font-size: 12px;
             line-height: 20px;
             color: #606266;
         }
     }
 </style>
