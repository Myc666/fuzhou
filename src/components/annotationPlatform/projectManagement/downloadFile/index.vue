<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="导出数据" :visible.sync="dialogVisible" width="1000px" @closed="closed">
      <div>
        <el-form ref="form" :model="params" label-width="80px">
          <el-form-item label="导出格式" prop="type">
            <el-radio-group v-model="params.type">
              <el-radio label="1" v-if="currentProjectType!=3">VOC ( 点击查看：<el-link target="_blank"
                  href="https://github.com/IndustryEssentials/label-free/wiki/VOC%E6%95%B0%E6%8D%AE%E9%9B%86">VOC格式说明</el-link>
                )</el-radio>
              <el-radio label="3" v-if="currentProjectType==3">TXT ( 特指paddle OCR )</el-radio>
              <el-radio label="2">COCO ( 点击查看：<el-link target="_blank"
                  href="https://github.com/IndustryEssentials/label-free/wiki/COCO%E6%95%B0%E6%8D%AE%E9%9B%86">COCO格式说明</el-link>
                )</el-radio>
              <el-radio label="4" v-if="currentProjectType==3">Excel</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="导出图片" prop="exportImage">
            <el-radio-group v-model="params.exportImage">
              <el-radio-button label="1">是</el-radio-button>
              <el-radio-button label="0">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button type="primary" @click="saveDownload">确认</el-button>
        <el-button type="primary" @click="dialogVisible = false">取消</el-button>
      </div>
      <div style="margin-top: 20px">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column align="center" prop="id" label="编号"> </el-table-column>
          <el-table-column align="center" prop="type" label="导出格式">
            <template slot-scope="scope">
              <template v-if="scope.row.type == 1">VOC</template>
              <template v-if="scope.row.type == 2">COCO</template>
              <template v-if="scope.row.type == 3">TXT</template>
              <template v-if="scope.row.type == 4">Excel</template>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="exportImage" label="导出图片">
            <template slot-scope="scope">
              <template v-if="scope.row.exportImage == 1">是</template>
              <template v-if="scope.row.exportImage == 0">否</template>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="createdAt" label="创建时间">
          </el-table-column>
          <el-table-column align="center" prop="status" label="导出状态">
            <template slot-scope="scope">
              <template v-if="scope.row.status == 1">打包完成</template>
              <template v-if="scope.row.status == 0">打包中</template>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-download" :disabled="scope.row.status == 0"
                @click="dowloadData(scope.row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" :disabled="scope.row.status == 0"
                @click="deleteDownload(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  dowloadData,
  dowloadList,
  saveDownload,
  deleteDownload,
} from '@/api/annotationPlatform/projectManagement';
export default {
  props: {
    currentId: {
      type: String,
      default: ''
    },
    currentProjectType:{
      type:Number,
      default:null,
    }
  },
  data() {
    return {
      loading: false,
      dialogVisible: true,
      params: {
        projectId: this.currentId,
        type: '1',
        exportImage: '1'
      },
      tableData: [],
      timer: null
    };
  },
  created() {
    if(this.currentProjectType == 3){
      this.params.type="3"
    }
    this.dowloadList()
  },
  methods: {
    async dowloadList() {
      const data = await dowloadList({ projectId: this.currentId })
      this.tableData = data.data
    },
    async saveDownload() {
      clearInterval(this.timer)
      const data = await saveDownload(this.params)
      this.dowloadList()
      this.timer = setInterval(() => {
        this.dowloadList()
      }, 3000);
    },
    async dowloadData(row) {
      const data = await dowloadData({ id: row.id })
      var blob = new Blob([data.data], { type: "application/zip" });
      var url = window.URL.createObjectURL(blob);
      var linkElement = document.createElement('a');
      linkElement.setAttribute('href', url);
      linkElement.setAttribute('downLoad', 'download');
      linkElement.click();
    },
    async deleteDownload(row) {
      await deleteDownload({ id: row.id })
      this.dowloadList()
      this.$message.success('删除成功')
    },
    // 关闭回调
    closed() {
      this.$emit('close');
    }
  }
};
</script>
<style scoped lang="scss"></style>
