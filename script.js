//version 1
var can = document.getElementById("canvas");
var ctx = can.getContext("2d");

var reap = setInterval(draw,1);

var rainbowColorInv;
var displayHue = true;

var mouseX = 0;
var mouseY = 0;

var windowMouseX = 0;
var windowMouseY = 0;

var pos1x = -1;
var pos1y = -1;
var pos2x = -1;
var pos2y = -1;

var sliderY = 281.818182; 

var mousedown = false;
var mouseButton = "none";
var keyDown = "none";
var inFrame = null;

var prevColor = "red";
var color = "red";
var brushSize = 10;
var selected = "none";
var hue = 0;
var rainbowToggle = true;
rainbowColorInv = setInterval(rainbowColor,25);

var image = document.getElementById("image");
var imageSelectorStatus = "hidden";
var imageSelector = document.getElementById("imageSelectorBody");
var imageLink = "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png";
var link = document.getElementById("link");

var fill = true;

var devBool = true;

var r = 0;
var g = 0;
var b = 0;

var prevImage = "/images/default_image";

var downloadBool = false;

ctx.fillStyle = "black";
ctx.fillRect(0,0,1000,700);

//Color Selector
//select the input element

var colorSel = document.getElementById("selector");
colorSel.addEventListener('input', function(){

  if(selected == "eraser"){

    prevColor = colorSel.value;

  }
  else{

    color = colorSel.value;
    prevColor = colorSel.value;

  }

});

window.onbeforeunload = function (e) {
    e = e || window.event;

    // For IE and Firefox prior to version 4
    if (e) {
        e.returnValue = 'Sure?';
    }

    // For Safari
    return 'Sure?';
};

// var rainbowColorInv = setInterval(rainbowColor,1);

// Math.floor(39.2); //static: does not rely on an object

// ctx.fillRect(10,20,20,20); //non-static: relies on an object

//Place color box
var left = can.offsetLeft + 950;
var down = can.offsetTop + 55;
colorSel.style.top = down + "px";
colorSel.style.left = left + "px";

//place Size box
var sizeBox = document.getElementById("tb");
left = can.offsetLeft + 950;
down = can.offsetTop + 310;
sizeBox.style.top = down + "px";
sizeBox.style.left = left + "px";

//Place image selecter
var imageSelectorButton = document.getElementById("imageSelectorPrompt");
left = can.offsetLeft + 950;
down = can.offsetTop + 596;
imageSelectorButton.style.top = down + "px";
imageSelectorButton.style.left = left + "px";

//place download button
var downloadButton = document.getElementById("downloadButton");
left = can.offsetLeft + 1010;
down = can.offsetTop + 0;
downloadButton.style.top = down + "px";
downloadButton.style.left = left + "px";

window.addEventListener('keyup', function(e) {

  keyDown = "none";

});

window.addEventListener('mousemove', function(e) {

  windowMouseX = e.clientX;
  windowMouseY = e.clientY;

});

can.addEventListener('wheel', function(e){

 //Make sure to moderate how fast it increases/decreases
 //Make sure it doesn't exceed min/max brush size
//  brushSize += e.deltaY;
  console.log(e.deltaY);

  if(e.deltaY > 0 && brushSize > 1){

    brushSize = brushSize - 1;
    sliderY = -1 * (brushSize - 1)/99 * 200 + 300;
    sizeBox.value = Math.floor(brushSize);

  }
  else if(e.deltaY < 0 && brushSize < 100){

    brushSize = brushSize + 1;
    sliderY = -1 * (brushSize - 1)/99 * 200 + 300;
    sizeBox.value = Math.floor(brushSize);

  }

});

can.addEventListener('mouseout', function(e){

  inFrame = false;

});

can.addEventListener('mouseover', function(e){

  inFrame = true;

});

can.addEventListener('mousemove', function(e) {

  mouseX = e.clientX - canvas.offsetLeft;
  mouseY = e.clientY - canvas.offsetTop;

  mx = e.clientX;
  my = e.clientY;

  if(mouseX >= 950 && mouseX <= 1000 && mouseY >= 100 && mouseY <= 300){

    if(mousedown){

      sliderY = mouseY;
      var distance = 300 - sliderY; //Distance from bottom of slider: 0 - 200
      var percent = distance / 200;//Converts distance to a percentage: 0% - 100%
      brushSize = percent * 99 + 1;//Converts percentage to a value from 1 - 100
      sizeBox.value = Math.floor(brushSize);
      

    }

  }

  if(mouseX >= 950){

    document.getElementById("canvas").style.cursor = "pointer";

  }
  else{

    document.getElementById("canvas").style.cursor = "crosshair";

  }

  if(!mousedown){

    return;

  }

  if(!(selected == "lineTool" || selected == "rectTool" || selected == "circleTool" || selected == "imageBrush")){
    
    pen();

  }
    
  if(selected == "imageBrush"){

    var img = document.getElementById("image");
    if(mouseX < 950){
      ctx.drawImage(img, mouseX-brushSize/2, mouseY-brushSize/2,brushSize,brushSize);
    }

  }

});

window.addEventListener("keydown", function(event){

  keyDown = event.keyCode;

  if(event.keyCode == "27" && imageSelectorStatus == "visible"){

    imageSelectorStatus = "hidden";

  }

  // if(event.keyCode == "68"){

  //   var dataURL = can.toDataURL("image/png");
  //   document.write('<img src = "' + dataURL + '"/>');
  //   alert(dataURL);

  // }

  if(event.keyCode == "13"){

    if(document.activeElement.id == "tb"){

      //Input Validation
      //1 from to 100
      //No text or symbols
      //No spaces
      if(!isNaN(sizeBox.value) && sizeBox.value <= 100 && sizeBox.value >= 1){//Valid Input

        brushSize = sizeBox.value;
        sliderY = -1 * (brushSize - 1)/99 * 200 + 300;

      }
      else{//Invalid input

        alert("Please do not include any letters or special symbols. Make sure the number is anywhere from to 1 - 100.");

      }
      
    }

  }

  if(event.keyCode == "16"){

    if(fill){

      fill = false;

    }
    else{

      fill = true;

    }

  }

  if(event.keyCode == "192"){

    if(devBool){

      devBool = false;

    }
    else{

      devBool = true;

    }

  }

});

can.addEventListener('mousedown', function(e){

  mousedown = true;
  mouseButton = e.button;

    if(mouseX <= 950 && selected == "none" && mouseButton == 0){
      
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      // ctx.beginPath();
      // ctx.arc(mouseX,mouseY,brushSize/2.5,0,Math.PI*2);
      // ctx.fill();
      // ctx.stroke();
      ctx.lineCap = "round";
      ctx.lineWidth = brushSize;
      ctx.lineTo(mouseX+0.1,mouseY+0.1);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(mouseX,mouseY);

    }

    if(mouseY >= 620  && mouseY <= 645 && mouseX >= 950 && mouseX <= 1000){

        if(fill){

          fill = false;

        }
        else{

          fill = true;

        }

      }

    if(mouseY >= 540  && mouseY <= 600 && mouseX >= 950 && mouseX <= 1000){

      if(selected == "imageBrush"){

        selected = "none";

      }
      else{

        selected = "imageBrush";

      }

    }

    if(mouseX >= 970 && mouseX <= 980 && mouseY >= 100 && mouseY <= 300){

      sliderY = mouseY;
      var distance = 300 - sliderY;
      var percent = distance / 200;
      brushSize = percent * 99 + 1;
      sizeBox.value = Math.floor(brushSize);

    }

    if(mouseX >= 950 && mouseX <= 1001){

      if(mouseY >= 0 && mouseY <= 50){
    
        if(selected == "eraser"){//if eraser is already selected but clicked on again

          selected = "none";
          color = colorSel.value;

        }
        else{//if eraser is getting selected for first time
        
          selected = "eraser";
          prevColor = colorSel.value;
          clearInterval(rainbowColorInv)
          color = "black";
          rainbowToggle = false;
          //*clicks on eraser*
          //selected = eraser
          //prevColor = red
          //color = black
          //selected = rectTool
        
        }
        
      }

      if(mouseY >= 440 && mouseY <= 490){
        
        if(selected == "circleTool"){

          selected = "none";

        }
        else{

          color = prevColor;
          selected = "circleTool";
        
        }
        
      }

      if(mouseY >= 390 && mouseY <= 440){

        
        if(selected == "rectTool"){

          selected = "none";

        }
        else{

          color = prevColor;
          selected = "rectTool";
        
        }
        
      }

      if(mouseY >= 341 && mouseY <= 390){

        if(selected == "lineTool"){

          selected = "none";

        }
        else{
          
          color = prevColor;
          selected = "lineTool";
        
        }

      }

      if(mouseY >= 490 && mouseY <= 540){

        if(rainbowToggle){

          color = colorSel.value;
          rainbowToggle = false;
          clearInterval(rainbowColorInv);

        }
        else{
          
            if(selected == "eraser"){
              selected = "none";
            }
            prevColor = color;
            rainbowToggle = true;  
            rainbowColorInv = setInterval(rainbowColor,25);
        
        }

      }

      if(mouseY >= 650 && mouseY <= 700){

        var answer = confirm("Are you sure you want to erase the entire canvas?");
        if(answer){

          selected = "trash";
          cover();
          mousedown = false;

        }
        else{

          mousedown = false;

        }

      }

    }

    if(selected == "lineTool"){

        if(mouseX <= 950){

          pos1x = mouseX;
          pos1y = mouseY;

        }
    
    }

    if(selected == "rectTool"){

      if(mouseX <= 950){

        pos1x = mouseX;
        pos1y = mouseY;

      }
    }

    if(selected == "circleTool"){

      if(mouseX <= 950){

        pos1x = mouseX;
        pos1y = mouseY;

      }
    }

});

window.addEventListener("mouseup", function(){

  mousedown = false;
  mouseButton = "none";
  
  if(selected == "lineTool"){

    if(pos1x != -1){

      pos2x = mouseX;
      pos2y = mouseY;

      ctx.beginPath();
      ctx.moveTo(pos1x,pos1y);
      ctx.lineTo(pos2x,pos2y);
      ctx.lineWidth = brushSize;
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.lineWidth = 1;

      pos1x = -1;
      pos1y = -1;
      pos2x = -1;
      pos2y = -1;
    }


  }

  if(selected == "rectTool"){

    if(pos1x != -1){

      pos2x = mouseX;
      pos2y = mouseY;

      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      if(fill){

        ctx.fillRect(pos1x,pos1y,pos2x-pos1x,pos2y-pos1y);

      }
      else{

        ctx.strokeRect(pos1x,pos1y,pos2x-pos1x,pos2y-pos1y);

      }

      pos1x = -1;
      pos1y = -1;
      pos2x = -1;
      pos2y = -1;
    }

  }

  if(selected == "circleTool"){

    if(pos1x != -1){

      pos2x = mouseX;
      pos2y = mouseY;

      console.log("pos1x: " + pos1x);
      console.log("pos1y: " + pos1y);
      console.log("pos2x: " + pos2x);
      console.log("pos2y: " + pos2y);

      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      var leg1 = pos2x - pos1x;
      var leg2 = pos2y - pos1y;
      var hypotenuse = Math.sqrt(leg1*leg1 + leg2*leg2);
      var radius = hypotenuse/2;
      var centerX = (leg1/2) + pos1x;
      var centerY = (leg2/2) + pos1y;
      ctx.beginPath();
      ctx.arc(centerX,centerY,radius,0,Math.PI*2);
      if(fill){

        ctx.fill();

      }
      ctx.stroke();

      pos1x = -1;
      pos1y = -1;
      pos2x = -1;
      pos2y = -1;
    }

  }

});

function pen(){

  if(mouseX <= 945 && mouseButton == 0){

    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    if(inFrame){
      ctx.moveTo(mouseX,mouseY);
      inFrame = false;
    }
    ctx.lineTo(mouseX,mouseY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mouseX,mouseY);
    
  }

}

function sideBar(){

  ctx.fillStyle = "gray";
  ctx.fillRect(950,0,50,700);
  ctx.lineWidth = 1;
  ctx.lineCap = "square";
  eraser();
  slider();
  trashButton();
  lineTool();
  rectTool();
  circleTool();
  rainbowBrush();
  fillSwitch();
  imageBrush();

}

function promptImageSelector(){

  if(imageSelectorStatus == "hidden"){

    imageSelectorStatus = "visible";

  }
  else{

    imageSelectorStatus = "hidden";

  }

}

function selectImage(){
  prevImage = image.src;
  image.src = document.getElementById("imgTb").value;
  imageLink = document.getElementById("imgTb").value;
  document.getElementById("imgTb").value = null;
  imageSelectorStatus = "hidden";
}

function downloadDrawing(){
  
    clearInterval(reap);
    sideBarClear();
    var img = can.toDataURL("image/png");
    var imageLink = document.getElementById("downloadButton");
    imageLink.href = img;
    reap = setInterval(draw,.1);

}

function slider(){

  ctx.fillStyle = "white";
  ctx.fillRect(970,100,10,200);

  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(975,sliderY,7.5,0,2*Math.PI);
  ctx.fill()
  ctx.strokeStyle = "black"
  ctx.stroke();

}

function sideBarClear(){

  ctx.clearRect(950,0,50,700);

}

function eraser(){

  var img = document.getElementById("eraser");
  ctx.drawImage(img, 955,5,40,40);
  if(selected == "eraser"){

    ctx.strokeStyle = "red";

  }
  else{

    ctx.strokeStyle = "black";

  }

  ctx.beginPath();
  ctx.moveTo(951,50);
  ctx.lineTo(999,50);
  ctx.lineTo(999,1);
  ctx.lineTo(951,1);
  ctx.lineTo(951,50)
  ctx.stroke();

}

function lineTool(){

  var img = document.getElementById("line");
  ctx.drawImage(img, 950,340,50,50);
  if(selected == "lineTool"){

    ctx.strokeStyle = "red";

  }
  else{

    ctx.strokeStyle = "black";

  }

  ctx.beginPath();
  ctx.moveTo(951,50+340);
  ctx.lineTo(999,50+340);
  ctx.lineTo(999,1+340);
  ctx.lineTo(951,1+340);
  ctx.lineTo(951,50+340)
  ctx.stroke();

}

function fillSwitch(){

  if(fill){

    ctx.fillStyle = "green";
    ctx.fillRect(953,625,45,20);

    ctx.fillStyle = "white";
    ctx.fillRect(990,625,20,20);

    ctx.font = "18px Arial";
    ctx.fillText("FILL", 953, 641);


  }
  else{

    ctx.fillStyle = "red";
    ctx.fillRect(953,625,45,20);

    ctx.fillStyle = "white";
    ctx.fillRect(953,625,9,20);

    ctx.font = "18px Arial";
    ctx.fillText("FILL", 961, 641);

  }

}

function trashButton(){

  var img = document.getElementById("trash");
  ctx.drawImage(img, 955,655,40,40);

}

function rectTool(){

  var img = document.getElementById("rectangle");
  ctx.drawImage(img, 955,395,40,40);
  if(selected == "rectTool"){

    ctx.strokeStyle = "red";

  }
  else{

    ctx.strokeStyle = "black";

  }

  ctx.beginPath();
  ctx.moveTo(951,50+390);
  ctx.lineTo(999,50+390);
  ctx.lineTo(999,1+390);
  ctx.lineTo(951,1+390);
  ctx.lineTo(951,50+390)
  ctx.stroke();

}

function imageBrush(){

  var img = document.getElementById("image");
  try{
    ctx.drawImage(img, 955,545,40,40);
  }
  catch(IndexSizeError){
    img.src = prevImage;
    alert("invalid image");
  }
  
  if(selected == "imageBrush"){

    ctx.strokeStyle = "red";

  }
  else{

    ctx.strokeStyle = "black";

  }
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(951,50+490+50);
  ctx.lineTo(999,50+490+50);
  ctx.lineTo(999,1+490+50);
  ctx.lineTo(951,1+490+50);
  ctx.lineTo(951,50+490+50);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(mouseX,mouseY);

}

function rainbowBrush(){

  var img = document.getElementById("rainbow");
  ctx.drawImage(img, 955,495,40,40);
  if(rainbowToggle == true){

    ctx.strokeStyle = "red";

  }
  else{

    ctx.strokeStyle = "black";

  }


  ctx.beginPath();
  ctx.moveTo(951,50+490);
  ctx.lineTo(999,50+490);
  ctx.lineTo(999,1+490);
  ctx.lineTo(951,1+490);
  ctx.lineTo(951,50+490)
  ctx.stroke();

}

function circleTool(){

  var img = document.getElementById("circle");
  ctx.drawImage(img, 955,445,40,40);
  if(selected == "circleTool"){

    ctx.strokeStyle = "red";

  }
  else{

    ctx.strokeStyle = "black";

  }

  ctx.beginPath();
  ctx.moveTo(951,50+440);
  ctx.lineTo(999,50+440);
  ctx.lineTo(999,1+440);
  ctx.lineTo(951,1+440);
  ctx.lineTo(951,50+440);
  ctx.stroke();

}

function cover(){

  ctx.fillStyle = "black";
  ctx.fillRect(0,0,950,700);

}

function rainbowColor(){

  if(mousedown && mouseX < 950){
    if(hue >= 360){

      hue = 0;

    }
    else{

      hue = hue + 1;
      color = "hsl(" + hue + ",100%,50%)";
    }

  }
}

function devTool(){

  if(devBool){

    document.getElementById("devDiv").style.visibility = "visible";

  }
  else{

    document.getElementById("devDiv").style.visibility = "hidden";

  }

  document.getElementById("canvasX").innerHTML = mouseX;
  document.getElementById("canvasY").innerHTML = mouseY;

  document.getElementById("mouseX").innerHTML = windowMouseX;
  document.getElementById("mouseY").innerHTML = windowMouseY;

  document.getElementById("mouseDown").innerHTML = mousedown;
  document.getElementById("mouseButton").innerHTML = mouseButton;

  document.getElementById("selected").innerHTML = selected;

  document.getElementById("brushSize").innerHTML = Math.floor(brushSize);
  document.getElementById("brushColor").style.color = color;

  document.getElementById("displayHue").innerHTML = displayHue;

  document.getElementById("keyDown").innerHTML = keyDown;

  document.getElementById("prevColor").innerHTML = prevColor;
  document.getElementById("prevColor").style.color = prevColor;

  document.getElementById("fill").innerHTML = fill;

  document.getElementById("imageSelectorStatus").innerHTML = imageSelectorStatus;
  document.getElementById("image").innerHTML = image;
  document.getElementById("link").href = imageLink;

  if(mousedown){

    document.getElementById("mouseDown").style.color = "green";

  }
  else{

    document.getElementById("mouseDown").style.color = "red";

  }

  if(fill){

    document.getElementById("fill").style.color = "green";

  }
  else{

    document.getElementById("fill").style.color = "red";

  }

  if(displayHue){

    document.getElementById("brushColor").innerHTML = "hue("+hue+")";

  }
  else{

    document.getElementById("brushColor").innerHTML = color;

  }

}

function draw(){

  if(!rainbowToggle){
    displayHue = false;
  }
  else{
    displayHue = true;
  }
  sideBarClear();
  sideBar();
  devTool();
  imageSelector.style.visibility = imageSelectorStatus;

}