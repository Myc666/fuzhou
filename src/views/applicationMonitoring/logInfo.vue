<template>
    <div class="log-info">
        <el-tabs v-model="activeName"  @tab-click="handleClick">
            <el-tab-pane label="jave日志" name="first">
                <div v-for="(item,index) in logList" :key="index">
                    {{ item }}
                </div>
            </el-tab-pane>
            <el-tab-pane label="盒子日志" name="second">
                <div style="text-align: center;">暂无数据</div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import { javaLog } from "@/api/common";
export default {
    data() {
        return {
            logList:[],
            activeName:'first'
        };
    },
    created() {
        this.getLog();
        let that = this;
        this.timer = setInterval(function () {
            that.getLog();
        }, 10000);
    },
    destroyed(){
        clearInterval(this.timer)
        this.timer = "";
    },
    methods: {
        async getLog(){
            const res = await javaLog();
            this.logList = res.data
        },
        handleClick(tab) {
            clearInterval(this.timer)
            this.timer = "";
            if(tab.name == "first"){
                this.getLog();
                let that = this;
                this.timer = setInterval(function () {
                    that.getLog();
                }, 10000);
            }else{

            }
        }
    },
};
</script>
<style scoped lang="scss">
.log-info{
    background: #fff;
    padding: 16px;
    border-radius: 8px;
    font-size: 14px;
    div{
        line-height: 20px;
        word-break: break-all;
        white-space: pre-wrap;
    }
}
</style>