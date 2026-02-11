// প্রয়োজনীয় লাইব্রেরিগুলো ইম্পোর্ট করা হচ্ছে
const express = require('express'); // সার্ভার তৈরির জন্য এক্সপ্রেস
const axios = require('axios'); // গুগল স্ক্রিপ্ট থেকে ডাটা আনতে অ্যাক্সিওস
const cors = require('cors'); // ওয়েবসাইট এক্সেস কন্ট্রোল করার জন্য কর্স
const app = express(); // এক্সপ্রেস অ্যাপলিকেশন শুরু করা

// শুধুমাত্র আপনার ওয়েবসাইটকে ডাটা নেওয়ার অনুমতি দেওয়া হচ্ছে
const corsOptions = {
  origin: 'https://www.swapneel.bro.bd', // এখানে আপনার মেইন ডোমেইনটি দেওয়া হয়েছে
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); // সার্ভারে এই সিকিউরিটি নিয়মটি চালু করা হলো
app.use(express.json()); // সার্ভারকে জেএসন (JSON) ডাটা পড়ার অনুমতি দেওয়া হলো

// এই ভেরিয়েবলটি সরাসরি রেন্ডারের Environment Settings থেকে লিঙ্কটি টেনে আনবে
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

// আপনার ওয়েবসাইট যখন এই লিঙ্কে রিকোয়েস্ট পাঠাবে
app.get('/get-data', async (req, res) => {
    
    // চেক করা হচ্ছে রিকোয়েস্টটি কি আপনার নির্দিষ্ট পেজ থেকে এসেছে কি না
    const referer = req.headers.referer || "";
    const allowedPath = "https://www.swapneel.bro.bd/projects"; 

    // যদি রিকোয়েস্টটি /projects পেজ থেকে না আসে, তবে এক্সেস ব্লক করা হবে
    if (!referer.startsWith(allowedPath)) {
        return res.status(403).json({ 
            error: "অ্যাক্সেস ডিনাইড! আপনি এই ডাটা দেখার জন্য অনুমোদিত নন।" 
        });
    }

    try {
        // সার্ভার নিজে পর্দার আড়ালে গিয়ে গুগল স্ক্রিপ্ট থেকে ডাটা নিয়ে আসবে
        const response = await axios.get(GOOGLE_SCRIPT_URL);
        
        // সংগৃহীত ডাটা আপনার ওয়েবসাইটে পাঠিয়ে দেওয়া হচ্ছে
        res.json(response.data);
    } catch (error) {
        // যদি কোনো সমস্যা হয় তবে এরর মেসেজ দেখাবে
        console.error("ডাটা আনতে সমস্যা হয়েছে:", error.message);
        res.status(500).json({ error: "সার্ভার থেকে ডাটা আনতে ব্যর্থ হয়েছে" });
    }
});

// রেন্ডারের দেওয়া পোর্টে অথবা লোকালহোস্টের ৩০০০ পোর্টে সার্ভার চলবে
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Swapneel's Server is running on port ${PORT}`);
});