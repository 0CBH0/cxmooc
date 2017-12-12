function shTj(){
	var checkall=true;
	var obj={};
	if(checkall){
		if($("#shxm").val().trim()==""){
			alert("姓名或者昵称没有填写哦！");
			checkall=false;
		}
	}
	if(checkall){
		if($("#shszd").val()==""){
			alert("所在地没有选择哦！");
			checkall=false;
		}
	}
	if(checkall){
		if($("#shsj").val()==""){
			alert("手机号没有填写哦！");
			checkall=false;
		}
	}
	if(checkall){
		var str= /^(1[3|4|5|7|8])\d{9}$/;
		if(!$("#shsj").val().match(str))
		{
			alert("请输入正确的11位手机号");
			checkall=false;
		}
	}
	if(checkall){
		var danxArr=[];
		var duoxArr=[];
		var pandArr=[];
		$(".shdtdx li").each(function(k){
			var o={};
			o.id=$(this).attr("data-id");
			o.result="0";
			danxArr.push(o);
		});
		obj.danx=danxArr;
		$(".shdtdxd li").each(function(k){
			var o={};
			o.id=$(this).attr("data-id");
			o.result="01";
			duoxArr.push(o);
		});
		obj.duox=duoxArr;
		$(".shdtdxp li").each(function(k){
			var o={};
			o.id=$(this).attr("data-id");
			o.result="0";
			pandArr.push(o);
		});
		obj.pand=pandArr;
		for(var i=0,len=obj.danx.length;i<len;i++) obj.danx[i].result = questionlist.danxuan[obj.danx[i].id].value;
		for(var j=0,lenj=obj.duox.length;j<lenj;j++) obj.duox[j].result=questionlist.duoxuan[obj.duox[j].id].value;
		for(var l=0,lenl=obj.pand.length;l<lenl;l++) obj.pand[l].result=questionlist.panduan[obj.pand[l].id].value;
		//console.log(obj);
		var url = 'http://active.kaiwind.com/kfvote/2017yunfan/submit.php?type=1&name='+encodeURIComponent($("#shxm").val())+'&location='+encodeURIComponent($("#shszd").val())+'&phone='+$("#shsj").val()+'&ar='+true+'&questions='+JSON.stringify(obj)+'&callback=?';
		jQuery.getJSON(url, function(data){
			if(data.ispass=="1"){
				alert("谢谢参与答题，提交成功！");
				location.reload();
			}else if(data.ispass=="2"){
				alert("提交地址不对!");
			}else if(data.ispass=="3"){
				alert("提交过于频繁!");
			}else if(data.ispass=="4"){
				alert("手机号已经提交过了!");
			}else if(data.ispass=="5"){
				alert("答题错误!");
			}
		}); 
	}
}
shTj()
