var multer  = require('multer')
var path = require('path')
var randomstring = require('randomstring')
var fs = require('fs')
// var upload = multer({ 
//     dest: path.resolve(__dirname,'../public/uploads')
// })

let imgMap={
    'image/jpeg':'.jpeg',
    'image/png':'.png',
    'image/gif':'.gif',
    'image/jpg':'.jpg',
}

var filename = ''

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(__dirname,'../public/uploads'))
    },
    filename: function (req, file, cb) {
        filename = file.fieldname + '-' + randomstring.generate(6)+imgMap[file.mimetype]
      cb(null, filename)
    
    }
  })

  var upload = multer({storage:storage}).single('companyLogo')
module.exports = (req,res,next) =>{
  res.set('Content-Type', 'application/json; charset=utf-8')
    upload(req, res, function (err) {
      console.log(req.body)
      // if(filename){
      //   console.log(req.body.tempCompanyLogo)
      //       fs.unlink(path.resolve(__dirname,'../public/uploads/'+req.body.temCompanyLogo),(err) => {
      //         console.log('suc');
      //         if (err) {
      //           console.log(err.message)
      //         }
      //       }
      //       )
      // }
      // req.filename = filename   
      // filename=''     
      res.render('succ', {
        data: JSON.stringify({
          message:'上传成功',
          filename,
        })
    })
    
      })
}