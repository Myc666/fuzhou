<template>
  <div class="tab-wrap" ref="tab-wrap">
    <ul class="tag-list">
      <li
        v-for="(item, index) in attributeList"
        :key="index"
        :style="{
          background:
            currentTagList.indexOf(item.name) > -1
              ? '#2099fa'
              : 'rgba(207, 213, 216, 0.6)',
        }"
        @click="clickTag(item)"
      >
        {{ item.name }}
      </li>
    </ul>
    <div v-if="currentProjectType==3" style="margin-top: 10px;">
      <div v-for="(item,index) in list" :key="index" @click="handleChange(item)" class="list-item">
        <div :class="[item.check?'item-flex bj':'item-flex']">
          <div style="width: 60px;text-align: center;">{{ index+1 }}</div>
          <div style="width: calc(100% - 15px);padding: 0px 10px;">{{ item.name }}</div>
          <div class="button-list" style="width: 60px;text-align: center;">
            <i
              class="icon-aios_eye"
              v-if="item.svgVisible && item.tagVisible"
              @click.stop="clickVisible(item)"
            ></i>
            <i
              class="icon-aios_eyeclose"
              v-if="!item.svgVisible || !item.tagVisible"
              @click.stop="clickVisible(item)"
            ></i>
            <i class="icon-aios_shanchu" @click="clickDelete(item)"></i>
          </div>
        </div>
        <div style="padding: 5px 0px 5px 30px;">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入"
            v-model="item.annotationValue"
            @click.native.stop
            @focus="focusFun(item,index)"
            @blur="blurFun(item,index)"
          >
          </el-input>
        </div>
      </div>
    </div>
    <el-table
      v-else
      :data="list"
      :show-header="false"
      highlight-current-row
      @current-change="handleCurrentChange"
      border
      style="margin-top: 20px"
      ref="singleTable"
    >
      <el-table-column width="40" align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name"></el-table-column>
      <el-table-column align="center">
        <template slot-scope="scope">
          <div class="button-list">
            <i
              class="icon-aios_eye"
              v-if="scope.row.svgVisible && scope.row.tagVisible"
              @click.stop="clickVisible(scope.row)"
            ></i>
            <i
              class="icon-aios_eyeclose"
              v-if="!scope.row.svgVisible || !scope.row.tagVisible"
              @click="clickVisible(scope.row)"
            ></i>
            <i class="icon-aios_shanchu" @click="clickDelete(scope.row)"></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },
    attributeList: {
      type: Array,
      default: () => [],
    },
    currentProjectType:{
      type:Number,
      default:null,
    }
  },
  data() {
    return {
      currentTagList: [],
      list: [],
      defaultList:[],
    };
  },
  watch: {
    attributeList: {
      deep: true,
      handler(val) {
        val.forEach((item) => {
          this.currentTagList.push(item.name);
        });
      },
    },
    dataList: {
      deep: true,
      handler(val) {
        if(val){
          this.list = JSON.parse(JSON.stringify(val))

          if(this.currentProjectType==3){
            this.list.forEach((item,i)=>{
              item.check = false;
              // if(i == this.list.length-1){
              //   item.check = true
              // }
              this.defaultList.forEach((items)=>{
                if(item.id == items.id){
                  item.check = items.check;
                }
              })
            })
          }
          
        }else{
          this.list = []
        }
      },
    },
  },
  created() {
  },
  methods: {
    // 输入框获取焦点
    focusFun(val){
      this.list.forEach((item)=>{
        item.check=false;
      })
      if(val){
        val.check = true;
      }
      this.$forceUpdate()
      this.$parent.$refs.tab1.delFun();
      this.$parent.$refs.toolBar.delFun();
    },
    // 输入框失去焦点
    blurFun(item){
      this.$emit("changesave", item);
      this.$parent.$refs.tab1.addFun();
      this.$parent.$refs.toolBar.addFun();
    },
    // 点击标签
    clickTag(obj) {
      const i = this.currentTagList.indexOf(obj.name);
      if (i > -1) {
        this.currentTagList.splice(i, 1);
        this.list.forEach((item) => {
          if (obj.name == item.tagName) {
            item.svgVisible = false;
            item.tagVisible = false;
            this.$emit("changeVisible", item);
          }
        });
      } else {
        this.currentTagList.push(obj.name);
        this.list.forEach((item) => {
          if (obj.name == item.tagName) {
            item.svgVisible = true;
            item.tagVisible = true;
            this.$emit("changeVisible", item);
          }
        });
      }
    },
    // 点击显示隐藏
    clickVisible(item) {
      item.svgVisible = !item.svgVisible;
      item.tagVisible = !item.tagVisible;
      this.$emit("changeVisible", item);
    },
    // 点击删除
    clickDelete(item) {
      this.$emit("delCurrent", item);
      for (let i = 0; i < this.list.length; i++) {
        if (item.id == this.list[i].id) {
          this.list.splice(i, 1);
          break;
        }
      }
    },
    // 设置当前svg为当前表格
    setCurrent(row) {
      this.list.forEach((item) => {
        if (item.id == row.id) {
          row.svgVisible = item.svgVisible;
          row.tagVisible = item.tagVisible;
          this.$refs.singleTable.setCurrentRow(row);
        }
      });
    },
    removeCurrent() {
      this.$refs.singleTable.setCurrentRow();
    },
    // 选中表格
    handleCurrentChange(val) {
      if (val) {
        val.svgVisible = true
        val.tagVisible = true
        this.$emit("changeCurrent", val);
      }
    },
    handleChange(val){
      this.list.forEach((item)=>{
        item.check=false;
        if(item.id == val.id){
          item.check = true;
        }
      })
      this.defaultList = JSON.parse(JSON.stringify(this.list))
      if (val) {
        // val.check = true
        val.svgVisible = true
        val.tagVisible = true
        this.$emit("changeCurrent", val);
      }
      this.$forceUpdate()
    }
  },
};
</script>
<style scoped lang="scss">
.tab-wrap {
  padding: 20px;
  height: calc(100vh - 150px);
  overflow-y: scroll;
  .tag-list {
    display: flex;
    flex-wrap: wrap;
    li {
      height: 28px;
      line-height: 28px;
      font-size: 14px;
      color: #fff;
      border-radius: 5px;
      padding: 0 10px;
      margin: 10px 10px 0 0;
      cursor: pointer;
    }
  }
}
.button-list {
  font-size: 14px;
  i {
    cursor: pointer;
    margin: 0 5px;
  }
}
.list-item{
  padding: 0px 16px;
  .item-flex{
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 8px 0px;
  }
  .bj{
    background: #ecf5ff;
  }
}
</style>
