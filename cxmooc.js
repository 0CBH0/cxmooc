// Copyright (C) 2016  0CBH0 <maodatou88@163.com>
// Licensed under the terms of the GNU GPL, version 3
// http://www.gnu.org/licenses/gpl-3.0.txt

var courseId = '87443251';
var clazzid = '592538';
var chapterId = '86886308';
getTeacherAjax(courseId,clazzid,chapterId);


function loadVideo()
{
	var objectid = config('objectid');
	Ext.get('objectid').setHTML('�ļ�ID:' + objectid);
	var reader = Ext.get('reader');
	if(!objectid)
	{
		reader.setHTML('δ�ҵ����ļ�');
		return;
	}
	var iframe = window.frameElement;
	var data = Ext.decode(iframe.getAttribute('data'));
	var setting = parent.AttachmentSetting;
	var mid = config('mid');
	var percent = 0;
	var vbegin = config('vbegin');
	var vend = config('vend');
	var jobid = config('jobid');
	var fastforward = config('fastforward') == 'true' ? true : false;
	var switchwindow = config('switchwindow') == 'true' ? true : false;
	var note = Ext.get('note');
	var hl = Ext.get('hl');
	var note1Wrap = Ext.get('note1-wrap');
	var note1 = Ext.get('note1');
	var timer = null;
	function request()
	{
		if(percent<=100)
		{
			hl.setWidth((percent+=5)+"%");
		}
		var k = getCookie('fid') || '';
		Ext.Ajax.request({
			url : '/ananas/status/'+objectid+'?k=' + k,
			success : function(response){
			var oData = eval('(' + response.responseText + ')');
			Ext.get('loading').hide();
			switch(oData.status)
			{
			case 'success':
				note1Wrap.remove();
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
					paras.questionErrorLogUrl= ServerHosts.MASTER_HOST + '/question/addquestionerror';
				}
				if (mid) {
					paras.mid = mid;
				}
				if (oData.duration) {
					paras.videoTotalTime = oData.duration;
				}
				if (oData.screenshot) {
					paras.screenshot = oData.screenshot;
				}
				if (oData.thumbnails) {
					paras.thumbnails = oData.thumbnails;
				}
				if (vbegin) {
					paras.startTime = vbegin;
				}
							
						if (vend) {
							paras.endTime = vend;
						}
						
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
									if(m.property.vbegin){
										vb = m.property.vbegin;
									}
									if(m.property.vend){
										ve = m.property.vend;
									}
								}
								
								s = m.objectId +"-"+vb+"-"+ve;
								
								if(spec == s){
									Ext.apply(paras,setting.defaults);
									
									paras.headOffset = Math.floor(parseInt(m.headOffset)/1000);
									paras.objectId = m.objectId;
									paras.otherInfo = m.otherInfo;
									paras.isPassed = m.isPassed;
										
									if(jobid){
										paras.jobid = jobid;
										if(!m.job){
											greenligth();										
											ed_complete = false;
											paras.enableFastForward = 1;
											paras.headOffset = 0;
										}
									}
									
									paras.reportUrl = setting.defaults.reportUrl;	
									window._jobindex = i;
									break;
								}
							}
						}
						
						timer && clearInterval(timer);
						
						if (!(Ext.isIpad || Ext.isIos)) {
							showMoocPlayer(paras);
						} else {
							showHTML5Player(paras);
						}
						
						break;
					case 'failed':
						timer && clearInterval(timer);
						note1Wrap.remove();
						note.show();
						break;
					case 'waiting':
						note1.update(Ext.String.format('�ļ����ڵȴ�ת���������Ķ���ʽ,ǰ�滹��{0}���ļ��Ŷӡ�  �ļ�ID: {1}', oData.queue, objectid));
						break;
					case 'converting':
						note1.update(Ext.String.format('���ϴ����ļ����ڴ���..., �ļ�ID:{0}', objectid));
						break;
					case 'transfer':
						note1.update(Ext.String.format('�ļ����ڴ��䣬�����ʹ�������ϴ������ƶ�λ��..., �ļ�ID:{0}', objectid));
					}
				},
				failure : function(resp){
					if(resp.status==404){
						timer &&��clearInterval(timer);
						note1Wrap.remove();
						note.show();
						Ext.get('loading').hide();
					}
				}
			});
		}
		
		request();
		timer = setInterval(request, 5000);
	}