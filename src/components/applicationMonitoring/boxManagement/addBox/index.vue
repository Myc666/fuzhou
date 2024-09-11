<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="dialogVisible"
      width="500px"
      @closed="closed"
    >
      <el-form label-width="120px">
        <el-form-item label="上级区域">
          {{ detail.parentName }}
        </el-form-item>
        <el-form-item label="盒子名称">
          <el-input
            placeholder="请输入盒子名称"
            v-model="detail.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input
            placeholder="请输入地址"
            disabled
            v-model="detail.ipAddr"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveData">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getRegionDetail,
  saveRegion
} from "@/api/applicationMonitoring/cameraManagement";
export default {
  props: {
    type: {
      type: String,
      default: 'add'
    },
    currentData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      loading: false,
      dialogVisible: true,
      title: this.type == 'add' ? '新增盒子' : '编辑盒子',
      detail: {},
    };
  },
  async created() {
    if (this.type == 'edit') {
      this.getRegionDetail()
    }else {
      this.detail = {
        parentName: this.currentData.text,
        parentId: this.currentData.meId,
      }
    }
  },
  methods: {
    // 获取区域详情
    async getRegionDetail() {
      const data = await getRegionDetail({id:this.currentData.meId})
      this.detail = data.data
    },
    // 保存数据
    async saveData() {
      const params = {
        id: this.detail.id,
        parentId: this.detail.parentId,
        name: this.detail.name,
        longitude: this.detail.longitude,
        latitude: this.detail.latitude,
        ipAddr: this.detail.ipAddr,
        locationType: 2,
        type: 2
      }
      await saveRegion(params)
      this.$message.success('保存成功')
      this.dialogVisible = false
      this.$emit("success");
    },
    // 关闭回调
    closed() {
      this.$emit("close");
    },
  },
};
</script>
<style scoped lang="scss">
.image {
  width: 100%;
  height: auto;
  display: block;
}
.btn-list {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}
</style>
