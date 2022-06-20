/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, @oawu/orm
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Queue = require('@oawu/queue')

const { Model: { Device } } = require('./index.js')

module.exports = Queue()

  .enqueue(next => next(process.stdout.write('測試 Model - 2\n')))
  
  // truncate
  .enqueue(next => {
    process.stdout.write('  truncate\n')
    Device.truncate(error => {
      if (error) throw error
      next(process.stdout.write('  ➜ ok\n'))
    })
  })
  .enqueue(next => {
    process.stdout.write('  truncate promise\n')
    Device.truncate()
      .then(_ => next(process.stdout.write('  ➜ ok\n')))
      .catch(error => { throw error })
  })
  .enqueue(next => {
    process.stdout.write('  truncate async\n')
    const test = async _ => {
      await Device.truncate()
    }
    test()
      .then(_ => next(process.stdout.write('  ➜ ok\n')))
      .catch(error => { throw error })
  })
  
  // create
  .enqueue(next => {
    process.stdout.write('  create\n')
    Device.create({ name: 'oaoa', sex: 'male', height: 171.1, bio: 'test' }, (error, user) => {
      if (error) throw error
      next(process.stdout.write('  ➜ ok ➜ ' + user.id + '\n'))
    })
  })
  .enqueue(next => {
    process.stdout.write('  create promise\n')
    Device.create({ name: 'oboa', sex: 'female', height: 171.1, bio: 'test' })
      .then(user => next(process.stdout.write('  ➜ ok ➜ ' + user.id + '\n')))
      .catch(error => { throw error })
  })
  .enqueue(next => {
    process.stdout.write('  create async\n')
    const test = async _ => {
      const user = await Device.create({ name: 'oaoc', sex: 'male', height: 171.1, bio: '' })
      return user
    }
    test()
      .then(user => next(process.stdout.write('  ➜ ok ➜ ' + user.id + '\n')))
      .catch(error => { throw error })
  })
  
  // count
  .enqueue(next => {
    process.stdout.write('  count\n')
    Device.count((error, total) => {
      if (error) throw error
      if (total != 3) throw new Error('  ➜ error\n')
      next(process.stdout.write('  ➜ ok\n'))
    })
  })
  .enqueue(next => {
    process.stdout.write('  count promise\n')
    Device.count()
      .then(total => {
        if (total != 3) throw new Error('  ➜ error\n')
        next(process.stdout.write('  ➜ ok\n'))
      })
      .catch(error => { throw error })
  })
  .enqueue(next => {
    process.stdout.write('  count async\n')
    const test = async _ => {
      const total = await Device.count()
      if (total != 3) throw new Error('  ➜ error\n')
      return total
    }
    test()
      .then(total => next(process.stdout.write('  ➜ ok\n')))
      .catch(error => { throw error })
  })

  // where
  .enqueue(next => {
    process.stdout.write('  where(id=1)\n')
    Device.where(1).count((error, total) => {
      if (error) throw error
      if (total != 1) throw new Error('  ➜ error\n')
      next(process.stdout.write('  ➜ ok\n'))
    })
  })
  .enqueue(next => {
    process.stdout.write('  where({id:1})\n')
    Device.where({id: 1}).count((error, total) => {
      if (error) throw error
      if (total != 1) throw new Error('  ➜ error\n')
      next(process.stdout.write('  ➜ ok\n'))
    })
  })
  .enqueue(next => {
    process.stdout.write('  where({id:1} or 2)\n')
    Device.where({id: 1}).orWhere(2).count((error, total) => {
      if (error) throw error
      if (total != 2) throw new Error('  ➜ error\n')
      next(process.stdout.write('  ➜ ok\n'))
    })
  })
  .enqueue(next => {
    process.stdout.write('  where({name:oaoa} or [1, 2])\n')
    Device.where({ name: 'oaoa', id: [1, 2] }).orWhere(2).count((error, total) => {
      if (error) throw error
      if (total != 2) throw new Error('  ➜ error\n')
      next(process.stdout.write('  ➜ ok\n'))
    })
  })
  .enqueue(next => {
    process.stdout.write('  where(id>1 && id<3)\n')
    Device.where('id', '>', 1).where('id', '<', 3).count((error, total) => {
      if (error) throw error
      if (total != 1) throw new Error('  ➜ error\n')
      next(process.stdout.write('  ➜ ok\n'))
    })
  })
  .enqueue(next => {
    process.stdout.write('  where(name like %b%) promise\n')
    Device.where('name', 'like', `%b%`).count()
      .then(total => {
        if (total != 1) throw new Error('  ➜ error\n')
        next(process.stdout.write('  ➜ ok\n'))
      })
      .catch(error => { throw error })
  })
  .enqueue(next => {
    process.stdout.write('  where([1, 3]) async\n')
    const test = async _ => {
      const total = await Device.where([1, 3]).count()
      if (total != 2) throw new Error('  ➜ error\n')
      return total
    }
    test()
      .then(total => next(process.stdout.write('  ➜ ok\n')))
      .catch(error => { throw error })
  })

  // update
  .enqueue(next => {
    process.stdout.write('  update ob\n')
    Device.where('id', '>', 1).where('id', '<', 3).update({ name: 'ob' }, (error, total) => {
      if (error) throw error
      if (total != 1) throw new Error('  ➜ error\n')
      next(process.stdout.write('  ➜ ok\n'))
    })
  })
  .enqueue(next => {
    process.stdout.write('  where(id>1 && id<3) update ob\n')
    Device.where('id', '>', 1).where('id', '<', 3).update({ name: 'ob' }, (error, total) => {
      if (error) throw error
      if (total != 1) throw new Error('  ➜ error\n')
      next(process.stdout.write('  ➜ ok\n'))
    })
  })
  .enqueue(next => {
    process.stdout.write('  where(1) update oc promise\n')
    Device.where(1).update({ name: 'oc' })
      .then(total => {
        if (total != 1) throw new Error('  ➜ error\n')
        next(process.stdout.write('  ➜ ok\n'))
      })
      .catch(error => { throw error })
  })
  .enqueue(next => {
    process.stdout.write('  where([1, 3]) update oc async\n')
    const test = async _ => {
      const total = await Device.where([1, 3]).update({ name: 'oc' })
      if (total != 2) throw new Error('  ➜ error\n')
      return total
    }
    test()
      .then(total => next(process.stdout.write('  ➜ ok\n')))
      .catch(error => { throw error })
  })

  // select
  .enqueue(next => {
    process.stdout.write('  where(id>1 && id<3) all\n')
    Device.where('id', '>', 1).where('id', '<', 3).all((error, users) => {
      if (error) throw error
      if (users.length != 1) throw new Error('  ➜ error\n')
      if (users[0].name != 'ob') throw new Error('  ➜ error\n')
      next(process.stdout.write('  ➜ ok\n'))
    })
  })
  .enqueue(next => {
    process.stdout.write('  where(1) one\n')
    Device.where(1).one()
      .then(user => {
        if (user.id != 1) throw new Error('  ➜ error\n')
        if (user.name != 'oc') throw new Error('  ➜ error\n')
        next(process.stdout.write('  ➜ ok\n'))
      })
      .catch(error => { throw error })
  })
  .enqueue(next => {
    process.stdout.write('  where(1) selec(name) one\n')
    Device.where(1).select('name').one()
      .then(user => {
        if (user.bio !== undefined) throw new Error('  ➜ error\n')
        if (user.name === undefined) throw new Error('  ➜ error\n')
        next(process.stdout.write('  ➜ ok\n'))
      })
      .catch(error => { throw error })
  })
  .enqueue(next => {
    process.stdout.write('  limit\n')

    Device.all((error, users) => {
      if (error) throw error
      if (users.length != 3) throw new Error('  ➜ error\n')
      next(process.stdout.write('  ➜ ok\n'))
    })
  })
  .enqueue(next => {
    process.stdout.write('  limit\n')

    Device.limit(2).all((error, users) => {
      if (error) throw error
      if (users.length != 2) throw new Error('  ➜ error\n')
      if (users[0].id != 1) throw new Error('  ➜ error\n')
      if (users[1].id != 2) throw new Error('  ➜ error\n')
      next(process.stdout.write('  ➜ ok\n'))
    })
  })
  .enqueue(next => {
    process.stdout.write('  limit order\n')

    Device.order('id DESC').limit(2).all((error, users) => {
      if (error) throw error
      if (users.length != 2) throw new Error('  ➜ error\n')
      if (users[0].id != 3) throw new Error('  ➜ error\n')
      if (users[1].id != 2) throw new Error('  ➜ error\n')
      next(process.stdout.write('  ➜ ok\n'))
    })
  })
  .enqueue(next => {
    process.stdout.write('  limit order\n')

    Device.order('id DESC').offset(1).limit(2).all((error, users) => {
      if (error) throw error
      if (users.length != 2) throw new Error('  ➜ error\n')
      if (users[0].id != 2) throw new Error('  ➜ error\n')
      if (users[1].id != 1) throw new Error('  ➜ error\n')
      next(process.stdout.write('  ➜ ok\n'))
    })
  })

  // delete
  .enqueue(next => {
    process.stdout.write('  where(id>1 && id<3) delete\n')
    Device.where('id', '>', 1).where('id', '<', 3).delete((error, count) => {
      if (error) throw error
      if (count != 1) throw new Error('  ➜ error\n')
      next(process.stdout.write('  ➜ ok\n'))
    })
  })
  .enqueue(next => {
    Device.one(1)
      .then(user => user.delete((error, user) => {
        if (error) throw error
        next(process.stdout.write('  ➜ ok\n'))
      }))
      .catch(error => { throw error })
  })
  .enqueue(next => {
    Device.one()
      .then(user => {
        user.name = 'aaa'
        user.save((error, user) => {
          if (error) throw error
          next(process.stdout.write('  ➜ ok\n'))
        })
      })
      .catch(error => { throw error })
  })
  .enqueue(next => {
    Device.where('number', 'is', null).one()
      .then(user => {
        user.name = 'aaa'
        user.save((error, user) => {
          if (error) throw error
          next(process.stdout.write('  ➜ ok\n'))
        })
      })
      .catch(error => { throw error })
  })