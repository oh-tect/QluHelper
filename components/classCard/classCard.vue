<template name="classCard">
	<view>
		<uni-card class="card" :is-shadow="false" margin="0 20px 10px 10px" style="height: 100px;" padding="10px">
			<u-row customStyle="margin-bottom: 5px">
				<image src="../../static/icon/class.png" style="width: 20px; height: 20px; margin-right: 10px;">
				</image>
				<text class="text">{{subject}}</text>
			</u-row>
			<u-row customStyle="margin-bottom: 5px">
				<image src="../../static/icon/class_time.png" style="width: 20px; height: 20px; margin-right: 10px;">
				</image>
				<text class="text">{{time}}</text>
			</u-row>
			<u-row customStyle="margin-bottom: 5px">
				<image src="../../static/icon/position.png" style="width: 20px; height: 20px; margin-right: 10px;">
				</image>
				<text class="text">{{position}}</text>
			</u-row>
		</uni-card>
	</view>
</template>

<script>
	export default {
		name: "classCard",
		data() {
			return {

			};
		},
		props: {
			subject: {
				type: String,
				value: null
			},
			time: {
				type: String,
				value: null
			},
			position: {
				type: String,
				value: null
			}
		}
	}
</script>

<style>
	.card {
		background-color: rgb(94, 121, 135);
		border-radius: 15px;
	}

	.text {
		color: #f5f6fa;
	}
</style>
