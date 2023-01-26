<template name="gradeCard">
	<view>
		<uni-card class='card' :is-shadow="false" margin="8px" id="card">
			<view class="layer_1">
				<view class="items_1">
					<view class="item_1">
						<text>{{subject}}</text>
					</view>
					<view class="item_2">

					</view>
					<view class="item_3">
						<text>{{grade}}</text>
					</view>
				</view>
				<view class="items_2">
					<view class="item_1">
						<text>{{type}}</text>
					</view>
					<view class="item_2">
						<text></text>
					</view>
					<view class="item_3">
						<text>{{credit}}学分</text>
					</view>
				</view>
			</view>
			<!-- <text class="_section">{{subject}}</text>
			<text class="grade">{{grade}}</text> -->
		</uni-card>
	</view>
</template>

<script>
	export default {
		name: "gradeCard",
		data() {
			return {

			};
		},
		props: {
			subject: {
				type: String,
				value: null
			},
			grade: {
				type: String,
				value: null
			},
			type: {
				type: String,
				value: null
			},
			credit: {
				type: Number,
				value: null
			}
		}
	}
</script>

<style>
	.layer_1 {
		display: flex;
		flex-direction: column;
	}

	.items_1 {
		display: flex;
		flex-direction: row;
		height: 30px;
		margin-top: 3px;
	}

	.items_2 {
		display: flex;
		flex-direction: row;
		height: 20px;
	}

	.items_1 .item_1 {
		display: block;
		flex: 5;
		font-size: 20px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: #f5f6fa;
	}

	.items_1 .item_2 {
		flex: 2;
	}

	.items_1 .item_3 {
		display: block;
		flex: 1;
		text-align: end;
		font-size: 30px;
		color: #f5f6fa;
	}

	.items_2 .item_1 {
		flex: 3;
		color: #f5f6fa;
	}

	.items_2 .item_2 {
		flex: 2;
	}

	.items_2 .item_3 {
		flex: 1;
		text-align: end;
		color: #f5f6fa;
	}

	.card {
		height: 70px;
		background-color: rgb(94, 121, 135)
	}

	.grade {
		display: inline-block;
		margin-left: 10%;
		font-size: 30px;

	}


	._section {
		display: inline-block;
		font-size: 20px;
		font-weight: bold;
		margin-top: 20px;
		width: 70%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
