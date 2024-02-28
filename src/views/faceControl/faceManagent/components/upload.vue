<template>
  <el-dialog
    title="分组管理"
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
          >
          <el-button size="small" type="primary">点击上传</el-button>
  <div slot="tip" class="el-upload__tip">只能上传zip文件，且不超过100M</div>
          </el-upload>
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
      token:Cookies.get('X-Token')
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
    },
    onSuccess(data){
      if(data.code == 0){
        this.$message.success("导入成功")
        this.closeDialog()
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
</style>