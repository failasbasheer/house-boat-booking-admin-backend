import { Request, Response } from 'express';
import { FAQ } from '../models/FAQ';
import { PricingPlan } from '../models/Pricing';
import { Category } from '../models/Category';

// Data from User Request
const FAQ_DATA = [
    {
        title: "Booking & Information",
        items: [
            {
                question: "What's included in the houseboat booking?",
                answer: [
                    "✓ Accommodation: Private rooms in chosen category (Premium/Luxury)",
                    "✓ All Meals: Traditional Kerala breakfast, lunch, dinner, and evening snacks",
                    "✓ Welcome Amenities: Fresh juice, tender coconut, and local snacks",
                    "✓ Sightseeing: Backwater cruise with village visits and sunset views",
                    "✓ Crew Service: Experienced captain, chef, and helper",
                    "✓ Safety Equipment: Life jackets, first aid kit, and emergency contacts"
                ]
            },
            {
                question: "How far in advance should I book and do you offer instant confirmation?",
                answer: ["We recommend booking at least 3-4 weeks in advance during peak season (Dec-Feb). For instant confirmation, you can reach us directly via WhatsApp."]
            }
        ],
        sortOrder: 1
    },
    {
        title: "Experience & Safety",
        items: [
            {
                question: "Are houseboats safe for children, elderly guests, and non-swimmers?",
                answer: [
                    "Yes, we have comprehensive safety measures:",
                    "For Children: Child-safe railings, life jackets, 24/7 supervision.",
                    "For Elderly: Comfortable seating, accessible bathrooms, boarding assistance.",
                    "For Non-Swimmers: Mandatory life jackets for water activities, experienced crew assistance."
                ]
            },
            {
                question: "What food options are available and can you accommodate dietary restrictions?",
                answer: [
                    "Standard Menu: Traditional Kerala cuisine including fresh fish, chicken, and vegetable curries.",
                    "Dietary Accommodations: Vegetarian, Vegan, Jain, Gluten-Free, and Diabetic-friendly options available on request.",
                    "Please inform us 24 hours in advance."
                ]
            },
            {
                question: "What activities are included?",
                answer: [
                    "Sightseeing: Vembanad Lake cruise, village visits, bird watching.",
                    "Cultural: Local interactions, seasonal boat races.",
                    "Onboard: Fishing, cooking demos, games, music."
                ]
            }
        ],
        sortOrder: 2
    },
    {
        title: "General Information",
        items: [
            {
                question: "How do I reach the boarding point?",
                answer: [
                    "Nearest Airport: Kochi International Airport (85 km).",
                    "Nearest Train Station: Alappuzha Railway Station (3 km).",
                    "We provide GPS coordinates and can arrange airport/station pickups."
                ]
            },
            {
                question: "What is the best time to visit?",
                answer: [
                    "Peak Season (Dec-Feb): Cool weather, perfect for cruising.",
                    "Shoulder Season (Mar-May, Sep-Nov): Good availability, fewer crowds.",
                    "Monsoon (Jun-Aug): Lush greenery, nature lovers' paradise."
                ]
            },
            {
                question: "Do you provide Wi-Fi?",
                answer: ["Wi-Fi is not standard on houseboats due to moving network coverage. Mobile network (Airtel/Jio) works in most areas. Premium boats may offer limited Wi-Fi."]
            }
        ],
        sortOrder: 3
    }
];

const PRICING_PACKAGES = [
    {
        title: "Day Cruise Packages",
        duration: "11:00 AM - 5:00 PM",
        description: "Perfect for a quick yet immersive backwater experience. Enjoy a traditional lunch and sunset tea while cruising the serene canals.",
        includes: ["Welcome Drink", "Traditional Lunch", "Evening Tea & Snacks", "6 Hours Cruising"],
        priceEstimate: "From ₹8,500",
        bestFor: "Day Trippers",
        sortOrder: 1
    },
    {
        title: "Overnight Stay",
        duration: "12:00 PM - 9:00 AM",
        description: "The complete backwater experience. Sunset cruise, starlit dinner, and a peaceful night on the water. Wake up to the sounds of nature.",
        includes: ["Lunch, Dinner, Breakfast", "Candlelight Dinner Option", "21 Hours Onboard", "Private Bedroom"],
        priceEstimate: "From ₹12,000",
        bestFor: "Full Experience",
        sortOrder: 2
    }
];

export const ContentController = {
    // --- FAQs ---
    getFAQs: async (req: Request, res: Response) => {
        try {
            const faqs = await FAQ.find().sort({ sortOrder: 1 });
            res.json(faqs);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    seedFAQs: async (req: Request, res: Response) => {
        try {
            await FAQ.deleteMany({});
            await FAQ.insertMany(FAQ_DATA);
            res.json({ message: 'FAQs seeded successfully' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    // --- Pricing ---
    getPricing: async (req: Request, res: Response) => {
        try {
            const plans = await PricingPlan.find().sort({ sortOrder: 1 });
            res.json(plans);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    seedPricing: async (req: Request, res: Response) => {
        try {
            await PricingPlan.deleteMany({});
            await PricingPlan.insertMany(PRICING_PACKAGES);
            res.json({ message: 'Pricing seeded successfully' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
};
