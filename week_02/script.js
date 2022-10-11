/* This is a javascropt example for week2.
*/ 

// inline comment

let num = 100; //integer

function foo(){
    let num2 = 22;
    console.log(num)

};

let anonFun = function(){
    console.log("hello")
};

let anonFun1 = function() => console.log("hello") //same as before, just different


(function(){
    console.log("hi")
})();

let person = "Summer";

(function(peopleName){
    console.log("Hello ") + peopleNamme);
})()}

array = ['barbar']
array.push["car"] // ads to array
arr.splice(2,1); // remove item from array (index, deletecount)

for (let in arr){
    console.log(i + " " + arr[i])
}

//loop through each item in the array with its index - foreach
arr.forEach((item,i)) => console.log(i + " " + item));


let obj1 = {
    name: "Jill"
    age: 85,
    job: "Cactus Hunter"
};

console.log(obj.name); // will log only name
console.log(obj['name']);

for (let key in obj1){
    let value = obj1[key[];
    console.log('${key}: $value}');
}

for (let i = 0; i < 10; i++){
    console.log(i);
}

let x = 75;

if(x > 50) {
    console.log("above average");
} else if (x > 5) {
    console.log("below average")
} else { 
    console.log("really below average")
}

//inline if else
let y = (x > 50) ? "Above average": "Below average";

//traverse DOM
let example = document.getElementById("example") //defined in html

example.innerHTML += "Hello world!";
