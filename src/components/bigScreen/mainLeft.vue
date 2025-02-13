<template>
  <div class="main1">
    <div class="mainLeft">
      <div style="border: 1px solid #003c74;margin-bottom: 10px;">
        <Title name="摄像头管理" />
        <div class="creamBox" style="padding: 10px;">
          <div class="numbg1">
            <div style="height: 30px;font-size: 40px;margin-bottom: 10px">
              {{runingNum}}
              <span style="font-size: 16px">个</span>
            </div>
            <div style="height: 30px;font-size: 16px">当前在线数量</div>
          </div>
          <div class="numbg2">
            <div style="height: 30px;font-size: 40px;margin-bottom: 10px">
              {{totleNum}}
              <span style="font-size: 16px">个</span>
            </div>
            <div style="height: 30px;font-size: 16px">摄像头总数</div>
          </div>
        </div>
      </div>
      <div style="border: 1px solid #003c74;margin-bottom: 10px;">
        <Title name="本月预警事件前十统计" />
        <div style="width: 410px;height: 326px;padding: 10px;">
          <Category />
        </div>
      </div>
      <div style="border: 1px solid #003c74;">
        <Title name="告警列表" />
        <div>
          <alarmList :data="warningList"/>
        </div>
      </div>
    </div>
    <div class="mainCenter">
      <!-- <Title name="系统管理" :isShow="true" />
      <div class="sysBox">
          <sysMage v-for="(item,index) in systemData" :key="index" :name="item.name" :url="item.src" :num="item.num"></sysMage>
      </div>
      <Title name="本日告警情况分析统计图" :isShow="true" />
      <div style="display: flex">
          <div style="width: 50%;height: 340px;">
              <annular :dataArr="countAlgorithm1DayArr" :show="true"/>
              <annular v-if="countAlgorithm1DayArr.length>0" :dataArr="countAlgorithm1DayArr"/>
          </div>
          <div>
              <Map />
          </div>
      </div> -->

<!--      <div style="border: 1px solid #003c74;margin: 0 0 10px 10px;">-->
<!--        <Title name="地图总览" :isShow="true" />-->
<!--        &lt;!&ndash;            <div style="display: flex;width: 100%;height: 500px;margin-bottom: 10px;">&ndash;&gt;-->
<!--        <img width="100%" src="@/assets/images/map.png" alt="" />-->
<!--      </div>-->
      <div style="border: 1px solid #003c74;margin: 0 0 10px 10px;">
        <div class="header">

          <div class="headerTitle" style="position: relative">
            <Title name="视频轮询"/>

            <div class="oprBtn">
              <div class="btn" @click="changeSreen(1)">一屏</div>
              <div class="btn" @click="changeSreen(4)">四屏</div>
            </div>
          </div>
        </div>
        <div class="videoMain">
          <div v-for="(item,key) in videoArr" :key="key"  :class="{ video4: screenNum == 4, video1: screenNum == 1, video6: screenNum == 6}" ref="videobg">
            <div class="video">
              <VideoItem :cameraOptions="cameraOptions" :Id="item.id" :index="key" :ref="'video'+key"></VideoItem>
            </div>
            <div class="videoName">
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
      <div style="border: 1px solid #003c74;margin: 0 0 0 10px;">
        <Title name="违规行为截图记录" :isShow="true" />
        <div style="width: 100%;">
          <alarmListPicture :dataList="warningList"/>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import Title from './Title';
import request from '@/utils/request.js'
import Category from '@/components/echart/earlyWarning/newChart.vue'
import alarmList from "@/components/alarmListCopy";
import sysMage from '@/components/systemManageCopy'
import annular from '@/components/echart/annular/newChart.vue'

import VideoItem from '@/components/bigVideoItem.vue';
import Map from '@/components/echart/map/newChart.vue'
import alarmListPicture from "@/components/alarmListPictureCopy";
import ScoketService from "@/utils/websocket.js";
export default {
  data() {
    return {
      runingNum: 0,
      totleNum: 0,
      warningList: [],

      systemData: [
        {
          src: require('@/assets/img/resBg.png'),
          name: '服务器数量',
          label: 'server_count',
          num: 0
        },
        {
          src: require('@/assets/img/resBg1.png'),
          name: '数据集总量',
          label: 'dataset_count',
          num: 0
        },
        {
          src: require('@/assets/img/resBg2.png'),
          name: '今日推送数据总数',
          label: 'today_dataset_count',
          num: 0
        },
        {
          src: require('@/assets/img/resBg3.png'),
          name: '已标注数据总量',
          label: 'mark_dataset_count',
          num: 0
        },
        {
          src: require('@/assets/img/resBg4.png'),
          name: '任务总量',
          label: 'task_count',
          num: 0
        },
        {
          src: require('@/assets/img/resBg5.png'),
          name: '模型训练数量',
          label: 'model_train_count',
          num: 0
        },
        {
          src: require('@/assets/img/resBg6.png'),
          name: '模型部署数量',
          label: 'model_deploy_count',
          num: 0
        },
        {
          src: require('@/assets/img/resBg7.png'),
          name: '镜像数量',
          label: 'model_image_count',
          num: 0
        }
      ],

      countAlgorithm1DayArr: [],
      ws: null,

      cameraOptions: [],
      videoArr: [],
      realVideoArr: [],
      screenNum: 1, // 默认屏幕数量
    }
  },
  components: {
    VideoItem,
    Title,
    Category,
    alarmList,
    sysMage,
    annular,
    Map,
    alarmListPicture
  },
  mounted() {
    this.getCameraListData();
    this.getCountCamera();
    this.getCountNewly();
    this.getActiveCameras();
    this.timer = setInterval(() => {

      this.getCountNewly(); // 发送接口请求

    }, 10000); // 每10秒请求一次接口
    this.getCountData();
    this.getCountAlgorithm1Day();
    // ScoketService.Instance.connect(
    //     `${VUE_APP_WS_BASE_URL}/report/${this.guid()}`
    // );
    // ScoketService.Instance.send({
    //     action: "REPORT_SHOW",
    // });
    // ScoketService.Instance.registerCallBack("REPORT_SHOW", (data) => {
    //     this.warningList.push(data)
    // });
  },
  beforeDestroy() {
    // 在组件销毁前清除定时器
    clearInterval(this.timer);
    // 关闭webScoket
    ScoketService.Instance.onClose()
  },
  methods: {
    // 获取摄像头列表
    getCameraListData() {
      request.post('/camera/listData2').then(({data}) => {
        // let Arr = data.filter(item=>{
        //     return item.running == "1"
        // })
        //this.cameraOptions = Arr;
        this.cameraOptions = data

      })
    },
    getActiveCameras() {
      request.post('/camera/listPageActives?page=1&limit=4').then(({data}) => {
        this.realVideoArr = data;
        this.cutSreenData(this.realVideoArr, this.screenNum);
      })
    },
    changeSreen(num) {
      this.screenNum = num;
      this.cutSreenData(this.realVideoArr, this.screenNum);
    },
    getCountCamera() {
      request.get('/statistic/countCamera').then(({data}) => {
        this.runingNum = data.runing;
        this.totleNum = data.total;
      })
    },
    cutSreenData(data, index) {
      let arr = JSON.parse(JSON.stringify(data)) // 由于数据的唯一性，进行数据深拷贝
      if(arr.length < index) {
        let empyArr = new Array(index - arr.length).fill({});
        arr = arr.concat(empyArr);
      }
      this.videoArr = arr.splice(0, index) // 截取数据
      this.refreshChild();
      // if(this.videoArr.length>0){//每10秒提交一次正在播放的摄像头
      //     this.savePlayings();
      //     let that =this;
      //     this.timer = setInterval(function () {
      //         that.savePlayings();
      //     }, 10000);
      // }
    },
    refreshChild() {
      this.hackReset = false
      this.$nextTick(() => {
        this.hackReset = true
      })
    },
    getCountNewly() {
      request.get('/statistic/countNewly').then(({data}) => {
        this.warningList = data;
      })
    },
    guid() {
      return 'xxx-xxx-4y'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    getCountData() {
      request.get('/statistic/countData').then(({data}) => {
        for(let i in data) {
          for(let item of this.systemData) {
            if(item.label == i) {
              item.num = data[i]
            }
          }
        }
      })
    },
    getCountAlgorithm1Day() {
      request.get('/statistic/countAlgorithm1Day').then(({data}) => {
        this.dayNum = data.total;
        let resData = data.datas.length > 7 ? data.datas.slice(0,7) : data.datas;
        for(let item of resData) {
          let obj = {
            name: item.name,
            value: item.count
          }
          this.countAlgorithm1DayArr.push(obj);
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main1 {
  display: flex;
}
.mainLeft {
  width: 510px;
  .creamBox {
    display: flex;
    justify-content: space-around;
    .numbg1, .numbg2 {
      background: url('@/assets/images/yuan1.png') no-repeat;
      width: 142px;
      height: 142px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #fff;
    }
    .numbg2 {
      background: url('@/assets/images/yuan2.png') no-repeat;
    }
  }
}

.mainCenter {
  width: 810px;
  .sysBox {
    display: flex;
  }
}

.header {
  display: flex;
  justify-content: space-between;
  .headerTitle {
    flex: 1;
  }
  .oprBtn{
    width: 100px;
    height: 30px;
    position: absolute;
    top: 5px;
    right: 20px;
    border-radius: 25px;
    border: 1px solid transparent;
    background-clip: padding-box, border-box;
    background-origin: padding-box, border-box;
    background-image: linear-gradient(to right, #499DE0, #499DE0), linear-gradient(to bottom, #499DE0, #021034);
    display: flex;
    align-items: center;
    .btn {
      flex: 1;
      text-align: center;
      color: #fff;
      cursor: pointer;
    }
  }
}

.videoMain {
  padding: 6px;
  display: flex;
  flex-wrap: wrap;
  height: 440px;
  gap: 1%;
  .video1 {
     width: 100%;
     height: 100%;
    //width: 510px;
    //height: 300px;
    display: flex;
    flex-direction: column;
  }
  .video4 {
    width: 49%;
    height: 220px;
    //padding: 0 12px;
    display: flex;
    flex-direction: column;
  }
  .video6 {
    width: 33%;
    height: 150px;
    padding: 0 12px;
    display: flex;
    flex-direction: column;
  }
  .video{
    // flex: 1;
    width: 100%;
    height: 100%;
    background: #000;
  }
  .videoName {
    height: 20px;
    width: 100%;
    color: #4191EB;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
  }
  .player{
    height: 100%;
    width: 100%;
  }
}
</style>
