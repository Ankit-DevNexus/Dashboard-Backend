import jwt from "jsonwebtoken";
import LeadsModel from "../models/LeadModel.js";

// const JWT_SECRET = process.env.JWT_SECRET;

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
        //   decoded = jwt.verify(token, JWT_SECRET); // verify token
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
            createdBy: req.user._id,
            ...extraFields // This flattens dynamic fields as top-level fields
        });

        const savedLead = await newLead.save();

        return res.status(201).json({ message: "Lead created successfully", lead: savedLead });
    } catch (error) {
        return res.status(500).json({ message: "Error creating lead", error: error.message });
    }
};

