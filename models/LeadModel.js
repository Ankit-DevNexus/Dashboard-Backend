// models/LeadModel.js
import mongoose, { Schema } from "mongoose";

const leadSchema = new mongoose.Schema({
    // Fixed fields
    date: { 
        type: Date, 
        default: Date.now 
    },
    name: {
        type: String
    },
    email: { 
        type: String 
    },
    phone: { 
        type: String 
    },
    city: { 
        type: String 
    },
    budget: { 
        type: String 
    },
    requirement: { 
        type: String 
    },
    status: { 
        type: String 
    },
    remarks1: { 
        type: String 
    },
    remarks2: { 
        type: String 
    },
    source:{
        type: String 
    },
    Campaign:{
        type: String 
    },
    createdBy:{
        type: String 
    },
    // Dynamic fields container
    extraFields: {
        type: Schema.Types.Mixed,
        default: {}
    }
}, { timestamps: true });

const LeadsModel =  mongoose.model("Lead", leadSchema);
export default LeadsModel;