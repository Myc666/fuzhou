<template>
    <div style="width: 100%;height: 100vh;display: flex;align-items: center;justify-content: center;" v-loading="loading">
        <div v-if="errorTip" style="font-size: 18px;">
            <img src="@/assets/images/error-icon.png" style="width: 300px;"/>
            <div style="text-align: center;">{{ errorTip }}</div>
        </div>
    </div>
</template>
<script>
import request from '@/utils/request.js'
import Cookies from "js-cookie";
export default {
    data() {
        return {
            loading:true,
            errorTip:'',
        };
    },
    created() {
        this.loginFun()
    },
    methods: {
        loginFun() {
            let isUser = this.$route.query['iv-user'] || ''
            request.post('/ivLoginUser?ivUser=' + isUser).then(({data}) => {
                this.loading = false;
                Cookies.set(data.tokenName, data.tokenValue);
                this.$store.state.cookies = data.tokenValue;
                this.$router.push({ path: '/bigScreen', query: { type: '1' }});
            }).catch(res=>{
                this.loading = false;
                this.errorTip = res;
            })
        },
    },
};
</script>
<style scoped lang="scss">
</style>
  