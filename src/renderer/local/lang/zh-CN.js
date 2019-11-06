const config = require('@etc/js/config')
export default {
	ERROR_TIP: {
		TIP_0: "您的密码必须至少9个字符。请确保它是一个强密码。",
		TIP_1: "功能开发中！",
		TIP_2: " 地址不能为空",
		TIP_3: "不是此方式登录，请选择其他方式。",
		TIP_4: "不能给自己转账",
		TIP_5: "地址需要以0x开头",
		TIP_6: "登录错误!",
		TIP_7: "帐号错误!",
		TIP_8: "地址已申请，请稍后刷新查看。",
		TIP_9: "请刷新页面以查看!",
		TIP_10: {
			FIRST: "申请成功，保存TX Hash以防你以后需要：",
			LAST: ", 并在15秒后刷新页面以查看。"
		},
		TIP_11: " 地址不能为空。",
		TIP_12: "请先登录再操作！",
		TIP_13: "",
		TIP_14: "",
		TIP_15: "",
		TIP_16: ""
	},
	WARNING_TIP: {
		TIP_0: "* 不要忘记保存这个！",
		TIP_1: "你要申请DCRM地址吗"
	},
	SUCCESS_TIP: {
		TIP_0: "复制成功！",
		TIP_1: "你的TX已经广播到网络上了。这并不意味着它已经被开采和发送。在极端容量的时候，可能需要3个多小时来发送。1)检查下面的TX。2)如果已挂起数小时或消失，请使用Check TX Status页面进行替换。3)通过" + config.initCoin + "加油站了解最优油价。4)保存TX散列,以防你需要后 ",
		TIP_2: "设置成功"
	},
	BTN: {
		REGISTER: '注册',
		LOGIN: '登录',
		NEXT_STEP: "下一步",
		DOWNLOAD_KEYSTORE: "下载 密钥存储库 文件 (UTC / JSON)",
		DOWNLOAD_KEYSTORE1: "密钥存储库 文件 (UTC / JSON · Recommended · Encrypted)",
		UNDERSTAND_CONTINUE: "我明白了。继续下去",
		SELECT_WALLET_FILE: "选择钱包文件...",
		UNLOCK: "解锁",
		RECEIVE: "接收",
		SEND: "发送",
		REQUEST: "请求",
		PENDING: "等待",
		GET_OUT: "退出",
		YES_SURE: "确认",
		SHOW_QR_CODE: "显示二维码",
		COPY_CLIPBOARD: "复制",
		DEPOSIT: "充值",
		WITHDRAW: "提现",
		DOWNLOAD: "下载",
		CONNECT_TO_TREZOR: "连接到TREZOR",
		CONNECT_TO_LEDGER: "连接到Ledger Wallet",
		CONNECT_TO_METAMASK: "连接到MetaMask",
		CANCEL: "取消",
		UNLOCK_WALLET: "解锁钱包",
		CONFIRM: "确定",
		GENERATE_INFORMATION: "生成信息",
		GET_TXNS: "获取交易",
		APPLY_CROSS_CHAIN: "Apply Cross-Chain"
	},
	TITLE: {
		COIN_SUPPORTED: "支持币种",
		CREATE_NEW_WALLET: "创建新钱包",
		SAVE_LEYSTORE_FILE: "保存你的 <span>密钥存储库</span> 文件.",
		SELECT_WALLET_FILE: "选择你的钱包文件",
		PASTE_PRIVATE_KEY: "粘贴私钥",
		REQUEST_CONFIRM: "请求地址确认",
		HISTORY: "历史",
		YOUR_ADDREAA: "你的地址",
		LOCKIN: "充值",
		LOCKOUT: "提现",
		PRIVATE_KEY_UNENCRYPTED: "私钥(加密)",
		TO_SEND: "你要发送的信息...",
		TREZOR_WALLET: "TREZOR Hardware Wallet",
		LEDGER_WALLET: "Ledger Hardware Wallet",
		METAMASK_WALLET: "MetaMask / Mist",
		CUSTOM_NODE: "自定义节点"
	},
	PLACEHOLDER: {
		ENTER_PASSWORD: "输入一个密码",
		ENTER_PRIVATE_KEY: "输入私钥"
	},
	CREATE_TIP: {
		CREATE_TIP_0: "这个密码加密您的私钥。这不是生成键的种子。",
		CREATE_TIP_1: "你需要这个密码和你的私人钥匙才能解锁你的钱包",
		CREATE_TIP_2: config.AppName + " DCRM钱包不会帮你保管钥匙。我们无法访问帐户，恢复密钥，",
		CREATE_TIP_3: "重置密码，或反向事务。保护你的钥匙&总是检查你在正确的URL。你要对你的安全负责。"
	},
	SAVE_KEYSTORE_TIP: {
		SAVE_KEYSTORE_TIP_0: "**不要失去它!如果你把它弄丢了，就无法找回来。**不要分享!**如果您在恶意/钓鱼网站使用此文件，您的资金将被窃取。<br/>* *有备份!就像它有一天可能值几百万美元一样，好好保管它。",
		SAVE_KEYSTORE_TIP_1: config.AppName + " DCRM钱包不会帮你保管钥匙。我们不能访问帐户，恢复密钥，重置密码，或反向交易。保护你的钥匙&总是检查你在正确的URL。你要对你的安全负责。"
	},
	IMPORT_TYPE: {
		KEYSTORE: "Keystore / JSON File",
		PRIVATE_KEY: "私钥",
		TREZOR: "TREZOR",
		Mnemonic: "Mnemonic Phrase"
	},
	NAV: {
		MY_ASSETS: "资产",
		TRANSFER: "转账",
		LILO: "跨链",
		DAPP: "DAPP",
		MY_WALLET: "我的钱包"
	},
	THEAD: {
		COIN: "币种",
		ACTIONS: "操作",
		ASSETS: {
			AVAILABLE_BALANCE: "可用余额",
			FREEZE: "冻结",
			TOTAL_BALANCE: "总资产",
			DOLLAR: "美元"
		},
		PUBLIC: {
			STATUS: "状态",
			AMOUNT: "金额",
			DATE: "日期",
			INFORMATION: "信息"
		}
	},
	LABEL: {
		AMOUNT: "金额",
		TXID: "TXid",
		ADDRESS: "地址",
		SUCCESS: "成功",
		FAILURE: "失败",
		PENDING: "等待中",
		LOADING: "Loading. . .",
		NEW: "新"
	},
	IMPORT_WALLET_TIP: config.AppName + " DCRM钱包不会帮你保管钥匙。我们无法访问帐户，恢复密钥，重置密码，或反向交易。保护你的钥匙&总是检查你在正确的URL。你要对你的安全负责。",
	LEDGER_TIP: "此浏览器不支持U2F。请尝试使用带有安全（ssl/https）连接的Google Chrome！",
	METAMASK_TIP: "请在安全（SSL/HTTPS）连接上使用" + config.AppName + "Wallet进行连接。"
}
