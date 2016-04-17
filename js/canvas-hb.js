$(function(){
    var box=$(".box");
    var copy=$(".copy");
    var canvas=$("canvas");
    // 绘制2d图形
    var cobj=canvas[0].getContext("2d");
    canvas.attr({
        width:copy.width(),
        height:copy.height()
    });


    $(".hasson").hover(function(){
        $(this).find("ul").finish();
        $(this).find("ul").slideDown(300);
    },function(){
        $(this).find("ul").slideUp(300);
    });


    var obj=new shape(copy[0],canvas[0],cobj,$(".xp"),$(".selectarea"));
    //画图的类型
    $(".shapes li").click(function(){
        //$(".shapes li").css({background:"rgb(152,213,130)",color:"#000"});
        //$(this).css({background:"#87A3F9",color:"#fff"});
        if($(this).attr("data-role")!="pen"){
            obj.shapes=$(this).attr("data-role");
            obj.draw();
        }else{
            obj.pen();
        }
    });
    // 画图的方式
    $(".type li").click(function(){
        //$(".type li").css({background:"rgb(152,213,130)",color:"#000"});
        //$(this).css({background:"#87A3F9",color:"#fff"});
        obj.type=$(this).attr("data-role");
        obj.draw();
    });
    // 背景颜色
    $(".fillColor input").change(function(){
        obj.bgcolor=$(this).val();
        obj.draw();
    });
    //边框颜色
    $(".lineColor input").change(function(){
        obj.bordercolor=$(this).val();
        obj.draw();
    });

    //边框的宽度

    $(".lineWidth select").click(function(){
        console.log($(this).val());
        obj.lineWidth=$(this).val();
        obj.draw();
    });
    // 设置橡皮的大小
    $(".xpSize select").click(function(){
        var xpw=$(this).val();
        var xph=$(this).val();
        var xp= $(".xp");
        obj.xp(xp,xpw,xph);
    });
    // 对文件的操作
    // 新建(N)     后退(Z)    保存(S)
    $(".file li").click(function () {
        var index=$(this).index(".file li");
        if(index==0){
            if(obj.history.length>0){
                var yes=window.confirm("是否要保存");
                if(yes){
                    location.href=(canvas[0].toDataURL().replace("data:image/png","data:stream/octet"));
                }
            }
            obj.history=[];
            cobj.clearRect(0,0,canvas[0].width,canvas[0].height);
        }else if(index==1){
            cobj.clearRect(0,0,canvas[0].width,canvas[0].height);
            if(obj.history.length==0){
                alert("不能后退");
                return;
            }
            var data=obj.history.pop();
            cobj.putImageData(data,0,0);
        }else {
            location.href=(canvas[0].toDataURL().replace("data:image/png","data:stream/octet"));
        }
    })
    $(".select").click(function(){
        obj.select($(".selectarea"));
    });





    // 设置快捷键
    // 新建(N)     后退(Z)    保存(S)
    document.onkeydown=function(e){
        if(e.keyCode==78){
            //e.ctrlKey &&
            if(obj.history.length>0){
                var yes=window.confirm("是否要保存");
                console.log(yes);
                if(yes){
                    location.href=(canvas[0].toDataURL().replace("data:image/png","data:stream/octet"));
                }
            }
            obj.history=[];
            cobj.clearRect(0,0,canvas[0].width,canvas[0].height);
        }
        if(e.keyCode==90){
            cobj.clearRect(0,0,canvas[0].width,canvas[0].height);
            if(obj.history.length==0){
                alert("不能后退");
                return;
            }
            var data=obj.history.pop();
            cobj.putImageData(data,0,0);
        }
        if(e.keyCode==83){
            location.href=(canvas[0].toDataURL().replace("data:image/png","data:stream/octet"));
        }
        //console.log(e.keyCode);
    }









    //形状
    //$(".hasson").eq(1).find(".son li").click(function(){
    //    obj.shapes=$(this).attr("data-role");
    //    obj.type="fill";
    //    obj.bgcolor="blue";
    //    obj.draw();
    //})

    //obj.pen();











})