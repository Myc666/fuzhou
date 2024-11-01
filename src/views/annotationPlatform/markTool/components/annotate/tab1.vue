<template>
  <div class="tab-wrap">
    <div class="tab-title">对象类别</div>
    <div class="tree">
      <el-tree
        :data="newAttributeList"
        :props="defaultProps"
        node-key="name"
        default-expand-all
        :expand-on-click-node="false"
        ref="tree"
      >
        <span slot-scope="{ node, data }">
          <span v-if="data.children&&data.children.length">
            <span>{{ data.name }}</span>
          </span>
          <span v-else
            ><el-radio
              v-model="name"
              :label="data.name"
              @input="changeAttribute($event, node)"
            ></el-radio>
            <span style="color: #999;">{{ getText(data.name) }}</span>
          </span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
import colorList from "@/utils/colorList";
// import { set } from "vue/types/umd";
export default {
  props: {
    attributeList: {
      type: Array,
      default: () => [],
    },
    nameCurrent:{
      type: String,
      default: () => ""
    }
  },
  mounted() {
    document.addEventListener("keydown", this.handleWatchEnter);
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name",
      },
      newAttributeList: [],
      attributeArr: [], // 平铺所有可选标签
      tagName: "", // 一级标签名
      name: "", // 选中标签值
      tempTagArr: [], // 选中的所有节点
      labelTree: [], // 返回给后端的labelTree
      count: 0,
      numberType: "",
      ancestorTree: null,
      error: null,
    };
  },
  watch: {
    attributeList: {
      deep: true,
      handler(val) {
        this.newAttributeList = JSON.parse(JSON.stringify(val));
        console.log(JSON.stringify(this.newAttributeList),">>>")
        // 将所有的末级数据拼成数组并将第一个设置为默认值
        this.treeToArray(this.newAttributeList);
        this.attributeArr.forEach((item, index) => {
          item.color = colorList[index];
        });

        this.$nextTick(() => {
          this.changeAttribute(
            this.attributeArr[0].name,
            this.$refs.tree.getNode(this.attributeArr[0].name)
          );
        });
      },
    },
    name: {
      deep: true,
      handler(val) {
        if(val){
          const obj = this.attributeArr.find((i) => i.name == val);
          this.$nextTick(() => {
            this.changeAttribute(
              val,
              this.$refs.tree.getNode(val)
            );
            setTimeout(()=>{
              this.$emit("changeAttribute", {
                ...obj,
                tagName: this.tagName,
                labelTree: this.labelTree,
              });
            },200)
          });
        }
      },
    },
    nameCurrent:{
      deep:true,
      handler(val){
        this.name=val
      }
    }
  },
  created() {},
  methods: {
    handleWatchEnter(e) {
      var key = window.event ? e.keyCode : e.which;
      if (key == 48 || key == 96) {
        // 0
        this.setNumber("0");
      }
      if (key == 49 || key == 97) {
        this.setNumber("1");
      }
      if (key == 98 || key == 50) {
        this.setNumber("2");
      }
      if (key == 99 || key == 51) {
        this.setNumber("3");
      }
      if (key == 100 || key == 52) {
        this.setNumber("4");
      }
      if (key == 101 || key == 53) {
        this.setNumber("5");
      }
      if (key == 102 || key == 54) {
        this.setNumber("6");
      }
      if (key == 103 || key == 55) {
        this.setNumber("7");
      }
      if (key == 104 || key == 56) {
        this.setNumber("8");
      }
      if (key == 105 || key == 57) {
        // 9
        this.setNumber("9");
      }
    },
    setNumber(val) {
      if(val<this.attributeArr.length){
        this.name = this.attributeArr[val].name
        this.findAndBuildAncestorTree(val);
      }
    },
    findAndBuildAncestorTree(val) {
      let newAttributeList = JSON.parse(JSON.stringify(this.newAttributeList));
      const targetNodePath = this.findPathToNode(newAttributeList, this.name);
      console.log(this.name,targetNodePath,(targetNodePath && targetNodePath.length>0),"<<<<")
      if(targetNodePath && targetNodePath.length>0){
        this.labelTree = [targetNodePath[0]]
        this.tagName = this.labelTree[0].name;
        console.log(this.name,this.labelTree,this.tagName,">>>>")
      }
          
    },
    findPathToNode(tree, targetName, path = []) {
      for (const node of tree) {
        if (node.name === targetName) {
          return [...path, node];
        }

        if (node.children) {
          const result = this.findPathToNode(node.children, targetName, [...path, node]);
          if (result) {
            return result;
          }
        }
      }

      return null;
    },

    buildAncestorTree(tree, path) {
      const ancestors = path.reverse();

      return ancestors.reduce((ancestorTree, node, index) => {
        const isRoot = index === 0;

        if (!isRoot) {
          const parent = ancestorTree.find(n => n.name === ancestors[index - 1].name);
          if (!parent) {
            throw new Error("Inconsistent tree structure: unable to find parent node.");
          }

          parent.children ||= [];
          parent.children.push(node);
        }

        return ancestorTree;
      }, [ancestors[0]]);
    },
    
    changeAttribute(val, node) {
      this.tempTagArr = [];
      this.treeToArrayByFather(node);
      const newTempTagArr = JSON.parse(JSON.stringify(this.tempTagArr));
      for (let i = 0; i < newTempTagArr.length; i++) {
        if (newTempTagArr[i + 1]) {
          newTempTagArr[i + 1].children = [
            {
              name: newTempTagArr[i].name,
              editCell: newTempTagArr[i].editCell,
              children: newTempTagArr[i].children,
            },
          ];
        }
      }
      this.labelTree = newTempTagArr.slice(-1);
      this.tagName = this.labelTree[0].name;
      console.log(this.labelTree,this.tagName,this.name)
      this.name = val;
      //console.log(val)
      // this.name = node.data.name;
    },
    treeToArray(tree) {
      tree.forEach((item) => {
        if (item.children&&item.children.length) {
          this.treeToArray(item.children);
        } else {
          this.attributeArr.push(item);
        }
      });
    },
    getText(name){
      for (let i = 0; i < this.attributeArr.length; i++) {
        if (name == this.attributeArr[i].name && i<10) {
          return '快捷键'+i
        }
      }
    },
    treeToArrayByFather(item) {
      this.tempTagArr.push(item.data);
      if (this.$common.checkIsJSON(item.parent.data)) {
        this.treeToArrayByFather(item.parent);
      }
    },
    delFun(){
      document.removeEventListener("keydown", this.handleWatchEnter);
    },
    addFun(){
      document.addEventListener("keydown", this.handleWatchEnter);
    }
  },
  beforeDestroy(){
    document.removeEventListener("keydown", this.handleWatchEnter);
  }
};
</script>
<style scoped lang="scss">
.tab-wrap {
  padding: 20px;
  height: calc(100vh - 150px);
  overflow-y: scroll;
  .tab-title {
    font-size: 14px;
    color: #999;
    padding-bottom: 10px;
  }
  .tree {
    font-size: 14px;
  }
}
</style>
