<template>
    <div>
      <el-dialog
        :close-on-click-modal="false"
        title="请选择归属机构"
        :visible.sync="dialogVisible"
        width="600px"
        @closed="closed"
        append-to-body
      >
        <el-tree :data="treeData" check-strictly accordion show-checkbox node-key="id" :default-expand-all="true" :props="defaultProps"
            @check="handleNodeClick" ref="tree" :default-checked-keys="checkedKeys">
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveData">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
<script>
export default {
  props: {
    treeData:{
      type:Array,
      default:[],
    },
    checkedKeys: {
        type: Array,
        default: [],
    },
    departObj:{
        type:Object,
        default:null
    }
  },
  data() {
    return {
        dialogVisible: true,
        defaultProps:{
            children: 'children',
            label: 'name'
        },
        currentNodeKey:null,
    };
  },
  created() {
    this.currentNodeKey = this.departObj;
    // this.getTree();
  },
  methods: {
    handleNodeClick(data, node, self) {
      // 如果已经选中了一个节点，则取消选择
      if (this.currentNodeKey?.name && this.$refs.tree) {
        this.$refs.tree.setCheckedKeys([]);
         // 更新当前选中节点的 key
        this.$refs.tree.setCheckedNodes([data]);
      }

      // 更新当前选中节点的 key
      this.currentNodeKey = data;
    },
    // 保存
    saveData(){
        console.log(this.currentNodeKey,"============")
        if(!this.currentNodeKey){
            this.$message.error("请选择部门")
            return;
        }
        this.$emit("close",this.currentNodeKey);
    },
    // 关闭回调
    closed() {
        this.$emit("close");
    },
  },
};
</script>
<style scoped lang="scss">
.depart{
  width: 100%;
  height: 32px;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  cursor: pointer;
}
</style>
