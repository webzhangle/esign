<template>
  <!-- 示例页面 -->
  <div class="home">
    <el-button type="primary" round class="main-button" style="position: fixed; right: 0; z-index: 999" @click="submit">提交</el-button>
    <div class="show">
      <div class="content" ref="container-parent">
        <div class="container-image" :scale="scale" :ref="'container-image' + index" v-for="(page, index) in pagesConfig" :key="index" @drop="drop($event, page, index)" @dragover="dragover">
          <img :src="page.imageUrl" alt="">
          <template v-for="item in page.configs">
            <VueDragResize :key="item.id" :isActive="item.isActive"
              :ref="'Drag'+ item.id"
              :x="item.context.position.x"
              :y="item.context.position.y"
              :w="item.context.style.width"
              :h="item.context.style.height"
              :minw="10"
              :minh="10"
              :parentH="page.parentLimitH"
              :parentLimitation="true"
              :preventActiveBehavior="true"
              :sticks="setSticks(item.componentType)"
              v-on:resizing="resize(item, $event)"
              v-on:dragging="resize(item, $event)"
              @activated="activateEv(item)"
              @deactivated="onDeactivated(item)"
              @clicked="clicked(page, item)"
            >
              <!-- <img src="../assets/logo.png" v-if="item.componentType === 1" alt="">
              <img src="../assets/logo.png" v-else-if="item.componentType === 2" alt=""> -->
              <!-- <input v-else-if="item.componentType === 3" type="text" v-model="item.context.fillText" :id="'drag-input' + item.id" :ref="'drag-input' + item.id"> -->
              <span v-if="item.componentType === 3" class="time">{{ item.context.fillText }}</span>
              <span v-else-if="item.componentType === 4" class="time">{{ item.context.fillText }}</span>
            </VueDragResize>
          </template>
        </div>
      </div>
    </div>
    <div class="action">
      拖拽你想要的组件
      <ul class="fieldTypes">
        <!-- <li v-for="item in fieldTypes" :key="item.value" draggable="true" @dragstart="dragstart($event, item)" > -->
          <li v-for="item in fieldTypes" :key="item.value" draggable="true" @mousedown="mousedown($event, item)">
          <span class="iconfont" :class="item.icon"></span>
        </li>
      </ul>
      <template v-for="(page, pageIndex) in pagesConfig">
        <div class="action-item" :key="pageIndex" v-show="page.show">
          <template v-for="(item, index) in page.configs">
            <div :key="item.id" v-show="item.show">
              <h1>组件名称</h1>
              <template v-if="item.componentType === 3 || item.componentType === 4">
                显示值 <el-input v-model="item.context.fillText" placeholder="显示值"></el-input>
              </template>
              位置X <el-input-number v-model="item.context.position.x" :min="0" :max="1000"></el-input-number>
              位置Y <el-input-number v-model="item.context.position.y" :min="0" :max="10000"></el-input-number>
              宽度W <el-input-number v-model="item.context.style.width" :min="0" :max="1000"></el-input-number>
              高度H <el-input-number v-model="item.context.style.height" :min="0" :max="1000"></el-input-number>
              <br />
              时间格式化
              <template v-if="item.componentType === 4">
                <div>
                  <el-select v-model="item.context.format" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </template>
              <el-button type="danger" round @click="deleteItem(page, index)">删除</el-button>
            </div>
          </template>
        </div>
      </template>
      <div class="width: 80%: margin: 0 auto;">
        <el-slider v-model="scale" :min="0" :max="3" :step="0.01" :format-tooltip="formatTooltip" @change="scaleChange"></el-slider>
      </div>
    </div>
    <div id="moveChunk" class="moveChunk"></div>
  </div>
</template>

<script>
  import VueDragResize from 'vue-drag-resize';
  import fieldTypes from '@config/fieldTypes'
  import { generateUUID, offsetTop, offsetLeft } from '@common/utils'
  export default {
    data() {
      return {
        fieldTypes,
        scale: 1,
        images: [require('../assets/images/1.jpg'),require('../assets/images/2.jpg'),require('../assets/images/3.jpg'),require('../assets/images/4.jpg')],
        options: [
          {
            value: '格式化时间1',
            label: '格式化时间1'
          },
          {
            value: '格式化时间2',
            label: '格式化时间2'
          },
          {
            value: '格式化时间3',
            label: '格式化时间3'
          }
        ],
        pagesConfig: []
      }
    },
    components: {
      VueDragResize
    },
    mounted() {
      let { width } = this.$refs['container-parent'].getBoundingClientRect()
      console.log(width)
      // setTimeout(() => {
        let pagesConfig = [
          {
            imageUrl: require('../assets/images/1.jpg'),
            width: 2480,
            height: 3509,
            parentLimitW: width,
            parentLimitH: 0,
            show: false,
            configs: []
          },
          {
            imageUrl: require('../assets/images/2.jpg'),
            width: 2480,
            height: 3509,
            parentLimitW: width,
            parentLimitH: 0,
            show: false,
            configs: []
          },
          {
            imageUrl: require('../assets/images/3.jpg'),
            width: 2480,
            height: 3509,
            parentLimitW: width,
            parentLimitH: 0,
            show: false,
            configs: []
          },
          {
            imageUrl: require('../assets/images/4.jpg'),
            width: 2480,
            height: 3509,
            parentLimitW: width,
            parentLimitH: 0,
            show: false,
            configs: []
          }
        ]
        if (window.localStorage.getItem('pagesConfig')) {
          pagesConfig = JSON.parse(window.localStorage.getItem('pagesConfig'))
          let ratio = parseFloat((width / pagesConfig[0].width).toFixed(6))
          pagesConfig.map(page => {
            page.parentLimitH = page.height * ratio // 因为图片加载的速度问题
            page.configs.map(item => {
            item.context.style.width = item.context.style.width * ratio
            item.context.style.height = item.context.style.height * ratio
            item.context.position.x = item.context.position.x * ratio
            item.context.position.y = item.context.position.y * ratio
            })
          })
        }
        this.pagesConfig = JSON.parse(JSON.stringify(pagesConfig))
      // }, 1000)
    },
    methods: {
      scaleChange () {

      },
      formatTooltip(val) {
        return val;
      },
      setSticks (type) {
        let sticks = []
        switch (type) {
          case 1:
            sticks = ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml']
            break
          case 2:
            sticks = ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml']
            break
          case 3:
            sticks = ['mr']
            break
          case 4:
            sticks = ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml']
            break
          case 5:
            sticks = []
            break
        }
        return sticks
      },
      mousedown (e, item) {
        e.stopPropagation()
        let width = item.width * this.scale
        let height = item.height * this.scale
        let moveChunk = document.getElementById('moveChunk')
        let that = this
        var { clientX, clientY } = e
        moveChunk.style.display = 'block'
        moveChunk.style.width = width + 'px'
        moveChunk.style.height = height + 'px'
        moveChunk.style.left = (clientX - width/2) + 'PX'
        moveChunk.style.top = (clientY - height/2) + 'PX'
        document.body.onmousemove = function (e) {
          e.preventDefault()
          let { clientX, clientY } = e;
          moveChunk.style.left = (clientX - width/2) + 'PX'
          moveChunk.style.top = (clientY - height/2) + 'PX'
        }
        document.body.onmouseup = function (e) {
          e.preventDefault()
          // 获取最新的分页坐标
          var coordinate = {}
          that.pagesConfig.map((key, index) => {
            let ref = `container-image${index}`
            let { left, right, top, bottom } = that.$refs[ref][0].getBoundingClientRect();
            coordinate[index+1] = {
              axisX: [left, right],
              axisY: [top, bottom]
            }
          })
          let { clientX, clientY } = e;
          let pageNum
          for (let key in coordinate) {
            let obj = coordinate[key]
            if (clientX > obj.axisX[0] && clientX < obj.axisX[1] && clientY > obj.axisY[0] && clientY < obj.axisY[1]) {
              pageNum = key
              break
            }
          }
          if (pageNum) {
            let index = pageNum - 1
            // 重置为false
            that.pagesConfig.map((i) => {
              i.show = false
            })
            that.pagesConfig[index].show = true
            that.pagesConfig[index].configs.map(config => {
              config.show = false
              config.isActive = false
            })
            that.pagesConfig[index].configs.push({
              "componentKey": "",
              "areaType": 4,
              "componentType": 1,
              "isActive": true,
              "show": true,
              "context": {
                "signature": {
                  "location": "",
                  "reason": ""
                },
                "fillText": "",
                "format": "",
                "style": {
                  "width": width,
                  "height": height,
                  "lineHeight": height,
                  "fontSize": 43,
                  "fontWeight": 'normal',
                  "textAlign": 'left',
                  "fontStyle": 'normal',
                  "fontColor": {
                    "red": 17,
                    "green": 37,
                    "blue": 0
                  }
                },
                "position": {
                  "x": clientX - coordinate[pageNum].axisX[0] - width/2,
                  "y": clientY - coordinate[pageNum].axisY[0] - height/2,
                  "pageNum": pageNum
                },
                "url": ""
              },
              "id": generateUUID()
            })
          }
          moveChunk.style.display = 'none'
          document.body.onmouseup = null
          document.body.onmousemove = null
        }
      },
      deleteItem(page, index) {
        page.configs.splice(index, 1)
      },
      drop() {
        drop
      },
      // drop (e, pageItem, index) {
      //   e.preventDefault(); // 拖动的默认处理方式是新窗口打开，故阻止之。
      //   if (!e.dataTransfer.getData('item')) return
      //   let data = JSON.parse(e.dataTransfer.getData('item'))
      //   let pageNum = index + 1
      //   let width,height
      //   switch (data.value) {
      //     case 1: // 签章
      //         width = 100
      //         height = 100
      //       break
      //     case 2:
      //         width = 100
      //         height = 100
      //       break
      //     case 3:
      //         width = 50
      //         height = 30
      //       break
      //     case 4:
      //         width = 50
      //         height = 30
      //       break
      //   }
      //   // 重置为false
      //   this.pagesConfig.map((i) => {
      //     i.show = false
      //   })
      //   pageItem.show = true
      //   pageItem.configs.map(config => {
      //     config.show = false
      //     config.isActive = false
      //   })
      //   pageItem.configs.push({
      //     "componentKey": "",
      //     "areaType": 4,
      //     "componentType": data.value,
      //     "isActive": true,
      //     "show": true,
      //     "context": {
      //       "signature": {
      //         "location": "",
      //         "reason": ""
      //       },
      //       "fillText": "",
      //       "format": "",
      //       "style": {
      //         "width": width,
      //         "height": height,
      //         "fontSize": 43,
      //         "fontColor": {
      //           "red": 17,
      //           "green": 37,
      //           "blue": 0
      //         }
      //       },
      //       "position": {
              
      //         "x": e.offsetX,
      //         "y": e.offsetY,
      //         "pageNum": pageNum
      //       },
      //       "url": ""
      //     },
      //     "id": generateUUID()
      //   })
      // },
      dragover (e) {
        e.preventDefault();
      },
      dragstart (e, item) {
        e.dataTransfer.setData('item', JSON.stringify(item))
      },
      submit() {
        let { width } = this.$refs['container-parent'].getBoundingClientRect()
        let ratio = parseFloat((this.pagesConfig[0].width).toFixed(6)/width)
        let pagesConfig = JSON.parse(JSON.stringify(this.pagesConfig))
        pagesConfig.map(page => {
          page.configs.map(item => {
            item.context.style.width = item.context.style.width * ratio
            item.context.style.height = item.context.style.height * ratio
            item.context.position.x = item.context.position.x * ratio
            item.context.position.y = item.context.position.y * ratio
          })
        })
        window.localStorage.setItem('pagesConfig', JSON.stringify(pagesConfig))
        this.$router.push({
          path: '/preview'
        })
      },
      resize(item, $event) {
        item.context.style.width = $event.width;
        item.context.style.height = $event.height;
        item.context.position.y = $event.top;
        item.context.position.x = $event.left;
        console.log($event.top)
        // let { width, height, left, top } = this.$refs['Drag' + item.id][0]
        // item.context.style.width = parseFloat(width.toFixed(6));
        // item.context.style.height = parseFloat(height.toFixed(6));
        // item.context.position.y = parseFloat(top.toFixed(6));
        // item.context.position.x = parseFloat(left.toFixed(6));
        // console.log(top)
      },
      clicked (page, item) {
        this.pagesConfig.map(i => {
          i.show = false
        })
        page.configs.map(j => {
          j.show = false
          j.isActive = false
        })
        page.show = true
        item.show = true
        item.isActive = true
      },
      activateEv(item) {
        // let { id, componentType } = item
        // this.obj.componentsList.map(item => {
        //   item.isActive = false
        // })
        // item.isActive = !item.isActive
        // if (componentType === 2) this.$refs['drag-input' + id][0].focus();
      },
      onDeactivated(item) {
        // let { id, componentType } = item
        // if (componentType === 2) this.$refs['drag-input' + id] && this.$refs['drag-input' + id][0].blur();
      },
      mouseup(e){
        e.stopPropagation()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/iconfont/iconfont.css";
  .moveChunk {
    position: fixed;
    background: #000;
    display: none;
  }
  img {
    width: 100%;
    height: 100%;
  }
  input {
    width: 100%;
    height: 100%;
    border: 0;
    outline: none;
  }
  .home {
    display: flex;
    line-height: 1.2;
    width: 100vw;
    height: 100vh;
    // background: url(~@assets/logo.png) no-repeat center; /*css使用alias示例*/
    .show {
      width: 50%;
      height: 100%;
      overflow: auto;
      .content {
        width: 80%;
        margin: 0 auto;
        background: #dedede;
        box-shadow: 0 4px 8px #ccc;
        .container-image {
          margin-bottom: 8px;
          position: relative;
        }
      }
    }
    .action {
      width: 50%;
      height: 100%;
      .fieldTypes {
        display: flex;
        justify-content: center;
        align-items: center;
        li {
          width: 100px;
          height: 100px;
          text-align: center;
          line-height: 100px;
          border: 1px solid #dedede;
          margin-right: 15px;
          span {
            cursor: pointer;
            font-size: 24px;
          }
        }
      }
      .action-item {
        border-bottom: 1px solid;
        padding: 15px;
        h1 {
          font-weight: bold;
          font-size: 24px;
        }
      }
    }
  }
  @media screen and (max-width: 992px) {
    .show {
      width: 100%!important;
    }
    .action {
      display: none;
    }
  }
</style>
