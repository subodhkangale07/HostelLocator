// const { toFormData } = require('axios');
const mongoose = require('mongoose');
const hostelSchema = new mongoose.Schema({
  hostelName: {
    type: String,
    required: true,
    trim: true
  },
   hostelOwner:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"User",
   },
  
  ownersFullName: {
    type: String,
    required: true,
    trim: true
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true
  },
  alternateContactNumber: {
    type: String,
    trim: true
  },
  hostelAddress: {
    type: String,
    required: true,
    trim: true
  },
  landmark: {
    type: String,
    trim: true
  },
  roomType: [{
    type: String,
    enum: ['SingleBed', 'DoubleBeds', 'ThreeBeds', 'FourBeds', 'MoreThanFourBeds'],
    required: true
  }],
  wifi: {
    type: Boolean,
    default: false
  },
  hotWater: {
    type: Boolean,
    default: false
  },
  drinkingWater: {
    type: Boolean,
    default: false
  },
  hostelType: {
    type: String,
    enum: ['Boys', 'Girls', 'Both'],
  },
  instructions: {
    type: String,
    trim: true
  },
  exteriorImage: {
    type: String,
    required: false 
  },
  roomImage: {
    type: String,
    required: false
  },
  bedImage: {
    type: String,
    required: false 
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  SingleBed: {
    total: {
      type: Number,
      default: 0
    },
    available: {
      type: Number,
      default: 0
    }
  },
  DoubleBeds: {
    total: {
      type: Number,
      default: 0
    },
    available: {
      type: Number,
      default: 0
    }
  },
  ThreeBeds: {
    total: {
      type: Number,
      default: 0
    },
    available: {
      type: Number,
      default: 0
    }
  },
  FourBeds: {
    total: {
      type: Number,
      default: 0
    },
    available: {
      type: Number,
      default: 0
    }
  },
  MoreThanFourBeds: {
    total: {
      type: Number,
      default: 0
    },
    available: {
      type: Number,
      default: 0
    }
  },
  price:{
    from: {
      type: Number,
      default: 0
    },
    to:{
      type: Number,
      default: 0
    },
  }

});


module.exports = mongoose.model('Hostel', hostelSchema);
