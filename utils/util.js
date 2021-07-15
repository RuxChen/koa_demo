/**
 * 通用的工具函数
 */

const log4js = require('./loggers');

const CODE = {
  SUCCESS: 200,
  PARAM_ERROR: 10001, // 参数错误
  USER_ACCOUNT_ERROR: 20001, // 账号或密码错误
  USER_LOGIN_ERROR: 30001, // 用户未登录
  BUSINESS_ERROR: 40001, // 业务请求失败
  AUTH_ERROR: 50001, // 认证失败或TOKEN过期
};

module.exports = {
  /**
   * 分页结构封装
   * @param {number} pageNum
   * @param {number} pageSize
   * @returns {{skipIndex: number, page: {pageSize: number, pageNum: number}}}
   */
  pager({ pageNum = 1, pageSize = 10 }) {
    pageNum *= 1;
    pageSize *= 1;
    const skipIndex = (pageNum - 1) * pageSize;
    return { page: { pageNum, pageSize }, skipIndex };
  },
  success(data = '', msg = '请求成功', code = CODE.SUCCESS) {
    log4js.debug(data);
    return { code, data, msg };
  },
  fail(msg = '业务请求失败,请重试。', code = CODE.BUSINESS_ERROR, data = '') {
    log4js.debug(msg);
    return { code, data, msg };
  },
  failAuth(msg = 'TOKEN认证失败或TOKEN过期，请重新登录。', code = CODE.AUTH_ERROR, data = '') {
    log4js.debug(msg);
    return { code, data, msg };
  },
  failParam(msg = '参数错误，请重试。', code = CODE.PARAM_ERROR, data = '') {
    log4js.debug(msg);
    return { code, data, msg };
  },
  // 递归拼接树形列表
  getTreeMenu(rootList, id, list) {
    for (let i = 0; i < rootList.length; i++) {
      let item = rootList[i];
      if (String(item.parentId.slice().pop()) == String(id)) {
        list.push(item._doc);
      }
    }
    list.map((item) => {
      item.children = [];
      this.getTreeMenu(rootList, item._id, item.children);
      if (item.children.length === 0) {
        delete item.children;
      } else if (item.children[0].menuType == 2) {
        // 快速区分按钮和菜单
        item.action = item.children;
      }
    });
    return list;
  },
};
