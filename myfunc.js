var errorTest = 240;
var courseId = '';
var clazzId = '';
var chapterId = '';
var chapterIndex = 0;
var chapterIndexTest = chapterIndex;
var content = window.document.getElementsByClassName("ncells");
var itemStr = content[chapterIndex].innerHTML;
var reg = /id="cur([0-9]+)"/;
var mp;
var newMovie = 0;
var moviePlay = false;
var a = window.frames["iframe"].contentWindow.document.getElementsByTagName("iframe")[0].contentWindow;
function config(d){
	return a.frameElement.getAttribute(d);
}
function getCookie(c_name){
　　　　if (document.cookie.length>0){
　　　　　　c_start=document.cookie.indexOf(c_name + "=")　　　　
　　　　　　if (c_start!=-1){
　　　　　　　　c_start=c_start + c_name.length+1
　　　　　　　　c_end=document.cookie.indexOf(";",c_start)　
　　　　　　　　if (c_end==-1) c_end=document.cookie.length
　　　　　　　　return unescape(document.cookie.substring(c_start,c_end))
　　　　　　} 
　　　　}
　　　　return ""
}
function getCourseInfo(item)
{
     var infoReg = new RegExp("(^|&)"+ item +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(infoReg);
     if(r!=null)return  unescape(r[2]); return null;
}
function loadVideo() {
	var objectid = config('objectid');
	a.Ext.get('objectid').setHTML('文件ID:' + objectid);
	var reader = a.Ext.get('reader');
	if (!objectid) {
		reader.setHTML('未找到该文件');
		return;
	}
	var iframe = a.frameElement;
	var data = a.Ext.decode(iframe.getAttribute('data'));
	var setting = a.parent.AttachmentSetting;
	var mid = config('mid');
	var percent = 0;
	var vbegin = config('vbegin');
	var vend = config('vend');
	var jobid = config('jobid');
	var fastforward = config('fastforward') == 'true' ? true : false;
	var switchwindow = config('switchwindow') == 'true' ? true : false;
	var note = a.Ext.get('note');
	var hl = a.Ext.get('hl');
	var note1Wrap = a.Ext.get('note1-wrap');
	var note1 = a.Ext.get('note1');
	var timer = null;
	var rt = data ? (data.rt ? data.rt : 0.9) : 0.9;
	function request() {
		var k = getCookie('fid') || '';
		var url = "/ananas/status/"+objectid+"?k="+k;
		var httpRequest=false;
		httpRequest = new XMLHttpRequest();
		if(httpRequest.overrideMimeType){httpRequest.overrideMimeType('text/xml');}
		httpRequest.open('GET',url,false);
		httpRequest.send();
		var oData;
		if(httpRequest.readyState==4&&httpRequest.status==200){oData=eval("("+httpRequest.responseText+")")};
		a.Ext.get('loading').hide();
		switch(oData.status){
		case 'success':
			var d = oData.duration,
			paras = {
				enableFastForward : fastforward ? 0 : 1,
				enableSwitchWindow : switchwindow ? 0 : 1,
				duration: d,
				httpmd: oData.httpmd,
				http: oData.http,
				httphd: oData.httphd,
				httpshd: oData.httpshd,
				cdn: oData.cdn,
				filename: oData.filename,
				dtoken:oData.dtoken
			};
			if (document.cookie.length > 0){
				paras.memberinfo=getCookie('memberinfo');
			}
			if (mid) {paras.mid = mid;}
			if (oData.duration) {paras.videoTotalTime = oData.duration;}
			if (oData.screenshot) {paras.screenshot = oData.screenshot;}
			if (oData.thumbnails) {paras.thumbnails = oData.thumbnails;}
			if (vbegin) {paras.startTime = vbegin;}
			if (vend) {paras.endTime = vend;}
			paras.rt = rt;
			var m={},s,vb,ve;
			if(setting && setting.control){
				var attachments = setting.attachments,
				defaults = setting.defaults,
				spec = oData.objectid+"-"+(vbegin?vbegin:0)+"-"+(vend?vend:d);
				if (defaults) {
					paras.userid = defaults.userid || '';
					paras.fid = defaults.fid || '';
				}
				for(var i=0;i<attachments.length;i++){
					m = attachments[i],vb=0,ve=d;
					if(m.property){
						if(m.property.vbegin){vb = m.property.vbegin;}
						if(m.property.vend){ve = m.property.vend;}
					}
					s = m.objectId +"-"+vb+"-"+ve;
					if(spec == s){
						a.Ext.apply(paras,setting.defaults);
						paras.headOffset = Math.floor(parseInt(m.headOffset)/1000);
						paras.objectId = m.objectId;
						paras.otherInfo = m.otherInfo;
						paras.isPassed = m.isPassed;
						if(jobid){
							paras.jobid = jobid;
							if(!m.job){
								a.greenligth();
								ed_complete = false;
								paras.enableFastForward = 1;
								paras.headOffset = 0;
							}
						}
						paras.reportUrl = setting.defaults.reportUrl;
						a._jobindex = i;
						break;
					}
				}
			}
			mp = new a.MoocPlayer({isSendLog: !!a.parent.AttachmentSetting && a.parent.AttachmentSetting.control,data: paras,height: 540,width: 676});
			break;
		}
	}
	request();
}
function playNewMovie(){
	moviePlay = false;
	if(newMovie == 2){
		if(window.frames["iframe"].contentDocument.readyState == "complete"){
			a = window.frames["iframe"].contentWindow.document.getElementsByTagName("iframe")[0].contentWindow;
			a.MoocPlayer.prototype.pauseMovie = function(){if(this.player.getPlayState()!=1) this.player.playMovie();};
			loadVideo();
			newMovie = 1;
		}
	}
	if(newMovie == 1){
		while(mp.player.getPlayState()!=1){mp.player.goPlay();newMovie = 0;break;};
	}
	if(newMovie == 0){
		a = window.frames["iframe"].contentWindow.document.getElementsByTagName("iframe")[0].contentWindow;
		var attachment = a.parent.AttachmentSetting.attachments[0];
		if((attachment.job==false)||(attachment.isPassed==true)){
			chapterIndex++;
			errorTest = 240;
			chapterIndexTest = chapterIndex;
			if(chapterIndex<content.length){
				itemStr = content[chapterIndex].innerHTML;
				reg = /id="cur([0-9]+)"/;
				itemStr.replace(reg, function() {
					chapterId = arguments[1];
					getTeacherAjax(courseId,clazzId,chapterId);
					newMovie = 2;
				});
			}
		}else{
			moviePlay = true;
		}
	}
}
function playCheck(){
	if((moviePlay==true)&&(newMovie==0)&&(mp.player.getPlayState()!=1)){
		getTeacherAjax(courseId,clazzId,chapterId);
		newMovie = 2;
		moviePlay = false;
		errorTest = 240;
	}
	if(errorTest>0)
	{
		errorTest--;
	}else{
		errorTest = 240;
		if(chapterIndex<content.length){
			if(chapterIndexTest == chapterIndex){
				getTeacherAjax(courseId,clazzId,chapterId);
				newMovie = 2;
				moviePlay = false;
			}
		}
	}
}
setInterval('playNewMovie();',5000);
setInterval('playCheck();',10000);
courseId = getCourseInfo("courseId");
clazzId = getCourseInfo("clazzid");
itemStr.replace(reg, function() {
	chapterId = arguments[1];
	getTeacherAjax(courseId,clazzId,chapterId);
	newMovie = 2;
});
