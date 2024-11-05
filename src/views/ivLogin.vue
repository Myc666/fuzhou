<template>
    <div style="width: 100%;height: 100vh;" v-loading="loading">
        
    </div>
</template>
<script>
import request from '@/utils/request.js'
import Cookies from "js-cookie";
export default {
    data() {
        return {
            loading:true,
        };
    },
    created() {
        this.loginFun()
    },
    methods: {
        loginFun() {
            let isUser = this.$route.query.ivUser || ''
            request.post('/ivLoginUser?ivUser=' + isUser).then(({data}) => {
                Cookies.set(data.tokenName, data.tokenValue);
                this.$store.state.cookies = data.tokenValue;
                this.$router.push({ path: '/bigScreen', query: { type: '1' }});
            })
        },
    },
};
</script>
<style scoped lang="scss">
</style>
  