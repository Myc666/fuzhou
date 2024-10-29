<template>
  <div class="video-cont">
    <video  :id="'video' + Id" controls autoplay muted width="100%" height="100%" :ref="'video' + Id">
    </video>
    <div class="dropdown">
      <!-- <el-radio-group size="mini" v-model="playType" style="margin-right: 10px" @change="setPlayType()">
        <el-radio-button :label="0" >原始流</el-radio-button>
        <el-radio-button :label="1">合成流</el-radio-button>
      </el-radio-group> -->
      <el-select
        placeholder="视频源"
        v-model="cameraId"
        class="head-container-input"
        @change="changeSelect()"
        style="width: 120px"
      >
        <el-option
          v-for="(subItem, subIndex) in cameraOptions"
          :key="subIndex"
          :label="subItem.name"
          :value="subItem.id"
        ></el-option>
      </el-select>
    </div>
    <div v-if="!Id" style="width: 100%; text-align: center">
      <i class="el-icon-loading"></i> 视频源
    </div>
  </div>
</template>

<script>
import {
    getBoxPlayUrl,
    playCx
  } from "@/api/applicationMonitoring/videoStreamManagement";
export default {
  props:{
    cameraOptions:{
      type:Array,
      default:[]
    },
    index:{
      type:Number,
      default:null
    },
    Id:{
      type:String,
      default:'',
    }
  },
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
      playType:0,
      cameraId:'',
      timer:null,
      timerObj:null,
    };
  },
  created() {
    let param = localStorage.getItem('playType'+this.Id)
    if(param !=null){
      let NewObj = JSON.parse(param)
      if(NewObj.cameraId == this.Id){
        this.playType = NewObj.playType
      }
    }
    this.cameraId = this.Id
    const searchParams = new URL(document.location.href).searchParams;
    let type = searchParams.get('type');
    if (!['echo','push','play'].includes(type)) {
      type = 'play';
    }
    this.recvOnly = type === 'play';
    this.getPlayUrl()

    this.timer = setInterval(this.getVideostate,5000);
  },
  mounted() {
    // ZLMRTCClient.GetAllScanResolution().forEach((r,i) => {
    //   let opt = {};
    //   opt.label = `${r.label}(${r.width}x${r.height})`;
    //   opt.value = r.label;
    //   opt.obj = r;
    //   if (1080*720 <= r.width * r.height && r.width * r.height <= 1280*720) {
    //     this.resolutionSel = r.label;
    //     this.resolution = r;
    //   }
    //   console.log(opt)
    //   this.resolutionOpt.push(opt);
    // });
  },
  beforeDestroy() {
    console.log('#### VideoBox beforeDestroy');
    if(this.timer){
      clearInterval(this.timer);
      this.timer = null;
    }
    if(this.timerObj){
      clearInterval(this.timerObj);
      this.timerObj = null;
    }
    this.stop();
  },
  methods: {
    // 获取视频播放状态
    getVideostate(){
      if(this.player){
        let paused = this.$refs['video'+this.Id].paused;
        if(paused){
          this.$refs['video'+this.Id].play();
        }
      }
    },
    getPlayCx(){
      playCx({cameraId:this.cameraId}).then(res=>{

      }).catch(()=>{
        if(this.timerObj){
            clearInterval(this.timerObj);
            this.timerObj = null;
          }
      })
    },
    // 切换原始流、合成流
    setPlayType(){
        let obj = {
          cameraId:this.cameraId,
          playType:this.playType,
        }
        localStorage.setItem('playType'+this.cameraId,JSON.stringify(obj))
        this.getPlayUrl('setPlayType')
    },
    // 获取视频流
    getPlayUrl(src) {
      console.log('source: ', src);
      console.log('get play url time:', new Date());

      // 播放前销毁播放器
      this.stop();
      // 重新获取播放地址
      getBoxPlayUrl({ cameraId: this.cameraId, playType: this.playType }).then((res) => {
          const playUrl = res.data;
          this.streamUrl = playUrl;
          if(this.timerObj){
            clearInterval(this.timerObj);
            this.timerObj = null;
          }
          this.timerObj = setInterval(this.getPlayCx,5000);
          this.start();
      })
    },
    // 切换摄像头
    changeSelect() {
      this.getPlayUrl('changeSelect')
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
                  element: this.$refs['video'+this.Id],// video 标签
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
};
</script>
<style scoped lang="scss">
.video-cont{
  position: relative;
  height: 100%;
  .dropdown {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 10;
  }
}
</style>
