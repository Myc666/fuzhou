<template>
  <div class="videoItem">
    <video v-if="Id" :id="'video' + index" controls muted width="100%" height="100%" :ref="'video' + index">
    </video>
    <div class="dropdown" v-if="Id">
      <el-select
        placeholder="视频源"
        v-model="cameraId"
        class="head-container-input"
        @change="changeSelect()"
        style="width: 100px;zoom: 0.8;"
      >
        <el-option
          v-for="(subItem, subIndex) in cameraOptions"
          :key="subIndex"
          :label="subItem.name"
          :value="subItem.id"
        ></el-option>
      </el-select>
    </div>
    <div v-if="!Id" style="width: 100%; text-align: center;margin-top: 25%;">
      未接入
    </div>
  </div>
</template>

<script>
import request from "@/utils/request.js";
export default {
  name: "bigVideoItem",
  data() {
    return {
      recvOnly: true,
      player: null,
      streamUrl: '',
      resolution: {
        height:1080,
        label:"1080p(FHD)",
        width:1920
      },
      resolutionSel: '1080p(FHD)',
      resolutionOpt: [],
      useCamera: false,
      cameraId:'',
    };
  },
  props: {
    index:{
      type:Number,
      default:null
    },
    Id:{
      type:String,
      default:'',
    },
    cameraOptions:{
      type:Array,
      default:[]
    },
  },
  created() {
    let param = localStorage.getItem('playType'+this.index)
    if(param !=null){
      //this.playType = param
    }
    this.cameraId = this.Id
    const searchParams = new URL(document.location.href).searchParams;
    let type = searchParams.get('type');
    if (!['echo','push','play'].includes(type)) {
      type = 'play';
    }
    this.recvOnly = type === 'play';
  },
  mounted() {
    this.getPlayUrl();
  },
  beforeDestroy() {
    this.stop();
  },
  methods: {
    // 切换摄像头
    changeSelect() {
      this.stop()
      this.getPlayUrl('changeSelect')
    },
    getPlayUrl(id, index) {
      if(!this.cameraId){
        return;
      }
      request
        .post("/stream/getBoxPlayUrl?cameraId=" + this.cameraId)
        .then(({ data }) => {
          this.streamUrl = data;
          this.start();
        });
    },
    startPlay() {
      let elr = this.resolution;
      let h = elr.height;
      let w = elr.width;

      const url = new URL(this.streamUrl);
      const newUrl = new URL(window.location.href);
      let count = 0;
      if (url.searchParams.has('app')) {
          newUrl.searchParams.set('app', url.searchParams.get('app'));
          count++;
      }
      if (url.searchParams.has('stream')) {
          newUrl.searchParams.set('stream', url.searchParams.get('stream'));
          count++;
      }
      if (url.searchParams.has('type')) {
          newUrl.searchParams.set('type', url.searchParams.get('type'));
          count++;
      }
      if (count > 0) {
          window.history.pushState(null, null, newUrl);
      }

      this.player = new ZLMRTCClient.Endpoint(
              {
                  element: this.$refs['video'+this.index],// video 标签
                  debug: false,// 是否打印日志
                  zlmsdpUrl:this.streamUrl,//流地址
                  simulcast:false,
                  useCamera:false,
                  audioEnable:false,
                  videoEnable:true,
                  recvOnly:this.recvOnly,
                  resolution:{w,h},
                  usedatachannel:false,
              }
          );

          var that = this;

          this.player.on(ZLMRTCClient.Events.WEBRTC_NOT_SUPPORT, function(e) {
            console.log('webrtc not support');
          });

          this.player.on(ZLMRTCClient.Events.WEBRTC_ICE_CANDIDATE_ERROR,function(e)
          {
            // ICE 协商出错
            console.log('ICE 协商出错');
          });

          this.player.on(ZLMRTCClient.Events.WEBRTC_ON_REMOTE_STREAMS,function(e)
          {
            //获取到了远端流，可以播放
            console.log('播放成功',e.streams);
          });

          this.player.on(ZLMRTCClient.Events.WEBRTC_OFFER_ANWSER_EXCHANGE_FAILED,function(e)
          {
            // offer anwser 交换失败
            // console.log('offer anwser 交换失败', e);
            console.log('-----  offer anwser error end -----');
            console.log('error time:', new Date());
            that.stop();
            setTimeout(that.getPlayUrl, 10000);
          });

          this.player.on(ZLMRTCClient.Events.WEBRTC_ON_LOCAL_STREAM,function(s)
          {
            // 获取到了本地流
            // document.getElementById('selfVideo').srcObject=s;
            // document.getElementById('selfVideo').muted = true;
            //console.log('offer anwser 交换失败',e)
          });

          this.player.on(ZLMRTCClient.Events.CAPTURE_STREAM_FAILED,function(s)
          {
            // 获取本地流失败
            // console.log('获取本地流失败');
          });

          this.player.on(ZLMRTCClient.Events.WEBRTC_ON_CONNECTION_STATE_CHANGE,function(state)
          {
            // RTC 状态变化 ,详情参考 https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/connectionState
            console.log('当前状态==>',state);
            if(state == 'disconnected' || state == 'failed' || state == 'closed') {
                that.stop();
                setTimeout(that.getPlayUrl, 10000);
            }
          });

          this.player.on(ZLMRTCClient.Events.WEBRTC_ON_DATA_CHANNEL_OPEN,function(event)
          {
            console.log('rtc datachannel 打开 :',event);
          });

          this.player.on(ZLMRTCClient.Events.WEBRTC_ON_DATA_CHANNEL_MSG,function(event)
          {
            console.log('rtc datachannel 消息 :',event.data);
            // document.getElementById('msgrecv').value = event.data;
          });
          this.player.on(ZLMRTCClient.Events.WEBRTC_ON_DATA_CHANNEL_ERR,function(event)
          {
            console.log('rtc datachannel 错误 :',event);
          });
          this.player.on(ZLMRTCClient.Events.WEBRTC_ON_DATA_CHANNEL_CLOSE,function(event)
          {
            console.log('rtc datachannel 关闭 :',event);
          });
      },
      start(){
        this.stop();
        let elr = this.resolution;
        let h = elr.height;
        let w = elr.width;
        if(this.useCamera && !this.recvOnly) {
          ZLMRTCClient.isSupportResolution(w,h).then(e=>{
            this.startPlay();
          }).catch(e=>{
            alert("not support resolution");
          });
        }else{
          this.startPlay();
        }
      },
      stop(){
        if(this.player) {
          this.player.close();
          this.player = null;
          var remote = this.$refs.video;
          if(remote) {
              remote.srcObject = null;
              remote.load();
          }
          // var local = document.getElementById('selfVideo');
          // local.srcObject = null;
          // local.load();
        }
      },
      on_click_to_play(app, stream) {
        console.log(`on_click_to_play: ${app}/${stream}`);
        var url = `${document.location.protocol}//${window.location.host}/index/api/webrtc?app=${app}&stream=${stream}&type=play`;
        this.streamUrl = url;
        this.start();
      },
      resolutionChange(val) {
        console.log(val)
        for (let i = 0; i < this.resolutionOpt.length; i++) {
          if (val === this.resolutionOpt[i].value) {
            this.resolution = this.resolutionOpt[i].obj;
            break;
          }
        }
      }
  },
  watch: {},
};
</script>

<style lang='scss' scoped>
.videoItem {
  width: 100%;
  height: 100%;
  position: relative;
  .dropdown {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 10;
  }
//   .player {
//     width: 100%;
//     height: 100%;
//   }
}
</style>