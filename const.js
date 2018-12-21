const env = require('./env')

let resUrl
let mp3FilePath
let dbHost
let dbUser
let dbPwd
let dbName

if (env === 'dev') {
    resUrl = '***'
    mp3FilePath = '***'
    dbHost = '***'
    dbUser = '***'
    dbPwd = '***',
    dbName = '***'
} else if (env === 'prod') {
    resUrl = '***'
    mp3FilePath = '***'
    dbHost = '***'
    dbUser = '***'
    dbPwd = '***',
    dbName = '***'
}

const category = [
    '***',
    '***',
    '***',
    '***',
    '***',
    '***',
    '***',
    '***'
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
