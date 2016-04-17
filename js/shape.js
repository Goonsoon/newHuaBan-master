//function shape(copy,canvas,cobj){
//    this.copy=copy;
//    this.canvas=canvas;
//    this.cobj=cobj;
//    this.bgcolor="#000";
//    this.bordercolor="#000";
//    this.lineWidth=10;
//    this.type="stroke";
//    this.shapes="line";
//    this.width=canvas.width;
//    this.height=canvas.height;
//    this.history=[];
//}
//shape.prototype={
//    draw:{
//        this.copy.onmousedown=function(e){
//            this.startX= e.offsetX;
//            this.startY= e.offsetY;
//            this.copy.onmousemove=function(e){
//                this.endX= e.offsetX;
//                this.endY= e.offsetY;
//            }
//        }
//        this.copy.onmouseup=function(e){
//
//}
//    }
//}


// 给shape添加属性
function shape(copy,canvas,cobj,xpobj,selectareaobj){
    this.copy=copy;
    this.canvas=canvas;
    this.cobj=cobj;
    this.xpobj=xpobj;
    this.selectareaobj=selectareaobj;
    this.bgcolor="#000";
    this.bordercolor="#000";
    this.lineWidth=1;
    this.type="stroke";
    this.shapes="line";
    this.width=canvas.width;
    this.height=canvas.height;
    // arr用于存储原来的图形
    this.history=[];
}

// 给shape原型链上添加方法
shape.prototype={
    init:function(){
        this.cobj.fillStyle=this.bgcolor;
        this.cobj.strokeStyle=this.bordercolor;
        this.cobj.lineWidth=this.lineWidth;

        this.selectareaobj.css("display","none");
        if (this.temp) {
            this.history.push(this.cobj.getImageData(0, 0, this.width, this.height));
            this.temp = null;
        }
    },
    line:function(x,y,x1,y1){
        var that=this;
        that.cobj.beginPath();
        that.cobj.moveTo(x,y);
        that.cobj.lineTo(x1,y1);
        that.cobj.closePath();
        that.cobj.stroke();
    },
    rect:function(x,y,x1,y1){
        var that=this;
        that.cobj.beginPath();
        that.cobj.rect(x,y,x1-x,y1-y);
        that.cobj.closePath();
        that.cobj[that.type]();//绘制2d stroke(线)/fill(填充)
    },
    cricle:function(x,y,x1,y1){
        var that=this;
        var r=Math.sqrt(Math.pow((x1-x),2)+Math.pow((y1-y),2));
        that.cobj.beginPath();
        that.cobj.arc(x,y,r,0,Math.PI*2);
        that.cobj.closePath();
        that.cobj[that.type]();//绘制2d stroke(线)/fill(填充)
    },
    star:function(x,y,x1,y1){
        var that=this;
        var r=Math.sqrt(Math.pow((x1-x),2)+Math.pow((y1-y),2));
        var sr=r/2;
        that.cobj.beginPath();
        that.cobj.moveTo(x+r,y);
        for(var i=1;i<10;i++){
            if(i%2==0){
                that.cobj.lineTo(x+Math.cos(i*36*Math.PI/180)*r,y+Math.sin(i*36*Math.PI/180)*r);
            }else{
                that.cobj.lineTo(x+Math.cos(i*36*Math.PI/180)*sr,y+Math.sin(i*36*Math.PI/180)*sr)
            }
        }
        that.cobj.closePath();
        that.cobj[that.type]();//绘制2d stroke(线)/fill(填充)
    },
    draw:function(){
        var that=this;
        that.init();
        that.copy.onmousedown=function(e){
            var startX= e.offsetX;
            var startY= e.offsetY;
            that.init();
            that.copy.onmousemove=function(e){
                that.cobj.clearRect(0,0,that.width,that.height);
                if(that.history.length>0){
                    that.cobj.putImageData(that.history[that.history.length-1],0,0);
                }
                var endX= e.offsetX;
                var endY= e.offsetY;
                that.cobj.beginPath();
                that[that.shapes](startX,startY,endX,endY);
                that.cobj.closePath();
            }
            that.copy.onmouseup=function(e){
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
            }
        }
    },
    pen:function(){
        var that=this;
        that.init();
        that.copy.onmousedown=function(e){
            if(that.history.length>0){
                that.cobj.putImageData(that.history[that.history.length-1],0,0);
            }
            var startX= e.offsetX;
            var startY= e.offsetY;
            that.init();
            that.cobj.beginPath();
            that.cobj.moveTo(startX,startY);
            that.copy.onmousemove=function(e){
                var endX= e.offsetX;
                var endY= e.offsetY;
                that.cobj.lineTo(endX,endY);
                that.cobj.stroke();
            }
            that.copy.onmouseup=function(){
                that.cobj.closePath();
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
            }
        }
    },
    xp:function(xpobj,w,h){
        var that=this;
        that.copy.onmousedown=function(e){
            that.copy.onmousemove=function(e){
                var ox= e.offsetX;
                var oy= e.offsetY;
                var lefts=ox-w/2;
                var tops=oy-h/2;
                if(lefts>that.canvas.width-w){
                    lefts=that.canvas.width-w;
                    console.log(lefts);
                }
                if(lefts<0){
                    lefts=0;
                }
                if(tops>that.canvas.height-h){
                    tops=that.canvas.height-h;
                }
                if(tops<0){
                    tops=0;
                }
                xpobj.css({display:"block",width:w,height:h,left:lefts,top:tops});
                that.cobj.clearRect(lefts,tops,w,h);
            }
            that.copy.onmouseup=function(){
                xpobj.css({display:"none"});
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.copy.onmousemove=null;
                that.copy.mouseup=null;
            }
        }
    },
    select:function(selectareaobj){
        var that=this;
        that.init();
        that.copy.onmousedown=function(e){
            var sx= e.offsetX;
            var sy= e.offsetY;
            var minx,miny,w,h;
            that.init();
            that.copy.onmousemove=function(e){
                that.init();
                var ex= e.offsetX;
                var ey= e.offsetY;
                minx=(sx-ex)?sx:ex;
                miny=(sy-ey)?sy:ey;
                w=Math.abs(sx-ex);
                h=Math.abs(sy-ey);
                selectareaobj.css({display:"block",width:w,height:h,left:minx,top:miny});
            }
            that.copy.onmouseup=function(e){
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
                that.temp=that.cobj.getImageData(minx,miny,w,h);
                that.cobj.clearRect(minx,miny,w,h);
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.cobj.putImageData(that.temp,minx,miny);
                that.drag(minx,miny,w,h,selectareaobj);

            }

        }

    },
    drag:function(x,y,w,h,selectareaobj){
        var that=this;
        that.copy.onmousemove=function(e){
            var ox= e.offsetX;
            var oy= e.offsetY;
            if(ox>x&&ox<x+w&&oy>y&&oy<y+h){
                that.copy.style.cursor="move";
            }else{
                that.copy.style.cursor="default";
            }
        }
        that.copy.onmousedown=function(e){
            var ox= e.offsetX;
            var oy= e.offsetY;
            var cx=ox-x;
            var cy=oy-y;
            if(ox>x&&ox<x+w&&oy>y&&oy<y+h){
                that.copy.style.cursor="move";
            }else{
                that.copy.style.cursor="default";
                return;
            }
            that.copy.onmousemove=function(e){
                that.cobj.clearRect(0,0,that.width,that.height);
                if(that.history.length!==0){
                    that.cobj.putImageData(that.history[that.history.length-1],0,0);
                }
                var endx= e.offsetX;
                var endy= e.offsetY;
                var lefts=endx-cx;
                var tops=endy-cy;
                if(lefts<0){
                    lefts=0;
                }
                if(lefts>this.width){
                    lefts=this.width;
                }
                if(tops<0){
                    tops=0
                }
                if(tops>this.height){
                    tops=this.height;
                }
                selectareaobj.css({
                    left:lefts,
                    top:tops
                });
                x=lefts;
                y=tops;
                that.cobj.putImageData(that.temp,lefts,tops);
            }
            that.copy.onmouseup=function(e){
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
                that.drag(x,y,w,h,selectareaobj);
            }

        }
    }


}

///////////////////////////////////////////////////

