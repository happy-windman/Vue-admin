var server = require('http').createServer((req,res)=>{
    res.end('1')
})
var io = require('socket.io')(server);
server.listen('3002','10.9.49.207')


const sendNews = (req,res,next) =>{
    let data = req.body
    io.emit('news', data)
}

module.exports={
    sendNews
}