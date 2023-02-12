<template>
	<view>
		<u-tabbar :value="value1" @change="change1" :fixed="true" :placeholder="false" :safeAreaInsetBottom="false">
			<u-tabbar-item text="首页" icon="home"></u-tabbar-item>
			<u-tabbar-item text="功能" icon="photo"></u-tabbar-item>
			<u-tabbar-item text="我的" icon="account"></u-tabbar-item>
		</u-tabbar>
		<view class="userinfo">
			<uni-card :is-shadow='false' is-full :border="false">
				<template v-slot:title>
					<uni-section title="登录信息" type="line"></uni-section>
				</template>
				<uni-list>
					<uni-list-item title='姓名:'>
						<text slot="footer">{{studentName}}</text>
					</uni-list-item>
					<uni-list-item title='学号:'>
						<text slot="footer">{{studentID}}</text>
					</uni-list-item>
					<uni-list-item title='学院:'>
						<text slot="footer">{{department}}</text>
					</uni-list-item>
					<uni-list-item title='专业:'>
						<text slot="footer">{{major}}</text>
					</uni-list-item>
				</uni-list>
				<wButton text="退出登录" rotate="false" style="margin-top: 10px;" bgColor="rgb(94, 121, 135)"
					fontColor="#FFFFFF" @click.native="logout()">
				</wButton>
			</uni-card>
			<uni-card :is-shadow="false" is-full :border="false">
				<uni-list>
					<uni-list-item showArrow="true" title="关于此软件" to="/pages/about/about">
					</uni-list-item>
				</uni-list>
			</uni-card>
			<uni-card :is-shadow="false">
				<template v-slot:title>
					<uni-section title="注意事项" type="line"></uni-section>
				</template>
				1.本软件系个人业余完成项目，更新时间不定。
				2.如果数据获取与齐鲁工业大学教务系统有偏差，以齐鲁工业大学教务系统为准。
			</uni-card>
		</view>
	</view>
</template>

<script>
	import wInput from '../../components/watch-login/watch-input.vue'
	import wButton from '../../components/watch-login/watch-button.vue'
	import {
		getKaoyan_date
	} from '../../util/date';
	export default {
		data() {
			return {
				value1: 2,
				studentID: '加载中...',
				department: '加载中...',
				studentName: '加载中...',
				major: '加载中...'
			}
		},
		onLoad() {
			uni.hideTabBar();
			console.log("是否登录:" + getApp().globalData.isLogin);
			let username = uni.getStorageSync("username");
			let token = uni.getStorageSync('token');
			let that = this;
			let studentName = uni.getStorageSync('studentName');
			let studentID = uni.getStorageSync('studentID');
			let department = uni.getStorageSync('department');
			let major = uni.getStorageSync('major');
			//如果缓存里没有信息，就加载一次，有信息就直接读取
			if (username && token && !(studentID && studentName && department && major)) {
				new Promise((resolve, reject) => {
					uni.request({
						url: 'http://jwxt.qlu.edu.cn/app.do',
						method: 'GET',
						data: {
							'method': 'getUserInfo',
							'xh': username
						},
						header: {
							'token': token
						},
						success: (re) => {
							console.log(re);
							if (JSON.stringify(re).includes('token')) {
								console.log('token过期');
								this.$_tokens.mytoken.refreshToken();
							} else {
								this.studentName = re.data['xm'];
								uni.setStorageSync("studentName", re.data['xm'])
								that.studentID = re.data['xh'];
								uni.setStorageSync("studentID", re.data['xh'])
								that.department = re.data['yxmc'];
								uni.setStorageSync("department", re.data['yxmc'])
								that.major = re.data['zymc'];
								uni.setStorageSync("major", re.data['zymc']);
							}

						}
					});

				});
			} else if (studentID && studentName && department && major) {
				this.studentID = studentID;
				this.studentName = studentName;
				this.department = department;
				this.major = major;
			} else {
				console.log("获取信息失败,没有username和password");
			}


		},
		components: {
			wButton
		},
		methods: {
			change1: function(e) {
				if (e == 0) {
					uni.switchTab({
						url: "/pages/index/index",
					});
				} else if (e == 1) {
					uni.switchTab({
						url: '/pages/function/function',
					})
				}
			},
			logout: function() {
				uni.setStorageSync('token', -1);
				uni.setStorageSync('isLogin', 0);
				getApp().globalData.isLogin = 0;
				getApp().globalData.classes = [];
				uni.showToast({
					title: "注销成功！",
				});
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/index/index',
					});
				}, 1000)

			},
			about: function() {
				uni.navigateTo({
					url: "/pages/about/about"
				});
			}
		}
	}
</script>

<style>
	.userinfo {}

	.items {
		display: flex;
		flex-direction: column;
	}

	.item {
		display: flex;
		font-size: 15px;
		flex: 1;
	}

	.item .text {
		flex: 3;
		display: inline-block;
		text-align: center;
	}

	.item .label {
		flex: 1;
		text-align: center;
	}
</style>
