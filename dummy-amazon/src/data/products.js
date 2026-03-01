export const categories = [
    'All', 'Electronics', 'Books', 'Clothing', 'Home & Kitchen', 'Sports', 'Beauty', 'Toys', 'Grocery'
];

export const brands = {
    'Electronics': ['Apple', 'Samsung', 'Sony', 'Logitech', 'Anker', 'Bose', 'LG', 'Dell', 'JBL'],
    'Books': ['Penguin', 'HarperCollins', 'Random House', 'Simon & Schuster', 'Scholastic'],
    'Clothing': ['Nike', 'Adidas', 'Levi\'s', 'H&M', 'Zara', 'Under Armour', 'Patagonia', 'Ralph Lauren'],
    'Home & Kitchen': ['KitchenAid', 'Instant Pot', 'Cuisinart', 'OXO', 'Dyson', 'iRobot', 'Le Creuset'],
    'Sports': ['Nike', 'Under Armour', 'Wilson', 'Callaway', 'Yeti', 'Hydro Flask'],
    'Beauty': ['CeraVe', 'Neutrogena', 'L\'Oréal', 'Olay', 'Dove', 'Fenty Beauty', 'Elemis'],
    'Toys': ['LEGO', 'Hasbro', 'Mattel', 'Fisher-Price', 'Hot Wheels', 'Nerf'],
    'Grocery': ['Organic Valley', 'KIND', 'Clif Bar', 'Nature Valley', 'Starbucks', 'Quaker'],
};

export const products = [
    { id: 1, name: 'Apple AirPods Pro (2nd Gen)', category: 'Electronics', brand: 'Apple', price: 199.99, originalPrice: 249.99, rating: 4.8, reviewCount: 124530, image: 'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=400&q=80', prime: true, badge: 'Best Seller', description: 'Active Noise Cancellation, Transparency mode, Spatial Audio.' },
    { id: 5, name: 'Anker 65W USB-C Charger', category: 'Electronics', brand: 'Anker', price: 25.99, originalPrice: 35.99, rating: 4.6, reviewCount: 67800, image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80', prime: true, badge: "Amazon's Choice", description: 'Fast charging for laptop, phone, tablet. Foldable plug.' },
    { id: 11, name: 'Apple MacBook Air M3', category: 'Electronics', brand: 'Apple', price: 1099.00, originalPrice: 1099.00, rating: 4.9, reviewCount: 9800, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80', prime: false, badge: null, description: '15-hour battery, M3 chip, Liquid Retina display.' },
    { id: 3, name: 'Sony WH-1000XM5 Headphones', category: 'Electronics', brand: 'Sony', price: 279.99, originalPrice: 399.99, rating: 4.7, reviewCount: 38900, image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80', prime: true, badge: null, description: 'Industry-leading noise cancellation, 30-hour battery life.' },

    { id: 21, name: 'Atomic Habits by James Clear', category: 'Books', brand: 'Penguin', price: 13.99, originalPrice: 27.00, rating: 4.8, reviewCount: 234000, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80', prime: true, badge: 'Best Seller', description: 'An easy and proven way to build good habits and break bad ones.' },
    { id: 23, name: 'Dune by Frank Herbert', category: 'Books', brand: 'Simon & Schuster', price: 10.99, originalPrice: 19.99, rating: 4.8, reviewCount: 45600, image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80', prime: false, badge: null, description: 'The bestselling science fiction novel of all time.' },
    { id: 28, name: 'Sapiens: A Brief History of Humankind', category: 'Books', brand: 'HarperCollins', price: 16.99, originalPrice: 22.00, rating: 4.7, reviewCount: 143000, image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80', prime: true, badge: null, description: 'Yuval Noah Harari explores how Homo sapiens came to dominate the planet.' },

    { id: 31, name: "Nike Air Force 1 '07", category: 'Clothing', brand: 'Nike', price: 90.00, originalPrice: 90.00, rating: 4.7, reviewCount: 102300, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', prime: true, badge: 'Best Seller', description: "The radiance lives on in the Nike Air Force 1 '07, a basketball classic." },
    { id: 34, name: 'Patagonia Better Sweater Fleece', category: 'Clothing', brand: 'Patagonia', price: 149.00, originalPrice: 149.00, rating: 4.8, reviewCount: 23100, image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80', prime: true, badge: null, description: '100% recycled polyester, sweater-knit fleece, full-zip. Warm, cozy, and sustainable.' },
    { id: 35, name: 'Under Armour HeatGear T-Shirt', category: 'Clothing', brand: 'Under Armour', price: 24.99, originalPrice: 34.99, rating: 4.5, reviewCount: 45600, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80', prime: true, badge: null, description: 'Moisture-wicking, anti-odor, Ultra-soft 4-way stretch.' },

    { id: 41, name: 'Instant Pot Duo 7-in-1', category: 'Home & Kitchen', brand: 'Instant Pot', price: 79.99, originalPrice: 99.99, rating: 4.7, reviewCount: 312000, image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&q=80', prime: true, badge: 'Best Seller', description: 'Pressure cooker, slow cooker, rice cooker, steamer.' },
    { id: 45, name: 'Dyson V15 Detect Cordless Vacuum', category: 'Home & Kitchen', brand: 'Dyson', price: 699.99, originalPrice: 799.99, rating: 4.7, reviewCount: 15600, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', prime: true, badge: null, description: 'Laser detects microscopic dust. LCD screen shows real time pickup.' },
    { id: 50, name: 'Bamboo Cutting Board Set (3-piece)', category: 'Home & Kitchen', brand: 'OXO', price: 29.99, originalPrice: 39.99, rating: 4.6, reviewCount: 44800, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80', prime: true, badge: "Amazon's Choice", description: 'Eco-friendly bamboo, juice grooves, non-slip feet.' },

    { id: 51, name: 'Yoga Mat Premium (6mm)', category: 'Sports', brand: 'Nike', price: 28.99, originalPrice: 39.99, rating: 4.5, reviewCount: 45600, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80', prime: true, badge: null, description: 'Non-slip surface, extra thick for joint support.' },
    { id: 53, name: 'Adjustable Dumbbell Set (5–52.5 lbs)', category: 'Sports', brand: 'Under Armour', price: 299.99, originalPrice: 399.99, rating: 4.8, reviewCount: 28900, image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=400&q=80', prime: true, badge: 'Best Seller', description: 'Replaces 15 sets of weights. Adjust with a simple dial turn.' },
    { id: 55, name: 'Hydro Flask 32 oz Water Bottle', category: 'Sports', brand: 'Hydro Flask', price: 44.95, originalPrice: 44.95, rating: 4.8, reviewCount: 112000, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80', prime: true, badge: 'Best Seller', description: 'Double wall insulation, TempShield. BPA-free.' },

    { id: 59, name: 'CeraVe Moisturizing Cream', category: 'Beauty', brand: 'CeraVe', price: 16.08, originalPrice: 19.99, rating: 4.8, reviewCount: 189000, image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80', prime: true, badge: 'Best Seller', description: '3 essential ceramides restore and maintain skin barrier.' },
    { id: 62, name: 'Olay Regenerist Micro-Sculpting Cream', category: 'Beauty', brand: 'Olay', price: 28.97, originalPrice: 34.99, rating: 4.6, reviewCount: 56700, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80', prime: true, badge: null, description: 'Hyaluronic acid + amino-peptide complex for 24hr hydration.' },
    { id: 64, name: 'Fenty Beauty Gloss Bomb', category: 'Beauty', brand: 'Fenty Beauty', price: 21.00, originalPrice: 21.00, rating: 4.7, reviewCount: 23400, image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&q=80', prime: false, badge: null, description: 'Universal lip luminizer, shea butter, ultra-glossy finish.' },

    { id: 66, name: 'LEGO Technic Bugatti Chiron', category: 'Toys', brand: 'LEGO', price: 224.99, originalPrice: 349.99, rating: 4.9, reviewCount: 18900, image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80', prime: true, badge: 'Best Seller', description: '3,599 pieces, working W16 engine. Ages 16+.' },
    { id: 67, name: 'Hasbro Monopoly Classic Board Game', category: 'Toys', brand: 'Hasbro', price: 19.99, originalPrice: 25.99, rating: 4.6, reviewCount: 112000, image: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400&q=80', prime: true, badge: null, description: 'The classic real estate trading game.' },
    { id: 70, name: 'Hot Wheels Ultimate Garage', category: 'Toys', brand: 'Hot Wheels', price: 99.99, originalPrice: 139.99, rating: 4.7, reviewCount: 22100, image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&q=80', prime: false, badge: null, description: 'Massive playset, holds 140 cars, working elevator, 2 loops.' },

    { id: 73, name: 'KIND Dark Chocolate Bars (12-pack)', category: 'Grocery', brand: 'KIND', price: 11.99, originalPrice: 14.99, rating: 4.7, reviewCount: 89000, image: 'https://images.unsplash.com/photo-1526470498-9ae73c665de8?w=400&q=80', prime: true, badge: 'Best Seller', description: 'Gluten free, whole almonds drizzled with dark chocolate.' },
    { id: 75, name: 'Organic Valley Whole Milk (1 Gallon)', category: 'Grocery', brand: 'Organic Valley', price: 8.99, originalPrice: 8.99, rating: 4.5, reviewCount: 23400, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80', prime: true, badge: null, description: 'USDA Organic, pasture-raised cows.' },
    { id: 77, name: 'Starbucks Pike Place Medium Roast (2 lbs)', category: 'Grocery', brand: 'Starbucks', price: 19.99, originalPrice: 25.99, rating: 4.6, reviewCount: 45300, image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=80', prime: true, badge: null, description: 'Smooth, balanced coffee with subtle notes of cocoa and toasted nuts.' }
];
