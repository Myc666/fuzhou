<template>
  <div>
    <template v-for="(item, index) in data">
      <!-- 因为有子集和无子集渲染html标签不一样，所以要分为两种情况
           情况一：有子集的情况：                         -->
      <el-submenu :key="index" :index="item.path" v-if="item.children&&item.children.length>0">
        <template slot="title">
          <i :class="item.icon"></i>
          <span>{{ item.name }}</span>
        </template>
        <myitem :data="item.children"></myitem>
      </el-submenu>
      <!-- 情况二：没子集的情况： -->
      <el-menu-item
        :key="item.path"
        v-if="(!item.children || item.children.length==0) && (item.meta&&!item.meta.hideMenu)"
        :index="item.path"
      >
        <i :class="item.icon"></i>
        <span slot="title">{{ item.name }}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: "myitem",
  props: {
    data: {
      type: Array,
      default: [],
    },
  },
  // 注意： 在template标签上使用v-for，:key="index"不能写在template标签上，因为其标签不会被渲染，会引起循环错误
  mounted(){
    const menuArr = JSON.parse(sessionStorage.getItem('menuTree'));
    let pathUrl = sessionStorage.getItem('path');
    if(pathUrl){
      this.$router.push({ path:pathUrl})
    }else{
      if(menuArr&&menuArr.length>0){
        if(menuArr[0].type==0){
          let path = menuArr[0].children[0].path
          this.$router.push({ path:path})
        }else if(menuArr[0].type==1){
          let path = menuArr[0].path
          this.$router.push({ path:path})
        }
      }
    }
  }
};
</script>
<style scoped lang="scss">
:deep(.el-tooltip){
  width: 70px !important;
}
</style>