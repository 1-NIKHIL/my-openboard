 // let canvas= document.querySelector("canvas");

//BASIC OF HTML==>>
// canvas.width = window.innerWidth;
// canvas.height= window.innerHeight;
//
// let tool=canvas.getContext("2d");
//
// tool.strokeStyle ="blue";
// tool.lineWidth="3"
// tool.beginPath(); //new graphic(path)(line)
// tool.moveTo(10,10); //start point
// tool.lineTo(100,150);//end point
// tool.stroke()  //fill color(fill graphic)

let canvas= document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height= window.innerHeight;

let pencilColor=document.querySelectorAll(".pencil-color");
let pencilWidthElem=document.querySelector(".pencil-width");
let eraserWidthElem=document.querySelector(".eraser-width");
let download=document.querySelector(".download");
let redo=document.querySelector(".redo");
let undo=document.querySelector(".undo");

let penColor="red";//by default color will be red
let eraserColor="white";
let penWidth=pencilWidthElem.value;
let eraserWidth=eraserWidthElem.value;

let undoRedoTracker=[];
let track=0;  //represents which action from tracker array



//mouseDown is when user presses the mouse BUTTON
//mouse up is when user releases the mouse button
let mouseDown=false;// indicates mouse is not in down condition

//API
let tool=canvas.getContext("2d");

tool.strokeStyle=penColor;
tool.lineWidth=penWidth;

//mousedown ->start new path, mousemove-> path fill(graphics)
canvas.addEventListener("mousedown",(e)=>{
  mouseDown=true;
  // beginPath({  //calling of function beginPath
  //   x: e.clientX,
  //   y: e.clientY
  //   //clinetX is x coordinate of point where we click mouse
  //   //clinetY is y coordinate of point where we click mouse
  // })
  let data={
      x: e.clientX,
      y: e.clientY
  }
  socket.emit("beginPath",data);

})

canvas.addEventListener("mousemove",(e)=>{
  if(mouseDown) {
    let data={
      x: e.clientX,
      y: e.clientY,
      color: eraserFlag?eraserColor:penColor,
      width: eraserFlag?eraserWidth:penWidth
    }
    socket.emit("drawStroke",data);
  }



})
canvas.addEventListener("mouseup",(e)=>{
mouseDown=false;

let url=canvas.toDataURL();
undoRedoTracker.push(url);
track=undoRedoTracker.length-1;
})

undo.addEventListener("click",(e)=>{
  if(track>0)track--;
  //track action
  let data={
    trackValue:track,
    undoRedoTracker
  }
  socket.emit("redoUndo",data);
})
redo.addEventListener("click",(e)=>{
  if(track<undoRedoTracker.length-1) track++;
   //track action
   let data={
     trackValue:track,
     undoRedoTracker
   }
  socket.emit("redoUndo",data);
})

function undoRedoCanvas(trackObj)
{
  track=trackObj.trackValue;
  undoRedoTracker=trackObj.undoRedoTracker;

  let url=undoRedoTracker[track];
  let img=new Image();  //new image reference element
  img.src=url;
  img.onload=(e)=>{
    tool.drawImage(img,0,0,canvas.width,canvas.height);
  }
}
function beginPath(strokeObj){
  tool.beginPath();
  tool.moveTo(strokeObj.x,strokeObj.y);

}
function drawStroke(strokeObj){
  tool.strokeStyle=strokeObj.color;
  tool.lineWidth=strokeObj.width;
  tool.lineTo(strokeObj.x,strokeObj.y);
  tool.stroke() ;
}


pencilColor.forEach((colorElem)=>{
  colorElem.addEventListener("click",(e)=>{
     let color=colorElem.classList[0];
     penColor=color;
     tool.strokeStyle = penColor;

  })
})


pencilWidthElem.addEventListener("change",(e)=>{
  penWidth=pencilWidthElem.value;
  tool.lineWidth=penWidth;

})
eraserWidthElem.addEventListener("change",(e)=>{
  eraserWidth=eraserWidthElem.value;
  tool.lineWidth=eraserWidth;

})

eraser.addEventListener("click",(e)=>{
  if(eraserFlag){
    tool.strokeStyle=eraserColor;
    tool.lineWidth=eraserWidth;
  }
  else{
    tool.strokeStyle=penColor;
    tool.lineWidth=penWidth;
  }
})
download.addEventListener("click",(e)=>{
  let url=canvas.toDataURL();
  let a=document.createElement("a");
  a.href=url;
  a.download="board.jpg";
  a.click();
})

socket.on("beginPath",(data)=>{
  //data from server
  beginPath(data);
})
socket.on("drawStroke",(data)=>{
  drawStroke(data);
})
socket.on("redoUndo",(data)=>{
  undoRedoCanvas(data);
})
