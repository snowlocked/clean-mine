let str = require('./map.js');
let arr = str.split(';');
let newArr = [],abc = "abcdefghijklmnopqrstuvwxyz";
for (let [i,string] of arr.entries()){
	newArr.push({
		x:abc.indexOf(string[2]),
		y:abc.indexOf(string[3])
	})
}
console.log(newArr);