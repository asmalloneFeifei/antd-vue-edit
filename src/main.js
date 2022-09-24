import Vue from 'vue'
import App from './App.vue'

// 新增代码：引入全部组件及样式
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

Vue.config.productionTip = false
Vue.use(Antd)

new Vue({
  render: h => h(App),
}).$mount('#app')
