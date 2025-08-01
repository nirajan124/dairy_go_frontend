const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Credential = require('./models/Credential');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/dairy_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const setupAdmin = async () => {
    try {
        // Check if admin already exists
        const existingAdmin = await Credential.findOne({ username: 'admin' });
        
        if (existingAdmin) {
            console.log('✅ Admin user already exists');
            return;
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = new Credential({
            username: 'admin',
            password: hashedPassword,
            role: 'admin',
            email: 'admin@dairygo.com',
            fullName: 'Administrator',
            phone: '',
            address: '',
            bio: 'System Administrator'
        });

        await admin.save();
        console.log('✅ Admin user created successfully');
        console.log('Username: admin');
        console.log('Password: admin123');
        
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
    } finally {
        mongoose.connection.close();
    }
};

setupAdmin(); 