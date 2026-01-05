const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const uri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/houseboat-db';

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

const CATEGORIES_DATA = [
    {
        id: 'premium',
        display_name: 'Premium Houseboats',
        slug: 'premium',
        tagline: 'Premium Excellence',

        duration: 'Overnight Cruise',
        guestCapacity: '2 - 6 Guests',
        secondaryDescription: 'Immerse yourself in the tranquility of the Alleppey backwaters. This houseboat is designed not just for travel, but for comfort. Every detail invites you to slow down and enjoy the journey.',
        amenitiesList: [
            { icon: 'Wind', title: 'Climate Control', desc: 'AC Bedrooms (9PM - 6AM)' },
            { icon: 'Utensils', title: 'Full Board Dining', desc: 'Lunch, Dinner & Breakfast' },
            { icon: 'Sun', title: 'Private Sundeck', desc: 'Open-air viewing area' },
            { icon: 'Wifi', title: 'WiFi Connectivity', desc: 'Complimentary' },
            { icon: 'Droplets', title: 'En-suite', desc: 'Private attached bathrooms' },
            { icon: 'Coffee', title: 'Hospitality', desc: 'Welcome drink & tea service' }
        ],
        description: 'Our premium houseboats offer an elevated Kerala backwater experience with spacious AC suites, gourmet dining, enhanced decks, and a dedicated 4-member crew. Ideal for discerning travelers, families, and special occasions.',
        stats: { rating: 4.9 },
        reviews: [
            { name: 'Amit & Priya Sharma', location: 'Mumbai', text: 'Absolutely worth the upgrade! Spacious suite, gourmet meals, and exceptional service. Perfect for celebrations.' },
            { name: 'Rachel Thompson', location: 'UK', text: 'Private balcony mornings were magical. Crew anticipated every need. Best decision of my Kerala trip.' },
            { name: 'Vivek & Family', location: 'Delhi', text: 'Perfect for a family of 5. Spacious, comfortable, and amazing food.' }
        ],
        availableCount: 25,
        imagePlaceholder: '/packages/premium.webp',
        is_active: true,
        sortOrder: 2
    },
    {
        id: 'luxury',
        display_name: 'Luxury Houseboats',
        slug: 'luxury',
        tagline: 'Ultimate Backwater Opulence',

        duration: 'Overnight Cruise',
        guestCapacity: '2 - 10 Guests',
        secondaryDescription: 'Experience the pinnacle of luxury. With a personal butler, infinity pool deck, and presidential suites, this houseboat offers a floating five-star hotel experience unlike any other.',
        amenitiesList: [
            { icon: 'Wind', title: 'Central AC', desc: '24/7 Climate Control' },
            { icon: 'Utensils', title: 'Gourmet Dining', desc: 'Chef-prepared meals' },
            { icon: 'Sun', title: 'Infinity Deck', desc: 'Private pool & lounge' },
            { icon: 'Wifi', title: 'High-Speed Wifi', desc: 'Starlink Connectivity' },
            { icon: 'Droplets', title: 'Jacuzzi', desc: 'In-suite private jacuzzi' },
            { icon: 'Coffee', title: 'Butler Service', desc: '24/7 Personal Attention' }
        ],
        description: 'Luxury houseboats redefine opulence on Kerala’s backwaters with presidential suites, infinity pool decks, personal butler service, fine dining, spa & entertainment facilities. Built for elite, privacy-focused guests.',
        stats: { rating: 4.9 },
        reviews: [
            { name: 'Rajesh & Meera Gupta', location: 'Dubai', text: 'More luxurious than 5-star hotels. Butler service and infinity pool were unreal.' },
            { name: 'James & Sarah Wilson', location: 'London', text: 'Michelin-level cuisine, spa on water, total privacy. Once-in-a-lifetime experience.' },
            { name: 'Arjun Kapoor Family', location: 'Mumbai', text: 'Hosted board meetings onboard. World-class facilities and service.' }
        ],
        availableCount: 15,
        imagePlaceholder: '/packages/luxury.webp',
        is_active: true,
        sortOrder: 3
    },
    {
        id: 'deluxe',
        display_name: 'Deluxe Houseboats',
        slug: 'deluxe',
        tagline: 'Best Value Experience',

        duration: 'Overnight Cruise',
        guestCapacity: '2 - 8 Guests',
        secondaryDescription: 'A perfect blend of tradition and comfort. Enjoy the authentic Kerala houseboat experience with modern amenities and a friendly crew dedicated to your service.',
        amenitiesList: [
            { icon: 'Wind', title: 'AC Bedroom', desc: '9PM - 6AM Cooling' },
            { icon: 'Utensils', title: 'Traditional Food', desc: 'Kerala Style Meals' },
            { icon: 'Sun', title: 'Upper Deck', desc: 'Scenic viewing area' },
            { icon: 'Droplets', title: 'Attached Bath', desc: 'Clean & Hygienic' },
            { icon: 'Coffee', title: 'Tea & Snacks', desc: 'Evening refreshments' }
        ],
        description: 'Our deluxe houseboats offer the perfect blend of comfort and authentic Kerala experience with modern amenities, traditional charm, and memorable backwater journeys. Ideal for families, couples, and senior travelers.',
        stats: { rating: 4.8 },
        reviews: [
            { name: 'Rajesh & Family', location: 'Mumbai', text: 'Perfect deluxe experience. Comfortable AC rooms, amazing food, and professional crew. Kids loved the village visit.' },
            { name: 'Arjun & Priya', location: 'Bangalore', text: 'Romantic and peaceful. Beautiful sunset views and delicious Kerala cuisine.' },
            { name: 'Sarah Johnson', location: 'UK', text: 'Absolutely magical. Clean, comfortable houseboat and very helpful crew.' },
            { name: 'Meera & Group', location: 'Chennai', text: 'Smooth booking, great amenities, and excellent service.' },
            { name: 'Vikram & Parents', location: 'Pune', text: 'Slow pace, respectful crew, and very comfortable for elderly travelers.' }
        ],
        availableCount: 30,
        imagePlaceholder: '/packages/deluxe.webp',
        is_active: true,
        sortOrder: 1
    },
    {
        id: 'romantic',
        display_name: 'Romantic Houseboats',
        slug: 'romantic',
        tagline: 'Now Available',

        duration: '21 Hours',
        guestCapacity: '2 Guests',
        secondaryDescription: 'Celebrate your love in the most romantic setting. Private decks, candlelight dinners, and flower decorations create an unforgettable atmosphere for honeymooners.',
        amenitiesList: [
            { icon: 'Wind', title: 'Private AC', desc: 'Cozy Bedroom' },
            { icon: 'Utensils', title: 'Candlelight Dinner', desc: 'Romantic Setting' },
            { icon: 'Sun', title: 'Private Deck', desc: 'Exclusively for two' },
            { icon: 'Wifi', title: 'WiFi Connectivity', desc: 'Stay connected' },
            { icon: 'Droplets', title: 'Modern Bath', desc: 'Hot water available' },
            { icon: 'Coffee', title: 'Welcome Cake', desc: 'Honeymoon Special' }
        ],
        description: 'Designed exclusively for couples, our romantic houseboats offer complete privacy, romantic candlelight dinners, flower bed decorations, and a serene journey through the most secluded canals.',
        stats: { rating: 4.9 },
        reviews: [
            { name: 'Rohan & Aishwarya', location: 'Bangalore', text: 'The flower decoration and candlelight dinner were dreamy. The crew respected our privacy completely.' },
            { name: 'Chris & Emily', location: 'Australia', text: 'Magical experience. The quiet canals at sunset were the highlight of our India trip.' }
        ],
        availableCount: 5,
        imagePlaceholder: '/packages/honeymoon.webp',
        is_active: true,
        sortOrder: 4
    },
    {
        id: 'shared-tours',
        display_name: 'Shared Houseboats',
        slug: 'shared-tours',
        tagline: 'Budget Friendly',

        duration: 'Day & Overnight',
        guestCapacity: 'Variable',
        secondaryDescription: 'Join other travelers for a shared cruising experience.',
        amenitiesList: [
            { icon: 'Wind', title: 'AC Bedroom', desc: 'Private Cabin' },
            { icon: 'Utensils', title: 'Shared Dining', desc: 'Buffet Meals' },
            { icon: 'Sun', title: 'Shared Deck', desc: 'Social Space' },
            { icon: 'Wifi', title: 'WiFi Connectivity', desc: 'Common Area' },
            { icon: 'Droplets', title: 'Private Bath', desc: 'Attached to Cabin' },
            { icon: 'Coffee', title: 'Tea & Snacks', desc: 'Communal Service' }
        ],
        description: 'Perfect for solo travelers and small groups. Share a premium houseboat with others and enjoy the same luxury experience at a fraction of the cost.',
        stats: { rating: 4.5 },
        reviews: [],
        availableCount: 5,
        imagePlaceholder: '/collection/IMG-20250617-WA0018 (3).jpg',
        is_active: true,
        sortOrder: 5
    }
];

async function run() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(uri);
        console.log('Connected.');

        // Define Models (Schema-less or loose)
        const Category = mongoose.model('Category', new mongoose.Schema({ id: String }, { strict: false, id: false }));
        const FAQ = mongoose.model('FAQ', new mongoose.Schema({}, { strict: false }));
        const PricingPlan = mongoose.model('PricingPlan', new mongoose.Schema({}, { strict: false }));

        console.log('Seeding FAQs...');
        await FAQ.deleteMany({});
        await FAQ.insertMany(FAQ_DATA);
        console.log(`Seeded ${FAQ_DATA.length} FAQs.`);

        console.log('Seeding PricingPlans...');
        await PricingPlan.deleteMany({});
        await PricingPlan.insertMany(PRICING_PACKAGES);
        console.log(`Seeded ${PRICING_PACKAGES.length} PricingPlans.`);

        console.log('Seeding Categories...');
        // Limit reviews to 1 per category as requested
        const categoriesWithSingleReview = CATEGORIES_DATA.map(cat => ({
            ...cat,
            reviews: cat.reviews ? cat.reviews.slice(0, 1) : []
        }));

        await Category.deleteMany({});
        await Category.insertMany(categoriesWithSingleReview);
        console.log(`Seeded ${categoriesWithSingleReview.length} Categories.`);

        console.log('Done!');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

run();
