const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const Roof  = require('../models/roof');
const User = require('../models/user');

const photoUtil = require('../utils/photoUploadService')

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  // storage: storage,
  limits: {fileSize: 100000000},
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  }
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images only!');
  };
};

router.get('/', async(req, res) => {
  try {
    const allRoofs = await Roof.find();
    res.json({
      status: 200,
      data: allRoofs
    })
  } catch(err) {
    res.send(err);
  };
});

router.get('/:id', async(req, res) =>{
  try {
    // const foundUser = await User.findById(req.params.id);
    const foundRoof = await Roof.findOne({userId: req.params.id});
    res.json({
      status: 200,
      data: foundRoof,
    });
  } catch(err) {
    res.send(err)
  };
});

router.post('/', upload.single('roofImg'), (req, res) => {
  photoUtil.uploadPhotoSaveFormInfo(req, res, Roof, 'roofImg')
});
// router.post('/', (req, res) => {
//   upload(req, res,  async (err) => {
//     if (err) {
//       res.json(err);
//     }else{
//       const createdPost = await Roof.create(makeRoofFromBody(req.body, req.file.filename))
//       createdPost.save((err, savedPost) => {
//         res.json({
//           msg: 'file uploaded',
//           newPost: savedPost,
//         });
//       });
//     };
//   });
// });

function makeRoofFromBody(body, filename){
  return {
    roofImg: `public/uploads/${filename}`,
    exterior: body.exterior,
    roofColor: body.roofColor,
    pvSystem: body.pvSystem,
    panels: body.panels,
    dcCapacity: body.dcCapacity,
    userId: body.userId
  };
};

router.put('/:id', (req, res) => {
  upload(req, res, async(err) =>{
    if (err){
      console.log('its err', err);
    } else {
      const example = makeRoofFromBody(req.body, req.file.filename);
      const foundRoof = await Roof.findOne({userId: req.params.id});
      const updatedRoof = await Roof.findByIdAndUpdate(foundRoof._id, example, {new: true});

      res.json ({
        status: 200,
        data: updatedRoof
      });
    };
  });
});

router.delete('/:id', async(req, res) => {
  try {
    const foundRoof = await Roof.findOne({userId: req.params.id});
    const deletedRoof = await Roof.findByIdAndRemove(foundRoof._id);
    res.json({
      status: 200,
      data: deletedRoof
    });
  } catch(err) {
    res.send(err)
  };
});

module.exports = router
