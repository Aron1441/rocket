import './assets/main.css'
import 'ant-design-vue/dist/reset.css';
import * as Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Antd from 'ant-design-vue';


import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(Antd)
app.use(VueAxios, axios)
app.use(router)

app.mount('#app')
