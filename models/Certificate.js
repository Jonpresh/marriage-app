const mongoose = require('mongoose');


const CertificateSchema = new mongoose.Schema({
    marriageCelebratedIn:{
        type: String,
        required: [true, 'Please add name'],
        trim: true,
        maxlength:[100, 'Name cannot be more than 100 characters']
    },

    location: {
        type: String,
        required: [true, 'Please add location'],
        maxlength:[500, 'Name cannot be more than 50 characters']
    },

    

      statusBeforeMarriage: {
        type: String,
        enum: [
            'Bachelor',
            'Sprinster'
          ]
      },

      profession: String,

      residenceAtTimeOfMarriage: {
        type: String,
      },

      photo: {
        type: String,
        default: 'no-photo.jpg'
      },

      documentToUpload: {
        type: String,
        default: 'no-doc.jpg'
      },

      createdAt: {
        type: Date,
        default: Date.now
      },
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
      },
      dateOfMarriage: String,     
    });




    module.exports = mongoose.model('Certificate', CertificateSchema);