港版商店iPhone6货源监控器(支持邮件提醒)
=====

> desc: check hk appstore and send mail if iphone is available

黄牛太多, 国行又没出来, 于是用node实现了一个港版iPhone的检查器, 支持邮件提醒

# 特性

- nodejs实现
- 可配置关注列表
- 每隔20s检查一次是否有货 (香港apple store)
- 有货则会触发邮件提醒 (需要配置发件服务以及收件人)


# 使用方法

- 编辑config.json

```
{
	//这里配置想要监控的型号
    "wishlist":[
        {
            "title": "iphone6/4.7-吋螢幕-128gb-太空灰-已解鎖"
            //这里title的值, 来自下面这个页面选择颜色,型号之后的地址栏: 
            //http://store.apple.com/hk-zh/buy-iphone/iphone6/5.5-吋螢幕-128gb-太空灰-已解鎖
            //只需要地址中后面的一部分拷贝出来放在这里即可
        },
        {
            "title": "iphone6/4.7-吋螢幕-64gb-太空灰-已解鎖"
        },
        {
            "title": "iphone6/4.7-吋螢幕-128gb-銀色-已解鎖"
        },
        {
            "title": "iphone6/4.7-吋螢幕-64gb-銀色-已解鎖"
        },
        {
            //注意, 这是一个测试用的item
            //可以通过更改noNotify的值为false来打开本item的邮件提醒, 以便测试是否能跑通流程.
            //disable可以彻底禁用这个item, 连check也不会check
            "disable": false,
            "noNotify": true,
            "title": "iphone5s/32gb-銀色-已解鎖"
        }
    ],
    //这里配置你想要用来发提醒邮件的邮箱smtp服务及账号密码
    "mail": {
    	//这里配置你想要用来发提醒邮件的邮箱smtp服务及账号密码
    	//默认配置的是sohu的smtp服务, 如果你也用这个邮件服务商, 那么修改一下下面的user和pass即可
    	//如果是其他邮件服务商, 不保证能够配置成功. 关于参数的配置可参照: https://github.com/andris9/Nodemailer#migration-guide
        "from":{
            "host": "smtp.sohu.com",
            "auth": {
                "user": "xxxxxx@sohu.com",
                "pass": "xxxxxxxx"
            },
            "debug": true
        },
        //这里配置你想要接收提醒的邮件地址
        "to": "xxxxxx@qq.com"
    }
}
```

- 测试

```
node checker.js
```
观察console打印并检查sendMail的运行是否正常, 是否能够发出邮件

- 利用forver守护进程
	- 安装forever
	`npm install forever -g`
	- 守护运行
	`forever start -o out.log -e err.log checker.js`
	- 查看守护列表
	`forever list`
	- 停止守护并结束所有任务
	`forever stopall`

关于forever更多信息: https://github.com/nodejitsu/forever
	
- 等待邮件提醒

使用手机或者某些提醒方便的客户端, 然后坐等收到邮件提醒吧.

提醒邮件会是这种格式:

标题: `iPhone到货提醒:iphone6-128gb-銀色-已解鎖(09月27日 22:52:30)`

正文: 

>iphone6/128gb-銀色-已解鎖 (带链接1)

>直接下单页 (带链接2)



	- 链接1: 点击后打开官方的选机器的页面, 你需要做的是到底部点购买, 然后就会进入下个链接
	
	- 链接2: 点击后打开官方的选机器配件的页面, 点这个链接可以跳过上面一个页面的加载过程, 所以稍微快一点, 你需要做的是选配件或者直接到右侧确认信息后点加入购物车
	



# 其他

## 两个有用的json地址以及格式样例

`https://reserve.cdn-apple.com/HK/en_HK/reserve/iPhone/stores.json`

```
{
  "updatedTime" : "4:39 PM",
  "stores" : [ {
    "storeNumber" : "R409",
    "storeName" : "Causeway Bay",
    "storeEnabled" : true
  }, {
    "storeNumber" : "R485",
    "storeName" : "Festival Walk",
    "storeEnabled" : true
  }, {
    "storeNumber" : "R428",
    "storeName" : "ifc mall",
    "storeEnabled" : true
  } ],
  "timezone" : "HKT",
  "updatedDate" : "Saturday, September 27",
  "reservationURL" : "https://reserve-hk.apple.com/HK/en_HK/reserve/iPhone"
}
```


`https://reserve.cdn-apple.com/HK/en_HK/reserve/iPhone/availability.json`


```
{
  "R485" : {
    "MGAF2ZP/A" : false,//金色 128G  plus
    "MG492ZP/A" : false,//金色 16G
    "MGAC2ZP/A" : false,//灰色 128G  plus
    "MGA92ZP/A" : false,//银色 16G   plus
    "MG4F2ZP/A" : false,//灰色 64G
    "MG472ZP/A" : false,//灰色 16G
    "MG4A2ZP/A" : false,//灰色 128g
    "MGAK2ZP/A" : false,//金色 64G   plus
    "MGAA2ZP/A" : false,//金色 16G   plus
    "MG4J2ZP/A" : false,//金色 64G
    "MGAJ2ZP/A" : false,//银色 64G   plus
    "MG4H2ZP/A" : false,//银色 64G
    "MGAE2ZP/A" : false,//银色 128G  plus
    "MG4E2ZP/A" : false,//金色 128G
    "MG482ZP/A" : false,//银色 16G
    "MGAH2ZP/A" : false,//灰色 64G
    "MG4C2ZP/A" : false,//银色 128G
    "MGA82ZP/A" : false //灰色 16G   plus
  },
  "R409" : {
    "MGAF2ZP/A" : false,
    "MG492ZP/A" : false,
    "MGAC2ZP/A" : false,
    "MGA92ZP/A" : false,
    "MG4F2ZP/A" : false,
    "MG472ZP/A" : false,
    "MG4A2ZP/A" : false,
    "MGAK2ZP/A" : false,
    "MGAA2ZP/A" : false,
    "MG4J2ZP/A" : false,
    "MGAJ2ZP/A" : false,
    "MG4H2ZP/A" : false,
    "MGAE2ZP/A" : false,
    "MG4E2ZP/A" : false,
    "MG482ZP/A" : false,
    "MGAH2ZP/A" : false,
    "MG4C2ZP/A" : false,
    "MGA82ZP/A" : false
  },
  "updated" : 1411804140412,
  "R428" : {
    "MGAF2ZP/A" : false,
    "MG492ZP/A" : false,
    "MGAC2ZP/A" : false,
    "MGA92ZP/A" : false,
    "MG4F2ZP/A" : false,
    "MG472ZP/A" : false,
    "MG4A2ZP/A" : false,
    "MGAK2ZP/A" : false,
    "MGAA2ZP/A" : false,
    "MG4J2ZP/A" : false,
    "MGAJ2ZP/A" : false,
    "MG4H2ZP/A" : false,
    "MGAE2ZP/A" : false,
    "MG4E2ZP/A" : false,
    "MG482ZP/A" : false,
    "MGAH2ZP/A" : false,
    "MG4C2ZP/A" : false,
    "MGA82ZP/A" : false
  }
}
```
