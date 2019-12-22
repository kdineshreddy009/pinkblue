//store data using name/value format
example = "sitename=JavaScript Kit"
console.log("example is-",example);

//retrieve value from cookie
var beginindex, endindex, result
//set begin index to 1st letter of value ("W")
beginindex = example.indexOf("sitename") + 9
endindex = beginindex
console.log("begin Index is-",beginindex);
console.log("end Index is-",endindex);
//while we haven't hit ";" and it's not end of cookie
while (example.charAt(endindex) != ";" && endindex <= example.length){
	console.log(endindex);
    endindex++
}

//result contains "JavaScript Kit"
var result = example.substring(beginindex, endindex)
console.log("result",result);