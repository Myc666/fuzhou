<template>
  <div style="width: 100%;height:100vh;background: #041335;">
    <div class="main" id="index" ref="appRef">
      <div class="header">
        <div
            style="
            width: 280px;
            height: 30px;
            padding-top: 30px;
            padding-left: 30px;
          "
        >
          <img v-show="this.$store.state.appInfo.screenLogoUrl"
               :src="VUE_APP_API_BASE_URL + this.$store.state.appInfo.screenLogoUrl"
               style="max-height: 30px"
          />
        </div>
        <div class="big-title" v-if="this.type!='1'">
          <span>
            {{ this.$store.state.appInfo.screenName }}
          </span>
          <div class="title-right">
            <div
                style="
              font-family: regular;
              display: flex;
              align-items: center;
              margin-right: 35px;
            "
            >
              <span class="date-num">{{ year }}/</span>
              <span class="date-num">{{ month }}/</span>
              <span class="date-num">{{ day }}</span>
              <span class="date-num" style="margin-left: 10px"
              >{{ time }}:{{ second }}</span
              >
            </div>
            <i class="el-icon-s-unfold" @click="changePath"></i>
          </div>
        </div>
      </div>
      <div class="view">
        <mainLeft />
        <MainRight />
      </div>
    </div>
  </div>
</template>

<script>
import drawMixin from "@/utils/drawMixin";
import MainRight from "@/components/bigScreen/mainRight.vue";
import mainLeft from "@/components/bigScreen/mainLeft.vue";
export default {
  mixins: [drawMixin],
  data() {
    return {
      VUE_APP_API_BASE_URL,
      year: "",
      month: "",
      day: "",
      time: "",
      second: "",
      timer: "",
      type:"",
    };
  },
  components: { mainLeft, MainRight },
  created(){
    this.type = this.$route.query.type;
  },
  mounted() {
    this.disableScroll();
    let that = this;
    this.getDate();
    this.timer = setInterval(function () {
      //定时器每秒调用一次getDate()，实现实时更新时间
      that.getDate();
    }, 1000);
  },
  beforeDestroy() {
    // 在组件销毁前启用滚动
    this.enableScroll();
  },
  methods: {
    getDate() {
      let date = new Date();
      this.year = date.getFullYear();
      this.month = date.getMonth() + 1;
      this.day = date.getDate();
      let hour = date.getHours(); //获取小时
      let minute = date.getMinutes() + ""; //获取分钟
      let seconds = date.getSeconds() + ""; //获取分钟
      this.second = seconds.length == 1 ? 0 + seconds : seconds; //获取秒
      this.time = hour + ":" + (minute.length == 1 ? 0 + minute : minute);
    },
    changePath() {
      this.$router.push('/')
    },
    disableScroll() {
      window.addEventListener('wheel', this.preventScroll, { passive: false });
    },
    enableScroll() {
      window.removeEventListener('wheel', this.preventScroll);
    },
    preventScroll(event) {
      event.preventDefault(); // 阻止滚轮事件的默认行为
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/index.scss";
.main {
  //background: url("@/assets/images/main.png") no-repeat;
  height: 100vh;
  width: 100%;
  .header {
    background: url("@/assets/images/header.png") no-repeat;
    height: 65px;
    width: 100%;
    .big-title {
      font-size: 35px;
      font-weight: bold;
      text-align: center;
      margin-top: -50px;
      position: relative;

      .el-icon-s-unfold{
        color: #226fb9;
        font-size: 35px;
        margin-right: 30px;
        margin-top: 4px;
        cursor: pointer;
      }

    }
    .title-right {
      position: absolute;
      right: 10px;
      top: -8px;
      height: 60px;
      display: flex;
      justify-content: right;
      align-items: center;
      .date-num {
        color: #3a72bb;
        font-size: 26px;
      }
      .date-name {
        margin-left: 5px;
      }
    }
  }
  .view {
    padding: 20px;
    display: flex;
  }
}
</style>
