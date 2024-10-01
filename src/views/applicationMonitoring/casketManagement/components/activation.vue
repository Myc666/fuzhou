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

                </el-form-item>
                <el-form-item label="授权码">
                    
                </el-form-item>
                <el-form-item label="当前状态">
                    
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
            ruleForm:{
                sn:"",
            }
        };
    },
    async created(){
        await this.getSn();
    },
    methods:{
        // 获取机器码
        async getSn(){
            let formData = new FormData();
            formData.append("boxId", this.rowId);
            const res = await getSn(formData);
            this.ruleForm.sn = res.data;
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
  