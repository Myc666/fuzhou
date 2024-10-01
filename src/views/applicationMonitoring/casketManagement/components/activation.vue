<template>
    <div>
        <el-dialog
          :close-on-click-modal="false"
          width="60%"
          top="10vh"
          title="激活"
          :visible.sync="detailVisible"
          @closed="closed"
          append-to-body>
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" size="mini" label-position="left">
                <el-form-item label="机器码">
                    <div style="display: flex;">
                        <div>{{ sn }}</div>
                        <div v-if="sn" style="margin-left: 20px;cursor: pointer;color: #EB3A2F;" @click="copyFun">复制</div>
                    </div>
                </el-form-item>
                <el-form-item label="授权码" v-if="activeType!=1">
                    <div style="display: flex;">
                        <div>
                        <el-input placeholder="请输入内容" v-model="activeCode" clearable></el-input>
                        </div>
                        <div v-if="activeCode" style="margin-left: 20px;cursor: pointer;color: #EB3A2F;" @click="activeFun">激活</div>
                    </div>
                </el-form-item>
                <el-form-item label="当前状态">
                    {{ activeType == 1 ? '已激活' : '未激活' }}
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
  
<script>
import {getSn,getActived,actived} from '@/api/applicationMonitoring/casketManagement'
export default {
    props:{
        rowId:{
            type:String,
            default:''
        }
    },
    data() {
        return {
            detailVisible:true,
            sn:'',
            activeCode:'',
            activeType:''
        };
    },
    async created(){
        await this.getSn();
        await this.getActive()
    },
    methods:{
        // 获取机器码
        async getSn(){
            let formData = new FormData();
            formData.append("boxId", this.rowId);
            const res = await getSn(formData);
            this.sn = res.data;
        },
        // 复制
        copyFun(){
            navigator.clipboard.writeText(this.sn)
        },
        // 获取激活状态
        async getActive(){
            let form = new FormData();
            form.append("boxId", this.rowId);
            const res = await getActived(form);
            this.activeType = res.data;
        },
        // 激活
        async activeFun(){
            let form = new FormData();
            form.append("boxId", this.rowId);
            form.append("activeCode", this.activeCode);
            const res = await actived(form);
            this.activeType = res.data;
        },
        // 关闭弹窗
        closed(){
            this.$emit('close')
        },
    }
};
</script>
<style scoped lang="scss">

</style>
  