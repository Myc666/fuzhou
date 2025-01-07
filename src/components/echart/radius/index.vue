<template>
    <div>
        <Chart :cdata="cdata" />
    </div>
</template>

<script>
    import Chart from './chart.vue';

    export default {
        data() {
            return {
                cdata: {
                    data: [
                        {value:80,name:"工服检测",itemStyle:{color:"#03acd1"}},
                        {value:150,name:"安全帽识别",itemStyle:{color:"#03c781"}},
                        {value:10,name:"叉车识别",itemStyle:{color:"#fc2d8a"}},
                        {value:45,name:"车辆检测",itemStyle:{color:"#96b497"}},
                        {value:150,name:"人脸识别",itemStyle:{color:"#0055ff"}},
                        {value:150,name:"区域入侵",itemStyle:{color:"#ff7708"}},
                        {value:120,name:"人流量检测",itemStyle:{color:"#fc2d8a"}},
                    ],
                }
            };
        },
        components: { Chart },
        mounted() {
        },
    };
</script>

<style lang="scss" scoped>
</style>