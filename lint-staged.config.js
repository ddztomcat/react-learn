module.exports = {
	"*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier -w"],
	"*.{scss,less,styl}": ["stylelint --fix", "prettier -w"]
};