import multer from 'multer'

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
            return cb(new Error('Пожалуйста загрузите png|jpg|jpeg файл'))
        }

        cb(null, true)
    }
})

export default upload