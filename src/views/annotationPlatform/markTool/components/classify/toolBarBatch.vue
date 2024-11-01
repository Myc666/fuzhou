<template>
  <div class="tool-wrap">
    <div class="tool-title">工具</div>
    <ul>
      <el-tooltip class="item" effect="dark" placement="right">
        <div slot="content">回退一步绘制</div>
        <li
          :class="{ disabled: !revokeList.length }"
          @click="setMode('REVOKE')"
        >
          <SvgIcon icon-name="revoke" />
        </li>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" placement="right">
        <div slot="content">恢复一步绘制</div>
        <li
          :class="{ disabled: !recoverList.length }"
          @click="setMode('RECOVER')"
        >
          <SvgIcon icon-name="recover" />
        </li>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" placement="right">
        <div slot="content">清空标签</div>
        <li @click="setMode('DELETETAG')">
          <i class="icon-aios_clear_label"></i>
        </li>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        placement="right"
        v-if="!tagVisible"
      >
        <div slot="content">显示标签</div>
        <li @click="setMode('SHOWTAG')">
          <i class="icon-aios_xianshixinxi"></i>
        </li>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        placement="right"
        v-if="tagVisible"
      >
        <div slot="content">隐藏标签</div>
        <li @click="setMode('HIDETAG')">
          <i class="icon-aios_yincang"></i>
        </li>
      </el-tooltip>
      <!-- <el-tooltip class="item" effect="dark" placement="right">
        <div slot="content">切换上一张（快捷键左键）</div>
        <li
          :class="{ active: modeType == 'PREVIOUS' }"
          @click="setMode('PREVIOUS')"
        >
          <i class="el-icon-back"></i>
        </li>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" placement="right">
        <div slot="content">切换下一张（快捷键右键）</div>
        <li :class="{ active: modeType == 'NEXT' }" @click="setMode('NEXT')">
          <i class="el-icon-right"></i>
        </li>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" placement="right">
        <div slot="content">选中可以拖动图片（右键）</div>
        <li :class="{ active: modeType == 'DRAG' }" @click="setMode('DRAG')">
          <i class="el-icon-rank"></i>
        </li>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" placement="right">
        <div slot="content">还原尺寸（快捷键上键）</div>
        <li
          :class="{ active: modeType == 'REFRESH' }"
          @click="setMode('REFRESH')"
        >
          <i class="el-icon-refresh-right"></i>
        </li>
      </el-tooltip> -->
    </ul>
  </div>
</template>

<script>
import SvgIcon from "@/components/svgIcon";
export default {
  components: {
    SvgIcon,
  },
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      modeType: "",
      revokeList: [], // 回退列表
      recoverList: [], // 恢复列表
      tagVisible: true,
      allVisible: true,
      imgStype: {
        imgNum1: 100,
        imgNum2: 100,
        imgNum3: 100,
        imgNum4: 0,
      },
    };
  },
  mounted() {
    // document.addEventListener("keydown", this.handleWatchEnter);
    // window.addEventListener("mousedown", this.handleMousedown); //监听鼠标按下
  },
  created() {},
  methods: {
    // handleWatchEnter(e) {
    //   var key = window.event ? e.keyCode : e.which;
    //   if (key == 37) {
    //     this.setMode("PREVIOUS");
    //   }
    //   if (key == 39) {
    //     this.setMode("NEXT");
    //   }
    //   if (key == 38) {
    //     this.setMode("REFRESH");
    //   }
    // },
    // handleMousedown(e) {
    //   if (e.button == 2) {
    //     this.setMode("DRAG");
    //   }
    //   if (e.button == 0) {
    //     this.setMode("MOUSELEFT");
    //   }
    // },
    setMode(val) {
      console.info(val);
      switch (val) {
        case "REVOKE":
          this.modeType = val;
          break;
        case "RECOVER":
          this.modeType = val;
          break;
        case "SHOWTAG":
          this.tagVisible = true;
          this.modeType = val;
          break;
        case "HIDETAG":
          this.tagVisible = false;
          this.modeType = val;
          break;
        case "ZOOMOUT":
          this.modeType = val;
          break;
        case "ZOOMIN":
          this.modeType = val;
          break;
        case "MOVE":
          this.modeType = val;
          break;
        case "DELETETAG":
          this.modeType = val;
          break;
          default:
          this.modeType = "";
          break;
      }
      this.$emit("setMode", this.modeType);
    },
  },
};
</script>
<style scoped lang="scss">
.tool-wrap {
  width: 100px;
  border-right: 1px solid #ebeef5;
  position: relative;
  flex-shrink: 0;
  .tool-title {
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    border-bottom: 1px solid #ebeef5;
    padding-left: 20px;
  }
  ul {
    padding: 6px 5.5px;
    display: flex;
    flex-wrap: wrap;
    li {
      width: 40px;
      height: 40px;
      font-size: 18px;
      border-radius: 8px;
      margin: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      &:hover {
        color: #2099fa;
      }
      &.active {
        color: #2099fa;
        background: rgba($color: #2099fa, $alpha: 0.1);
      }
      &.disabled {
        color: #bbb;
        background: #e6e8ed;
      }
    }
  }
  .issue {
    width: 40px;
    height: 40px;
    font-size: 18px;
    border-radius: 8px;
    position: absolute;
    bottom: 30px;
    left: 50%;
    margin-left: -20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
      color: #2099fa;
    }
    &.active {
      color: #2099fa;
      background: rgba($color: #2099fa, $alpha: 0.1);
    }
  }
}
.mo-input--number {
  border: 1px solid #dcdfe6;
  width: 100%;
  display: flex;
  border-radius: 4px;
  .el-input-number--mini {
    flex: 1;
  }
  ::v-deep .el-input__inner {
    border: none !important;
  }
}

.define-append {
  width: 40px;
  display: inline-block;
  background: #f5f7fa;
  padding: 0px 3px;
  border-left: none;
  height: 32px;
  line-height: 32px;
  color: #909399;
  font-size: 12px;
  text-align: center;
}
.row-col {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
::v-deep .el-input {
  margin: 0 !important;
}
::v-deep .el-input-number__increase,
::v-deep .el-input-number__decrease {
  width: 20px !important;
}
::v-deep .el-input-number.is-controls-right .el-input__inner {
  padding-left: 10px;
  padding-right: 25px;
}
</style>
