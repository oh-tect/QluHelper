<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "@/uni_modules/uview-ui/index.scss";
</style>
<script>
	export default {
		globalData: {
			isLogin: 0,
			version: 'alpha 0.0.1',
			notification: 0,
			//开学日期
			start_date: '2022-8-22',
			weather_data: [],
			weather: [],
			high: [],
			low: [],
			code: [],
			saying: '',
			author: '',
			origin: '',
			//选中日期
			date: '2022-11-22',
			//选中日期是第几周
			week: '',
			//选中日期是星期几
			day: '',
			//保存课程的list
			classes: [],
			username: '',
			token: '',
			//学期是否结束
			isEnd: Boolean,
			hasClass: Boolean,
		},

		onLaunch: function() {
			console.log('App Launch');
			uni.hideTabBar();
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
