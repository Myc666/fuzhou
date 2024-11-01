<template>
    <div class="cont">
        <div style="margin-bottom: 20px;"  v-if="!secret_adm">
            <el-button type="primary" @click="addData">新增部门</el-button>
        </div>
        <el-tree
            :data="treeList"
            :props="defaultProps"
            node-key="id"
            :default-expanded-keys="treeList[0] && [treeList[0].id]"
            accordion
        >
            <div class="custom-tree-node" slot-scope="{ node, data }">
                <span class="label-color">{{ node.label }}</span>
                <span style="margin-left: 30px;">
                    <el-button type="text"  @click.stop="editData(data)">编辑</el-button>
                    <el-button type="text"  style="color: #f56c6c !important" v-if="!secret_adm" @click.stop="delData(data)">删除</el-button>
                </span>
            </div>
        </el-tree>
        <!-- 新增、编辑 -->
        <AddInfo
            v-if="addVisible"
            :currentObj="currentObj"
            @close="(addVisible = false), getListTree()"
        />
    </div>
</template>

<script>
import AddInfo from "./components/addInfo.vue";
import { listTree,deleteData } from "./api"
export default {
    components:{
        AddInfo
    },
    data() {
        return {
            currentObj:null,
            addVisible:false,
            treeList:[],
            defaultProps:{
                children: 'children',
                label: 'name'
            }
        };
    },
    created(){
        this.getListTree()
    },
    computed:{
        rolesData:()=>{
            let role =  localStorage.getItem('rolesData').split(',')
            return (role.includes('admin') || role.includes('sys_user'))
        },
        secret_adm:()=>{
            let role =  localStorage.getItem('rolesData').split(',')
            return role.includes('secret_adm') 
        }
    },
    methods:{
        getListTree(){
            this.treeList = [];
            listTree().then(res=>{
                if(res.data&&res.data.length>0){
                    this.treeList = res.data;
                }
            })
        },
        // 新增
        addData(){
            this.currentObj = null;
            this.addVisible = true;
        },
        // 编辑
        editData(data){
            this.currentObj = data;
            this.addVisible = true;
        },
        // 删除
        delData(data){
            let str = data.children&&data.children.length>0?'删除该数据的同时会删除所有⼦节点,确定删除该条数据?':'确定删除该条数据?'
            this.$confirm(str, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }).then(async() => {
                const res = await deleteData({id:data.id});
                this.$message.success("删除成功");
                this.getListTree()
            }).catch(() => {});
        },
    }
};
</script>
<style scoped lang="scss">
.cont{
    background: #FFF;
    border-radius: 6px;
    padding: 16px;
}
</style>
