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
            let iamCode = this.$route.query['iamCode'] || ''
            request.post('/loginByIamCode?iamCode=' + iamCode).then(({data}) => {
                if(data.retCode == 100) {
                    window.location.href = data.retUrl;
                } else {
                    this.loading = false;
                    Cookies.set(data.retData.tokenName, data.retData.tokenValue);
                    localStorage.setItem("nickname", data.retData.name);
                    this.$store.state.cookies = data.retData.tokenValue;
                    this.$router.push({ path: '/bigScreen', query: { type: '0' }});
                }
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
  