import Vue from 'vue'
import VueI18n from 'vue-i18n'
import customZhCn from './lang/zh-CN'
import customEnUs from './lang/en-US'
Vue.use(VueI18n)

// 自动根据浏览器系统语言设置语言
const navLang = navigator.language
const localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false
let lang = localLang || 'en-US'

Vue.config.lang = lang

// vue-i18n 6.x+写法
Vue.locale = () => {}
const messages = {
  'zh-CN': customZhCn,
  'en-US': customEnUs
}

// console.log(lang)
// console.log(messages)
const i18n = new VueI18n({
  locale: lang,
  messages,
  silentTranslationWarn: true,
})

export default i18n

// vue-i18n 5.x写法
// Vue.locale('zh-CN', Object.assign(zhCnLocale, customZhCn))
// Vue.locale('en-US', Object.assign(zhTwLocale, customZhTw))
// Vue.locale('zh-TW', Object.assign(enUsLocale, customEnUs))
