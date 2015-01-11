"use strict";
;(function(){
	//用来创建一个时间相关的类
	var funTime;

	funTime = function(){
		var funTime = function(opts){
			if(!opts.element){
				throw new Error("Element can not be empty");
			}
			if(opts.element.tagName != "CANVAS"){
				throw new Error("the element must be canvas");
			}
			this._opts = opts;
			this.init();
		}
		funTime.prototype.init = function(){
			//计算天时分秒的位置
			var opts = this._opts;
			opts.cxt = opts.element.getContext("2d");
			//设置数字填充色，没有的话用默认值
			opts.cxtFillStyle = typeof(opts.fillStyle) == "undefined" || opts.fillStyle == "" ? "#0080FF" : opts.fillStyle;

			opts.cxtWidth = opts.element.offsetWidth;
			opts.cxtHeight = opts.element.offsetHeight;
			//设置canvas宽高
			opts.element.setAttribute("width", opts.cxtWidth);
			opts.element.setAttribute("height", opts.cxtHeight);

			//设置数字的间距
			opts.marginLeft = typeof(opts.marginLeft) == "undefined" || opts.marginLeft == "" ? 10 : opts.marginLeft;

			//让内容充满整个canvas容器
			opts.radius = parseInt(opts.cxtWidth/8/16);

			//设置随机掉落彩球的颜色
			this._opts.colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"];

			//彩球
			this._opts.balls=[];
			opts.marginTop = typeof(opts.marginTop) == "undefined" || opts.marginTop == "" ? 20 : opts.marginTop;;
			this._opts = opts;
		}
		funTime.prototype.begin = function(obj){
			setInterval(function(){
				obj._opts.cxt.clearRect(0, 0, obj._opts.cxtWidth, obj._opts.cxtHeight);
				obj.showtime();
			},50);
		}
		funTime.prototype.showtime = function(time){
			if(time == undefined || time < new Date().getTime()/1000){
				this._opts.count = 0; //统计显示了多少个内容
				//显示时钟
				var time = new Date();
				//var day = time.getDate() < 10 ? "0"+time.getDate() : time.getDate();
				var hour = time.getHours() < 10 ? "0"+time.getHours() : time.getHours();
				var minutes = time.getMinutes() < 10 ? "0"+time.getMinutes() : time.getMinutes();
				var seconds = time.getSeconds();
				seconds = parseInt(seconds) < 10 ? "0"+parseInt(seconds) : parseInt(seconds);

				//计算需要显示的彩球
				if(typeof(this._opts.lastNums) != "undefined"){
					this.calcBalls(hour,  minutes, seconds);
				}
				//记录上次的时间，用于更新彩球
				this._opts.lastNums = {
					hour: hour,
					minutes: minutes,
					seconds: seconds,
				}
				//this.rederNums(this._opts.count,0,day);
				this.rederNums(this._opts.count,this._opts.marginTop,hour);
				this.renderAlphabet(this._opts.count,this._opts.marginTop,"colon");
				this.rederNums(this._opts.count,this._opts.marginTop,minutes);
				this.renderAlphabet(this._opts.count,this._opts.marginTop,"colon");
				this.rederNums(this._opts.count,this._opts.marginTop,seconds);
				this.showballs();
				this.updateballs();
			}
		}
		//绘制小球
		funTime.prototype.showballs = function(){
			for(var i in this._opts.balls){
				var ball = this._opts.balls[i];
				this._opts.cxt.fillStyle = ball.color;
				this._opts.cxt.beginPath()
				this._opts.cxt.arc(ball.x, ball.y, this._opts.radius, 0, 2*Math.PI);
				this._opts.cxt.closePath();
				this._opts.cxt.fill();
			}
		}
		//更新小球的位置
		funTime.prototype.updateballs = function(){
			for(var i in this._opts.balls){
				this._opts.balls[i].x += this._opts.balls[i].vx;
				this._opts.balls[i].y += this._opts.balls[i].vy;
				this._opts.balls[i].vy += this._opts.balls[i].g;
				//更新出界的小球
				if(this._opts.balls[i].y >= this._opts.cxtHeight){
					this._opts.balls[i].y = this._opts.cxtHeight;
					this._opts.balls[i].vy = -this._opts.balls[i].vy*0.5;
				}
			}

			//移除出界的小球
			var cnt = 0;
			for(var i in this._opts.balls){
				if(this._opts.balls[i].x+this._opts.radius > 0 && this._opts.balls[i].x-this._opts.radius < this._opts.cxtWidth)
					this._opts.balls[cnt++] = this._opts.balls[i];
			}

			while(this._opts.balls.length > cnt){
				this._opts.balls.pop();
			}

		}
		//绘制数字
		funTime.prototype.rederNums = function(x, y, num){
			this._opts.cxt.fillStyle = this._opts.cxtFillStyle;
			//渲染one对应的数字或者内容
			var nums = String(num).split("");
			for(var k in nums){
				x = this._opts.marginLeft*(this._opts.count+1)+(this._opts.radius+1)*7*2*this._opts.count;
				this._opts.count++;
				num = digit[nums[k]];
				for(var i=0; i<num.length; i++)
					for(var j=0; j<num[i].length; j++)
						if(num[i][j] == 1){
							this._opts.cxt.beginPath();
							this._opts.cxt.arc(x+(this._opts.radius+1)*(2*j+1), y+(this._opts.radius+1)*(2*i+1), this._opts.radius, 0, 2*Math.PI);
							this._opts.cxt.closePath();
							this._opts.cxt.fill();	
						}
			}
		}
		//绘制非数字
		funTime.prototype.renderAlphabet = function(x, y, alphabet){
			this._opts.cxt.fillStyle = this._opts.cxtFillStyle;
			x = this._opts.marginLeft*(this._opts.count+1)+(this._opts.radius+1)*7*2*this._opts.count;
			alphabet = digit[alphabet];
			this._opts.count++;
			for(var i=0; i<alphabet.length; i++)
				for(var j=0; j<alphabet[i].length; j++)
					if(alphabet[i][j] == 1){
						this._opts.cxt.beginPath();
						this._opts.cxt.arc(x+(this._opts.radius+1)*(2*j+1), y+(this._opts.radius+1)*(2*i+1), this._opts.radius, 0, 2*Math.PI);
						this._opts.cxt.closePath();
						this._opts.cxt.fill();	
					}

		}
		//计算,需要彩球
		funTime.prototype.calcBalls = function(hour,  minutes, seconds){

			if(this._opts.lastNums.hour != hour){
				hour = String(hour).split("");
				//计算更新小时的彩球
				for(var i=0; i<2; i++){
					this.addBalls(1+i, hour[i]);
				}
			}

			if(this._opts.lastNums.minutes != minutes){
				minutes = String(minutes).split("");
				//计算更新分钟的彩球
				for(var i=0; i<2; i++){
					this.addBalls(4+i, minutes[i]);
				}
			}

			if(this._opts.lastNums.seconds != seconds){
				seconds = String(seconds).split("");
				//计算更新小时的彩球
				for(var i=0; i<2; i++){
					this.addBalls(7+i, seconds[i]);
				}
			}

		}

		//添加彩球
		funTime.prototype.addBalls = function(pos, num){
			num = digit[num];
			for(var i=0; i<num.length; i++)
				for(var j=0; j<num[i].length; j++)
					if(num[i][j] != 0){
						var aBall = {
							x: (pos-1)*7*2*(this._opts.radius+1)+pos*this._opts.marginLeft+(this._opts.radius+1)*(j*2+1),
							y: this._opts.marginTop+(this._opts.radius+1)*(i*2+1),
							g: 1.5+Math.random(),
							vx: Math.pow(-1, Math.ceil(Math.random()*1000))*5,
							vy: -5,
							color: this._opts.colors[Math.floor(Math.random()*this._opts.colors.length)],
						}
						this._opts.balls.push(aBall);
					}
		}

		funTime.prototype.whosopts = function(){
			console.log(this._opts);
		}
		return funTime;
	}();
	window.funTime = funTime;
}());

var t =new funTime({element:document.getElementById("times")});
t.begin(t);
