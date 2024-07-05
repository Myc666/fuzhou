<template>
  <div>
    <template v-for="(item, index) in data">
      <!-- 因为有子集和无子集渲染html标签不一样，所以要分为两种情况
           情况一：有子集的情况：                         -->
      <el-submenu :key="index" :index="item.path" v-if="item.children">
        <template slot="title">
          <i :class="item.icon"></i>
          <span>{{ item.name }}</span>
        </template>
        <myitem :data="item.children"></myitem>
      </el-submenu>
      <!-- 情况二：没子集的情况： -->
      <div v-if="!item.children && !item.meta?.hideMenu" :class="[(!item.children && item.meta?.textIndent)?'isText':'']">
        <el-menu-item
          :key="item.path"
          
          :index="item.path"
        >
          <i :class="item.icon"></i>
          <span slot="title">{{ item.name }}</span>
        </el-menu-item>
      </div>
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
};
</script>
<style scoped lang="scss">
:deep(.el-menu-item){
  text-indent: 29px;
}
.isText{
  :deep(.el-menu-item.is-active){
    background: #FFE6E1 !important;
    border-left: 3px solid #EB3A2F;
  }
  :deep(.el-menu-item){
    text-indent: 0px !important;
    i{
      margin-right: 20px;
    }
  }
  :deep(.el-tooltip){
    width: 70px !important;
  }
}

</style>