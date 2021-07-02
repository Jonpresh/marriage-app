const express = require('express');
const {getCertificate,
     getCertificates,
     createCertificate, 
     updateCertificate, 
     deleteCertificate, 
     certificatePhotoUpload,
     certificatePdfUpload
    } = require('../controllers/certificate');

    const advancedResults = require('../middleware/advancedResults')

    const Certificate = require('../models/Certificate')

    const { protect, authorize} = require('../middleware/auth')

    
const router = express.Router();


router
  .route('/:id/photo')
  .put(protect, authorize('admin'), certificatePhotoUpload)

router
.route('/:id/pdf').
put(protect, authorize('user', 'admin'), certificatePdfUpload)

router.route('/')
.get(advancedResults(Certificate), getCertificates)
.post(protect, authorize('admin'), createCertificate);

router.route('/:id')
.get(getCertificate)
.put(protect, authorize('admin'), updateCertificate)
.delete(protect, authorize('admin'), deleteCertificate)





module.exports = router 