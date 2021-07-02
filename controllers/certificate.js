const path = require('path')
const Certificate = require('../models/Certificate');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');


//@desc  GET all certificates
//@desc  GET  /certificate
//@access  Public  
exports.getCertificates = asyncHandler(async (req, res, next) => {
 
        res.status(200).send(res.advancedResults);
        
        //next(err);
});

//@desc  GET single certificate
//@desc  GET  /certificate/:id
//@access  Public
exports.getCertificate = asyncHandler(async (req, res, next) => {

        const certificate = await Certificate.findById(req.params.id);

        if (!certificate) {
            return next(new ErrorResponse(`Certificate not found with id of ${req.params.id}`, 404));
        }

        res.status(200).send({success: true, data: certificate});
        
    
      //y next(err);
 
});

//@desc  Create new certificates
//@desc  Post  /certificate
//@access  Private
exports.createCertificate = asyncHandler(async (req, res, next) => {

     // Add user to req,body
   req.body.user = req.user.id;
    //const { marriageCelebratedIn, location, age, statusBeforeMarriage,  profession,  residenceAtTimeOfMarriage, dateOfMarriage, email, password, role } = req.body;

        const certificate = await Certificate.create(req.body)
        res.status(200).send({success: true, data: certificate});

});

//@desc  Update certificates
//@desc  PUT  /certificate/:id
//@access  Private
exports.updateCertificate = asyncHandler(async (req, res, next) => {
    let certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
        return next(new ErrorResponse(`Certificate not found with id of ${req.params.id}`, 404));
    };

      // Make sure user is certificate owner
    if (certificate.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.params.id} is not authorized to update this certificate`,
          401
        )
      );
    }

    certificate = await Certificate.findOneAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).send({success: true, data: certificate});
  
        // next(err);   
});

//@desc  DELETE certificates
//@desc  DELETE  /certificate/:id
//@access  Private
exports.deleteCertificate = asyncHandler(async (req, res, next) => {
   
        const certificate = await Certificate.findById(req.params.id);

        if (!certificate) {
            return next(new ErrorResponse(`Certificate not found with id of ${req.params.id}`, 404));
        };

        // Make sure user is certificate owner
        if (certificate.user.toString() !== req.user.id && req.user.role !== 'admin') {
          return next(
            new ErrorResponse(
              `User ${req.params.id} is not authorized to delete this certificate`,
              401
            )
          );
        }
        
        certificate.remove();
        
        res.status(200).send({success: true, data:{} });

   
        //next(err);
   
});



 // @desc      Upload photo for certificate
// @route     PUT /certificate/:id/photo
// @access    Private
exports.certificatePhotoUpload = asyncHandler(async (req, res, next) => {
        const certificate = await Certificate.findById(req.params.id);
      
        if (!certificate) {
          return next(
            new ErrorResponse(`Certificate not found with id of ${req.params.id}`, 404)
          );
        }
      
        //Make sure user is certificate owner
        if (certificate.user.toString() !== req.user.id && req.user.role !== 'admin') {
          return next(
            new ErrorResponse(
              `User ${req.params.id} is not authorized to update this certificate`,
              401
            )
          );
        }
      
        if (!req.files) {
          return next(new ErrorResponse(`Please upload a file`, 400));
        }

        console.log(req.files)
      
        const file = req.files.file;

          // Make sure the image is a photo
        if (!file.mimetype.startsWith('image')) {
          return next(new ErrorResponse(`Please upload an image file`, 400));
        }
      
        //Check filesize
        if (file.size > process.env.MAX_FILE_UPLOAD) {
          return next(
            new ErrorResponse(
              `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
              400
            )
          );
        }
      
        // Create custom filename
        file.name = `photo_${certificate._id}${path.parse(file.name).ext}`;
      
        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
          if (err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
          }
      
          await Certificate.findByIdAndUpdate(req.params.id, { photo: file.name });
      
          res.status(200).json({
            success: true,
            data: file.name
          });
        }); 
      });

      // @desc      Upload pdf for Document
        // @route     PUT /certificate/:id/pdf
        // @access    Private
        exports.certificatePdfUpload = asyncHandler(async (req, res, next) => {
          const certificate = await Certificate.findById(req.params.id);

          if (!certificate) {
            return next(
              new ErrorResponse(`Certificate not found with id of ${req.params.id}`, 404)
            );
          }

          //Make sure user is certificate owner
          if (certificate.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(
              new ErrorResponse(
                `User ${req.params.id} is not authorized to update this certificate`,
                401
              )
            );
          }

          if (!req.files) {
            return next(new ErrorResponse(`Please upload a file`, 400));
          }

          

          const file = req.files.file;

            // Make sure the image is a photo
          if (!file.mimetype.endsWith('pdf')) {
            return next(new ErrorResponse(`Please upload a PDF file`, 400));
          }

          //Check filesize
          if (file.size > 1000000000) {
            return next(
              new ErrorResponse(
                `Please upload an image less than 1000000000`,
                400
              )
            );
          }

          // Create custom filename
          file.name = `doc_${certificate._id}${path.parse(file.name).ext}`;

          file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
            if (err) {
              console.error(err);
              return next(new ErrorResponse(`Problem with file upload`, 500));
            }

            await Certificate.findByIdAndUpdate(req.params.id, { documentToUpload: file.name });

            res.status(200).json({
              success: true,
              data: file.name
            });
          });
          
        });

      