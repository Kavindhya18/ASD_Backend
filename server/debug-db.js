require('dotenv').config();
const mongoose = require('mongoose');

console.log('Attempting to connect to MongoDB...');
console.log('URI:', process.env.MONGODB_URI.replace(/:([^@]+)@/, ':****@'));

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('✅ Connected successfully');
        const User = require('./models/User');
        const Child = require('./models/Child');

        const users = await User.find();
        console.log(`\n--- USERS (${users.length}) ---`);
        users.forEach(u => console.log(`- ${u.firstName} ${u.lastName} (${u.email}) [${u.role}]`));

        const children = await Child.find();
        console.log(`\n--- CHILDREN (${children.length}) ---`);
        children.forEach(c => console.log(`- ${c.name} (Age: ${c.age}) - Parent: ${c.user}`));

        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Connection failed');
        console.error('Error Name:', err.name);
        console.error('Error Message:', err.message);
        if (err.reason) console.error('Error Reason:', JSON.stringify(err.reason, null, 2));
        process.exit(1);
    });
