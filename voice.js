const Base64 = require('js-base64').Base64
const md5 = require('js-md5')
const qs = require('qs')
const http = require('http')
const mp3FilePath = require('./const').mp3FilePath
const resUrl = require('./const').resUrl
const fs = require('fs')

function createVoice(req, res) {
    const text = req.query.text
    const lang = req.query.lang
    let engineType = '***'
    if (lang.toLowerCase() === 'en') {
        engineType = '***'
    }
    if (lang.toLowerCase() === 'zh-cn') {
        engineType = '***'
    }

    const speed = '30'
    const voiceParam = {
        auf: 'audio/L16;rate=16000',
        aue: '***',
        voice_name: '***',
        speed,
        volume: '***',
        pitch: '***',
        engine_type: engineType,
        text_type: 'text'
    }

    const currentTime = Math.floor(new Date().getTime() / 1000)
    const appId = '***'
    const apiKey = '***'
    const xParam = Base64.encode(JSON.stringify(voiceParam))
    const checkSum = md5(apiKey + currentTime + xParam)
    const headers = {}
    headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8'
    headers['X-Param'] = xParam
    headers['X-Appid'] = appId
    headers['X-CurTime'] = currentTime
    headers['X-CheckSum'] = checkSum
    headers['X-Real-Ip'] = '***'
    const data = qs.stringify({
        text: text
    })
    const options = {
        host: 'api.xfyun.cn',
        path: '/v1/service/v1/tts',
        method: 'POST',
        headers
    }
    const request = http.request(options, response => {
        let mp3 = ''
        const contentLength = response.headers['content-length']
        response.setEncoding('binary')
        response.on('data', data => {
            mp3 += data
            const process = data.length / contentLength * 100
            const percent = parseInt(process.toFixed(2))
            // console.log(percent)
        })
        response.on('end', () => {
            // console.log(response.headers)
            // console.log(mp3)
            const contentType = response.headers['content-type']
            if (contentType === 'text/html') {
                res.send(mp3)
            } else if (contentType === 'text/plain') {
                res.send(mp3)
            } else {
                const fileName = new Date().getTime()
                const filePath = `${mp3FilePath}/${fileName}.mp3`
                const downloadUrl = `${resUrl}/mp3/${fileName}.mp3`
                // console.log(filePath, downloadUrl)
                fs.writeFile(filePath, mp3, 'binary', err => {
                    if (err) {
                        res.json({
                            error: 1,
                            msg: '下载失败'
                        })
                    } else {
                        res.json({
                            error: 0,
                            msg: '下载成功',
                            path: downloadUrl
                        })
                    }
                })
            }
        })
    })
    request.write(data)
    request.end()
}

module.exports = createVoice
