const container = document.getElementById("pic");
const canvas  = document.getElementById('fractalCanvas');
const ctx = canvas.getContext("2d");
const restartButton = document.getElementById("restartButton");


let maxDepth = 8;
let currentDepth = 0;
let isAnimating = true;
let lastTimestamp = 0;//存储上一次动画帧的时间戳，用于控制动画帧率。
const frameInterval = 300;//设置动画帧之间的间隔时间为 300 毫秒，即每秒大约绘制 3 帧。

function resizeCanvas(){
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    drawFractal();//Redraw the fractal(分形，破裂) after resizing
    //resizeCanvas 函数用于调整画布大小，使画布的宽度和高度与容器元素一致。
    //调整大小后，调用 drawFractal 函数重新绘制分形树。
}


//生成随机数
//x, y: 分支起始点的坐标。
function getRandomInRange(min,max){
    return Math.random() * (max-min)+min;
    
}


//递归绘制分形树的分支
// length: 分支的长度。
// angle: 分支相对于水平方向的角度。
// depth: 当前分支的深度
function drawBranch(x,y,length,angle,depth){
    
    //如果当前深度超过了动画的当前深度，则停止绘制。
    if(depth > currentDepth)
            return;


    const endX = x + length * Math.cos(angle);
    const endY = y - length * Math.sin(angle);

    //创建路径并且从起点绘制到终点
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(endX,endY);


    //如果到达最大深度开始绘画樱花花瓣
    if(depth == maxDepth){
        drawSakuraFlower(endX,endY);
    }else{
        ctx.strokeStyle = "#8B4513";//Natural brown for branches
        ctx.stroke();
    }


    
    // 如果当前深度尚未达到最大深度，生成新的分支。
    if(depth < maxDepth){
        const newLength = length* 0.7;
        const branches = Math.floor(getRandomInRange(2,5));

        for(let i = 0;i < branches;i++){
            const randomAngle = getRandomInRange(-Math.PI / 4, Math.PI / 4);
            drawBranch(endX,endY,newLength,angle + randomAngle,depth+1);
        }
    }
}



//绘制樱花花朵，在分型树的末端绘制
function drawSakuraFlower(x,y){
    ctx.beginPath();
    ctx.arc(x,y,5,0,Math.PI * 2,false);//Sakura flower 绘制一个半径为 5 的圆（花瓣）。
    ctx.fillStyle = "pink";
    ctx.fill();
}


//用于清除'canvas'并重新绘制整个分形树s
function drawFractal() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.lineWidth = 2;

	const startX = canvas.width / 2;
	const startY = canvas.height;
	const initialLength = canvas.height / 4;

	drawBranch(startX, startY, initialLength, Math.PI / 2, 0);
}

//控制动画的递增深度和帧率
function animate(timestamp){
    if(!isAnimating)return;

    if(timestamp - lastTimestamp >= frameInterval){
        if(currentDepth < maxDepth){
            currentDepth++;
        }
        else{
            isAnimating = false;
        }
        
        drawFractal();
        lastTimestamp = timestamp;
    }

    if(isAnimating){
        requestAnimationFrame(animate);//再次请求动画帧数
    }
}

//重置动画状态，重新开始绘制分形。
function restartAnimation(){
    currentDepth = 0;
    isAnimating = true;
    lastTimestamp = 0;
    drawFractal();
    requestAnimationFrame(animate);
}

window.addEventListener("resize",resizeCanvas);
resizeCanvas();//Initial resize to fit the viewport
requestAnimationFrame(animate);

restartButton.addEventListener("click",() => {
    isAnimating = false;
    setTimeout(restartAnimation,50);
});

