<template>
    <div class="log-info">
        <div v-for="(item,index) in logList" :key="index">
        {{ item }}
        </div>
    </div>
</template>
<script>
import { javaLog } from "@/api/common";
export default {
    data() {
        return {
            logList:[],
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
  