<template>
    <div class="chart" id="earlyChart"></div>
</template>
<script>
    import * as echarts from "echarts";
    import tdTheme from '@/common/echart/theme.json' // 引入默认主题
    import request from '@/utils/request.js'
    export default {
        data() {
            return {
                cdata: {
                    className: [],
                    data: []
                }
            };
        },
        mounted() {
            echarts.registerTheme('myTheme',tdTheme)
            this.getCountData()
        },
        methods:{
            getCountData() {
                request.get('/statistic/countAlgorithm30Day').then(({data}) => {
                    console.log(data)
                    for(let item of data) {
                        this.cdata.className.push(item.name);
                        this.cdata.data.push(item.count);
                    }
                    setTimeout(()=>{
                        this.getChart()
                    },600)
                })
            },
            getChart(){
                const chartDom = document.getElementById("earlyChart");
                const myChart = echarts.init(chartDom,'myTheme');
                myChart.clear();
                const option = {
                    tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    shadowStyle: {
                        color: '#FFA980',
                        opacity: 0.1
                    }
                },
                confine: true,
                width: "20",
            },
            grid: {
                left: 0,
                right: '10%',
                bottom: '3%',
                top: 0,
                height: 'auto',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01],
                axisTick: { // 去除坐标轴上的刻度线
                    show: false
                },
                splitLine: { // 控制网格线是否显示
                    show: true,
                    lineStyle: { //  改变样式
                        width: '0.2',
                        color: '#507b7d' // 修改网格线颜色
                    }
                },
                axisLine: { // y轴的颜色和宽度
                    show: false,
                    lineStyle: {
                        color: '#cfafff', // y坐标轴的轴线颜色
                    }
                },
                axisLabel: { // x轴的字体样式
                    show: true, //这行代码控制着坐标轴x轴的文字是否显示
                    textStyle: {
                        fontSize: 15, // x轴字体大小
                    },
                }
            },
            yAxis: {
                inverse: true,
                type: 'category',
                data: this.cdata.className,
                formatter: function(value) {
                    if (value.length > 16) {
                        return value.substring(0, 16) + "...";
                    } else {
                        return value;
                    }
                },
                axisTick: { // 去除坐标轴上的刻度线
                    show: false
                },
                splitLine: { // 控制网格线是否显示
                    lineStyle: { //  改变样式
                        width: '0.2',
                        color: '#507b7d' // 修改网格线颜色
                    }
                },
                axisLine: { // y轴的颜色和宽度
                    show: false,
                    lineStyle: {
                        color: '#ca3a40', // y坐标轴的轴线颜色
                    }
                },
                axisLabel: { // x轴的字体样式
                    show: true, //这行代码控制着坐标轴x轴的文字是否显示
                    textStyle: {
                        fontSize: 15, // x轴字体大小
                    },
                    formatter: function(name) {
                        if (name.length > 16) {
                            return name.substring(0, 16) + "...";
                        } else {
                            return name;
                        }
                    },
                }
            },
            series: [{
                showBackground: true,
                type: 'bar',
                data: this.cdata.data,
                itemStyle: {
                    normal: {
                        color: (param)=> {
                            let colorList = [ "#20ddff", "#eeb64d" ];
                            let x = '';
                            param.dataIndex%2 ==0 ? x=1 : x=2;
                            if(x == '1') {
                                return colorList[0];
                            } else {
                                return colorList[1]
                            }
                        },
                        label: {
                            show: true,
                            position: 'right',
                            formatter: (params)=> {
                                for (var i = 0,
                                         l = this.options.series[0].data.length; i < l; i++) {
                                    var val1 = params.value;
                                    return val1;
                                }
                            }
                        }
                    }
                },
                barWidth: 20,
            }]
                };
                myChart.setOption(option);
            }
        }
    };
</script>

<style lang="scss" scoped>
.chart {
        width: 500px;
        height: 326px;
    }
</style>