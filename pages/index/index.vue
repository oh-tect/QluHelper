<template>
	<view>
		<!-- <image class="logo" src="/static/logo.png"></image> -->
		<u-tabbar :value="value1" @change="change1" :fixed="true" :placeholder="false" :safeAreaInsetBottom="false">
			<u-tabbar-item text="首页" icon="home" @click="click1"></u-tabbar-item>
			<u-tabbar-item text="功能" icon="photo" @click="click1"></u-tabbar-item>
			<u-tabbar-item text="我的" icon="account" @click="click1"></u-tabbar-item>
		</u-tabbar>
		<uni-card>
			<template v-slot:title>
				<uni-list>
					<uni-section title="考研倒计时" type="line"></uni-section>
				</uni-list>
			</template>
			<view class="kaoyan_text">
				距离2023年考研还有:
			</view>

			<!-- 24 * 60 * 60 * 1000 * 365 24924673000-->
			<view class="countdown">
				<u-count-down :time="getDate" format="DD:HH:mm:ss" autoStart millisecond @change="onChange">
					<view class="time">
						<view class="time_custom">
							<text class="time__item">{{ timeData.days }}</text>
						</view>
						<text class="time_text">天</text>
						<view class="time_custom">
							<text class="time__item">{{timeData.hours>10?timeData.hours:'0'+timeData.hours}}</text>
						</view>
						<text class="time_text">时</text>
						<view class="time_custom">
							<text class="time__item">{{timeData.minutes}}</text>
						</view>
						<text class="time_text">分</text>
						<view class="time_custom">
							<text class="time__item">{{timeData.seconds}}</text>
						</view>
						<text class="time_text">秒</text>
					</view>
				</u-count-down>
			</view>
		</uni-card>
		<view class="saying">
			<uni-card>
				<template v-slot:title>
					<uni-list>
						<uni-section title="呵呵哒" type="line"></uni-section>
					</uni-list>
				</template>
				<view class="saying">
					<text>{{saying}}</text>
				</view>
			</uni-card>
		</view>

		<view class="weather">
			<uni-card>
				<template v-slot:title>
					<uni-list>
						<uni-section title="今明天气" type="line"></uni-section>
					</uni-list>
				</template>
				<view class="split">
					<view class="item">
						<view class="icon_class">
							<image :src="bindIcon(code[0])" style="width: 30px; height: 30px;"></image>
						</view>

						<view class="weather_text">
							<text>{{weather[0]}}</text>
							<text>\n{{low[0]}}℃</text>
							至
							<text>{{high[0]}}℃</text>
						</view>
					</view>
					<view class='item'>
						<view class="icon_class">
							<image :src="bindIcon(code[1])" style="width: 30px; height: 30px;"></image>
						</view>
						<view class="weather_text">
							<text>{{weather[1]}}</text>
							<text space="nbsp" decode="true">\n{{low[1]}}℃ &nbsp;</text>
							至
							<text space="nbsp" decode="true">{{high[1]}}℃ </text>
						</view>
					</view>
				</view>
			</uni-card>
		</view>
	</view>
</template>

<script>
	// import {
	// 	getKaoyan_date
	// } from "../../util/date.js";
	export default {
		data() {
			return {
				title: '测试',
				value1: 0,
				timeData: {},
				saying: '',
				weather: [],
				high: [],
				low: [],
				code: [],
				weather_data: [],
				getDate: ''
			}
		},
		onLoad() {
			console.log(getApp().globalData.isLogin);
			this.getDate = this.$mydate.getKaoyan_date('2023');
			this.saying = '加载中...';
			new Promise((resolve, reject) => {
				uni.request({
					url: 'https://api.uixsj.cn/hitokoto/get',
					method: 'GET',
					success: (e) => {
						resolve(e);
					},
					fail: () => {
						this.saying = '请求错误，请稍后再试。';
						reject();
					},
					complete: (e) => {
						this.saying = e.data;
					}
				});
			});
			new Promise((resolve, reject) => {
				uni.request({
					url: 'https://api.seniverse.com/v3/weather/daily.json',
					data: {
						'key': 'Sp7w-2_Jj1AdF1MHH',
						'location': '济南',
						'language': 'zh-Hans',
						'unit': 'c',
						'start': '0',
						'days': '2'
					},
					success: (re) => {
						for (let i of re.data['results'][0]['daily']) {
							let data = [];
							console.log(i.text_day);
							data.push(i.text_day);
							data.push(i.high);
							data.push(i.low);
							data.push(i.code_day);
							this.weather_data.push(data);
						}
						for (let i of this.weather_data) {


							this.weather.push(i[0]);
							this.high.push(i[1]);
							this.low.push(i[2]);
							this.code.push(i[3]);

						}
						console.log(this.weather_data);
						console.log(this.code);
					}
				})
			})
		},
		methods: {
			cli: function() {
				console.log('测试');
			},

			click1: function(e) {
				if (e === 1) {
					uni.redirectTo({
						url: '/pages/function/function'
					})
				} else if (e == 2) {
					uni.redirectTo({
						url: '/pages/login/login'
					})
				}
			},
			onChange: function(e) {
				this.timeData = e;
			},
			bindIcon: function(icon) {
				return '../../static/weather/' + icon + '.svg';
			}
		}
	}
</script>

<style>
	.kaoyan_text {
		color: #2f3640;
		font-size: 15px;
		font-weight: bold;
		text-align: center;
	}

	.countdown {
		display: flex;
		text-align: center;
		justify-content: center;
		align-items: center;
		margin-top: 15px;
		margin-bottom: 15px;
	}

	.time {
		display: flex;
		align-items: center;
	}

	.time_custom {
		display: flex;
		justify-content: center;
		align-items: center;
		color: #f5f6fa;
		background-color: #54a0ff;
		font-size: 18px;
		width: 40px;
		height: 40px;
		border-radius: 4px;
	}

	.time_text {
		color: #2f3640;
		font-weight: bold;
		padding-left: 5px;
		padding-right: 5px;
	}

	.split {
		display: flex;
		flex-direction: row;
	}

	.item {
		flex: 1;
		padding-top: 10px;
	}

	.icon_class {
		height: 30px;
		text-align: center;
		align-items: center;
		justify-content: center;
	}

	.weather_text {
		display: block;
		text-align: center;
		margin-top: 10px;
	}

	.weather_number {
		display: inline-block;
		margin-left: 5px;
		margin-right: 5px;
	}

	.saying {
		color: #2f3640;
	}

	.author {
		text-align: end;
	}
</style>
