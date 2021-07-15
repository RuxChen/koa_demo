const mongoose = require('mongoose');

const menuSchema = mongoose.Schema({
  menuType: Number, //菜单类型
  menuState: Number, //菜单状态
  menuName: String, //菜单名称
  menuCode: String, //菜单权限标识
  path: String, //菜单路径
  icon: String, //菜单图标地址
  component: String, //菜单组件路径
  parentId: [mongoose.Types.ObjectId], //父菜单id集合
  // children: String,
  order: Number, //菜单排序
  createTime: { type: Date, default: Date.now() }, //创建时间
  updateTime: { type: Date, default: Date.now() }, //更新时间
});

// 模型名称 ， schema，数据库
module.exports = mongoose.model('menu', menuSchema, 'menus');
