const refreshToken = async function() {
	//3秒就判定超时
	function timeout() {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				reject('请求超时');
			}, 3000);
		});
	}
	//刷新用函数
	function refresh() {
		console.log("[开始刷新token...]");
		let username = uni.getStorageSync('username');
		let password = uni.getStorageSync('password');
		if (username && password) {
			return new Promise((resolve, reject) => {
				uni.request({
					url: 'http://jwxt.qlu.edu.cn/app.do',
					method: 'GET',
					data: {
						'method': 'authUser',
						'xh': username,
						'pwd': password
					},
					success: (re) => {
						console.log("刷新成功");
						uni.setStorageSync('token', re.data['token']);
						resolve();
					}
				});
			});
		} else {
			console.log("[刷新失败,找不到username和password]");
		}
	}
	Promise.race([refresh(), timeout()]).then(
		function(d) {
			return true;
		},
		function(e) {
			return false;
		}
	);
}

const getToken = function() {
	return uni.getStorageSync('token');
}

let mytoken = {
	'refreshToken': refreshToken,
	'getToken': getToken
}

module.exports = {
	mytoken
}
