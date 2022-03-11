import Vue from 'vue'
import App from './App.vue'
import router from './router' // vue-router配置
import store from './store' // vuex配置
import i18n from './locale' // 国际化配置
import filters from './filters' // vue过滤器

import { Button, Select, Option, InputNumber, Input, Slider } from 'element-ui';
Vue.use(Button)
Vue.use(Select)
Vue.use(Option)
Vue.use(InputNumber)
Vue.use(Input)
Vue.use(Slider)

// 自定义的toast（这里仅做示例，需自己根据需求变动）
import Toast from './components/toast/index'
Vue.use(Toast);

Vue.config.productionTip = false

// 如果是非线上环境，加载 VConsole（移动端适用）
// if (process.env.NODE_ENV !== 'production') {
//     var VConsole = require('vconsole/dist/vconsole.min.js');
//     var vConsole = new VConsole();
// }

// 全局过滤器
Object.keys(filters).forEach(filterName => {
    Vue.filter(filterName, filters[filterName])
})

/* eslint-disable no-new */
new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')
