const config = require('@etc/js/config')
export default {
	ERROR_TIP: {
		TIP_0: "Your password must be at least 9 characters. Please ensure it is a strong password.",
		TIP_1: "Functional development!",
		TIP_2: " Send Address is not null.",
		TIP_3: "This is not the way to log in. Please choose another way.",
		TIP_4: "You can`t transfer money to yourself.",
		TIP_5: "The address needs to start with 0x",
		TIP_6: "Sign error!",
		TIP_7: "Account error!",
		TIP_8: "The address has been requested. Please refresh later. DCRM:",
		TIP_9: "Please refresh the page to view!",
		TIP_10: {
			FIRST: "Request success,Save your TX Hash in case you need it later：",
			LAST: ", and refresh the page to view after 15 seconds."
		},
		TIP_11: " Address is not null.",
		TIP_12: "Please login before you operate!",
		TIP_13: "",
		TIP_14: "",
		TIP_15: "",
		TIP_16: ""
	},
	WARNING_TIP: {
		TIP_0: "* Do NOT forget to save this!",
		TIP_1: "Do you request?"
	},
	SUCCESS_TIP: {
		TIP_0: "Copy Success",
		TIP_1: "Your TX has been broadcast to the network. This does not mean it has been mined & sent. During times of extreme volume, it may take 3+ hours to send. 1) Check your TX below. 2) If it is pending for hours or disappears, use the Check TX Status Page to replace. 3) Use " + config.initCoin + " Gas Station to see what gas price is optimal. 4) Save your TX Hash in case you need it later： ",
		TIP_2: "Success"
	},
	IMPORT_WALLET: "Import wallet",
	BTN: {
		CREATE_WALLET: "Create wallet",
		NEXT_STEP: "Next step",
		DOWNLOAD_KEYSTORE: "Download Keystore File (UTC / JSON)",
		DOWNLOAD_KEYSTORE1: "Keystore File (UTC / JSON · Recommended · Encrypted)",
		UNDERSTAND_CONTINUE: "I understand. Continue.",
		SELECT_WALLET_FILE: "SELECT WALLET FILE...",
		UNLOCK: "Unlock",
		RECEIVE: "Receive",
		SEND: "Send",
		REQUEST: "Request",
		PENDING: "Pending",
		GET_OUT: "No, get me out of here!",
		YES_SURE: "Yes, I am sure!",
		SHOW_QR_CODE: "Show QR code",
		COPY_CLIPBOARD: "Copy clipboard",
		DEPOSIT: "Deposit",
		WITHDRAW: "Withdraw",
		DOWNLOAD: "Download",
		CONNECT_TO_TREZOR: "Connect to TREZOR",
		CONNECT_TO_LEDGER: "Connect to Ledger",
		CONNECT_TO_METAMASK: "Connect to MetaMask",
		CANCEL: "Cancel",
		UNLOCK_WALLET: "Unlock your Wallet",
		CONFIRM: "Confirm",
		GENERATE_INFORMATION: "Generate Information",
		GET_TXNS: "Get Transaction",
		APPLY_CROSS_CHAIN: "Apply Cross-Chain"
	},
	TITLE: {
		COIN_SUPPORTED: "Coins Supported",
		CREATE_NEW_WALLET: "Create New Wallet",
		SAVE_LEYSTORE_FILE: "Save your <span>Keystore</span> File.",
		SELECT_WALLET_FILE: "Select Your Wallet File",
		PASTE_PRIVATE_KEY: "Paste Your Private Key",
		REQUEST_CONFIRM: "Request address confirmation",
		HISTORY: "History",
		YOUR_ADDREAA: "Your Address",
		LOCKIN: "Deposit",
		LOCKOUT: "Withdraw",
		PRIVATE_KEY_UNENCRYPTED: "Private Key (unencrypted)",
		TO_SEND: "You are about to send...",
		TREZOR_WALLET: "TREZOR Hardware Wallet",
		LEDGER_WALLET: "Ledger Hardware Wallet",
		METAMASK_WALLET: "MetaMask",
		CUSTOM_NODE: "Custom Node"
	},
	PLACEHOLDER: {
		ENTER_PASSWORD: "Enter a password",
		ENTER_PRIVATE_KEY: "Enter a Private Key"
	},
	CREATE_TIP: {
		CREATE_TIP_0: "This password encrypts your private key. This does not act as a seed to generate your keys.",
		CREATE_TIP_1: "You will need this password + your private key to unlock your wallet.",
		CREATE_TIP_2: config.AppName + " DCRM Wallet does not hold your keys for you. We cannot access accounts, recover keys, ",
		CREATE_TIP_3: "reset passwords, nor reverse transactions. Protect your keys & always check that you are on correct URL. You are responsible for your security."
	},
	SAVE_KEYSTORE_TIP: {
		SAVE_KEYSTORE_TIP_0: "**Do not lose it!** It cannot be recovered if you lose it.<br/>**Do not share it!** Your funds will be stolen if you use this file on a malicious/phishing site.<br/>**Make a backup!** Secure it like the millions of dollars it may one day be worth.",
		SAVE_KEYSTORE_TIP_1: config.AppName + " DCRM Wallet does not hold your keys for you. We cannot access accounts, recover keys,<br>reset passwords, nor reverse transactions. Protect your keys & always check that you are on correct URL. You are responsible for your security."
	},
	IMPORT_TYPE: {
		KEYSTORE: "Keystore / JSON File",
		PRIVATE_KEY: "Private Key",
		TREZOR: "TREZOR",
		Mnemonic: "Mnemonic Phrase"
	},
	NAV: {
		MY_ASSETS: "My Assets",
		TRANSFER: "Transfer",
		LILO: "LILO",
		DAPP: "DAPP",
		MY_WALLET: "My Wallet"
	},
	THEAD: {
		COIN: "Coin",
		ACTIONS: "Actions",
		ASSETS: {
			AVAILABLE_BALANCE: "Available Balance",
			FREEZE: "Freeze",
			TOTAL_BALANCE: "Total Balance",
			DOLLAR: "Dollar"
		},
		PUBLIC: {
			STATUS: "Status",
			AMOUNT: "Amount",
			DATE: "Date",
			INFORMATION: "Information"
		}
	},
	LABEL: {
		AMOUNT: "Amount",
		TXID: "TXid",
		ADDRESS: "Address",
		SUCCESS: "Success",
		FAILURE: "Failure",
		PENDING: "Pending",
		LOADING: "Loading. . .",
		NEW: "New"
	},
	IMPORT_WALLET_TIP: config.AppName + " DCRM Wallet does not hold your keys for you. We cannot access accounts, recover keys, reset passwords,<br/>nor reverse transactions. Protect your keys & always check that you are on correct URL. You are responsible for your security.",
	LEDGER_TIP: "U2F not supported in this browser. Please try using Google Chrome with a secure (SSL / HTTPS) connection!",
	METAMASK_TIP: "Please use " + config.AppName + "Wallet on a secure (SSL / HTTPS) connection to connect."
}
