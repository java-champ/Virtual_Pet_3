//Create variables here
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

var dog, happyDog, database, foodS, foodStock, dogImage, dogHappy, database;
var foodObj, fedTime, lastFed, feed, addFood;
var Bedroom, Garden, Washroom;
var bedroomImage, gardenImage, washroomImage;
var readState;
var gameState = 1;

function preload()
{
  //load images here
  
  dogImage = loadImage("dog.png");
  dogHappy = loadImage("happydog.png");
  bedroomImage = loadImage("Bed Room.png");
  gardenImage = loadImage("Garden.png");
  washRoomImage = loadImage("Wash Room.png");

}

function setup() {
  createCanvas(800, 700);

  database = firebase.database();
  
  var dog = createSprite(250, 250, 10, 10);
  dog.addImage(dogImage);
  foodStock=database.ref('Food');
  foodStock.on("value", readStock);

  feed = createButton("Feed the Dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);

  readState = database.ref('gameState');
  readState.on("value", function(data){
    gameState = data.val();
  });

  Bedroom.addImage(bedRoomImage);
  Garden.addImage(gardenImage);
  Washroom.addImae(washRoomImage);

}


function draw() { 
  background(46, 139, 87);
  
  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  })

  fill(255, 255, 254);
  textSize(15);
  if(lastFed>=12){
    text("Last Fed : " + lastFed % 12 + "PM", 250, 30);
  }
  else if(lastFed == 0){
    text("Last Fed : 12 AM", 350, 30);
  }
  else{
    text("Last Fed : " + lastFed + "AM", 350, 30);
  }

  if(gameState != "Hungry"){
    feed.hide()
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }

  currentTime = hour();
  if(currentTime == (lastFed + 1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime = (lastFed +  2)){
    update("Sleeping");
    foodObj.bedroom();
  }else if(currentTime > (lastFed + 2) && currentTime<=(lastFed + 4)){
    update("Bathing");
    foodObj.washroom();
  }else{
    update("Hungry");
    foodObj.display();
  }

  drawSprites();

  textSize(20);
  fill("green");
  stroke("black");
  text(" Note : Press UP_ARROW Key To Feed Drago Milk! ");  

  //add styles here

}
function readStock(data){
  foodS = data.val();
}
function writeStock(x){
  database.ref('/').update({
    Food : x
  })
}
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food : foodObj.getFoodStock(),
    FeedTime : hour()
  })
}
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food : foodS
  })
}
function update(state){
  database.ref('/').update({
    gameState : state
  })
}