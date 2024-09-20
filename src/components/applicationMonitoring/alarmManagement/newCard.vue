<template>
  <div>
    <div class="result">
      <div class="title-time">
        <div>{{ alarmData.createdStr }}</div>
        <div class="more">
          <el-dropdown @command="bigImgFun()">
            <span class="el-dropdown-link">
              <span class="el-icon-more"></span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item style="color: #1e9fff;">查看大图</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-image-viewer
            v-if="isShowPics"
            :on-close="closeViewer"
            :url-list="[originalUrl]"
          />
        </div>
      </div>
      <div class="img-box" @click="detailFun">
        <div class="img-content" :style="{overflow:'hidden',width:ratio==1?'235px !important':'',height:ratio==1?'132px !important':''}">
          <!-- <div v-for="(item, index) in pointList" :key="index"
            :class="item.type=='hook'?'xboxA':'xbox'"
            :style="{
            width: item.width,
            height: item.height,
            left: item.left,
            top: item.top,
          }">
          </div>
          <img id="img_alarm_card" ref="page_image_url" :src="this.fileUrl" style="width: 100%;"/> -->
          <MarkDetail 
            :fileUrl="fileUrl"
            :dataList="dataList"
            :ratio="ratio"
            :Index="index"
            :dataListAll="roiList"/>
        </div>
      </div>
    </div>
    <AlarmDetail :alarmData="alarmData" :dataList="dataList" :originalUrl="originalUrl" :ratio="ratio"
            :Index="index"
            :dataListAll="roiList" :fileUrl="fileUrl" v-if="alarmDetailVisible" @close="alarmDetailVisible = false" />
  </div>
</template>
<script>
import MarkResult from "@/components/markResult";
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
import AlarmDetail from "@/components/applicationMonitoring/alarmManagement/alarmDetail/newDetail"
import MarkDetail from "./markDetail.vue";
export default {
  components: {
      MarkResult,
      ElImageViewer,
      AlarmDetail,
      MarkDetail
  },
  props: {
    fileUrl: {
      type: String,
      default: "",
    },
    dataList: {
      type: Array,
      default: () => [],
    },
    alarmData: {
      type: Object,
      default: () => { },
    },
    ratio: {
      type: Number,
      default: 0.5,
    },
    isAlarm:{
      type:Boolean,
      default:false
    },
    originalUrl:{
      type:String,
      default:""
    },
    index:{
      type:Number,
      default:null
    }
  },
  data() {
    return {
      isBigImg:false,
      imgRatio:0.5,
      VUE_APP_API_BASE_URL,
      imgHeight: "",
      pointList: [],
      alarmDetailVisible: false,
      currentId: "",
      isShowTooltip:false,
      isShowPics:false,
      roiList:[],
    };
  },
  methods: {
    onMouseOver(index,str){
      const tag = index==1?this.$refs.cameraName:this.$refs.alName
      const parentWidth = tag.offsetWidth // 获取元素父级可视宽度
      // 创建临时元素
      const _span = document.createElement('span')
      // 放入文本
      _span.innerText = str
      // 设置文字大小
      _span.style.fontSize ='14px'
      // span放入body中
      document.body.appendChild(_span)
      // 获取span的宽度
      const contentWidth = _span.offsetWidth
      this.isShowTooltip = contentWidth <= parentWidth
      document.body.removeChild(_span)
    }
  },
  watch: {
   
    alarmData:{
      immediate: true,
      deep: true,
      handler(val) {
        this.roiList = [];
        if(val.rois){
                let roisArr = JSON.parse(val.rois);
                let newArr = [];
                roisArr.forEach((item) => {
                  newArr.push({
                      pointList: item,
                  });
                });
                if(val.lines){
                let lArr = JSON.parse(val.lines);
                lArr.forEach((item) => {
                    newArr.push({
                      pointList: item,
                    });
                });
                }
                let obj = {
                  markPoints:newArr,
                }
                this.roiList.push(obj)
            }
      }
    }
  },
  mounted() {
  },
  methods:{
      // onHover(){
      //     this.isBigImg = true;
      // },
      // hideMessage(){
      //   this.isBigImg = false;
      // },
      // 查看大图
      bigImgFun(){
        // this.$refs.page_image_url.clickHandler()
        this.isShowPics = true;
      },
      closeViewer() {
        this.isShowPics = false;
      },
      detailFun(){
        this.alarmDetailVisible = true
      }

  }
};
</script>
<style scoped lang="scss">
.result {
  width: 100%;
  .title-time{
    display: flex;
    justify-content: space-between;
    padding: 10px;
    .more{
      position: relative;
      .big-btn{
        position: absolute;
        background: #FFF;
        color: #1e9fff;
        padding: 10px;
        z-index: 99;
        width: 50px;
        right: -10px;
        cursor: pointer;
      }
    }
  }
  .img-box {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .imgLoading {
      width: 100%;
      display: block;
      padding-top: calc((56.25% - 18px) / 2); /* 假设图片的宽高比是16:9 */
      padding-bottom: calc((56.25% - 18px) / 2); /* 假设图片的宽高比是16:9 */
      text-align: center;
    }

    .img-content {
      position: relative;
      // width: 396px;
      // height: 223px;
    }
  }
  .img-box::after {
    content: "";
    display: block;
    padding-top: 56.25%; /* 假设图片的宽高比是16:9 */
  }
  .xbox {
    position: absolute;
    border: 2px solid #f43838;
    background-color: rgba(255, 0, 0, 0.2);
    font-size: 12px;
    color: #1e9fff;
    z-index: 2;
  }
  .xboxA{
    position: absolute;
    border: 2px solid #2b8904;
    background-color: rgba(102, 142, 6, 0.2);
    font-size: 12px;
    color: #1e9fff;
    z-index: 2;
  }
}

// .names-text {
//   display: flex;
//   flex-direction: row;
//   justify-content: space-between;
//   min-height: 42px;

//   span {
//     font-size: 16px;
//   }
// }
.cameraName{
  font-size: 15px;
  margin-bottom: 10px;
  height: 25px;
  font-weight: bold;
  overflow:hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.times-text {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .time {
    font-size: 14px;
    color: #303a4a;
    margin-bottom: 5px;
  }
}

.image-slot {
  min-height: 120px;
}

.al-info {
  font-size: 12px;
  display: flex;
  justify-content: space-between;
}

.al-name {
  font-size: 14px;
  margin-right: 5px;
  height: 25px;
  flex: 1;
  color: #202B3D;
  overflow:hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

::v-deep #img_alarm_card {
  display: block;
}
.big-img{
  width: 832px;
  height: 592px;
  padding: 10px;
  background: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow:  10px 10px 10px rgba(0,0,0,0.3);
  z-index: 99;
  pointer-events: none;
}
</style>
