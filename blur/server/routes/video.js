const express = require('express');
const router = express.Router();
const multer = require('multer');
var ffmpeg = require('fluent-ffmpeg');

//const { Video } = require("../models/Video");
//const { Subscriber } = require("../models/Subscriber");
const { auth } = require("../middleware/auth");

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null, true)
    }
})

var upload = multer({ storage: storage }).single("file")


//=================================
//             User
//=================================


router.post("/uploadfiles", (req, res) => {

    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
    })

});


router.post("/thumbnail", (req, res) => {

    let thumbsFilePath ="";
    let fileDuration ="";

    ffmpeg.ffprobe(req.body.filePath, function(err, metadata){
        console.dir(metadata);
        console.log(metadata.format.duration);

        fileDuration = metadata.format.duration;
    })


    ffmpeg(req.body.filePath)
        .on('filenames', function (filenames) {
            console.log('Will generate ' + filenames.join(', '))
            thumbsFilePath = "uploads/thumbnails/" + filenames[0];
        })
        .on('end', function () {
            console.log('Screenshots taken');
            return res.json({ success: true, thumbsFilePath: thumbsFilePath, fileDuration: fileDuration})
        })
        .screenshots({
            // Will take screens at 20%, 40%, 60% and 80% of the video
            count: 3,
            folder: 'uploads/thumbnails',
            size:'320x240',
            // %b input basename ( filename w/o extension )
            filename:'thumbnail-%b.png'
        });

});



/*
router.get("/getVideos", (req, res) => {

    Video.find()
        .populate('writer')
        .exec((err, videos) => {
            if(err) return res.status(400).send(err);
            res.status(200).json({ success: true, videos })
        })

});



router.post("/uploadVideo", (req, res) => {

    const video = new Video(req.body)

    video.save((err, video) => {
        if(err) return res.status(400).json({ success: false, err })
        return res.status(200).json({
            success: true 
        })
    })

});


router.post("/getVideo", (req, res) => {

    Video.findOne({ "_id" : req.body.videoId })
    .populate('writer')
    .exec((err, video) => {
        if(err) return res.status(400).send(err);
        res.status(200).json({ success: true, video })
    })
});


router.post("/getSubscriptionVideos", (req, res) => {


    //Need to find all of the Users that I am subscribing to From Subscriber Collection 
    
    Subscriber.find({ 'userFrom': req.body.userFrom })
    .exec((err, subscribers)=> {
        if(err) return res.status(400).send(err);

        let subscribedUser = [];

        subscribers.map((subscriber, i)=> {
            subscribedUser.push(subscriber.userTo)
        })


        //Need to Fetch all of the Videos that belong to the Users that I found in previous step. 
        Video.find({ writer: { $in: subscribedUser }})
            .populate('writer')
            .exec((err, videos) => {
                if(err) return res.status(400).send(err);
                res.status(200).json({ success: true, videos })
            })
    })
});
*/

module.exports = router;



/*
const express = require('express');
const router = express.Router();
//const { Video } = require("../models/Video");
//video 모델 가져오기
//const path = require('path');
const { auth } = require("../middleware/auth");
//const { multer } = require("multer");
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg"); //다운받은 defen

//multer config 저장
var storage = multer.diskStorage({
  //파일 올리면 어디에 저장할지 설명 -> uploads라는 폴더에 올라옴
  destination: (req, file, cb) => {
      cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
  },//1220_hello 형식 이름
  fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      if (ext !== '.mp4') {
        return cb(res.status(400).end('only mp4 is allowed'), false);
      }
      cb(null, true)
  }
}) //config 옵션

//const upload = multer({storage: storage}).single("file");
var upload = multer({storage: storage}).single("file");


//app.use('/api/video', require('./routes/video')); 읽고 넘어오니까
//api/vidoe/uploadfiles' 안써줘도
//콜백이라 req, res
//req통해서 파일 받고


router.post("/uploadfiles", (req, res) => {
  //이안에서 클라이언트한테 받은 비디오 서버에 저장
  upload(req,res,err => {
      if(err){
        //에러나면 상태 false로 바꿔서 videouploadPage 에서
        //axios 보낸거 성공 x시 보여주기로 한 문구 보낼 수 있도록
        return res.json({succes: false, err})
      }
      //url : 파일 업로드하면 업로드 폴더에 들어가고 그 경로 클라이언트에 보내주는중
      return res.json({succes: true, filePath: res.req.file.path, fileName: res.req.file.filename})
  })
});

router.post("/thumbnail", (req, res) => {
  //썸네일 생성하고 비디오 러닝타임도 가져오기

  let filePath ="";
  let fileDuration ="";

  //비디오 정보 가져오기
  //아래 비디오(req.body.url)넣기, 자동적으로 metadata 가져오기
  ffmpeg.ffprobe(req.body.filePath, function(err, metadata){
      console.dir(metadata); //all metadata
      console.log(metadata.format.duration);

      fileDuration = metadata.format.duration;
  })


  //썸네일 생성
  //req.body.url : 클라이언트에서 온 비디오 저장경로(uploads경로)
  ffmpeg(req.body.filePath)
      //가져온 비디오 파일의 썸네일 이름 filenames 생성
      .on('filenames', function (filenames) {
          console.log('Will generate ' + filenames.join(', '))
          console.log(filenames)

          //in 강의, filePath = thumbsFilePath
          thumbsFilePath = "uploads/thumbnails/" + filenames[0];
      })
      //(썸네일 생성)다하고 뭐할건지
      .on('end', function () {
          console.log('Screenshots taken');
          return res.json({ success: true, thumbsFilePath: thumbsFilePath, fileDuration: fileDuration})
      })
      .on('error', function (err) {
        console.error(err);
        return res.json({ success: fasle, err});
      })

      .screenshots({
          // Will take screens at 20%, 40%, 60% and 80% of the video
          //count가 3개면 3개의 썸네일 찍을 수 있는거
          count: 3,
          //업로드 폴더의 썸네일안에 저장
          folder: 'uploads/thumbnails',
          size:'320x240',
          // %b input basename ( filename w/o extension 제오)
          filename:'thumbnail-%b.png'
      });

})


module.exports = router;
*/