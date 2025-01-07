<template>
    <div>
        <Chart :cdata="cdata" :show="show" />
    </div>
</template>

<script>
    import Chart from './chart.vue';

    export default {
        data() {
            return {
                cdata: {
                    geoCoordMap: {
                        呼号浩特: [111.65, 40.82],
                        郑州: [113.65, 34.76],
                        重庆: [106.54, 29.59],
                        昆明: [102.73, 25.04],
                        乌鲁木齐: [87.68, 43.77],
                    },
                    data: [
                        { name: '呼号浩特', value: 30384 },
                        { name: '郑州', value: 20706 },
                        { name: '重庆', value: 86658 },
                        { name: '昆明', value: 35258 },
                        { name: '乌鲁木齐', value: 41110 },
                    ]
                }
            };
        },
        components: { Chart },
        mounted() {
        },
        props: {
            show: {
                type: Boolean,
                default: false
            },
        },
    };
</script>

<style lang="scss" scoped>
</style>