﻿
module.exports = {
	cookieSecret:'myDB',
	DB_NAME:'myDB',
	DB_POS_HIS_NAME:'hisPosDB',
	DB_MSG_HIS_NAME:'hisMsgDB',
	DB_DMSG_HIS_NAME:'hisDMsgDB',
	DB_COLLECT_HIS_NAME:'hisCollectDB',
	// DB_PORT:27017,
	DB_PORT:21818,

	// //测试服务器
	// DB_HOST:'172.168.1.245',
	// DEFAULT_IMGID:'53aad75705f938655c1fb0ad',
	// Y1_IMGID:'43e3e457eafaee854778206c',
	// OLD_IMGID:'d79e0a59c57df81c1c58bf06',
	// OLD2_IMGID:'969e0a59b56251171cedcfe7',
	// EASE_ID:'YXA6E7g0EDniEeaS4InQvMX0ZA',
	// EASE_SECRET:'YXA6ZgV7Wx4UC9hMU8eOXTKhPW3HepY',
	// EASE_APPNAME:'locate',
	// XING_IOS_ENV:1,
	// SERVER_PATH:'http://test.xcloudtech.com',

	//正式服务器
	DB_HOST:'127.0.0.1',
	DEFAULT_IMGID:'53aad75705f938655c1fb0ad',
	Y1_IMGID:'e476005866e8a2a6407502b3',
	OLD_IMGID:'d79e0a59c57df81c1c58bf06',
	OLD2_IMGID:'969e0a59b56251171cedcfe7',
	EASE_ID:'YXA6E7g0EDniEeaS4InQvMX0ZA',
	EASE_SECRET:'YXA6ZgV7Wx4UC9hMU8eOXTKhPW3HepY',
	EASE_APPNAME:'locate',
	XING_IOS_ENV:1,
	SERVER_PATH:'http://api.xcloudtech.com',

	SMS_TIME_OUT:10,
	SMS_UID:'24jMQCbdTxsu',
	SMS_CID:'nBST6qwtNNU1',
	SMS_PAS:'dzcd4msr',
	
	//权限
	PRI_TOP:0,
	PRI_FOLLOW:1,
	PRI_BLACKLIST:2,
	PRI_HIDDEN:3,
	
	REL_STRANGER:0,
	REL_FRIEND:1,
	REL_REFUSED:2,
	
	MSG_FRIEND:0,
	MSG_POS:1,
	MSG_FENCE:2,
	MSG_RISK:3,
	MSG_CHECKIN:4,

	XG_SYSTEM:0,
	XG_FRIEND:1,
	XG_POS:2,
	XG_AMR:3,
	XG_PUSH_SAVE:4,
	XG_PUSH_WAKE:5,

	ACTION_ADD:0,
	ACTION_AGREE:1,
	ACTION_DEL:2,//删除群
	ACTION_QUIT:3,
	ACTION_REMOVE:4,//移除成员
	ACTION_OUT:5,
	ACTION_IN:6,
	ACTION_HELP:7,
	ACTION_CHECKIN:8,

	ACTION_LOWBAT:9,
	ACTION_WEAR:10,
	ACTION_FALL:11,

	ACTION_SEND_TEXT:3,
	ACTION_SEND_VOICE:4,
	
	RET_OK:0,
	RET_WARN:-1,
	RET_ERR:-2,
	RET_OTHER:1,

	UPLOAD_INTERVAL:5,//上传条件：时间间隔
	UPLOAD_DISTANCE:50,//上传条件：移动距离
	HB_INTERVAL:5,//心跳的时间间隔

	LOGIN_PHONE:'1',
	LOGIN_WEIXIN:'2',
	LOGIN_QQ:'3',
	LOGIN_WEIBO:'4',
	LOGIN_TOURIST:'5',

	MODE_POWER_SAVE:1,
	MODE_REGULAR:2,
	MODE_ACCURATE:3,
	
	ERROR_INPUT_MSG:'传入参数不能为空或者格式不对应',

	COLLECTION_CurrentPos:'CurrentPos',
	COLLECTION_Friends:'Friends',
	COLLECTION_Msg:'Msg',
	COLLECTION_Pos:'Pos',
	COLLECTION_User:'User',
	COLLECTION_UserSetting:'UserSetting',
	COLLECTION_Advice:'Advice',
	COLLECTION_Fence:'Fence',
	COLLECTION_FenceBind:'FenceBind',
	COLLECTION_BindTime:'BindTime',
	COLLECTION_USER_GROUP:'UserGroup',
	COLLECTION_DMsg:'DMsg',
	COLLECTION_Chat:'Chat',

	SIGN_KEY:'SPzxARMf3Ea9cI5DFn4s',
	DEVICE_SIGN_KEY:'v2USSkyFE53YJ1Ael2GY',
	GROUP_SIGN_KEY:'M3qw3ywbSojNfIhD',

	D_APP_MSG:0,
	D_DEVICE_MSG:1,

	D_FILE_NEW:0,
	D_FILE_AMR:1,
	D_FILE_APP_AMR:2,

	D_OBJ_FRIEND:0,
	D_OBJ_GROUP:1,

	D_OPER_AMR:1,
	D_OPER_FAMILY_SIM:2,
	D_OPER_REMOTE_SHUTDOWN:3,
	D_OPER_LISTEN:4,
	D_OPER_UPLOAD_POS:5,

	D_FS_ADMIN:1,
	D_FS_USER:2,
	D_FS_NONE:3,

	ORDER_UPLOAD_POS:'UD',
	ORDER_UPLOAD_MISS:'UD2',
	ORDER_PING:'LK',
	ORDER_ALARM:'AL',
	ORDER_GET_UID:'GD',
	ORDER_POWEROFF:'POWEROFF',
	ORDER_SOS:'SOS',
	ORDER_WHITELIST:'WHITELIST1',
	ORDER_WHITELIST2:'WHITELIST2',
	ORDER_PHB:'PHB',
	ORDER_PHB2:'PHB2',
	ORDER_MONITOR:'MONITOR',
	ORDER_CENTER:'CENTER',
	ORDER_GPS:'CR',
	ORDER_FIND:'FIND',
	ORDER_UP_INTERVAL:'UPLOAD',
	ORDER_GET_LON_LAT:'WG',
	ORDER_LOWBAT:'LOWBAT',
	ORDER_AUTO_REPLY:'GSMANT',
	ORDER_SILENCE:'SILENCETIME',
	ORDER_CLOCK:'REMIND',
	ORDER_REMOVE:'REMOVE',
	ORDER_FACTORY:'FACTORY',
	ORDER_TK:'TK',
	ORDER_TK_OK:'TK,1',
	ORDER_TK_FAIL:'TK,0',
	ORDER_PEDO:'PEDO',
	ORDER_PROFILE:'profile',
	ORDER_HRTSTART:'hrtstart',
	ORDER_HEART:'heart',
	ORDER_RCAPTURE:'rcapture',
	ORDER_WT:'WT',
	ORDER_FALLDOWN:'FALLDOWN'
};