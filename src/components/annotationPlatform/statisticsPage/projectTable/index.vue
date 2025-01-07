<template>
  <div>
    <el-table :data="newTableData" border style="margin-top: 20px">
      <el-table-column label="用户名称" prop="userName"></el-table-column>
      <el-table-column label="用户角色" prop="roleName"></el-table-column>
      <el-table-column label="标注图片量" prop="annoNum"></el-table-column>
      <el-table-column label="标注框数" prop="annoDetailNum"></el-table-column>
      <el-table-column label="无效数据数" prop="invalidNum"></el-table-column>
      <el-table-column label="质检图片数" prop="reviewNum"></el-table-column>
      <el-table-column label="质检不合格图片数量" prop="backNum"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    tableData: Array,
  },
  data() {
    return {
      newTableData: [],
    };
  },
  watch: {
    tableData: {
      immediate: true,
      deep: true,
      handler(val) {
        this.newTableData = val;
      },
    },
  },
  methods: {},
};
</script>
<style scoped lang="scss">
.chart {
  width: 100%;
  height: 348px;
}
</style>
