function Star(id, x, y){
	this.id = id;
	this.x = x;
	this.y = y;
	this.r = Math.floor(Math.random()*2)+1;
	var alpha = (Math.floor(Math.random()*10)+1)/10/2;
	this.color = "rgba(255,255,255,"+alpha+")";
}

Star.prototype.draw = function() {
	ctx.fillStyle = this.color;
	ctx.shadowBlur = this.r * 2;
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
	ctx.closePath();
	ctx.fill();
}

Star.prototype.move = function() {
	this.y -= .15;
	if (this.y <= -10) this.y = HEIGHT + 10;
	this.draw();
}

Star.prototype.die = function() {
    stars[this.id] = null;
    delete stars[this.id];
}


function Dot(id, x, y, r) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.r = Math.floor(Math.random()*5)+1;
	this.maxLinks = 2;
	this.speed = .5;
	this.a = .5;
	this.aReduction = .005;
	this.color = "rgba(255,255,255,"+this.a+")";
	this.linkColor = "rgba(255,255,255,"+this.a/4+")";

	this.dir = Math.floor(Math.random()*140)+200;
}

Dot.prototype.draw = function() {
	ctx.fillStyle = this.color;
	ctx.shadowBlur = this.r * 2;
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
	ctx.closePath();
	ctx.fill();
}

Dot.prototype.link = function() {
	if (this.id == 0) return;
	var previousDot1 = getPreviousDot(this.id, 1);
	var previousDot2 = getPreviousDot(this.id, 2);
	var previousDot3 = getPreviousDot(this.id, 3);
	if (!previousDot1) return;
	ctx.strokeStyle = this.linkColor;
	ctx.moveTo(previousDot1.x, previousDot1.y);
	ctx.beginPath();
	ctx.lineTo(this.x, this.y);
	if (previousDot2 != false) ctx.lineTo(previousDot2.x, previousDot2.y);
	if (previousDot3 != false) ctx.lineTo(previousDot3.x, previousDot3.y);
	ctx.stroke();
	ctx.closePath();
}

function getPreviousDot(id, stepback) {
	if (id == 0 || id - stepback < 0) return false;
	if (typeof dots[id - stepback] != "undefined") return dots[id - stepback];
	else return false;//getPreviousDot(id - stepback);
}

Dot.prototype.move = function() {
	this.a -= this.aReduction;
	if (this.a <= 0) {
		this.die();
		return
	}
	this.color = "rgba(255,255,255,"+this.a+")";
	this.linkColor = "rgba(255,255,255,"+this.a/4+")";
	this.x = this.x + Math.cos(degToRad(this.dir))*this.speed,
	this.y = this.y + Math.sin(degToRad(this.dir))*this.speed;

	this.draw();
	this.link();
}

Dot.prototype.die = function() {
    dots[this.id] = null;
    delete dots[this.id];
}


var canvas  = document.getElementById('canvas'),
	ctx = canvas.getContext('2d'),
	WIDTH,
	HEIGHT,
	mouseMoving = false,
	mouseMoveChecker,
	mouseX,
	mouseY,
	stars = [],
	initStarsPopulation = 80,
	dots = [],
	dotsMinDist = 2,
	maxDistFromCursor = 50;

setCanvasSize();
init();

function setCanvasSize() {
	WIDTH = document.documentElement.clientWidth,
    HEIGHT = document.documentElement.clientHeight;                      

	canvas.setAttribute("width", WIDTH);
	canvas.setAttribute("height", HEIGHT);
}

function init() {
	ctx.strokeStyle = "white";
	ctx.shadowColor = "white";
	for (var i = 0; i < initStarsPopulation; i++) {
		stars[i] = new Star(i, Math.floor(Math.random()*WIDTH), Math.floor(Math.random()*HEIGHT));
		//stars[i].draw();
	}
	ctx.shadowBlur = 0;
	animate();
}

function animate() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    for (var i in stars) {
    	stars[i].move();
    }
    for (var i in dots) {
    	dots[i].move();
    }
    drawIfMouseMoving();
    requestAnimationFrame(animate);
}

window.onmousemove = function(e){
	mouseMoving = true;
	mouseX = e.clientX;
	mouseY = e.clientY;
	clearInterval(mouseMoveChecker);
	mouseMoveChecker = setTimeout(function() {
		mouseMoving = false;
	}, 100);
}


function drawIfMouseMoving(){
	if (!mouseMoving) return;

	if (dots.length == 0) {
		dots[0] = new Dot(0, mouseX, mouseY);
		dots[0].draw();
		return;
	}

	var previousDot = getPreviousDot(dots.length, 1);
	var prevX = previousDot.x; 
	var prevY = previousDot.y; 

	var diffX = Math.abs(prevX - mouseX);
	var diffY = Math.abs(prevY - mouseY);

	if (diffX < dotsMinDist || diffY < dotsMinDist) return;

	var xVariation = Math.random() > .5 ? -1 : 1;
	xVariation = xVariation*Math.floor(Math.random()*maxDistFromCursor)+1;
	var yVariation = Math.random() > .5 ? -1 : 1;
	yVariation = yVariation*Math.floor(Math.random()*maxDistFromCursor)+1;
	dots[dots.length] = new Dot(dots.length, mouseX+xVariation, mouseY+yVariation);
	dots[dots.length-1].draw();
	dots[dots.length-1].link();
}
//setInterval(drawIfMouseMoving, 17);

function degToRad(deg) {
	return deg * (Math.PI / 180);
}

            //模块化 每个功能函数去做自己相应的事情 代码可维护性 可扩展性
            //初始化函数
            var aShowList = document.querySelectorAll('.s_show div');//获取元素 H5
            var oShow = document.querySelector('.s_show');
            var oSend = document.querySelector('.send');
            var oBtn = document.querySelector('.btn');
            var oText = document.querySelector('.text');
            var time = 0;//上一次你发送的时间
            var time1 = 0;
            //点击发送弹幕
            
                oBtn.onclick = function(){//鼠标点击事件
                //oBtn.style.backgroundColor = randomColor();//按钮背景颜色变换
                time1 = new Date();
                oBtn.style.color = randomColor();//按钮字体颜色变换
                if(time1 - time > 3000){//2次发送的时间必须大于2秒
                var oDiv = document.createElement('div');//创建div
                oDiv.innerHTML = oText.value;//添加弹幕内容
                oDiv.className = 'magictime twisterInUp';//弹幕特效
                oShow.appendChild(oDiv);//添加一个子节点 
                init(oDiv);//初始化
                oText.value = '';
                time = time1;
                //console.log(time);
                   }else{
                       alert("请稍后再发~");

                   }
            }
            
            for(var i = 0;i < aShowList.length;i++){
                init(aShowList[i]);//执行初始化函数
            }
            
            function init(obj){//接受弹幕对象
            //确定top值的随机区间
                var screenHeight = document.documentElement.clientHeight;//获取屏幕可视高度
                var maxTop = screenHeight - oSend.offsetHeight - obj.offsetHeight;//高度差范围
                obj.style.top = maxTop * Math.random() + 'px';    
            //控制left值
                var screenWidth = document.documentElement.clientWidth;//获取可视宽度
                var maxLeft = screenWidth - obj.offsetWidth/* - Math.random() * 800 */;//随机宽度差
                obj.style.left = maxLeft + 'px';
            //弹幕的随机颜色
                obj.style.color = randomColor();
                /*setInterval(function(){
                    move(obj,maxLeft);
                },1000);*///普通定时器
                move(Math.random()*5+1,obj,maxLeft);
        }
            //弹幕移动函数
            function move(k,obj,maxLeft){
                var speed = k;//控制速度的变量
                maxLeft -= speed;//往左移动
                if(maxLeft > -obj.offsetWidth){
                    obj.style.left = maxLeft + 'px';
                    requestAnimationFrame(function(){
                    move(k,obj,maxLeft);
                });//H5新增的动画函数
                }else{
                    init(obj);//重新初始化 营造循环弹幕效果
                  /*  oShow.removeChild(obj);//DOM删除子节点 */
                }
            }
            //随机颜色函数
            function randomColor(){
                return '#' + Math.random().toString(16).slice(-6);//一行简化版截取后六位
                /*var str = '#';
                for(var i = 0;i < 6;i++){
                    str += Math.floor(Math.random() * 16).toString(16);
                }
                return str;*///普通逻辑版
            }
			