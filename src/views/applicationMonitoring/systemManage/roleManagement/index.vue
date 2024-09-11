<template>
    <div class="role-cont">
        <div class="flex-left">
            <div class="top-title">
                <div class="title">角色管理</div>
                <el-button icon="el-icon-user" v-if="btnData.includes('role-add')" @click="addFun">创建角色</el-button>
            </div>
            <div class="cont">
                <div class="role-item" v-for="(item,index) in dataSource" :key="index" @click="detailFun(item.id)">
                    <div class="role-flex">
                        <div class="role-name">
                            <div>{{ item.nameCh }}</div>
                            <div v-if="item.nameEn" class="mini-title">（{{item.nameEn}}）</div>
                        </div>
                        <div class="edit-btn" v-if="btnData.includes('role-edit')" @click.stop="editFun(item.id)">编辑</div>
                    </div>
                    <div class="role-user">
                        <span>关联用户</span>
                        <span style="margin-left: 20px;">{{ item.accountNum }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex-right">
            <div class="right-cont" v-if="isShow">
                <div class="title">{{ type=='add'?'创建角色' : type=='edit'?'编辑':'查看' }}</div>
                <AddRole v-if="addVisible" :currentId="currentId" :pageType="type" @close="close"/>
            </div>
            <div v-else style="text-align: center;">
                <img src="@/assets/images/brainstorm.png" style="width: 437px;"/>
                <div style="font-size: 16px;">请在左侧栏创建新角色或查看、编辑已有角色</div>
            </div>
        </div>
    </div>
</template>
<script>
import { listData } from "./api"
import AddRole from "./components/addRole.vue"
export default {
    components:{
        AddRole
    },
    data() {
        return {
            type:'view',//新增or编辑
            isShow:false,//是否展示右侧信息
            addVisible:false,
            dataSource:[],
            currentId:'',
            btnData:[],
            btnObjList:[],
        };
    },
    created() {
        this.getBtn();
        this.getTable()
    },
    methods: {
        getBtn(){
            this.btnData = [];
            this.btnObjList = [];
            this.isDetail = false;
            const menuArr = JSON.parse(sessionStorage.getItem('menuTree'));
            let newArr = [];
            this.getbtnList(menuArr);
            this.btnObjList.filter((item,index)=>{
                newArr.push(item.auth)
            })
            this.btnData = newArr;
            console.log(this.btnData)
        },
        getbtnList(data){
            let arr = []
            data.forEach(item=>{
                if(item.path==this.$route.path){
                    arr = item.children.filter((items,ind)=>{
                        return items.type==2
                    })
                    this.btnObjList = arr;
                }else{
                    this.getbtnList(item.children);
                }
            })
        },
        async getTable() {
          this.loading = true;
          listData().then(res=>{
            this.dataSource = res.data&&res.data.length>0?res.data:[];
          }).catch(()=>{
          })
          
        },
        // 创建角色
        addFun(){
            this.addVisible = false;
            setTimeout(()=>{
                this.currentId = "";
                this.isShow = true;
                this.type = 'add';
                this.addVisible = true;
            },100)
        },
        // 编辑
        editFun(Id){
            this.addVisible = false;
            setTimeout(()=>{
                this.isShow = true;
                this.type = 'edit';
                this.currentId = Id
                this.addVisible = true;
            },100)
        },
        // 查看
        detailFun(Id){
            this.addVisible = false;
            setTimeout(()=>{
                this.isShow = true;
                this.type = 'view';
                this.currentId = Id
                this.addVisible = true;
            },100)
        },
        // 
        close(){
            this.currentId = "";
            this.isShow = false;
            this.getTable()
        }
    },
};
</script>
<style scoped lang="scss">
.role-cont{
    display: flex;
    min-height: 100%;
    .title{
        font-size: 20px;
        font-weight: bold;
    }
    .flex-left{
        width: 280px;
        border-radius: 8px;
        background: #fff;
        padding: 16px;
        margin: 0px 10px 0 0;
        flex-shrink: 0;
        .top-title{
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            padding: 5px 10px;
        }
        .cont{
            margin-top: 16px;
            .role-item{
                border: 1px solid #DCDCDC;
                border-radius: 6px;
                padding: 16px;
                margin-bottom: 16px;
            }
            .role-flex{
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .role-name{
                color: rgba(0, 0, 0, 0.90);
                font-size: 16px;
                line-height: 24px;
                flex:1;
                display: flex;
                align-items: center;
                flex-wrap: wrap;
            }
            .mini-title{
                color: rgba(0, 0, 0, 0.30);
                font-size: 14px;
            }
            .edit-btn{
                color: #409EFF;
                cursor: pointer;
                font-size: 14px;
                display: none;
            }
            .role-user{
                color: rgba(0, 0, 0, 0.40);
                line-height: 22px;
                font-size: 14px;
                margin-top: 16px;
            }
            .role-item:hover{
                border: 1px solid #409EFF;
                background: rgba(46, 70, 142, 0.10);
                .edit-btn{
                    display: block;
                }
            }
        }
    }
    .flex-right{
        background: #FFF;
        border-radius: 8px;
        padding: 16px;
        flex: 1;
    }
}
</style>
  