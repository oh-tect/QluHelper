const getKaoyan_date = (date) => {
	return Date.parse(new Date(date + '-11-08')) - Date.parse(new Date());
}

const getSeasonTime = (month) => {
	return (month / 3) + 1;
}
module.exports = {
	getKaoyan_date,
	getSeasonTime
};
