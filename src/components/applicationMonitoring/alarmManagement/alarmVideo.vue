<template>
    <el-dialog
    :close-on-click-modal="false"
      title="查看视频"
      :visible.sync="dialogVisible"
      width="800px"
      :append-to-body="true"
      @closed="closed"
    >
    <video controls style="width: 100%;height: 100%;" :src="'http://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-480p.mp4'"></video>
        <div style="text-align: right;margin-top: 20px;">
            <el-button @click="closed">取消</el-button>
        </div>
    </el-dialog>
</template>
<script>
export default {
  props: {
    videoUrl:{
        type:String,
        default:'',
    }
  },
  data() {
    return {
        dialogVisible: true,
        
    };
  },
  created() {

  },

  methods: {
    // 关闭回调
    closed() {
      this.$emit("close");
    },
    
  },
};
</script>
<style scoped lang="scss">
.tip{
    font-size: 12px;
    color: #909399;
    line-height: 20px;
    margin-bottom: 20px;
}
.radio-flex{
    display: flex;
}
.item-sty{
    font-size: 14px;
    padding: 0px 20px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    margin-right: 20px;
    cursor: pointer;
}
.check-item{
    background: #ECF5FF;
    border: 1px solid #337ECC !important;
}
</style>