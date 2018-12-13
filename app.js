const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const constant = require('./const')
const voice = require('./voice')
const app = express()

app.use(cors())

function connect() {
    return mysql.createConnection({
        host: constant.dbHost,
        user: constant.dbUser,
        password: constant.dbPwd,
        database: constant.dbName
    })
}

function randomArray(n, l) {
    let rnd = []
    for (let i = 0; i < n; i++) {
        rnd.push(Math.floor(Math.random() * l))
    }
    return rnd
}

function createData(results, key) {
    return handleData(results[key])
}

function createCategoryIds(n) {
    const arr = []
    constant.category.forEach((item, index) => {
        arr.push(index + 1)
    })
    const result = []
    for (let i = 0; i < n; i++) {
        // 获取的随机数不能重复
        const ran = Math.floor(Math.random() * (arr.length - i))
        // 获取分类对应的序号
        result.push(arr[ran])
        // 将已经获取的随机数取代，用最后一位数
        arr[ran] = arr[arr.length - i - 1]
    }
    return arr
}

function createCategoryData(data) {
    const categoryIds = createCategoryIds(6)
    const result = []
    categoryIds.forEach(categoryId => {
        const subList = data.filter(item => item.category === categoryId).slice(0, 4)
        subList.map(item => {
            return handleData(item)
        })
        result.push({
            category: categoryId,
            list: subList
        })
    })
    return result.filter(item => item.list.length === 4)
}

function handleData(data) {
    if (!data.cover.startsWith('http://')) {
        data['cover'] = `${constant.resUrl}/epub2/${data['categoryText']}/${data['fileName']}/cover.jpg`
    }
    data['selected'] = false
    data['private'] = false
    data['cache'] = false
    data['haveRead'] = 0
    return data
}

function createGuessYouLikeData(data) {
    const n = parseInt(randomArray(1, 3)) + 1
    data['type'] = n
    switch (n) {
        case 1:
            data['result'] = data.id % 2 === 0 ? '《Executing Magic》' : '《Elements Of Robotics》'
            break
        case 2:
            data['result'] = data.id % 2 === 0 ? '《Improving Psychiatric Care》' : '《Programming Language》'
            break
        case 3:
            data['result'] = '《Living with Disfigurement》'
            data['percent'] = data.id % 2 === 0 ? '92%' : '97%'
            break
    }
    return data
}

function createRecommendData(data) {
    data['readers'] = Math.floor(data.id % 2 * randomArray(1, 100))
    return data
}

app.get('/', (request, response) => {
    response.json(new Date().toDateString())
})

// 书城小说首页接口
app.get('/book/home', (request, response) => {
    const conn = connect()
    conn.query('SELECT `id`, `file_name` as `fileName`, `cover`, `title`, `author`, `publisher`, `book_id` as `bookId`, `category`, `category_text` as `categoryText`, `language`, `root_file` as `rootFile` FROM  `store_book_info_bak` WHERE cover != \'\'', (err, results) => {
        const length = results.length
        const banner = constant.resUrl + '/home_banner.jpg'
        const guessYouLike = []
        const recommend = []
        const featured = []
        const random = []
        const categoryList = createCategoryData(results)
        const categories = [
            {
                'category': 1,
                'num': 24,
                'img1': constant.resUrl + '/cover/cam/cover1.jpg',
                'img2': constant.resUrl + '/cover/cam/cover2.jpg'
            }, {
                'category': 2,
                'num': 12,
                'img1': constant.resUrl + '/cover/js/cover1.jpg',
                'img2': constant.resUrl + '/cover/js/cover2.jpg'
            }, {
                'category': 3,
                'num': 15,
                'img1': constant.resUrl + '/cover/ls/cover1.jpg',
                'img2': constant.resUrl + '/cover/ls/cover2.jpg'
            }, {
                'category': 4,
                'num': 11,
                'img1': constant.resUrl + '/cover/qh/cover1.jpg',
                'img2': constant.resUrl + '/cover/qh/cover2.jpg'
            }, {
                'category': 5,
                'num': 15,
                'img1': constant.resUrl + '/cover/wx/cover1.jpg',
                'img2': constant.resUrl + '/cover/wx/cover2.jpg'
            }, {
                'category': 6,
                'num': 10,
                'img1': constant.resUrl + '/cover/xh/cover1.jpg',
                'img2': constant.resUrl + '/cover/xh/cover2.jpg'
            }, {
                'category': 7,
                'num': 10,
                'img1': constant.resUrl + '/cover/xy/cover1.jpg',
                'img2': constant.resUrl + '/cover/xy/cover2.jpg'
            }, {
                'category': 8,
                'num': 14,
                'img1': constant.resUrl + '/cover/xx/cover1.jpg',
                'img2': constant.resUrl + '/cover/xx/cover2.jpg',
            }]
        randomArray(9, length).forEach(key => {
            guessYouLike.push(createGuessYouLikeData(createData(results, key)))
        })
        randomArray(3, length).forEach(key => {
            recommend.push(createRecommendData(createData(results, key)))
        })
        randomArray(6, length).forEach(key => {
            featured.push(createData(results, key))
        })
        randomArray(1, length).forEach(key => {
            random.push(createData(results, key))
        })
        response.json({
            banner: banner,
            guessYouLike: guessYouLike,
            recommend: recommend,
            featured: featured,
            random: random,
            categoryList: categoryList,
            categories: categories
        })
        conn.end()
    })
})

// 书城小说详情接口
app.get('/book/detail', (request, response) => {
    const conn = connect()
    const fileName = request.query.fileName
    const sql = 'SELECT `id`, `file_name` as `fileName`, `cover`, `title`, `author`, `publisher`, `book_id` as `bookId`, `category`, `category_text` as `categoryText`, `language`, `root_file` as `rootFile` FROM  `store_book_info_bak` WHERE `file_name` = ' + `'${fileName}'`
    conn.query(sql, (err, result) => {
        if (err) {
            response.json({
                error_code: 1,
                msg: '从数据库获取小说详情数据失败。',
                data: null
            })
        } else {
            if (result && result.length === 0) {
                response.json({
                    error_code: 2,
                    msg: '从数据库获取小说详情数据失败。',
                    data: null
                })
            } else {
                const book = handleData(result[0])
                response.json({
                    error_code: 0,
                    msg: '从数据库获取小说详情数据成功。',
                    data: book
                })
            }
        }
        conn.end()
    })
})

// 书城小说列表接口
app.get('/book/list', (request, response) => {
    const conn = connect()
    conn.query('SELECT `id`, `file_name` as `fileName`, `cover`, `title`, `author`, `publisher`, `book_id` as `bookId`, `category`, `category_text` as `categoryText`, `language`, `root_file` as `rootFile` FROM  `store_book_info_bak` WHERE `cover` != \'\'', (err, results) => {
        if (err) {
            response.json({
                error_code: 1,
                msg: '从数据库查询所有小说列表信息失败。',
                data: null
            })
        } else {
            results.map(item => handleData(item))
            const data = {}
            constant.category.forEach(categoryText => {
                data[categoryText] = results.filter(item => item.categoryText === categoryText)
            })
            response.json({
                error_code: 0,
                msg: '从数据库查询所有小说列表信息成功。',
                data: data,
                total: results.length
            })
        }
        conn.end()
    })
})

// 书城小说翻转卡片推荐小说接口
app.get('/book/flat-list', (request, response) => {
    const conn = connect()
    conn.query('SELECT `id`, `file_name` as `fileName`, `cover`, `title`, `author`, `publisher`, `book_id` as `bookId`, `category`, `category_text` as `categoryText`, `language`, `root_file` as `rootFile` FROM  `store_book_info_bak` WHERE `cover` != \'\'', (err, results) => {
        if (err) {
            response.json({
                error_code: 1,
                msg: '从数据库查询所有小说列表信息失败。',
                data: null
            })
        } else {
            results.map(item => handleData(item))
            response.json({
                error_code: 0,
                msg: '从数据库查询所有小说列表信息成功。',
                data: results,
                total: results.length
            })
        }
        conn.end()
    })
})

// 书城小说书架数据接口
app.get('/book/shelf', (request, response) => {
    response.json({
        bookList: []
    })
})

// 科大讯飞语音合成API接口
app.get('/voice', (request, response) => {
    voice(request, response)
})

// 书城小说用户接口
app.get('/user/info', (request, response) => {
    response.json({
        error_code: 0,
        msg: '获取微信用户信息成功',
        userInfo: constant.userInfo
    })
})

const server = app.listen(3000, () => {
    const host = server.address().address
    const port = server.address().port
    console.log('server is listening at http://%s:%s', host, port)
})
