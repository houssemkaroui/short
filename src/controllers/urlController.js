const Url = require('../models/urlModel')

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const validUrl = require('valid-url')
const baseUrl = 'http:localhost:5115'
const shortid = require('shortid')
const click = require('../models/clickModel')

exports.createShortUrl = catchAsync(async(req,res,next) =>{
    if(!req.user.id) {        
        return next(new AppError('verifer votre token', 400));
      }
    const {longUrl} = req.body
    //check base url
    if(!validUrl.isUri(longUrl)){
        return next(
            new AppError(
              'Invalide url ',
              400
            )
          );
    }
     let url = await Url.findOne({longUrl:req.body.longUrl})
     console.log(url)
     if(url) {
        res.json(url)
     }
     else{
        const urlCode = shortid.generate()
        req.body.urlCode = urlCode
         req.body.userId=req.user.id
         req.body.shortUrl = baseUrl + '/'+ urlCode
         const url = await Url.create(req.body)
         res.status(200).send(url)

     }


})

exports.getAllurlUser = catchAsync(async(req,res,next) =>{
     if(!req.user.id) {        
        return next(new AppError('verifer votre token', 400));
      }
    const liste = await Url.find({userId:req.user.id})
    res.status(200).send(liste)
})


exports.postClick = catchAsync(async(req,res,next) =>{
  if(!req.user.id) {        
    return next(new AppError('verifer votre token', 400));
  }
 
  const nombre = await click.findOne({URlId:req.body.URlId})
  if(nombre) {
    const data = await click.findByIdAndUpdate(nombre._id, { clicsNb: nombre.clicsNb+1 }, {
      new: true,
      runValidators: true,
  });
    res.status(200).send(data)
  }else{
    req.body.clicsNb =+1
    req.body.userId = req.user.id
    const data = await click.create(req.body)
    res.status(200).send(data)
  }
 
})

exports.getNombreClik = catchAsync(async (req, res, next) => {
  if(!req.user.id) {        
    return next(new AppError('verifer votre token', 400));
  }
    const query = await click.findOne({URlId:req.params.URlId});


    if (!query) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({data: query});
  });