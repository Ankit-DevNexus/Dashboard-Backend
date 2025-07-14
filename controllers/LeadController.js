
import dotenv from 'dotenv';
dotenv.config();


import xlsx from "xlsx";
import LeadsModel from "../models/LeadModel.js";
// import LeadsModelByExcel from "../models/LeadsModelByExcel.js";

// const JWT_SECRET = process.env.JWT_SECRET;


// create leads manually
export const createLead = async (req, res) => {
    try {
        // Step 1: Extract and verify JWT
        // const authHeader = req.headers.authorization;
        // if (!authHeader || !authHeader.startsWith("Bearer ")) {
        //   return res.status(401).json({ message: "Unauthorized: No token provided." });
        // }

        // const token = authHeader.split(" ")[1];
        // let decoded;

        // try {
        //   decoded = jwt.verify(token, JWT_SECRET); // verify tokzsen
        //   req.user = decoded; // Attach user data to request
        // } catch (err) {
        //   return res.status(403).json({ message: "Invalid or expired token." });
        // }

        // // Step 2: Optional - fetch user if needed
        // const user = await LeadsModel.findById(decoded.id);
        // if (!user || !user.isActive) {
        //   return res.status(401).json({ message: "Unauthorized: User not found or inactive." });
        // }

        // Step 3: Proceed to lead creation

        const {
            date, name, email, phone, city,
            budget, requirement, status,
            remarks1, remarks2, source, Campaign,
            ...extraFields
        } = req.body;

        const newLead = new LeadsModel({
            date,
            name,
            email,
            phone,
            city,
            budget,
            requirement,
            source,
            Campaign,
            status,
            remarks1,
            remarks2,
            createdById: req.user.id,
            createdBy: req.user.name,
            ...extraFields // This flattens dynamic fields as top-level fields
        });

        const savedLead = await newLead.save();

        return res.status(201).json({ message: "Lead created successfully", lead: savedLead });
    } catch (error) {
        return res.status(500).json({ message: "Error creating lead", error: error.message });
    }
};


// create leads via .csv and excel
export const uploadLeadsFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Parse Excel file buffer
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet); // auto handles dynamic headers

    const leads = rows.map(row => ({
      ...row,
      createdBy: req.user?.name || "system"
    }));

    const savedLeads = await LeadsModel.insertMany(leads);

    res.status(200).json({ message: "Leads uploaded successfully", count: savedLeads.length });
  } catch (error) {
    console.error("Excel Upload Error:", error);
    res.status(500).json({ message: "Failed to upload leads", error: error.message });
  }
};


// get all leads from created leads 
export const getAllLeads = async (req, res) => {
  try {
    const leads = await LeadsModel.find()
      .select('-source -Campaign') // Exclude these fields

    return res.status(200).json({ message: "Leads fetched successfully", leads });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching leads", error: error.message });
  }
};


// get leads from meta APIs

const AD_ACCOUNT_ID = process.env.AD_ACCOUNT_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;


export const getLeadsFromMetaAPI = async (req, res) => {
   const url = `https://graph.facebook.com/v19.0/${AD_ACCOUNT_ID}/insights?fields=campaign_name,clicks,impressions,spend&access_token=${ACCESS_TOKEN}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching Meta Ads data:', error.message);
    res.status(500).json({ error: 'Failed to fetch Meta Ads data' });
  }
}


// https://graph.facebook.com/v23.0/1381264666476332/events?access_token=EAA5ZCj82CAQUBPCnywNiBdIy9ULbBeNBOEKZACB8k1bCEU6Pk8fORRZCjn8utxUMNIXdRyyLjfudnMlXY0zmigSVXZCAtfZARU4YA6vVNFKd5q9wZBdPZBdbKO3GRglMHrrFzt5akZAklkhujFiQKG2ZBZACxrZCudrnD8D3IkQqIBeDsMsOmHX4kVhhIiR4MbZAZBAZDZD