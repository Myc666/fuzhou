<template>
    <div class="flex-sty">
      <div class="drag-inner" >
          <svg class="canvas" v-for="(items,ind) in svgListAll" :key="ind">
          
          <g v-for="(item, index) in items.markPoints" :key="index">
            <polygon
              :points="item.pointText"
              style="
                
                stroke: #1dfff9;
                fill:rgba(29, 255, 249, 0.4);
                stroke-width: 2;
              "
            />
            <g
              v-for="(pointItem, pointIndex) in item.pointList"
              :key="pointIndex"
            >
              <rect
                :x="pointItem.x - 3"
                :y="pointItem.y - 3"
                width="6"
                height="6"
                fill='#ff1d23'
              ></rect>
            </g>
          </g>
        </svg>
        <div v-for="(item, index) in pointList" :key="index"
            class="xbox"
            :style="{
            width: item.width,
            height: item.height,
            left: item.left,
            top: item.top,
          }">
            <div v-if="pageType=='detail'">
                <div class="text" v-if="!item.isShow">
                    <span style="margin-right: 5px;">{{ item.type }}</span>
                    <span>{{ item.confidence }}</span>
                </div>
                <div v-else class="text_P" :style="{'width':item.txt_width}">
                    <div class="textA">
                        <span style="margin-right: 5px;">{{ item.type }}</span>
                        <span>{{ item.confidence }}</span>
                    </div>
                </div>
            </div>
          </div>
          <img style="width: 100%;" :id="'draw_img'+Index" draggable="false" :ref="'draw_img'+Index" :src="fileUrl"/>
        </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
        Index:{
            type:Number,
            default:0
        },  
        fileUrl: {
            type: String,
            default: "",
        },
        dataListAll:{
            type:Array,
            default:()=>[],
        },
        dataList:{
            type:Array,
            default:()=>[],
        },
        ratio: {
            type: Number,
            default: 0.5,
        },
        pageType:{
            type:String,
            default:''
        }
    },
    data() {
      return {
        svgList: [],
        pointCount: 0,
        pointList: [],
        finish: true,
        pointIndex:null,
        isTrue:false,
        isDisabled:true,
        svgListAll:[],
        imgWidth: "",
        imgHeight:'',
        svgIndexList:[],
      };
    },
    watch: {
        dataList: {
            immediate: true,
            deep: true,
            handler(val) {
                this.$nextTick(() => {
                this.pointList = [];
                let img = new Image();
                img.src = this.fileUrl;
                if (!this.fileUrl) {
                    return
                }
                img.onload = () => {
                    let height = img.height;
                    setTimeout(() => {
                    const ratio = this.$refs['draw_img'+this.Index].offsetHeight / height;
                    val.forEach((item,index) => {
                        let width = (item.position[2] - item.position[0]) * ratio * this.ratio
                        // 创建临时元素
                        const _span = document.createElement('span')
                        // 放入文本
                        _span.innerText = item.type+parseFloat(item.confidence).toFixed(2)
                        // 设置文字大小
                        _span.style.fontSize ='12px'
                        // span放入body中
                        document.body.appendChild(_span)
                        // 获取span的宽度
                        let txt_width = _span.offsetWidth + 18
                        // 从body中删除该span
                        document.body.removeChild(_span)
                        if(item.position[3] >height){
                          item.position[3] = height - 10
                        }
                        if(item.position[1] >height){
                          item.position[1] = height - 10
                        }
                        this.pointList.push({
                            left: (item.position[0] * ratio * this.ratio) + "px",
                            top: (item.position[1] * ratio * this.ratio) + "px",
                            width: ((item.position[2] - item.position[0]) * ratio * this.ratio) + "px",
                            height: ((item.position[3] - item.position[1]) * ratio * this.ratio) + "px",
                            txt_width: (txt_width+3) + 'px',
                            confidence: parseFloat(item.confidence).toFixed(2),
                            type:item.type,
                            isShow: (txt_width > width) ? true : false
                        });
                    });
                    }, 100);
                };
                });
            },
        },
        dataListAll:{
            immediate: true,
            handler(val) {
                if(val.length>0){
                    this.svgListAll = [];
                    this.$nextTick(() => {
                    this.pointList = [];
                    let img = new Image();
                    img.src = this.fileUrl;
                    img.onload = () => {
                        this.imgWidth = img.width;
                        setTimeout(() => {
                           
                        const ratio = this.imgWidth/this.$refs['draw_img'+this.Index].offsetWidth;
                        val.forEach((item) => {
                            let newMarkArr = [];
                            item.markPoints.forEach((items)=>{
                            let arr = [];
                            let pointText = ""
                            items.pointList.forEach((ite)=>{
                                arr.push({
                                    x: Math.ceil((ite.x / ratio)*this.ratio),
                                    y: Math.ceil((ite.y / ratio)*this.ratio),
                                })
                                pointText = pointText + ` ${Math.ceil((ite.x / ratio)*this.ratio)},${Math.ceil((ite.y / ratio)*this.ratio)}`;
                            })
                            newMarkArr.push({
                                pointList:arr,
                                pointText:pointText,
                            })
                            })
                            this.svgListAll.push({
                            markPoints:newMarkArr,
                            })
                        })
                        },100)
                    }
                    })
                }else{
                    this.svgListAll = [];
                }
            }
        },
    },
    created(){
      setTimeout(() => {
        this.imgHeight = this.$refs['draw_img'+this.Index].offsetHeight + 'px'
      },50)
    },
    methods: {
        
    }
  };
  </script>
  <style scoped lang="scss">
  .drag-inner {
    position: relative;
    // margin: 0 auto;
    // width: 640px;
    //   height: 360px;
    width: 100%;
    .canvas {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      right: 0;
      z-index: 2;
    }
    .bg-img {
        width: 100%;
      // width: 640px;
    //   height: 360px;
      // display: block;
    }
    .xbox {
        position: absolute;
        border: 2px solid #f43838;
        background-color: rgba(255, 0, 0, 0.2);
        font-size: 12px;
        color: #1e9fff;
        z-index: 2;
        .text {
      width: 100%;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      color: #fff;
      background-color: rgba(255, 0, 0, 0.4);
      padding: 0 5px;
    }
    .textA{
      line-height: 20px;
      font-size: 12px;
      color: #fff;
      background-color: rgba(255, 0, 0, 0.4);
      padding: 0 5px;
    }
    .text_P{
      position: absolute;
      top: -20px;
      // left: -2px;
      right: -2px;
    }
    }
  }
  
  </style>
  