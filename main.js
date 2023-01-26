import App from './App'
import uView from '@/uni_modules/uview-ui'
import {
	getKaoyan_date,
	getSeasonTime
} from 'util/date.js'
import {
	mytoken
} from 'util/token.js'
Vue.prototype.$_tokens = {
	'mytoken': mytoken
}
Vue.prototype.$mydate = {
	'getKaoyan_date': getKaoyan_date,
	'getSeasonTime': getSeasonTime
}
Vue.use(uView)
// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
