<template>
  <div class="videoItem">
    <div :id="'video' + index" class="videobg">
      <span style="color: #fff" v-if="this.cameraId"
        ><i class="el-icon-loading"></i> 视频源</span
      >
      <div style="color: #fff;text-align: center;padding-top: 25%;" v-else> 未接入</div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request.js";
import Cookies from "js-cookie";
import Player from "xgplayer";
import FlvPlugin from "xgplayer-flv";
import "xgplayer/dist/index.min.css";
export default {
  name: "bigVideoItem",
  data() {
    return {
      wsUrl: VUE_APP_WS_BASE_URL, //'ws://e4ab935113169c37.natapp.cc:18025',
      flvPlayer: null,
    };
  },
  props: ["cameraId", "index"],
  created() {},
  mounted() {
    this.getPlayUrl();
    console.log(this.$parent.$refs.videobg[0].offsetWidth)
  },
  beforeDestroy() {
    this.player.pause();
    this.player.unload();
    this.player.detachMediaElement();
    this.player.destroy();
    this.player= null;
  },
  methods: {
    getPlayUrl(id, index) {
      //this.realVideoArr = data; this.cutSreenData(this.realVideoArr, this.screenNum);
      if(!this.cameraId){
        return;
      }
      request
        .post("/stream/getPlayUrl?cameraId=" + this.cameraId)
        .then(({ data }) => {
          this.$nextTick(() => {
            this.player = new Player({
              id: "video" + this.index,
              isLive: true,
              playsinline: true,
              url: data,
              volume: 0,
              autoplay: true,
              fluid: true,
              plugins: [FlvPlugin],
              width: this.$parent.$refs.videobg[0].offsetWidth,
              height: this.$parent.$refs.videobg[0].offsetHeight,
            });
          });
        });
    },
  },
  watch: {},
};
</script>

<style lang='scss' scoped>
.videoItem {
  width: 100%;
  height: 100%;
  .player {
    width: 100%;
    height: 100%;
  }
}
</style>