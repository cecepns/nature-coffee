-- Nature Coffee Database
-- Created: 2024

DROP DATABASE IF EXISTS nature_coffee;
CREATE DATABASE nature_coffee;
USE nature_coffee;

-- Admin table
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Settings table
CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    about_us TEXT,
    address TEXT,
    phone VARCHAR(20),
    instagram VARCHAR(100),
    maps_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Menu table
CREATE TABLE menu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    category ENUM('coffee', 'non-coffee', 'food', 'dessert') DEFAULT 'coffee',
    image VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Coffee beans table
CREATE TABLE coffee_beans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    origin VARCHAR(100),
    roast_level ENUM('Light', 'Medium', 'Medium Dark', 'Dark') DEFAULT 'Medium',
    weight VARCHAR(50) DEFAULT '1 kg',
    image VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Gallery table
CREATE TABLE gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    image VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Reservations table
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    guests INT NOT NULL DEFAULT 1,
    notes TEXT,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin
INSERT INTO admins (username, password, email) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@naturecoffee.com');
-- Password: admin123

-- Insert default settings
INSERT INTO settings (about_us, address, phone, instagram, maps_url) VALUES 
(
    'Nature Coffee adalah tempat yang sempurna untuk menikmati kopi berkualitas premium dalam suasana yang alami dan nyaman. Kami berkomitmen untuk menyajikan pengalaman kopi terbaik dengan biji kopi pilihan dari petani lokal terbaik.',
    'Jl. Pemuda 2 No.84, Temindung Permai, Kec. Sungai Pinang, Kota Samarinda, Kalimantan Timur 75119, Samarinda',
    '+62 XXX-XXXX-XXXX',
    'https://www.instagram.com/naturebyorca',
    'https://maps.app.goo.gl/4Yy2bHsHYt3aS9C26?g_st=aw'
);

-- Insert sample menu data
INSERT INTO menu (name, description, price, category) VALUES 
('Espresso', 'Single shot espresso dengan crema yang sempurna', 25000, 'coffee'),
('Cappuccino', 'Espresso dengan steamed milk dan milk foam', 35000, 'coffee'),
('Latte', 'Espresso dengan steamed milk yang lembut', 40000, 'coffee'),
('Americano', 'Espresso dengan air panas, rasa kopi murni', 30000, 'coffee'),
('Mocha', 'Perpaduan espresso, chocolate, dan steamed milk', 45000, 'coffee'),
('Macchiato', 'Espresso dengan sedikit steamed milk', 38000, 'coffee'),
('Croissant', 'Croissant butter yang renyah dan lembut', 25000, 'food'),
('Sandwich Club', 'Sandwich dengan chicken, lettuce, tomato, dan mayo', 45000, 'food'),
('Pasta Carbonara', 'Pasta dengan creamy carbonara sauce', 55000, 'food'),
('Chocolate Cake', 'Kue coklat lembut dengan frosting krim', 35000, 'dessert'),
('Ice Matcha Latte', 'Matcha latte dingin dengan es batu', 42000, 'non-coffee'),
('Fresh Orange Juice', 'Jus jeruk segar tanpa gula tambahan', 25000, 'non-coffee');

-- Insert sample coffee beans data
INSERT INTO coffee_beans (name, description, price, origin, roast_level, weight) VALUES 
('Arabica Premium', 'Biji kopi arabica premium dengan rasa yang halus dan aroma yang khas', 120000, 'Aceh Gayo', 'Medium', '1 kg'),
('Robusta Gold', 'Biji kopi robusta dengan kualitas terbaik dan kafein yang tinggi', 95000, 'Lampung', 'Dark', '1 kg'),
('Kintamani Bali', 'Kopi khas Bali dengan citarasa unik dan aroma floral', 110000, 'Kintamani, Bali', 'Light', '1 kg'),
('Toraja Sulawesi', 'Kopi legendaris dari tanah Toraja dengan rasa yang kompleks', 130000, 'Toraja, Sulawesi', 'Medium Dark', '1 kg'),
('Java Preanger', 'Kopi dari dataran tinggi Jawa Barat dengan cita rasa seimbang', 105000, 'Preanger, Jawa Barat', 'Medium', '1 kg'),
('Sumatra Mandheling', 'Kopi sumatra dengan body yang penuh dan after taste panjang', 115000, 'Mandailing, Sumatra', 'Medium Dark', '1 kg');

-- Insert sample gallery data
INSERT INTO gallery (title, description) VALUES 
('Interior Cozy', 'Suasana interior yang nyaman dan hangat'),
('Latte Art', 'Karya seni dalam secangkir kopi'),
('Coffee Beans', 'Biji kopi premium pilihan terbaik'),
('Outdoor Seating', 'Tempat duduk outdoor yang asri'),
('Barista Action', 'Barista profesional sedang beraksi'),
('Morning Light', 'Suasana pagi yang hangat di cafe'),
('Coffee Culture', 'Budaya kopi Indonesia yang kaya'),
('Friends Gathering', 'Berkumpul bersama teman di Nature Coffee');

-- Indexes for better performance
CREATE INDEX idx_menu_category ON menu(category);
CREATE INDEX idx_menu_available ON menu(is_available);
CREATE INDEX idx_coffee_available ON coffee_beans(is_available);
CREATE INDEX idx_gallery_active ON gallery(is_active);
CREATE INDEX idx_reservations_date ON reservations(date);
CREATE INDEX idx_reservations_status ON reservations(status);