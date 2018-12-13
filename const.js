const env = require('./env')

let resUrl
let mp3FilePath
let dbHost
let dbUser
let dbPwd
let dbName

if (env === 'dev') {
    resUrl = 'http://localhost:9000'
    mp3FilePath = 'D:/Program/Resources/mp3'
    dbHost = 'localhost'
    dbUser = 'root'
    dbPwd = '123456',
    dbName = 'sell'
} else if (env === 'prod') {
    resUrl = 'http://www.potato369.com:8000'
    mp3FilePath = '/ebookData/upgrade_file/http/Resources/mp3'
    dbHost = 'www.potato369.com'
    dbUser = 'root'
    dbPwd = 'MyNewPassword4!',
    dbName = 'sell'
}

const category = [
    'Wuxia',
    'Xianxia',
    'Fantasy',
    'History',
    'Mystery',
    'Campus',
    'Military',
    'Bizarre'
]

/*
const category = [
    'Biomedicine',
    'BusinessandManagement',
    'ComputerScience',
    'EarthSciences',
    'Economics',
    'Engineering',
    'Education',
    'Environment',
    'Geography',
    'History',
    'Laws',
    'LifeSciences',
    'Literature',
    'SocialSciences',
    'MaterialsScience',
    'Mathematics',
    'MedicineAndPublicHealth',
    'Philosophy',
    'Physics',
    'PoliticalScienceAndInternationalRelations',
    'Psychology',
    'Statistics'
]
*/
const userInfo = {
    'userAvatar': 'https://www.potato369.com/buddhist/images/avatar/5.png',
    'userNickName': 'Jack',
    'id': '192040647',
    'balance': '10'
}
module.exports = {
    resUrl,
    category,
    mp3FilePath,
    dbHost,
    dbUser,
    dbPwd,
    dbName,
    userInfo
}
