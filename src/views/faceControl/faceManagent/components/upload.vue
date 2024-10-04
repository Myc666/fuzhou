<template>
  <el-dialog
    title="批量上传"
    :visible.sync="visible"
    width="40%"
    @update:visible="(val) => $emit('update:visible', val)"
    append-to-body
  >
    <div style="overflow: hidden">
      <el-form label-position="right" label-width="100px">
        <el-form-item label="所属组">
          <el-select
            class="pr10"
            style="width: 291px"
            v-model="formatData.faceGroupId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in tableData"
              :key="item.id"
              v-if="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传文件">
          <el-upload
            :action="VUE_APP_API_BASE_URL + '/face/user/upload'"
            :data="{
              faceGroupId:this.formatData.faceGroupId
            }"
            :headers="{
              'X-Token':token
            }"
            :before-upload="beforeupload"
            accept=".zip"
            :on-success="onSuccess"
            :limit="1"
            :disabled="isDisabled"
          >
          <el-button size="small" type="primary">点击上传</el-button>
  <div slot="tip" class="el-upload__tip">只能上传zip文件，且不超过100M</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="Zip结构示例">
          <div style="font-size: 12px;color: #000;">
            <div style="line-height: 22px;">
              文件夹1 (注册人脸1)<br/> + 图片1<br/> + 图片2<br/>  
            </div>
            <div style="line-height: 22px;margin-top: 15px;">文件夹2 (注册人脸2)<br/> + 图片1<br/> + 图片2</div>
            <div style="line-height: 22px;margin-top: 15px;">文件夹3 (注册人脸3)<br/>  + 图片1<br/>  + 图片2<br/>  + 图片3</div>
            <div style="line-height: 22px;margin-top: 15px;"> ...更多人脸</div>
            <div style="color: #606266;line-height: 22px;margin-top: 15px;">Zip内可添加多个文件夹，每个文件夹的名称即人脸的名称，单个文件夹最多三张图片，支持JPG、JPEG、PNG图片格式，单张不大于2m。</div>
          </div>
        </el-form-item>
      </el-form>

      <!-- <span slot="footer" class="footer">
        <el-button size="mini" :disabled="disabled" type="primary" @click="save();closeDialog();">确 定</el-button>
        <el-button size="mini"  @click="closeDialog">取 消</el-button>
      </span> -->
    </div>
  </el-dialog>
</template>
<script>
import { listPageDGroup } from "../api";
import Cookies from "js-cookie";
export default {
  components: {},
  props: {
    visible: Boolean,
    currentItme: Object,
    currentState: String,
  },
  data() {
    return {
      formatData: {
        faceGroupId:''
      },
      tableData: [],
      VUE_APP_API_BASE_URL,
      token:Cookies.get('X-Token'),
      isDisabled:false,
    };
  },
  computed: {},
  created() {
    this.int();
  },
  methods: {
    int() {
      this.getTable();
    },

    async getTable() {
      const { data, count } = await listPageDGroup();
      this.tableData = data;
    },
    closeDialog() {
      this.$emit("update:visible", false);
      this.$emit("close", false);
    },
    beforeupload(file){
        const isLt2M = file.size / 1024 / 1024 < 100;
        const faceGroupId = this.formatData.faceGroupId;

        if(!faceGroupId){
          this.$message.error('请选择所属组后再上传!');
          return false
        }
        if (!isLt2M) {
          this.$message.error('上传文件不能超过 100MB!');
          return false
        }
        this.isDisabled = true;  
    },
    onSuccess(data){
      if(data.code == 0){
        this.isDisabled = false;
        this.$message.success("导入成功")
        this.closeDialog()
      }else{
        this.isDisabled = false;
        this.$message.erro(data.msg)
      }
    }
  },
};
</script>
<style scoped>
.bg {
  background: white;
}
.wh {
  width: 100%;
  height: 100%;
}
.footer {
  float: right;
}
.upload-demo{
  width: 290px;
}
::v-deep .el-form-item {
  margin-bottom: 18px !important;
}
</style>