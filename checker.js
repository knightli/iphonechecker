/*jshint node:true*/
"use strict";

var request = require('request');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var fs = require('fs');
var moment = require('moment');

var config = JSON.parse(fs.readFileSync('./config.json','utf8'));

var wishlist = config.wishlist;
var mail = config.mail;
var transport;

function getAllInfo(){
    console.info('===== getAllInfo ('+time()+') =====');
    for(var i=0,len=wishlist.length; i<len; i++){
        if(!wishlist[i].disable) getInfo(wishlist[i],i);
    }
}

function time(){
    return moment().format("MM月DD日 HH:mm:ss");
}


var productTitleMap = {};

function getProductTitleMap(){
    var products = JSON.parse(fs.readFileSync('./products.json','utf8'));

    for(var id in products){

        var item = products[id];
        item.id = id;

        var title = item.url;
        var titleArr = title.split('/');
        var which = titleArr[0];
        var name = titleArr[1];

        item.checkURL = 'http://store.apple.com/hk-zh/buyFlowSelectionSummary/' +
            which.toUpperCase() + '?' +
            'node=home/shop_iphone/family/' + which +
            '&step=select&' +
            (item.summary.size ? ('&option.dimensionScreensize=' + item.summary.size + 'inch') : '') +
            '&option.dimensionColor=' + item.summary.color +
            '&option.dimensionCapacity=' + item.summary.size + 'gb' +
            '&option.carrierModel=UNLOCKED%2FWW' +
            '&carrierPolicyType=UNLOCKED';

        item.which = which;
        item.name = name;
        item.buyURL = 'http://store.apple.com/hk-zh/buy-iphone/' + which + '/' +encodeURIComponent(name);

        item.ticketURL = 'http://store.apple.com/hk-zh/buy-iphone/' + which + '?' 
            + 'cppart=UNLOCKED%2FWW&product='+id+'&step=accessories#';

        productTitleMap[title] = item;

    }

}

function getMapItemFromWishItem(wishItem){
    var title = wishItem.title;
    var item = productTitleMap[title];

    if(!item) console.info('title not found in map, title='+title);

    return item;
}

function getInfo(wishItem, i){

    var item = getMapItemFromWishItem(wishItem);

    request.get(item.checkURL,
        function(err, body, data){
            var info;
            console.info('['+(i+1)+'] '+item.url);
            if(data){
                data = JSON.parse(data);
            }
            if(typeof data==="object" && data.head.status=="200"){
                info = data.body;
            }
            if(info){
                var p_info = info.content.selected.purchaseOptions;
                //var title = info.content.selected.productTitle;
                //var suffix = ' - ' + title;
                var suffix = "";
                if(p_info.isBuyable===false){
                    console.info('------- 还没到货! '+suffix);
                    if(wishlist[i].lastAviableTime) wishlist[i].lastAviableTime = void(0);
                }
                else{
                    console.info('++++++++ 到货拉!!赶快下单!!! '+suffix);
                    var nowTime = new Date();
                    var haveABreak = false;
                    if(wishlist[i].lastAviableTime){
                        var diffTime = nowTime - wishlist[i].lastAviableTime;
                        console.info('diffTime='+diffTime);
                        if(diffTime<5*60*1000){
                            //若发现距离上一次检查有货的时间点在5分钟内, 暂时就不重复发邮件了
                            haveABreak = true;
                        }
                    }
                    wishlist[i].lastAviableTime = nowTime;
                    console.info('haveABreak='+haveABreak+',noNotify='+wishItem.noNotify);
                    if(!haveABreak && !wishItem.noNotify){//若在不应期或者配置了不提醒的产品, 不发邮件
                        console.info('send Mail...');
                        sendMail(item);
                    }
                }
            }
        }
    );
}

function sendMail(item){

    var trans = getTranport();

    var title = item.which+'-'+item.name;
    
    trans.sendMail({
        from: mail.from.auth.user,
        to: mail.to ? mail.to : mail.from.auth.user,
        subject: 'iPhone到货提醒:'+ title +'('+time()+')',
        html: '<p><a href="'+item.buyURL+'">'+title+'</a></p><p><a href="'+item.ticketURL+'">直接下单页</a></p>'
    }, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent success', info);
        }
    });
}

function getTranport(){
    if(!transport){
        transport = nodemailer.createTransport(smtpTransport(mail.from));
    }
    return transport;
}

function run(){
    getProductTitleMap();
    getAllInfo();
    var interval = setInterval(getAllInfo, 20000);
}

run();