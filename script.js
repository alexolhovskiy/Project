//Olhovskiy A.S.//
var canvas=document.getElementById("mycanvas");
canvas.width=300;
canvas.height=300;
var ctx=canvas.getContext('2d');

function MyPoint(x,y)
{
	this.x=x;
	this.y=y;
}
function MyPoint3D(x,y,z)
{
	this.x=x;
	this.y=y;
	this.z=z;
}
var count=0;
function Hole(x,y)
{
	this.time=20;
	this.num=7;
	this.r=3;
	this.p=new MyPoint(x,y);
	this.arr=new Array();
	this.Set=function()
	{
		var a,r,xx,yy,audio;
		if(m.auto)
		{
			a=Math.random()*Math.PI*2;
			r=Math.random()*m.R;
			this.p.x+=Math.cos(a)*r;
			this.p.y+=Math.sin(a)*r;
		}
		else
		{
			a=Math.random()*Math.PI*2;
			r=Math.random()*m.r;
			this.p.x+=Math.cos(a)*r;
			this.p.y+=Math.sin(a)*r;
		}

		r=5;
		a=2*Math.PI/this.num;
		for(var i=0;i<this.num;i++)
		{
			if(i%2)
			{
				this.arr.push(new MyPoint(a*i,r));
			}
			else
			{
				this.arr.push(new MyPoint(a*i,r+Math.random()*r));
			}
		}
		
		count++;
		if(!(count%100))
		{
			is_ufo=true;
			ufo.Set();
		}
		audio=new Audio();
		audio.src="shoot2.mp3";
		audio.autoplay=true;
	}
	this.Set();
	this.Collision=function()
	{
		if(Math.sqrt(Math.pow((this.p.x-m_b.p.x),2)+Math.pow((this.p.y-m_b.p.y),2))<m_b.scale)
		{
			m_b.Blow();
			console.log("I am shoot it down");
		}
	}
	this.Collision();
	this.Draw=function()
	{
		ctx.fillStyle="rgb(255,0,0)";
		ctx.beginPath();
		ctx.moveTo(this.p.x+Math.cos(this.arr[0].x)*this.arr[0].y,this.p.y+Math.sin(this.arr[0].x)*this.arr[0].y);
		for(var i=1;i<this.num;i++)
		{
			ctx.lineTo(this.p.x+Math.cos(this.arr[i].x)*this.arr[i].y,this.p.y+Math.sin(this.arr[i].x)*this.arr[i].y);
		}
		ctx.closePath();
		ctx.fill();
		
		ctx.fillStyle="rgb(0,0,0)";
		ctx.beginPath();
		ctx.arc(this.p.x,this.p.y,this.r,0,2*Math.PI);
		ctx.closePath();
		ctx.fill();
		this.time--;
	}
}
function Cloud()
{
	this.scale=12;
	this.fluff_index=6;
	this.arr=new Array();
	this.left=true;
	this.p=new MyPoint((Math.random()*(canvas.width-this.fluff_index*10)),(Math.random()*(canvas.height-this.scale)));
	this.Set=function()
	{
		if((Math.random()*100)>50)
		{
			this.left=true;
		}
		else
		{
			this.left=false;
		}
		if(this.left)
		{
			for(var i=0;i<this.fluff_index;i++)
			{
				this.arr.push(new MyPoint3D((canvas.width+15*i),this.p.y,Math.sin(i*Math.PI/this.fluff_index)*this.scale));
			}
		}
		else
		{
			for(var i=0;i<this.fluff_index;i++)
			{
				this.arr.push(new MyPoint3D((-15*i),this.p.y,Math.sin(i*Math.PI/this.fluff_index)*this.scale));
			}
		}
	}
	this.Set();
	this.Move=function()
	{
		if(this.left)
		{
			if(this.arr[0].x>this.p.x)
			{
				for(var i=0;i<this.fluff_index;i++)
				{
					this.arr[i].x-=10;
				}
			}
		}
		else
		{
			if(this.arr[0].x<this.p.x)
			{
				for(var i=0;i<this.fluff_index;i++)
				{
					this.arr[i].x+=10;
				}
			}
		}
	}
	this.Draw=function()
	{
		ctx.fillStyle="rgb(234,217,220)";
		for(var i=0;i<this.fluff_index;i++)
		{
			ctx.beginPath();
			ctx.arc(this.arr[i].x,this.arr[i].y,this.arr[i].z,0,2*Math.PI);
			ctx.closePath();
			ctx.fill();
		}
	}
}
function Piece(arr)
{
	this.arr=arr;
	this.vx=this.arr[2].x-this.arr[0].x;
	this.vy=this.arr[2].y-this.arr[0].y;
	this.step=this.arr[1].y;
	this.svx=this.vx/this.step;
	this.svy=this.vy/this.step;
	
	this.Move=function()
	{
		this.step-=2;
		this.vx=this.svx*this.step;
		this.vy=this.svy*this.step;
		this.arr[0].x+=this.vx;
		this.arr[0].y+=this.vy;
		this.arr[2].x+=this.vx;
		this.arr[2].y+=this.vy;
	}
	this.Draw=function()
	{
		ctx.fillStyle="rgb(255,0,0)";
		ctx.beginPath();
		ctx.moveTo(this.arr[0].x,this.arr[0].y);
		ctx.lineTo(this.arr[0].x+Math.cos(this.arr[1].x)*this.step,this.arr[0].y+Math.sin(this.arr[1].x)*this.step);
		ctx.lineTo(this.arr[0].x+Math.cos(this.arr[3].x)*this.step,this.arr[0].y+Math.sin(this.arr[3].x)*this.step);
		ctx.closePath();
		ctx.fill();
	}
}

function Moving_Block(x,y,s,v_sp,h_sp,z_sp)
{
	this.score=0;
	this.level=1;
	this.p=new MyPoint(x,y);
	this.right_left=true;
	this.top_bottom=true;
	this.forward_backward=true;
	this.max_scale=s;
	this.scale=s/2.5;
	this.min_scale=s/2.5;
	this.vertical_speed=v_sp;
	this.horisontal_speed=h_sp;
	this.z_speed=z_sp;
	this.deep=100;
	this.timer=100;
	this.whole=true;
	this.arr=new Array();
	this.a=1;
	this.Set=function()
	{
		this.timer=100;
		this.score++;
		if(!(this.score%3))
		{
			this.level++;
			this.vertical_speed+=2;
			this.horisontal_speed+=2;
			s_arr.push(new Cloud());
			this.timer-=10;
			if(this.score>10)
			{
				m.auto=true;
			}
		}
		this.p.x=this.scale+Math.random()*(canvas.width-this.scale);
		this.p.y=this.scale+Math.random()*(canvas.height-this.scale);
	}
	this.Blow=function()
	{
		this.whole=false;
		var step=Math.PI/6;
		var Arr;
		for(var i=0;i<24;i+=2)
		{
			Arr=new Array();
			Arr.push(new MyPoint(this.p.x,this.p.y));
			Arr.push(new MyPoint((step*i),this.scale));
			Arr.push(new MyPoint(this.p.x+Math.cos(step*(i+1))*this.scale,this.p.y+Math.sin(step*(i+1))*this.scale));
			Arr.push(new MyPoint((step*(i+2)),this.scale));
			p_arr.push(new Piece(Arr));
		}
		
		var num=12,r=20,a=2*Math.PI/num;
		for(var i=0;i<num;i++)
		{
			if(i%2)
			{
				this.arr.push(new MyPoint(a*i,r));
			}
			else
			{
				this.arr.push(new MyPoint(a*i,r+Math.random()*2*r));
			}
			console.log(a);
			console.log(this.arr[i]);
		}
		var audio=new Audio();
		audio.src="lop.mp3";
		audio.autoplay=true;
	}	
	this.Move=function()
	{
		if(this.whole)
		{
			if(this.timer)
			{
				if(this.right_left)
				{
					if(this.p.x+this.scale<canvas.width)
					{
						this.p.x+=this.horisontal_speed;
					}
					else
					{
						this.right_left=false;
					}
				}
				else
				{
					if(this.p.x-this.scale>0)
					{
						this.p.x-=this.horisontal_speed;
					}
					else
					{
						this.right_left=true;
					}
				}
				if(this.top_bottom)
				{
					if(this.p.y+this.scale<canvas.height)
					{
						this.p.y+=this.vertical_speed;
					}
					else
					{
						this.top_bottom=false;
					}
				}
				else
				{
					if(this.p.y-this.scale>0)
					{
						this.p.y-=this.vertical_speed;
					}
					else
					{
						this.top_bottom=true;
					}
				}
				if(this.forward_backward)
				{
					if(this.scale<this.max_scale)
					{
						this.scale+=this.z_speed;
					}
					else
					{
						this.forward_backward=false;
					}
				}
				else
				{
					if(this.scale>this.min_scale)
					{
						this.scale-=this.z_speed;
					}
					else
					{
						this.forward_backward=true;
					}
				}
				this.timer--;
			}
		}
		else
		{
			for(var i=0;i<this.arr.length;i++)
			{
				this.arr[i].y+=5;
			}
			
			if(this.a>0)
			{
				this.a-=0.05;
			}
			else
			{
				this.a=1;
				this.whole=true;
				this.Set();
				this.arr.splice(0);
			}
		}	
	}
	this.Draw=function()
	{
		if(this.whole)
		{
			if(this.timer)
			{
				var grd=ctx.createRadialGradient(this.p.x,this.p.y, this.scale/10,this.p.x,this.p.y-5,this.scale);
				grd.addColorStop(0, "white");
				grd.addColorStop(1, "red");
				ctx.fillStyle=grd;//"rgb(255,0,0)";
				ctx.beginPath();
				ctx.arc(this.p.x,this.p.y,this.scale,0,2*Math.PI);
				ctx.closePath();
				ctx.fill();
			}
		}
		else
		{
			ctx.fillStyle="rgba(0,255,0,"+this.a+")";
			ctx.beginPath();
			ctx.moveTo(this.p.x+Math.cos(this.arr[0].x)*this.arr[0].y,this.p.y+Math.sin(this.arr[0].x)*this.arr[0].y);
			for(var i=1;i<this.arr.length;i++)
			{
				ctx.lineTo(this.p.x+Math.cos(this.arr[i].x)*this.arr[i].y,this.p.y+Math.sin(this.arr[i].x)*this.arr[i].y);
			}
			ctx.closePath();
			ctx.fill();
		}
	}
	this.T_Draw=function()
	{
		ctx.fillStyle="rgb(0,0,0)";
		ctx.font="12px Arial";
		ctx.fillText("Score: "+this.score,10,canvas.height-30);
		ctx.fillText("Level: "+this.level,80,canvas.height-30);
		ctx.fillText("Time Left: "+this.timer/10,160,canvas.height-30);
		if(m.auto)
		{
			ctx.fillText("Auto",250,canvas.height-30);
		}
		else
		{
			ctx.fillText("Single",250,canvas.height-30);
		}
		if((this.whole)&(!this.timer))
		{
			ctx.fillStyle="rgb(0,0,0)";
			ctx.font="24px Arial";
			ctx.fillText("Game Over",canvas.width/2-60,canvas.height/2);
		}
	}
}
function Mark(x,y,s)
{
	this.auto=false;
	this.p=new MyPoint(x,y);
	this.scale=s;
	this.R=30;
	this.r=5;
	this.l_m_d=false;
	this.time_for_reload=1;
	this.time=0;
	this.Move=function()
	{
		if(this.auto)
		{
			if(this.l_m_d)
			{
				if(this.time==this.time_for_reload)
				{
					h_arr.push(new Hole(this.p.x,this.p.y));
					this.time=0;
				}
				else
				{
					this.time++;
				}
			}
		}
	}
	this.Draw=function()
	{
		ctx.strokeStyle="rgb(0,0,0)";
		if(this.auto)
		{
			ctx.beginPath();
			ctx.moveTo(this.p.x-(this.R+this.scale/2),this.p.y);
			ctx.lineTo(this.p.x-(this.R-this.scale/2),this.p.y);
			ctx.closePath();
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(this.p.x,this.p.y-this.R-this.scale/2);
			ctx.lineTo(this.p.x,this.p.y-this.R+this.scale/2);
			ctx.closePath();
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(this.p.x+this.R-this.scale/2,this.p.y);
			ctx.lineTo(this.p.x+this.R+this.scale/2,this.p.y);
			ctx.closePath();
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(this.p.x,this.p.y+this.R+this.scale/2);
			ctx.lineTo(this.p.x,this.p.y+this.R-this.scale/2);
			ctx.closePath();
			ctx.stroke();
		}
		else
		{
			ctx.beginPath();
			ctx.moveTo(this.p.x-this.scale,this.p.y);
			ctx.lineTo(this.p.x+this.scale,this.p.y);
			ctx.closePath();
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(this.p.x,this.p.y-this.scale);
			ctx.lineTo(this.p.x,this.p.y+this.scale);
			ctx.closePath();
			ctx.stroke();
		}
	}
}
function UFO()
{
	this.num=8;
	this.step=(Math.PI/2)/this.num;
	this.p=new MyPoint(-50,100);
	this.arr=new Array();
	this.Set=function()
	{
		this.p.y=Math.random()*canvas.height;
		var r=50,delta=2*Math.sin(Math.PI/4)*r;
		for(var i=0;i<this.num+1;i++)
		{
			this.arr.push(new MyPoint(this.p.x+Math.cos(Math.PI/4+this.step*i)*r,this.p.y-delta/2+Math.sin(Math.PI/4+this.step*i)*r));
		}
		for(var i=0;i<this.num+1;i++)
		{	
			this.arr.push(new MyPoint(this.p.x+Math.cos(-Math.PI/4-this.step*i)*r,this.p.y+delta/2+Math.sin(-Math.PI/4-this.step*i)*r));
		}
	}
	this.Move=function()
	{
		var flag=false;
		for(var i=0;i<this.arr.length;i++)
		{
			this.arr[i].x+=10;
			if(this.arr[i].x<canvas.width)
			{
				flag=true;
			}
		}
		if(!flag)
		{
			for(var i=0;i<this.arr.length;i++)
			{
				this.arr[i].x-=400;
			}
			is_ufo=false;
			this.arr.splice(0);
		}
		var audio=new Audio();
		audio.src="ufo2.mp3";
		audio.autoplay=true;
	}
	this.Draw=function()
	{
		if(this.arr.length)
		{
			ctx.fillStyle="rgb(92,92,92)";
			ctx.beginPath();
			ctx.moveTo(this.arr[0].x,this.arr[0].y);
			for(var i=1;i<this.arr.length;i++)
			{
				ctx.lineTo(this.arr[i].x,this.arr[i].y);
			}
			ctx.closePath();
			ctx.fill();
		}
	}
}
var m_b=new Moving_Block(10,50,20,6,4,0.2);
var m=new Mark(150,150,10);
var s_arr=new Array();
var h_arr=new Array();
var ufo=new UFO();
var is_ufo=false;
var p_arr=new Array();
function TotalCommFunc()
{
	ctx.fillStyle="rgb(135,206,235)";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	ctx.strokeStyle="rgb(56,87,230)";
	ctx.font="34px Arial";
	ctx.strokeText("Chinese",canvas.width/2-60,canvas.height/3);
	ctx.strokeText("Baloon",canvas.width/2-55,2*canvas.height/3);
	
	if(is_ufo)
	{
		ufo.Move();
		ufo.Draw();
	}
		
	m_b.Move();
	m_b.Draw();
	if(s_arr.length)
	{
		for(var i=0;i<s_arr.length;i++)
		{
			s_arr[i].Move();
			s_arr[i].Draw();
		}
	}
	if(p_arr.length)
	{
		for(var i=0;i<p_arr.length;i++)
		{
			if(p_arr[i].step>0)
			{
				p_arr[i].Move();
				p_arr[i].Draw();
			}
			else
			{
				p_arr.splice(i,0);
			}
		}
	}
	if(h_arr.length)
	{
		for(var i=0;i<h_arr.length;i++)
		{
			if(h_arr[i].time)
			{
				h_arr[i].Draw();
			}
			else
			{
				h_arr.splice(i,0);
			}
		}
	}
	m.Move();
	m.Draw();
	m_b.T_Draw();
}
setInterval(TotalCommFunc,100);
document.addEventListener('mousemove',function(e){
	m.p.x=e.offsetX;
	m.p.y=e.offsetY;
	if(m.l_m_d)
	{
		console.log("Mouse down "+e.offsetX+' '+e.offsetY);
	}
});
document.addEventListener('click',function(e){
	console.log(e.offsetX+' '+e.offsetY);
	h_arr.push(new Hole(e.offsetX,e.offsetY));
	
});
document.addEventListener('mousedown',function(e){
	if(e.button==0)
	{
		m.l_m_d=true;
		console.log("left point down");
	}
});
document.addEventListener('mouseup',function(e){
	if(e.button==0)
	{
		m.l_m_d=false;
		console.log("left point up");
	}
});