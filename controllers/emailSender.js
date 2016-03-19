var nodemailer= require('nodemailer');
var transporter = nodemailer.createTransport('smtps://'+process.env.GOOGLE_MAIL_USER+':'+process.env.GOOGLE_MAIL_PASSWORD+'@'+process.env.GOOGLE_MAIL_SERVER);

// sendOrgValidationEmail('evin92@gmail.com', 'targetUser', 'orgName')
exports.sendVolunNewActivityEmail  = function(targetUser, targetMail, orgName, activityName, volunNum){
  console.log('sendVolunNewActivityEmail:', targetMail, targetUser, orgName, activityName);
  eMai({
    targetEmail: targetMail,
    targetUserName: targetUser,
    titleSub: '機構新服務發佈通知',
    content: '機構 「'+orgName+'」剛剛提交了「'+activityName+'」 新服務，需求'+volunNum+'人，請至以下連結查看服務資訊：',
    link: 'http://tkkyvc.org.tw/youth/bevo'
  });
}
exports.sendOrgApplyEmail  = function(targetUser, targetMail, activityName){
  console.log('sendOrgApplyEmail:', targetMail, targetUser, activityName);
  eMai({
    targetEmail: targetMail,
    targetUserName: targetUser,
    titleSub: '志工申請通知',
    content: '有新志工提交貴機構之 「'+activityName+'」 申請，請至以下連結查看資訊：',
    link: 'http://tkkyvc.org.tw/youth/findvo'
  });
}
exports.sendOrgValidationCheckEmail = function(targetUser, targetMail){
  console.log('sendOrgValidationCheckEmail:', targetMail, targetUser);
  eMai({
    targetEmail: targetMail,
    targetUserName: targetUser,
    titleSub: '機構審核完成通知',
    content: '貴機構的審核申請已通過確認，請至以下連結查看並開始使用：',
    link: 'http://tkkyvc.org.tw/youth/findvo'
  });
}
exports.sendOrgValidationUnAuthEmail = function(targetUser, targetMail){
  console.log('sendOrgValidationCheckEmail:', targetMail, targetUser);
  eMai({
    targetEmail: targetMail,
    targetUserName: targetUser,
    titleSub: '機構身份變更通知',
    content: '貴機構的身份認證已被取消，請聯絡志工中心或至以下連結查看：',
    link: 'http://tkkyvc.org.tw/youth/findvo'
  });
}

exports.sendOrgValidationEmail = function(targetUser, targetMail, orgName){
  console.log('sendOrgValidationEmail:', targetMail, targetUser, orgName);
  eMai({
    targetEmail: targetMail,
    targetUserName: targetUser,
    titleSub: '機構送交審核通知',
    content: orgName+' 機構已送交審核申請，請至以下驗證身份：',
    link: 'http://tkkyvc.org.tw/orgVerify'
  });
}
initEmail();
function initEmail(){
  // console.log('sendOrgValidationEmail:', targetMail, targetUser, orgName);
  eMai({
    targetEmail: 'crawljw@gmail.com',
    targetUserName: 'LJW',
    titleSub: 'TKKYVC伺服器-啟動通知',
    content: Date()+'伺服器啟動，前往:',
    link: 'http://tkkyvc.org.tw/'
  });
}

function eMai(sMyJSON){
  
  // Message object
  var message = {

      // sender info
      from: '北基金青年志工中心 <tkkyvc@gmail.com>',

      // Comma separated list of recipients
      to: sMyJSON.targetEmail,

      // Subject of the message
      subject: sMyJSON.titleSub, //

      headers: {
        'X-Laziness-level': 1000
      },

      // plaintext body
      text: 'tkkyvc',

      // HTML body
      html: '<div bgcolor="#EEEEEE" style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;color:#565a5c;min-height:100%;background-color:#f7f7f7;font-size:16px;line-height:150%;width:100%!important">\
<div style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;width:0;min-height:0;color:transparent;display:none!important"></div>\
<table style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;line-height:150%;border-spacing:0;background-color:#f7f7f7;width:100%">\
<tbody><tr style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif">\
<td style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif"></td>\
<td style="padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;display:block!important;margin:0 auto!important;clear:both!important;max-width:610px!important">\
<div style="font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;padding:15px;max-width:600px;display:block;margin:0 auto;padding-left:5px;padding-right:5px;padding-bottom:5px;padding-top:0px">\
<table style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;line-height:150%;border-spacing:0;margin-bottom:10px;margin-top:10px;width:100%">\
<tbody><tr style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif">\
<td style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif"></td>\
<td style="padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;display:block!important;margin:0 auto!important;clear:both!important;max-width:610px!important">\
<div style="font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;padding:15px;max-width:600px;display:block;margin:0 auto;padding-left:5px;padding-right:5px;padding-bottom:5px;padding-top:0px">\
<table style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;border-spacing:0;line-height:150%;width:100%">\
<tbody><tr style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif">\
<td style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;text-align:center">\
<a href="http://tkkyvc.org.tw" title="北基金青年志工中心" style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;color:#ff5a5f;text-decoration:none" target="_blank">\
<img src="http://tkkyvc.org.tw/img/yvcLogo.png" border="0" alt="北基金青年志工中心" width="123" height="123" style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;max-width:100%;border:0">\
</a>\
</td>\
</tr>\
</tbody></table>\
</div>\
</td>\
<td style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif"></td>\
</tr>\
</tbody></table>\
<div style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif">\
<div style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif">\
'+sMyJSON.targetUserName+'，您好：\
</div>\
<div style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;margin-top:1em">\
'+sMyJSON.content+'\
</div>\
<div style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;margin-top:1em">\
<a href="'+sMyJSON.link+'" style="margin:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;border:1px solid;display:block;padding:10px 16px;text-decoration:none;border-radius:2px;text-align:center;vertical-align:middle;font-weight:bold;white-space:nowrap;background:#ffffff;border-color:#F3BB45;background-color:#F3BB45;color:#ffffff;border-top-width:1px" target="_blank">\
前往\
</a>\
</div>\
<div style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;margin-top:1em">\
謝謝！ <br style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif">北基金志工中心 團隊\
</div>\
<div style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;color:#eeeeee;font-size:1px;min-height:1px;line-height:1px">2015-09-18 18:19:24 +0000</div>\
</div>\
<br style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif"><br style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif">\
</div>\
</td>\
<td style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif"></td>\
</tr>\
<tr style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif">\
<td style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif"></td>\
<td style="padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;display:block!important;margin:0 auto!important;clear:both!important;max-width:610px!important">\
<div style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif">\
<div style="font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;max-width:600px;padding:15px;margin:0 auto;display:block;padding-bottom:5px;padding-top:0px;color:#9ca299;font-size:14px;text-align:center;padding-left:5px;padding-right:5px">\
<table cellpadding="10" style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;border-spacing:0;line-height:150%;width:100%;padding:10px">\
<tbody><tr style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif">\
<td align="center" style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif">\
<table cellpadding="5" style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;border-spacing:0;line-height:150%;width:100%;width:auto">\
<tbody><tr style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif">\
<td style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;padding:5px">\
<a href="https://www.facebook.com/pkkvolunteer/" title="Facebook" style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;color:#ff5a5f;text-decoration:none" target="_blank">\
<img alt="Facebook" height="42" src="https://ci5.googleusercontent.com/proxy/J93KSR75YSSwYTGKthe3XskWGErWPvIBoPCfnHxG0l30T3kdR-udXm46snmIg6mqv4dX4a4yWeFsk5YaB_nTzbHnJtoVEPCKS9gU8zc_qbcgqmTc6Wwp-OzFxKtykhQoIVtfm1FGT_tYUMmvlhR2Iz3-ssDid9k=s0-d-e1-ft#https://a1.muscache.com/airbnb/rookery/email/footer/facebook-942db036304a4d7531bd634125b0ed95.png" width="42" style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;max-width:100%;border:0">\
</a> </td>\
</tr>\
</tbody></table>\
</td>\
</tr>\
</tbody></table>\
<table style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;border-spacing:0;line-height:150%;width:100%">\
<tbody><tr style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif">\
<td style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif"></td>\
<td style="padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;display:block!important;margin:0 auto!important;clear:both!important;max-width:610px!important">\
<div style="font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;padding:15px;max-width:600px;margin:0 auto;display:block;padding-left:5px;padding-right:5px;padding-bottom:5px;padding-top:0px;color:#9ca299;font-size:14px;text-align:center">\
由北基金青年志工中心系統發送<br style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif">\
請勿回覆此信\
</div>\
</td>\
<td style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif"></td>\
</tr>\
</tbody></table>\
</div>\
<div style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;color:#eeeeee;font-size:1px;min-height:1px;line-height:1px">2015-09-18 18:19:24 +0000</div>\
</div>\
<br style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif"><br style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif">\
</td>\
<td style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif"></td>\
</tr>\
</tbody></table>\
<span style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;font-size:1px!important;color:#eeeeee!important">### 北基金青年志工中心 ###</span>\
</div>'

  };

  transporter.sendMail(message, function(error, info) {
    if (error) {
        console.log('Error occurred');
        console.log(error.message);
        return;
    }
    console.log('Message sent successfully!->['+sMyJSON.titleSub+'] Send to: '+sMyJSON.targetUserName+', email:'+sMyJSON.targetEmail);
    console.log('Server responded with %s', info.response);
  });
    
}