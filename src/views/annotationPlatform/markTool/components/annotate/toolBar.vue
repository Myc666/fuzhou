<template>
  <div class="tool-wrap">
    <div class="tool-title">工具</div>
    <ul>
      <el-tooltip class="item" effect="dark" placement="right">
        <div slot="content">选择:（快捷键S）</div>
        <li :class="{ active: modeType == '' }" @click="setMode('')">
          <i class="el-icon-position" style="transform: rotateY(180deg)"></i>
        </li>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" placement="right">
        <div slot="content">
          无限画框:（快捷键Q）<br />可以进入无限画框模式，然后给目标对象添加属性即可完成标注
        </div>
        <li :class="{ active: modeType == 'RECT' }" @click="setMode('RECT')">
          <i class="icon-aios_continue"></i>
        </li>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" placement="right">
        <div slot="content">
          绘制折线:（快捷键W）<br />可以在图片中打多个点绘制折线，右击结束绘制，然后给目标对象添加属性即可完成标注
        </div>
        <li
          :class="{ active: modeType == 'POLYGON' }"
          @click="setMode('POLYGON')"
        >
          <SvgIcon icon-name="polyline" />
        </li>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" placement="right">
        <div slot="content">
          无限画点:（快捷键E）<br />可以进入无限画点模式，然后给目标对象添加属性即可完成标注
        </div>
        <li :class="{ active: modeType == 'POINT' }" @click="setMode('POINT')">
          <SvgIcon icon-name="point" />
        </li>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" placement="right">
        <div slot="content">回退一步绘制:（快捷键Z）</div>
        <li
          :class="{ disabled: !revokeList.length }"
          @click="setMode('REVOKE')"
        >
          <SvgIcon icon-name="revoke" />
        </li>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" placement="right">
        <div slot="content">恢复一步绘制：（快捷键V）</div>
        <li
          :class="{ disabled: !recoverList.length }"
          @click="setMode('RECOVER')"
        >
          <SvgIcon icon-name="recover" />
        </li>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" placement="right">
        <div slot="content" v-if="tagVisible">
          隐藏类别:（快捷键F）<br />将隐藏已标注的类别
        </div>
        <div slot="content" v-if="!tagVisible">
          显示类别:（快捷键F）<br />将显示已标注的类别
        </div>
        <li @click="setMode(tagVisible ? 'HIDETAG' : 'SHOWTAG')">
          <i class="icon-aios_yincangleibie" v-if="tagVisible"></i>
          <i class="icon-aios_xianshileibie" v-if="!tagVisible"></i>
        </li>
      </el-tooltip>
      <li><i class="icon-aios_delT"></i></li>
      <el-tooltip class="item" effect="dark" placement="right">
        <div slot="content">
          隐藏选中:（快捷键H）<br />将隐藏当前选中的标注框，便于暂时清洁屏幕,以更好的观察待标注图片
        </div>
        <li @click="setMode('HIDECURRENT')">
          <i class="icon-aios_yincang"></i>
        </li>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" placement="right">
        <div slot="content">
          隐藏全部:（快捷键J）<br />将隐藏所有标注框，便于暂时清洁屏幕,以更好的观察待标注图片
        </div>
        <li @click="setMode('HIDEALL')"><i class="icon-aios_eyeplus"></i></li>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" placement="right">
        <div slot="content">独显:（快捷键X）<br />仅显示当前框</div>
        <li @click="setMode('SHOWCURRENT')">
          <i class="icon-aios_single2"></i>
        </li>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" placement="right">
        <div slot="content">
          显示全部:（快捷键B）<br />将显示所有已标注的对象，便于检阅已标注的信息
        </div>
        <li @click="setMode('SHOWALL')">
          <el-badge :value="list.length" class="item">
            <i class="icon-aios_xianshixinxi"></i>
          </el-badge>
        </li>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" placement="right">
        <div slot="content">缩小（快捷键-）</div>
        <li @click="setMode('ZOOMOUT')"><i class="icon-aios_zoomin1"></i></li>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" placement="right">
        <div slot="content">放大（快捷键+）</div>
        <li @click="setMode('ZOOMIN')"><i class="icon-aios_zoomout1"></i></li>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" placement="right">
        <div slot="content">移动（快捷键M）</div>
        <li :class="{ active: modeType == 'MOVE' }" @click="setMode('MOVE')">
          <i class="icon-aios_hand"></i>
        </li>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" placement="right">
        <div slot="content">移除:（快捷键D）<br />可以移除当前选中的标注框</div>
        <li @click="setMode('DELETECURRENT')">
          <i class="icon-aios_shanchu"></i>
        </li>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" placement="right">
        <div slot="content">清空（快捷键C）</div>
        <li @click="setMode('DELETEALL')">
          <i class="icon-aios_clear_label"></i>
        </li>
      </el-tooltip>
      <el-popover placement="right" width="400" trigger="click">
        <el-row>
          <el-col :span="4" class="row-col">亮度</el-col>
          <el-col :span="14" class="row-col">
            <el-slider
              style="width: 200px"
              :min="0"
              :max="300"
              v-model="imgStype.imgNum1"
              :show-tooltip="false"
            ></el-slider>
          </el-col>
          <el-col :span="6" class="row-col">
            <div class="mo-input--number">
              <el-input-number
                v-model="imgStype.imgNum1"
                controls-position="right"
                :min="0"
                :max="300"
              />
              <div class="define-append">%</div>
            </div>
          </el-col>
          <el-col :span="4" class="row-col">对比度</el-col>
          <el-col :span="14" class="row-col">
            <el-slider
              style="width: 200px"
              :min="0"
              :max="300"
              v-model="imgStype.imgNum2"
              :show-tooltip="false"
            ></el-slider>
          </el-col>
          <el-col :span="6" class="row-col">
            <div class="mo-input--number">
              <el-input-number
                v-model="imgStype.imgNum2"
                controls-position="right"
                :min="0"
                :max="300"
              />
              <div class="define-append">%</div>
            </div>
          </el-col>
          <el-col :span="4" class="row-col">饱和度</el-col>
          <el-col :span="14" class="row-col">
            <el-slider
              style="width: 200px"
              :min="0"
              :max="300"
              v-model="imgStype.imgNum3"
              :show-tooltip="false"
            ></el-slider>
          </el-col>
          <el-col :span="6" class="row-col">
            <div class="mo-input--number">
              <el-input-number
                v-model="imgStype.imgNum3"
                controls-position="right"
                :min="0"
                :max="300"
              />
              <div class="define-append">%</div>
            </div>
          </el-col>
          <el-col :span="4" class="row-col">透明度</el-col>
          <el-col :span="14" class="row-col">
            <el-slider
              style="width: 200px"
              :min="0"
              :max="100"
              v-model="imgStype.imgNum4"
              :show-tooltip="false"
            ></el-slider>
          </el-col>
          <el-col :span="6" class="row-col">
            <div class="mo-input--number">
              <el-input-number
                v-model="imgStype.imgNum4"
                controls-position="right"
                :min="0"
                :max="300"
              />
              <div class="define-append">%</div>
            </div>
          </el-col>
        </el-row>
        <li slot="reference">
          <SvgIcon icon-name="image" />
        </li>
      </el-popover>
    </ul>
    <!-- <el-tooltip
      class="item"
      effect="dark"
      placement="right"
      v-if="$route.query.type != 1"
    >
      <div slot="content">可在图片中标记问题位置，添加问题描述</div>
      <div
        class="issue"
        :class="{ active: modeType == 'ISSUE' }"
        @click="setMode('ISSUE')"
      >
        <SvgIcon icon-name="icon-issue-mark" />
      </div>
    </el-tooltip> -->
  </div>
</template>

<script>
import SvgIcon from "@/components/svgIcon";
import { connect } from 'echarts';
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
      list: []
    };
  },
  watch: {
    imgStype: {
      immediate: true,
      handler(val) {
        this.$emit("changeImg", val);
      },
      deep: true,
    },
    dataList: {
      deep: true,
      handler(val) {
        console.info(val)
        this.list = val.filter((item) => {
          return !item.svgVisible || !item.tagVisible
        })
      },
    },
  },
  created() {},
  mounted() {
    document.addEventListener("keydown", this.handleWatchEnter);
  },
  methods: {
    handleWatchEnter(e) {
      var key = window.event ? e.keyCode : e.which;
      if (key == 83) {
        this.setMode("");
      }
      if (key == 81) {
        this.setMode("RECT");
      }
      if (key == 87) {
        this.setMode("POLYGON");
      }
      if (key == 69) {
        this.setMode("POINT");
      }
      if (key == 90) {
        this.setMode("REVOKE");
      }
      if (key == 86) {
        this.setMode("RECOVER");
      }
      if (key == 70) {
        if (this.tagVisible) {
            this.setMode("HIDETAG");
          } else {
            this.setMode("SHOWTAG");
          }
      }
      if (key == 72) {
        this.setMode("HIDECURRENT");
      }
      if (key == 74) {
        this.setMode("HIDEALL");
      }
      if (key == 88) {
        this.setMode("SHOWCURRENT");
      }
      if (key == 66) {
        this.setMode("SHOWALL");
      }
      if (key == 109) {
        this.setMode("ZOOMOUT");
      }
      if (key == 107) {
        this.setMode("ZOOMIN");
      }
      if (key == 77) {
        this.setMode("MOVE");
      }
      if (key == 68) {
        this.setMode("DELETECURRENT");
      }
      if (key == 67) {
        this.setMode("DELETEALL");
      }
    },
    setMode(val) {
      console.info(val)
      switch (val) {
        case "RECT":
          if (this.modeType == "RECT") {
            this.modeType = "";
          } else {
            this.modeType = val;
          }
          break;
        case "POLYGON":
          if (this.modeType == "POLYGON") {
            this.modeType = "";
          } else {
            this.modeType = val;
          }
          break;
        case "POINT":
          if (this.modeType == "POINT") {
            this.modeType = "";
          } else {
            this.modeType = val;
          }
          break;
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
        case "HIDECURRENT":
          this.modeType = val;
          break;
        case "HIDEALL":
          this.allVisible = false;
          this.modeType = val;
          break;
        case "SHOWCURRENT":
          this.modeType = val;
          break;
        case "SHOWALL":
          this.allVisible = true;
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
        case "DELETECURRENT":
          this.modeType = val;
          break;
        case "DELETEALL":
          this.modeType = val;
          break;
        case "ISSUE":
          if (this.modeType == "ISSUE") {
            this.modeType = "";
          } else {
            this.modeType = val;
          }
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
