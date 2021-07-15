
const router = require('koa-router')()
const util = require('../utils/util')
const jwt = require('jsonwebtoken')
const Menu = require('./../models/menuSchema')

router.prefix('/menu')

router.post('/oparate', async ctx => {
  const { _id, action, ...params } = ctx.request.body;
  let res, info;

  try {
    if (action == 'add') {
      res = await Menu.create(params)
      info = '创建成功'
    } else if (action == 'edit') {
      params.updateTime = new Date();
      Menu.findByAndUpdate(_id, params);
      info = ''
    } else {
      info = ''
    }
  } catch (e) {
    ctx.body = util.fail('', e)
  }

  ctx.body = util.success('', info)
})

module.exports = router
