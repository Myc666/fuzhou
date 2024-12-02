<template>
    <div>
        <el-dialog
          :close-on-click-modal="false"
          width="60%"
          top="10vh"
          title="详情"
          :visible.sync="detailVisible"
          @closed="closed"
          append-to-body>
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" size="mini" label-position="left">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="计算设备名称">{{ ruleForm.name }}</el-form-item>
                        <el-form-item label="ip地址">{{ ruleForm.ipAddr }}</el-form-item>
                        <el-form-item label="CPU型号">{{ ruleForm.cpuVersion }}</el-form-item>
                        <el-form-item label="磁盘容量">{{ ruleForm.diskTotal }}</el-form-item>
                        <el-form-item label="制造商">{{ ruleForm.makers }}</el-form-item>
                        <el-form-item label="驱动版本">{{ ruleForm.lyndriverVersion }}</el-form-item>
                        <el-form-item label="在线状态">{{ ruleForm.online==0?"离线":ruleForm.online==1?"在线":"" }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="盒子编号">{{ ruleForm.boxNo }}</el-form-item>
                        <el-form-item label="内核版本">{{ ruleForm.kernelVersion }}</el-form-item>
                        <el-form-item label="操作系统版本">{{ ruleForm.osVersion }}</el-form-item>
                        <el-form-item label="内存容量">{{ ruleForm.memoryTotal }}</el-form-item>
                        <el-form-item label="设备模式">{{ ruleForm.deviceMode }}</el-form-item>
                        <el-form-item label="SDK版本">{{ ruleForm.lynsdkVersion }}</el-form-item>
                        <el-form-item label="最后心跳时间">{{ getMyDate(Number(ruleForm.boxHeartTime)) }}</el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
    </div>
</template>
  
<script>
import {detail} from '@/api/applicationMonitoring/casketManagement'
import { getMyDate } from '@/utils/common.js'
export default {
    props:{
        rowId:{
            type:String,
            default:''
        }
    },
    data() {
        return {
            ruleForm:{},
            detailVisible:true,
            getMyDate:getMyDate
        };
    },
    created(){
        this.getData()
    },
    methods:{
        // 获取数据
        async getData(){
            const { data } = await detail({id:this.rowId})
            this.ruleForm = {...data}
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
  