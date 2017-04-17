/**
 * Created by maple on 2017/4/15.
 */
/*
var pet={
    words:'...',
    speak:function(){
        console.log(this.words);
        console.log(this == pet);
    }
}
pet.speak()*/
/*
function pet(words){
    this.words = words;
    console.log(this.words);
    console.log(this);
    console.log(this === global);
}

pet('...');*/

/*
function pet(words){
    this.words = words;
    this.speak = function(){
        console.log(this.words);
        console.log(this === cat);
    }
}
var cat = new pet('miaoV');
cat.speak()*/

/*var pet= {
    words:'...',
    speak:function(say){
        console.log(say+' '+this.words);
    }
}

var dog={
    words:'wang'
}

pet.speak.call(dog,'Speak');
*/

function Pet(words){
    this.words = words;
    this.speak = function(){
        console.log(this.words);
    }
}

function Dog(words){
    Pet.call(this,words);
}

var dog = new Dog('wang');
dog.speak();