<template>
	<view>
		<view class="about">
			<uni-section title="关于" type="line"></uni-section>
			<uni-card :is-shadow="false" is-full :border="false">
				<uni-list>
					<uni-list-item title="开发者:" rightText="大约在冬季" />
					<uni-list-item title="QQ:" rightText="2215464145" />
					<uni-list-item title="Email:" rightText="yxteee@126.com" />
					<uni-list-item title="软件版本:" rightText="1.0.2" />
					<uni-list-item title="项目地址:" rightText="https://github.com/oh-tect/QluHelper" />
				</uni-list>
			</uni-card>
			<uni-card padding="0 0 0 0">
				<uni-section title="数据来源" type="line"></uni-section>
				<uni-section title="天气数据由 心知天气 提供."></uni-section>
				<uni-section title="每日一言数据由 古诗词·一言 提供."></uni-section>
				<uni-section title="其他信息由齐鲁工业大学教务系统API提供."></uni-section>
			</uni-card>
		</view>
		<view class="footer">
			<image src="../../static/logo.png" style="width: 30px; height: 30px;"></image><br>
			<text style="color: silver; font-size: 15px;">Powered by uni-app</text><br>
			<text style="color: silver; font-size: 10px;">Copyright © 2023 oh-tect（大约在冬季）</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style>
	.about {
		margin-top: 10px;
	}

	.footer {
		text-align: center;
		margin-top: 30px;
	}
</style>
