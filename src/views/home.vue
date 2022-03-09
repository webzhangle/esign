<template>
  <!-- 示例页面 -->
  <div class="home">
     <el-button type="primary" round class="main-button" style="position: fixed; right: 0; z-index: 999" @click="submit">提交</el-button>
    <div class="show">
      <div class="content">
        <div class="content1" ref="container-parent">
          <div class="container-image" ref="container-image" v-for="(item, index) in images" :key="item">
            <img :src="item" alt="">
          </div>
          <template v-for="item in obj.componentsList">
            <VueDragResize :key="item.id" :isActive="item.isActive"
              :ref="'Drag'+ item.id"
              :x="item.context.position.x"
              :y="item.context.position.y"
              :w="item.context.style.width"
              :h="item.context.style.height"
              :parentH="parentH"
              :minw="10"
              :minh="10" 
              :parentLimitation="true"
              v-on:resizing="resize(item, $event)"
              v-on:dragging="resize(item, $event)"
              @activated="activateEv(item)"
              @deactivated="onDeactivated(item)"
            >
              <img src="../assets/logo.png" v-if="item.componentType === 1" alt="">
              <input v-else-if="item.componentType === 2" type="text" v-model="item.context.fillText" :id="'drag-input' + item.id" :ref="'drag-input' + item.id">
              <span v-else-if="item.componentType === 3" class="time">{{ item.context.fillText }}</span>
            </VueDragResize>
          </template>
        </div>
      </div>
    </div>
    <div class="action">
      <div class="action-item" v-for="item in obj.componentsList" :key="item.id">
        <div v-if="item.componentType === 1">
          <h1>签章</h1>
        </div>
        <div v-if="item.componentType === 2">
          <h1>输入框</h1>
        </div>
        <div v-if="item.componentType === 3">
          <h1>日期</h1>
        </div>
        <template v-if="item.componentType === 2 || item.componentType === 3">
          显示值 <el-input v-model="item.context.fillText" placeholder="显示值"></el-input>
        </template>
        位置X <el-input-number v-model="item.context.position.x" :min="0" :max="1000"></el-input-number>
        位置Y <el-input-number v-model="item.context.position.y" :min="0" :max="10000"></el-input-number>
        宽度W <el-input-number v-model="item.context.style.width" :min="0" :max="1000"></el-input-number>
        高度H <el-input-number v-model="item.context.style.height" :min="0" :max="1000"></el-input-number>
        <br />
        时间格式化<template v-if="item.componentType === 3">
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
      </div>
    </div>
  </div>
</template>

<script>
  import VueDragResize from 'vue-drag-resize';
  export default {
    data() {
      return {
        parentH: 0,
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
        obj: {
          // "templateId": "fake_data",
          // "referenceWidth": 0,
          // "componentsList": [
          //   {
          //     "componentKey": "fake_data",
          //     "areaType": 4,
          //     "componentType": 1, // 1 代表
          //     "isActive": false,
          //     "context": {
          //       "signature": {
          //         "location": "fake_data",
          //         "reason": "fake_data"
          //       },
          //       "fillText": "",
          //       "format": "",
          //       "style": {
          //         "width": 200,
          //         "height": 200,
          //         "fontSize": 43,
          //         "fontColor": {
          //           "red": 17,
          //           "green": 37,
          //           "blue": 0
          //         }
          //       },
          //       "position": {
          //         "x": 0,
          //         "y": 0,
          //         "pageNum": 56
          //       },
          //       "url": "fake_data"
          //     },
          //     "id": "1"
          //   },
          //   {
          //     "componentKey": "fake_data",
          //     "areaType": 4,
          //     "componentType": 2,
          //     "isActive": false,
          //     "context": {
          //       "signature": {
          //         "location": "fake_data",
          //         "reason": "fake_data"
          //       },
          //       "fillText": "",
          //       "format": "",
          //       "style": {
          //         "width": 100,
          //         "height": 20,
          //         "fontSize": 43,
          //         "fontColor": {
          //           "red": 17,
          //           "green": 37,
          //           "blue": 0
          //         }
          //       },
          //       "position": {
          //         "x": 0,
          //         "y": 0,
          //         "pageNum": 56
          //       },
          //       "url": "fake_data"
          //     },
          //     "id": "2"
          //   },
          //   {
          //     "componentKey": "fake_data",
          //     "areaType": 4,
          //     "componentType": 3,
          //     "isActive": false,
          //     "context": {
          //       "signature": {
          //         "location": "fake_data",
          //         "reason": "fake_data"
          //       },
          //       "fillText": "2022-03-08",
          //       "format": "",
          //       "style": {
          //         "width": 100,
          //         "height": 20,
          //         "fontSize": 43,
          //         "fontColor": {
          //           "red": 17,
          //           "green": 37,
          //           "blue": 0
          //         }
          //       },
          //       "position": {
          //         "x": 0,
          //         "y": 0,
          //         "pageNum": 56
          //       },
          //       "url": "fake_data"
          //     },
          //     "id": "3"
          //   }
          // ],
        }
      }
    },
    components: {
      VueDragResize
    },
    mounted() {
      let { width } = this.$refs['container-parent'].getBoundingClientRect()
      this.obj = JSON.parse(window.localStorage.getItem('obj'))
      let ratio = parseFloat((width / this.obj.referenceWidth).toFixed(6))
      this.obj.componentsList.map(item => {
        item.context.style.width = item.context.style.width * ratio
        item.context.style.height = item.context.style.height * ratio
        item.context.position.x = item.context.position.x * ratio
        item.context.position.y = item.context.position.y * ratio
      })
      setTimeout(() => {
        this.parentH = 3300
      }, 500)
    },
    methods: {
      changePosition (value) {
        console.log(value)
      },
      submit() {
        let { width } = this.$refs['container-parent'].getBoundingClientRect()
        this.obj.referenceWidth = parseFloat(width.toFixed(6))
        window.localStorage.setItem('obj', JSON.stringify(this.obj))
      },
      resize(item, $event) {
        // item.context.style.width = $event.width;
        // item.context.style.height = $event.height;
        // item.context.position.y = $event.top;
        // item.context.position.x = $event.left;
        let { width, height, left, top } = this.$refs['Drag' + item.id][0]
        item.context.style.width = parseFloat(width.toFixed(6));
        item.context.style.height = parseFloat(height.toFixed(6));
        item.context.position.y = parseFloat(top.toFixed(6));
        item.context.position.x = parseFloat(left.toFixed(6));
      },
      activateEv(item) {
        let { id, componentType } = item
        this.obj.componentsList.map(item => {
          item.isActive = false
        })
        item.isActive = !item.isActive
        if (componentType === 2) this.$refs['drag-input' + id][0].focus();
      },
      onDeactivated(item) {
        let { id, componentType } = item
        if (componentType === 2) this.$refs['drag-input' + id] && this.$refs['drag-input' + id][0].blur();
      },
      mousedown(e){
        console.log(e)
        e.stopPropagation()
      },
      mouseup(e){
        e.stopPropagation()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/iconfont/iconfont.css";
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
      .content {
        position: relative;
        width: 80%;
        height: 100%;
        margin: 0 auto;
        .content1 {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: auto;
          box-shadow: 0 4px 8px #ccc;
        }
        .container-image {
          padding-bottom: 8px;
          background: #ededed;
        }
      }
    }
    .action {
      width: 50%;
      height: 100%;
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
