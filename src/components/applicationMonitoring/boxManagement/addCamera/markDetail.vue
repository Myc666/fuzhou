<template>
    <div class="flex-sty">
        <div v-if="isShow" class="list-sty">
            <div v-for="(items,ind) in svgList" class="list-item">
                <div class="title" :style="{color:items.dragging?'#2099fa':''}" @click="draggingChange(ind)">区域{{ ind+1 }}</div>
                <div class="del" @click="delFun(ind)">删除</div>
            </div>
        </div>
      <div class="drag-inner" :style="{height:imgHeight?imgHeight:'auto'}">
        <svg class="canvas" @click="draw" @mousemove="mousemoveFun" v-if="dataListAll.length==0">
          <g v-for="(item, index) in svgIndexList" :key="index">
            <polygon
              :points="item.pointText"
              style="
                
                stroke: #1dfff9;
                stroke-width: 2;
              "
              :style="{fill:item.dragging?'rgba(29, 255, 249, 0.4)':'transparent'}"
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
                fill="#ff1d23"
                @click.stop="draggingFun(pointIndex)"
              ></rect>
            </g>
          </g>
        </svg>
        <div v-else >
          <svg class="canvas" v-for="(items,ind) in svgListAll" :key="ind">
          
          <g v-for="(item, index) in items.markPoints" :key="index">
            <text 
            :x=item.pointList[0].x-10
            :y=item.pointList[0].y-10
            :fill=items.color 
            style="font-size: 14px;font-weight: bold;"
            >{{items.name}}</text>
            <polygon
              :points="item.pointText"
              :style="{
                'fill':'rgba('+items.r+','+items.g+','+items.b+',0.5)',
                'stroke': 'rgb('+items.r+','+items.g+','+items.b+')',
                'stroke-width': 2,
              }"
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
        </div>
        
        <img class="bg-img" id="draw_img" draggable="false" ref="draw_img" :src="fileUrl"/>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      fileUrl: {
        type: String,
        default: "",
      },
      dataList: {
        type: Array,
        default: () => [],
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      dataListAll:{
        type:Array,
        default:()=>[],
      },
      nameEn:{
        type:String,
        default:""
      },
      isShow:{
        type:Boolean,
        default:false,
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
        index:null,
        pointIndex:null,
        isTrue:false,
        isDisabled:false,
        svgListAll:[],
        imgWidth: "",
        imgHeight:'',
        svgIndexList:[],
      };
    },
    watch: {
      dataList: {
        immediate: true,
        handler(val) {
          if(val.length>0){
            this.$nextTick(() => {
              this.pointList = [];
              let img = new Image();
              img.src = this.fileUrl;
              img.onload = () => {
                this.imgWidth = img.width;
                setTimeout(() => {
                  this.imgHeight = this.$refs.draw_img.offsetHeight + 'px'
                  const ratio = this.imgWidth/this.$refs.draw_img.offsetWidth;
                  console.log(ratio)
                  this.finish = true;
                  this.svgList = [];
                  this.svgIndexList = [];
                  val.forEach((item) => {
                      let pointText = "";
                      let pointArr = [];
                      console.log(item,"=")
                      item.forEach((i) => {
                        pointArr.push({
                          x: Math.ceil(i.x / ratio),
                          y: Math.ceil(i.y / ratio),
                        })
                        pointText = pointText + ` ${Math.ceil(i.x / ratio)},${Math.ceil(i.y / ratio)}`;
                      });
                      this.svgList.push({
                        pointList: pointArr,
                        pointText: pointText,
                        dragging:false,
                      });
                      this.svgIndexList.push({
                        pointList: pointArr,
                        pointText: pointText,
                        dragging:false,
                      })
                  });
                  if(this.index!=null){
                      this.svgIndexList = [];
                      this.svgList[this.index].dragging = true;
                      this.svgIndexList.push(this.svgList[this.index])
                  }
                }, 50);
              };
            });
          }else{
            this.isDisabled = false;
            this.finish = true;
            this.svgList = [];
          }
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
                  this.imgHeight = this.$refs.draw_img.offsetHeight + 'px'
                  const ratio = this.imgWidth/this.$refs.draw_img.offsetWidth;
                  val.forEach((item) => {
                    let newMarkArr = [];
                    item.markPoints.forEach((items)=>{
                      let arr = [];
                      let pointText = ""
                      items.pointList.forEach((ite)=>{
                        arr.push({
                          x: Math.ceil(ite.x / ratio),
                          y: Math.ceil(ite.y / ratio),
                        })
                        pointText = pointText + ` ${Math.ceil(ite.x / ratio)},${Math.ceil(ite.y / ratio)}`;
                      })
                      newMarkArr.push({
                        pointList:arr,
                        pointText:pointText,
                      })
                    })
                    this.svgListAll.push({
                      b:item.b,
                      r:item.r,
                      g:item.g,
                      color:item.color,
                      markPoints:newMarkArr,
                      name:item.name,
                    })
                  })
                  console.log(this.svgListAll)
                },50)
              }
            })
          }else{
            this.svgListAll = [];
          }
        }
      },
    },
    created(){
      this.isDisabled = this.disabled;
      setTimeout(() => {
        this.imgHeight = this.$refs.draw_img.offsetHeight + 'px'
        if(this.pageType=='add'){
          this.$emit('getHeight',this.$refs.draw_img.offsetHeight)
        }
      },50)
    },
    methods: {
      // 标记
      draw(e) {
        if (this.isDisabled) {
          return
        }
        // if(this.dataList.length > 1){
        //   this.$message.warning("请删除之后再重新绘制");
        //     return
        // }
        if(this.svgList.length-1 >0 && (this.nameEn == "person_tracker" || this.nameEn == 'peopleTrack')){
          if(this.svgList[this.svgList.length-1].pointList.length == 2){
            this.$message.warning("画线只允许画两个点");
            return
          }
        }
        const { offsetX, offsetY } = e;
        const point = [{ x: offsetX, y: offsetY }];
        if (this.finish) {
          this.finish = false;
          this.svgList.push({
            pointList: point,
            pointText: `${point[0].x},${point[0].y}`,
            dragging:false,
          });
          this.svgIndexList.push({
            pointList: point,
            pointText: `${point[0].x},${point[0].y}`,
            dragging:false,
          });
        } else {
            const obj = this.svgList[this.svgList.length - 1];
            obj.pointList.push({ x: offsetX, y: offsetY });
            obj.pointList = obj.pointList.reduce((accumulator, current) => {
                let found = accumulator.find(item => item.x === current.x&&item.y === current.y);
                if (!found) accumulator.push(current);
                return accumulator;
            }, []);
            obj.pointText = obj.pointText + ` ${point[0].x},${point[0].y}`;

            const objIndex = this.svgIndexList[this.svgIndexList.length - 1];
            objIndex.pointList.push({ x: offsetX, y: offsetY });
            objIndex.pointList = objIndex.pointList.reduce((accumulator, current) => {
                let found = accumulator.find(item => item.x === current.x&&item.y === current.y);
                if (!found) accumulator.push(current);
                return accumulator;
            }, []);
            objIndex.pointText = objIndex.pointText + ` ${point[0].x},${point[0].y}`;
        }
        // this.$emit('dataChange',this.svgList)
      },
        // 重新标记
        resetting() {
            this.isDisabled = false;
            this.finish = true;
        },
        // 保存
        save() {
          let ratio = this.scaleRatio();
          let newArr = [];
          this.svgList.forEach((item,ind)=>{
            let newPointList = [];
            // let pointText = ""
            item.pointList.forEach((items,index)=>{
              newPointList.push({
                x:parseInt(items.x * ratio),
                y:parseInt(items.y * ratio),
              })
              // pointText = pointText + ` ${parseInt(items.x * ratio)},${parseInt(items.y *ratio)}`;
            })
            newArr.push({
              pointList:newPointList,
              // pointText:pointText,
            })
          })
          return newArr
        },
        // 清空
        clear() {
            this.svgList = []
        },
        //
        scaleRatio() {
            if(this.$refs.draw_img) {
                let nw = this.$refs.draw_img.naturalWidth
                let ow = this.$refs.draw_img.offsetWidth
                return (ow == 0) ? 0 : (nw / ow)
            }
            return 0;
        },
        draggingChange(index){
            this.isDisabled = true
            this.index = index;
            let newArr = [];
            let ratio = this.scaleRatio();
            this.svgList.map((item,ind)=>{
              let newPointList = [];
              item.pointList.forEach((items,index)=>{
                newPointList.push({
                  x:parseInt(items.x * ratio),
                  y:parseInt(items.y * ratio),
                })
              })
              newArr.push(newPointList)
            })
            this.isTrue = false;
            this.$emit('saveList',newArr)
        },
        draggingFun(pointIndex){
            if(this.svgList[this.index].dragging&&!this.isTrue){
                this.pointIndex = pointIndex;
                this.isTrue = true;
            }else{
                this.isTrue = false;
            }
        },
        mousemoveFun(event){
            if(this.isTrue){
                // 获取鼠标相对于元素的坐标
                const x = event.offsetX;
                const y = event.offsetY;
                this.svgList[this.index].pointList[this.pointIndex].x = x;
                this.svgList[this.index].pointList[this.pointIndex].y = y;
                
                let newArr = [];
                let ratio = this.scaleRatio();
                this.svgList.map((item,ind)=>{
                  let newPointList = [];
                  item.pointList.forEach((items,index)=>{
                    newPointList.push({
                      x:parseInt(items.x * ratio),
                      y:parseInt(items.y * ratio),
                    })
                  })
                  newArr.push(newPointList)
                })
                this.$emit('saveList',newArr)
            }
        },
        // 删除
        delFun(index){
            this.svgList.splice(index, 1)
            if(this.svgList.length==0){
              this.isDisabled = false;
              this.finish = true;
            }
            this.svgIndexList = [];
            this.svgList.map((item)=>{
              item.dragging = false;
              this.svgIndexList.push(item)
            })
        }
    },
  };
  </script>
  <style scoped lang="scss">
  .flex-sty{
    display: flex;
    .list-sty{
        padding-right: 24px;
        width: 120px;
        min-height: 30px;
        .list-item{
            padding: 10px 0px;
            font-size: 16px;
            display: flex;
            align-items: center;
            .title{
                margin-right: 16px;
                cursor: pointer;
            }
            .title:hover{
              color: #2099fa;
            }
            .del{
                color: #EB3A2F;
                cursor: pointer;
                font-size: 14px;
            }
        }
    }
  }
  .drag-inner {
    position: relative;
    // margin: 0 auto;
    // width: 640px;
    //   height: 360px;
    width: 100%;
    flex: 1;
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
  }
  </style>
  