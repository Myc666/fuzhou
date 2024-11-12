<template>
    <div class="chart" id="pireChart"></div>
</template>
<script>
    import * as echarts from "echarts";
    import tdTheme from '@/common/echart/theme.json' // 引入默认主题
    export default {
        data() {
            return {
                cdata: {
                }
            };
        },
        props: {
            pireArr: {
                type: Array,
                default: function() {
                    return [];
                }
            },
        },
        mounted() {
            echarts.registerTheme('myTheme',tdTheme)
            this.getChart()
        },
        methods:{
            getChart(){
                
                const chartDom = document.getElementById("pireChart");
                const myChart = echarts.init(chartDom,'myTheme');
                myChart.clear();
                const option = {
                    legend: {
                        orient: 'vertical',
                        align: "left",
                        icon: "circle",
                        x: 'right',      //可设定图例在左、右、居中
                        y: 'top',     //可设定图例在上、下、居中
                        left:'65%',
                        itemGap: 8,
                    },
                    toolbox: {
                        show: true,
                    },
                    series: [
                        {
                            name: 'Nightingale Chart',
                            type: 'pie',
                            radius: [30, 80],
                            center: ['30%', '50%'],
                            roseType: 'area',
                            itemStyle: {
                                borderRadius: 8
                            },
                            data: this.pireArr,
                            label: {
                            formatter: (e) => {
                                let newStr = " "
                                const name_len = e.data.name.length //每个内容名称的长度
                                if(name_len>6){
                                newStr = e.data.name.slice(0, 6) + '...'
                                }else{
                                newStr = e.data.name
                                }
                                return newStr 
                            },
                        }
                        }
                    ]
        
                };
                myChart.setOption(option);
            }
        }
    };
</script>

<style lang="scss" scoped>
.chart {
        width: 100%;
        height: 230px;
    }
</style>