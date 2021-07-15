const router = require('koa-router')()

const util = require('./../utils/util')
const jwt = require('jsonwebtoken')
const User = require('./../models/userSchema')
const userId = require('./../models/userIdSchema')

router.prefix('/user')
router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/test', function (ctx, next) {
  const token = ctx.request.headers.authorization.split(' ')[1];
  const payload = jwt.verify(token, '#$#E!');
  ctx.body = util.success('test')
})

router.post('/login', async (ctx) => {
  console.log('login', ctx.request.query)

  try {
    const { userName, userPwd } = ctx.request.body;

    const res = await User.findOne({
      userName,
      userPwd
    })
    if(res) {
      let token = jwt.sign({
        data: res
      }, '#$#E!', { expiresIn: '1h'})
      // res.data.token = '123'

      // data.token = token
      // console.log(JSON.stringify(res.data))
      let data = JSON.parse(JSON.stringify(res))
      data.token = token
      Object.assign(res, {token: token})
      console.log('data111: ', data)
      ctx.body = util.success(data)
    } else {
      ctx.body = util.fail('账号或者密码不正确')
    }
  } catch (e) {
    ctx.body = util.fail(e.msg)
  }
})

router.get('/list', async ctx => {
  const { userId, userName, state } = ctx.request.query;
  const { page, skipIndex } = util.pager(ctx.request.query)
  let params = {}

  if (userId) params.userId = userId;
  if (userName) params.userName = userName;
  if (state && state != '0') params.state = state;

  try {
    const query = User.find(params, { _id: 0, userPwd: 0 })
    const list = await query.skip(skipIndex).limit(page.pageSize)
    const total = await User.countDocuments(params);

    ctx.body = util.success({
      page: {
        ...page,
        total
      },
      list
    })
  } catch(e) {
    ctx.body = util.fail(`查询异常：${e.stack}`)
  }
})

router.post('/operate', async (ctx) => {

  // const {
  //   userId,
  //   userName,
  //   userEmail,
  //   mobile,
  //   job,
  //   state,
  //   roleList,
  //   deptId,
  //   action
  // } = ctx.request.query;
  console.log('1', ctx.request.query)
  if (1) {
    console.log('2')
    // if (!userName || !userEmail || !deptId) {
    //   ctx.body = util.fail('参数错误', util.CODE.PARAM_ERROR)
    //   return ;
    // }
    console.log('3')

    // const res = await User.findOne({ $or: [{ userName }, { userEmail }] }, '_id userName userEmail')
    // const doc = await userId.findOneAndUpdate(
    //   {
    //     _id: 'userId'
    //   }, {
    //     $inc: {
    //       sequence_value: 1
    //     }
    //   }, {
    //     new: true
    //   }
    // )
    //
    // console.log('4')
    // if (res) {
    //   ctx.body = util.fail(`系统检测到重复的用户，信息如下：${res.userName} - ${res.userEmail}`)
    //   console.log('5')
    // } else {
    //   try {
    //     const user = new User({
    //       userId: doc.sequence_value,
    //       userName,
    //       userPwd: '123123',
    //       userEmail,
    //       role: 1,
    //       roleList,
    //       job,
    //       state,
    //       deptId,
    //       mobile
    //     })
    //
    //     console.log('6')
    //     user.save();
    //     ctx.body = util.success('', '用户创建成功')
    //   } catch (e) {
    //     ctx.body = util.fail(e.stack, '用户创建失败')
    //   }
    // }
  }

  console.log('end')
})
module.exports = router
