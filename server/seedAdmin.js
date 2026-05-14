const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/asd_db');
        console.log('MongoDB Connected...');

        const adminEmail = 'admin@gmail.com';
        const adminPassword = 'admin123';

        let admin = await User.findOne({ role: 'admin' });
        
        if (admin) {
            console.log('Admin already exists. Updating credentials...');
            admin.email = adminEmail;
            admin.password = adminPassword;
            await admin.save();
        } else {
            admin = new User({
                email: adminEmail,
                firstName: 'Admin',
                lastName: 'System',
                password: adminPassword,
                role: 'admin'
            });
            await admin.save();
            console.log('Admin user created successfully.');
        }
        
        // Migration: Update existing users without a role to 'user'
        const migrationResult = await User.updateMany(
            { role: { $exists: false } },
            { $set: { role: 'user' } }
        );
        if (migrationResult.modifiedCount > 0) {
            console.log(`✅ Migrated ${migrationResult.modifiedCount} existing users to 'user' role.`);
        }

        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        
        process.exit();
    } catch (err) {
        console.error('Error seeding admin:', err.message);
        process.exit(1);
    }
};

seedAdmin();
