<template>
	<view>
		<view class="">
			<u-tabbar :value="value1" @change="change1" :fixed="true" :placeholder="true" :safeAreaInsetBottom="false">
				<u-tabbar-item text="首页" icon="home" @click="click1"></u-tabbar-item>
				<u-tabbar-item text="功能" icon="photo" @click="click1"></u-tabbar-item>
				<u-tabbar-item text="我的" icon="account" @click="click1"></u-tabbar-item>
			</u-tabbar>
		</view>
		<view class="login">
			<view class="logo_div">
				<image src="/static//icon/ic_launcher_proc_transparent.jpg" class="logo"></image>
			</view>
			<view class="username" style="border-radius: 20px;">
				<wInput v-model="username" type="text" placeholder="请输入学号" focus> </wInput>
				</uni-easyinput>
			</view>
			<view class="password">
				<wInput v-model="password" type="password" isShowPass placeholder="请输入教务系统密码"> </wInput>
			</view>
			<view class="submit">
				<wButton text="登录" rotate="false" bgColor="rgb(94, 121, 135)" fontColor="#FFFFFF"
					@click.native="login()">
				</wButton>
			</view>
		</view>
	</view>
</template>

<script>
	import wInput from '../../components/watch-login/watch-input.vue' //input
	import wButton from '../../components/watch-login/watch-button.vue'
	export default {
		data() {
			return {
				value1: 2,
				username: '',
				password: ''
			}
		},
		methods: {
			change1: function(e) {
				if (e == 1) {
					uni.redirectTo({
						url: '/pages/function/function'
					});
					window.location.reload();
				} else if (e == 0) {
					uni.redirectTo({
						url: '/pages/index/index'
					});
				}

			},
			click1: function() {

			},
			timeOut: function() {
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						reject('请求超时');
					}, 3000);

				});
			},
			login_race: function() {
				return new Promise((resolve, reject) => {
					uni.request({
						url: 'http://jwxt.qlu.edu.cn/app.do',
						method: 'GET',
						data: {
							'method': 'authUser',
							'xh': this.username,
							'pwd': this.password
						},
						success: (re) => {
							if (re.data['flag'] == 0) {
								uni.hideLoading();
								uni.showToast({
									title: '用户名或密码错误！',
									icon: 'none',
									duration: 3000,
									position: 'bottom'
								});
								resolve();
							} else {
								console.log('登录成功');
								console.log('token: ' + re.data['token']);
								uni.setStorageSync('token', re.data['token']);
								uni.setStorageSync('username', this.username);
								uni.setStorageSync('password', this.password);
								uni.hideLoading();
								// uni.showToast({
								// 	title: '登录成功',
								// 	icon: 'success',
								// 	position: 'bottom'
								// });
								uni.showToast({
									title: '登录成功',
									icon: 'success',
									position: 'bottom'
								});
								setTimeout(() => {
									getApp().globalData.isLogin = 1;
									uni.setStorageSync('isLogin', 1);
									uni.redirectTo({
										url: '/pages/index/index'
									});
									resolve();
								}, 2000)
							}
						},
						fail: (re) => {

						}
					});
				});
			},
			login: function() {
				if (this.username === '' || this.password === '') {
					uni.showToast({
						title: '用户名或密码不能为空！',
						icon: 'none',
						duration: 2000,
						position: 'bottom'
					});
					return;
				}
				uni.showLoading({
					title: '登录中'
				});
				Promise.race([this.login_race(), this.timeOut()]).then(
					function(d) {
						console.log(d);
					},
					function(e) {
						uni.hideLoading();
						uni.showToast({
							title: '请求超时，请确定是否在校园网环境下进行登录',
							duration: 3000,
							icon: 'none',
							position: 'bottom'
						});
					}
				);
			}
		},
		components: {
			wButton,
			wInput
		}
	}
</script>

<style>
	.title {
		text-align: center;
		font-size: 30px;
		font-weight: bold;

	}

	.label {
		font-weight: normal;
	}

	.login {
		margin-left: 20px;
		margin-right: 20px;
		margin-top: 40px;
	}

	.logo_div {
		text-align: center;
	}

	.logo {

		width: 60px;
		height: 60px;
	}

	.username {
		display: inline;
		margin-top: 10px;
		margin-left: 10px;
		padding-bottom: 30px;
	}

	.label {
		font-size: 15px;
	}

	.password {
		margin-top: 5px;
		margin-bottom: 30px;
	}

	.button {
		background: rgb(94, 121, 135);
		border-radius: 10px;
	}

	.submit {
		padding-top: 10px;
	}
</style>
