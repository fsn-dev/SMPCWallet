export default {
  // 密码强度正则
  pwd: /^(\w){6,20}$/,

  // 密码强度正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
  // pwd: /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/,

  // 用户名正则，4到16位（字母，数字，下划线）
  username: /^[a-zA-Z0-9_]{6,16}$/,
  // 邮箱正则
  email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
}