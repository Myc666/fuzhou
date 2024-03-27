<template>
  <div>
    <div class="result">
      <div class="img-box">
        <div class="img-content" :style="{overflow:'hidden',width:ratio==1?'235px !important':'',height:ratio==1?'132px !important':''}" @mouseenter="onHover"  @mouseleave="hideMessage">
          <div v-for="(item, index) in pointList" :key="index"
            :class="item.type=='hook'?'xboxA':'xbox'"
            :style="{
            width: item.width,
            height: item.height,
            left: item.left,
            top: item.top,
          }">
            <!-- <div class="text" v-if="ratio==0.5" :style="{ color: '#fff', textAlign:'center',backgroundColor: item.type=='hook'?'green':'red',position:'absolute',minWidth:'100%'}">{{ item.confidence }}</div> -->
          </div>
          <img id="img_alarm_card" ref="page_image_url" :src="this.fileUrl" style="width: 100%;"/>
        </div>
      </div>
      <div style="padding: 5px 10px">
        <div class="names-text">

            <el-tooltip effect="dark" v-if="alarmData.cameraName" :content="alarmData.cameraName" placement="top-start" :disabled="isShowTooltip">
              <div class="cameraName" ref="cameraName">
                摄像头名称: {{ alarmData.cameraName }}
              </div>
            </el-tooltip>
          <div class="times-text">
              <time class="time">告警时间: {{ alarmData.createdStr }}</time>
          </div>
          <div class="al-info">
            <el-tooltip effect="dark" v-if="alarmData.algorithmName" :disabled="isShowTooltip" :content="alarmData.algorithmName">
              <div class="al-name" ref="alName">
                检测内容: {{ alarmData.algorithmName }}
              </div>
            </el-tooltip>
            <div v-if="alarmData.alarmLevel.name">
              <el-tag size="mini" style="font-size: 12px" :style="{
                borderColor: alarmData.alarmLevel.showColor,
                color: alarmData.alarmLevel.showColor,
                backgroundColor: alarmData.alarmLevel.showColorAlpha,
              }">{{ alarmData.alarmLevel.name }}</el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MarkResult from "@/components/markResult";
export default {
  components: {
      MarkResult,
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
    }
  },
  data() {
    return {
      imgHeight: "",
      pointList: [],
      alarmDetailVisible: false,
      currentId: "",
      isShowTooltip:false,
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
    dataList: {
      immediate: true,
      deep: true,
      handler(val) {
        this.$nextTick(() => {
          this.pointList = [];
          let img = new Image();
          img.src = this.fileUrl;
          if (!this.fileUrl) {
            return
          }
          img.onload = () => {
            this.imgHeight = img.height;
            setTimeout(() => {
              const ratio = this.$refs.page_image_url.offsetHeight / this.imgHeight;
              val.forEach((item) => {
                if(item.position[3] * this.ratio >this.imgHeight){
                  item.position[3] = this.imgHeight/this.ratio
                }
                this.pointList.push({
                  ...item,
                  left: (item.position[0] * ratio * this.ratio) + "px",
                  top: (item.position[1] * ratio * this.ratio) + "px",
                  width: ((item.position[2] - item.position[0]) * ratio * this.ratio) + "px",
                  height: ((item.position[3] - item.position[1]) * ratio * this.ratio) + "px",
                });
              });

              
            }, 100);
          };
        });
      },
    },
  },
  mounted() {
  },
  methods:{
      onHover(){
          let obj = {
              isShow:true,
              id:this.alarmData.id,
              dataList:this.dataList
          }
          this.$emit('hoverFun',obj)
      },
      hideMessage(){
          let obj = {
              isShow:false,
              id:"",
              dataList:[]
          }
          this.$emit('hoverFun',obj)
      }
  }
};
</script>
<style scoped lang="scss">
.result {
  width: 100%;

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
  color: #303a4a;
  overflow:hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

::v-deep #img_alarm_card {
  display: block;
}
</style>
