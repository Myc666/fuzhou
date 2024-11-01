<template>
  <div class="wrap">
    <ToolBarBatch ref="toolBarBatch" @setMode="setMode" />
    <div class="content">
      <div class="pagination">
        <el-button type="primary" @click="goClassify"
          >去单图<template v-if="$route.query.type == 1">标注</template
          ><template v-else>质检</template></el-button
        >
        <el-pagination
          background
          layout="prev, pager, next, jumper, total"
          :current-page="currentPage"
          :page-size="20"
          :pager-count="5"
          @current-change="handleCurrentChange"
          :total="total"
        />
        <span>
          <el-button type="primary" @click="back">返回</el-button>
          <el-button type="primary" @click="submit">提交</el-button>
        </span>
      </div>
      <div class="list">
        <div style="padding-top: 20px">
          <el-checkbox
            label="全选"
            style="margin-right: 10px"
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
          ></el-checkbox>
        </div>
        <el-checkbox-group
          v-model="checkedList"
          @change="handleCheckedImgChange"
        >
          <el-row :gutter="20" class="checkbox-list">
            <el-col :span="48" v-for="(item, index) in imgList" :key="index">
              <el-checkbox class="checkbox" :label="item.id">
                <div class="list-item">
                  <div
                    style="width: 100%; display: inline-block; height: 200px"
                  >
                    <ClassifyDetail
                      v-if="projectDetail.projectType == 1"
                      :currentImgData="item"
                    />
                    <div class="hege" v-if="item.status == 15">
                      <SvgIcon icon-name="icon-accepted" />
                    </div>
                  </div>
                </div>
              </el-checkbox>
            </el-col>
          </el-row>
        </el-checkbox-group>
      </div>
    </div>
    <div class="right-wrap">
      <ul class="right-tab">
        <li
          v-for="(item, index) in rightTabList"
          :key="index"
          :class="{ active: rightActive == item }"
          @click="rightActive = item"
        >
          <span>{{ item }}</span>
        </li>
      </ul>
      <Tab1
        ref="tab1"
        :attributeList="projectDetail.labels"
        @changeAttribute="changeAttribute"
        v-show="rightActive == '标签'"
      />
    </div>
  </div>
</template>

<script>
import ToolBarBatch from "./components/classify/toolBarBatch";
import SvgIcon from "@/components/svgIcon";
import Tab1 from "./components/classify/tab1";
import ClassifyDetail from "@/components/classifyDetail";
import {
  getDetail,
  getAssign,
  getAssignReview,
  getHistory,
  saveCommit,
  release,
} from "@/api/annotationPlatform/projectManagement";
export default {
  components: {
    Tab1,
    ToolBarBatch,
    SvgIcon,
    ClassifyDetail,
  },
  data() {
    return {
      loading: false,
      projectId: this.$route.query.id,
      projectDetail: {},
      imgList: [], // 图片列表
      currentPage: 1, // 当前页
      total: 0, // 总数
      rightTabList: ["标签"],
      rightActive: "标签",
      attributeList: [], // 所有属性标签
      modeType: "", // 工具栏选择类型
      currentTagData: {}, // 当前属性标签
      tagVisible: true, // 标签是否全部隐藏
      checkAll: false,
      isIndeterminate: false,
      checkedList: [],
      timer: null,
    };
  },
  async created() {
    await this.getDetail();
    this.getAssign();
  },
  methods: {
    async getDetail() {
      const data = await getDetail({ id: this.projectId });
      this.projectDetail = data.data;
      if (this.projectDetail.labelTaskTimeOut) {
        let time = 0;
        this.timer = setInterval(() => {
          time = time + 1000;
          if (time >= this.projectDetail.labelTaskTimeOut * 60000) {
            clearInterval(this.timer);
            this.$alert("标注操作已超时", "温馨提示", {
              confirmButtonText: "确定",
              showClose: false,
              callback: async () => {
                const list = [];
                for (let i = 0; i < this.imgList.length; i++) {
                  list.push(this.imgList[i].id);
                }
                const res = await release({
                  projectId: this.projectId,
                  imageIds: list,
                });
                this.$router.push({
                  path: "/annotationPlatform/projectManagement",
                });
              },
            });
          }
        }, 1000);
      }
    },
    async getAssign() {
      const data = await getAssign({
        count: 20,
        projectId: this.projectId,
      });
      if (data.data.images.length) {
        this.imgList = data.data.images;
        this.total = Number(data.data.total) + this.imgList.length;
        this.currentPage = this.total;
        this.currentImgData = this.imgList[0];
      } else {
        if (this.total == this.currentPage || data.data.total == "0") {
          this.$message.error("当前没有可以操作的图片，即将跳转至项目页");
          setTimeout(() => {
            this.$router.push({
              path: "/annotationPlatform/projectManagement",
            });
          }, 1000);
        } else {
          this.total = Number(data.data.total) + this.imgList.length;
          this.currentPage = this.total;
          await this.getHistory();
        }
      }
    },
    async getHistory() {
      const data = await getHistory({
        projectId: this.projectId,
        page: this.currentPage,
        limit: 20,
        type: 0,
      });
      this.imgList = data.data;
      if (data.data.length) {
        this.imgList = data.data;
      } else {
        this.$message.error(
          "当前没有可以标注的新图片，您可以对已标注的数据进行修改"
        );
      }
    },
    setMode(val) {
      switch (val) {
        case "REVOKE":
          break;
        case "RECOVER":
          break;
        case "SHOWTAG":
          this.tagVisible = true;
          break;
        case "HIDETAG":
          this.tagVisible = false;
          break;
        case "DELETETAG":
          break;
        case "PREVIOUS":
          if (this.currentPage > 1) {
            this.currentPage--;
            this.handleCurrentChange(this.currentPage);
          } else {
            this.$message.warning("已经是第一张了");
          }
          break;
        case "NEXT":
          if (this.currentPage < this.total) {
            this.currentPage++;
            this.handleCurrentChange(this.currentPage);
          } else {
            this.$message.warning("已经是最后一张了");
          }
          break;
        case "REFRESH":
          this.$refs.dragElement.style.transform = `scale(0.17) translate(0px, 0px)`;
          break;
        case "DRAG":
          this.mouseType = "pointer";
          this.modeType = val;
          break;
        case "MOUSELEFT":
          this.modeType = "";
          break;
        default:
          this.modeType = "";
          this.mouseType = "auto";
          break;
      }
    },
    // 改变标签属性
    changeAttribute(obj) {
      if (!this.checkedList.length) {
        this.$refs.tab1.name = "";
        return this.$message.error("请勾选需要标注的图片");
      }
      this.currentTagData = obj;
      this.checkedList.forEach((item) => {
        this.imgList.forEach((i) => {
          if (item == i.id) {
            this.$set(i.commit, "annotations", [
              {
                annotationType: 1,
                tagName: this.currentTagData.tagName,
                annotation: {
                  label: this.currentTagData.labelTree,
                },
              },
            ]);
            this.$set(i, "color", this.currentTagData.color);
          }
        });
      });
      this.checkAll = false;
      this.isIndeterminate = false;
      this.checkedList = [];
    },
    handleCheckAllChange(val) {
      this.$refs.tab1.name = "";
      const list = this.imgList.map((i) => {
        return i.id;
      });
      this.checkedList = val ? list : [];
      this.isIndeterminate = false;
    },
    handleCheckedImgChange(value) {
      this.$refs.tab1.name = "";
      const list = this.imgList.map((i) => {
        return i.id;
      });
      let checkedCount = value.length;
      this.checkAll = checkedCount === list.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < list.length;
    },
    async submit() {
      const commits = [];
      let count = 0;
      for (let i = 0; i < this.imgList.length; i++) {
        const item = this.imgList[i];
        if (!item.commit.annotations?.length) {
          count++;
        }
        commits.push({
          imageId: item.id,
          isValid: item.commit.isValid || 1,
          annotations: item.commit.annotations,
        });
      }
      const params = {
        projectId: this.projectId,
        commits,
      };
      console.info(count);
      if (count) {
        return this.$message.error(
          `抱歉，您有${count}张未标注的图片，无法提交。`
        );
      }
      const data = await saveCommit(params);
      this.$message.success("提交成功");
      this.getAssign();
    },
    async back() {
      await this.$confirm(
        "放弃当前标注任务则该任务释放回标注池, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      );
      const list = [];
      for (let i = 0; i < this.imgList.length; i++) {
        list.push(this.imgList[i].id);
      }
      const res = await release({
        projectId: this.projectId,
        imageIds: list,
      });
      this.$router.push({
        path: "/annotationPlatform/projectManagement",
      });
    },
    // 分页
    handleCurrentChange(val) {
      this.checkAll = false;
      this.isIndeterminate = false;
      this.checkedList = [];
      this.currentPage = val;
      if (this.imgList.length && this.total == this.currentPage) {
        this.getAssign();
      } else {
        this.getHistory();
      }
    },
    goClassify() {
      this.$router.replace({
        path: "/annotationPlatform/projectManagement/markTool/classify",
        query: {
          id: this.projectId,
          type: this.$route.query.type,
        },
      });
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>
<style scoped lang="scss">
::v-deep .el-col-48 {
  width: 20%;
}

::v-deep .checkbox-list {
  .checkbox {
    width: 100%;
    height: 100%;
    position: relative !important;
    top: 0 !important;
    right: 0 !important;
  }

  .el-checkbox__input {
    display: none;
  }

  .el-checkbox__label {
    width: 100%;
    padding: 0;
    display: block;
  }

  .is-checked {
    .list-item {
      border: 1px #2099fa solid !important;
    }
  }
}

.wrap {
  display: flex;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;

  .content {
    flex: 1;
  }

  .pagination {
    align-items: center;
    justify-content: space-between;
    display: flex;
    padding: 5px 10px;
    margin: 0;
  }

  .list {
    height: calc(100vh - 138px);
    background: #f5f8fb;
    padding: 0 20px;
    overflow: auto;

    .list-item {
      width: 100%;
      height: 200px;
      border: 1px solid rgba(0, 0, 0, 0.06);
      border-radius: 5px;
      margin: 10px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      .checkbox {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 10;
      }

      .img {
        max-width: 100%;
        max-height: 100%;
        display: block;
      }

      .invalid {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        position: absolute;
        left: 0;
        top: 0;
        z-index: 9;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 80px;
        }
      }

      .hege {
        width: 20px;
        height: 20px;
        position: absolute;
        left: 10px;
        top: 10px;
        z-index: 8;
        font-size: 20px !important;
      }
    }
  }

  .right-wrap {
    width: 300px;
    background: #fff;

    .right-tab {
      width: 100%;
      background: #f4f5f8;
      display: flex;

      li {
        height: 40px;
        font-size: 14px;
        text-align: center;
        flex: 1;
        flex-shrink: 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;

        &.active {
          background: #fff;
        }
      }
    }
  }
}
</style>
