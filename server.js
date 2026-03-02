// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');

// // Models
// const User = require('./models/User');
// const Investment = require('./models/Investment'); // <-- NEW: Investment Blueprint
// const bcrypt = require('bcryptjs');

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// // --- MASTER ADMIN SETUP ---
// const createPermanentAdmin = async () => {
//   try {
//     const adminEmail = 'admin@gmail.com';
//     const existingAdmin = await User.findOne({ email: adminEmail });
    
//     if (!existingAdmin) {
//       console.log('⚙️ No admin found. Creating permanent admin account...');
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash('Admin@123', salt); 
      
//       const adminUser = new User({
//         name: 'Master Admin', 
//         email: adminEmail,
//         password: hashedPassword,
//         role: 'admin'
//       });
      
//       await adminUser.save();
//       console.log('✅ Permanent admin created! Email: admin@gmail.com | Password: Admin@123');
//     } else {
//       let needsSave = false;
//       if (existingAdmin.role !== 'admin') { existingAdmin.role = 'admin'; needsSave = true; }
//       if (!existingAdmin.name) { existingAdmin.name = 'Master Admin'; needsSave = true; }
//       if (needsSave) {
//          await existingAdmin.save();
//          console.log('✅ Upgraded admin@gmail.com and fixed missing data!');
//       } else {
//          console.log('🛡️ Permanent admin account is active and ready.');
//       }
//     }
//   } catch (error) {
//     console.error('❌ Error securing permanent admin:', error);
//   }
// };

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log('✅ Successfully connected to Local MongoDB!');
//     createPermanentAdmin(); 
//   })
//   .catch((err) => console.error('❌ MongoDB connection error:', err));


// // ==========================================
// // --- USER AUTHENTICATION ROUTES ---
// // ==========================================
// app.post('/api/register', async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: "An account with this email already exists." });

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = new User({ name, email, password: hashedPassword });
//     await newUser.save();

//     res.status(201).json({ 
//       message: "Account created successfully!", 
//       user: { name: newUser.name, email: newUser.email, balance: newUser.balance, investment: newUser.investment, riskProfile: newUser.riskProfile, role: newUser.role } 
//     });
//   } catch (error) { res.status(500).json({ message: "Server error during registration." }); }
// });

// app.post('/api/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Invalid email or password." }); 

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid email or password." });

//     res.status(200).json({ 
//       message: "Login successful!",
//       user: { name: user.name, email: user.email, balance: user.balance, investment: user.investment, riskProfile: user.riskProfile, role: user.role }
//     });
//   } catch (error) { res.status(500).json({ message: "Server error during login." }); }
// });


// // ==========================================
// // --- FINANCIAL TRANSACTIONS ROUTES ---
// // ==========================================
// app.put('/api/deposit', async (req, res) => {
//   try {
//     const { email, amount } = req.body;
//     if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid deposit amount." });

//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found." });

//     user.balance += Number(amount);
//     await user.save();
//     res.status(200).json({ message: "Deposit successful!", balance: user.balance });
//   } catch (error) { res.status(500).json({ message: "Server error during deposit." }); }
// });

// app.put('/api/withdraw', async (req, res) => {
//   try {
//     const { email, amount } = req.body;
//     if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid withdrawal amount." });

//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found." });

//     if (user.balance < Number(amount)) return res.status(400).json({ message: "Insufficient funds!" });

//     user.balance -= Number(amount);
//     await user.save();
//     res.status(200).json({ message: "Withdrawal successful!", balance: user.balance });
//   } catch (error) { res.status(500).json({ message: "Server error during withdrawal." }); }
// });

// app.put('/api/invest', async (req, res) => {
//   try {
//     const { email, amount } = req.body;
//     if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid investment amount." });

//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found." });

//     if (user.balance < Number(amount)) return res.status(400).json({ message: "Insufficient cash balance." });

//     user.balance -= Number(amount);
//     user.investment += Number(amount);
//     await user.save();
//     res.status(200).json({ message: "Investment successful!", balance: user.balance, investment: user.investment });
//   } catch (error) { res.status(500).json({ message: "Server error during investment." }); }
// });

// app.put('/api/sell', async (req, res) => {
//   try {
//     const { email, amount } = req.body;
//     if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid sell amount." });

//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found." });

//     if (user.investment < Number(amount)) return res.status(400).json({ message: "Cannot sell more than invested." });

//     user.investment -= Number(amount);
//     user.balance += Number(amount);
//     await user.save();
//     res.status(200).json({ message: "Sale successful!", balance: user.balance, investment: user.investment });
//   } catch (error) { res.status(500).json({ message: "Server error during sale." }); }
// });


// // ==========================================
// // --- ADMIN USER MANAGEMENT ROUTES ---
// // ==========================================
// app.get('/api/admin/users', async (req, res) => {
//   try {
//     const allUsers = await User.find().select('-password');
//     res.status(200).json(allUsers);
//   } catch (error) { res.status(500).json({ message: "Failed to fetch users." }); }
// });

// app.put('/api/admin/users/:id', async (req, res) => {
//   try {
//     const { name, email, balance, investment, role, riskProfile } = req.body;
//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.id, { name, email, balance, investment, role, riskProfile }, { new: true } 
//     ).select('-password');
//     if (!updatedUser) return res.status(404).json({ message: "User not found" });
//     res.status(200).json(updatedUser);
//   } catch (error) { res.status(500).json({ message: "Failed to update user." }); }
// });

// app.delete('/api/admin/users/:id', async (req, res) => {
//   try {
//     const userToDelete = await User.findById(req.params.id);
//     if (userToDelete.email === 'admin@gmail.com') return res.status(403).json({ message: "Cannot delete master admin!" });
//     await User.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "User deleted successfully." });
//   } catch (error) { res.status(500).json({ message: "Failed to delete user." }); }
// });


// // ==========================================
// // --- NEW MODULE: INVESTMENT PLANS ---
// // ==========================================
// app.get('/api/investments', async (req, res) => {
//   try {
//     const investments = await Investment.find();
//     res.status(200).json(investments);
//   } catch (error) { res.status(500).json({ message: "Failed to fetch investments." }); }
// });

// app.post('/api/admin/investments', async (req, res) => {
//   try {
//     const newInvestment = new Investment(req.body);
//     await newInvestment.save();
//     res.status(201).json(newInvestment);
//   } catch (error) { res.status(500).json({ message: "Failed to create investment plan." }); }
// });

// app.delete('/api/admin/investments/:id', async (req, res) => {
//   try {
//     await Investment.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "Investment plan deleted." });
//   } catch (error) { res.status(500).json({ message: "Failed to delete investment plan." }); }
// });


// // Test route
// app.get('/api/test', (req, res) => {
//     res.json({ message: "Success! The Wahed clone backend is officially running.", status: "Active" });
// });

// app.listen(PORT, () => {
//     console.log(`🚀 Server is running on http://localhost:${PORT}`);
// });

/////////////////////////////////////////////////

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Models
const User = require('./models/User');
const Investment = require('./models/Investment'); // <-- NEW: Investment Blueprint
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true 
}));

app.use(express.json());


const createPermanentAdmin = async () => {
  try {
    const adminEmail = 'admin@gmail.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      console.log('⚙️ No admin found. Creating permanent admin account...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Admin@123', salt); 
      
      const adminUser = new User({
        name: 'Master Admin', 
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('✅ Permanent admin created! Email: admin@gmail.com | Password: Admin@123');
    } else {
      let needsSave = false;
      if (existingAdmin.role !== 'admin') { existingAdmin.role = 'admin'; needsSave = true; }
      if (!existingAdmin.name) { existingAdmin.name = 'Master Admin'; needsSave = true; }
      if (needsSave) {
         await existingAdmin.save();
         console.log('✅ Upgraded admin@gmail.com and fixed missing data!');
      } else {
         console.log('🛡️ Permanent admin account is active and ready.');
      }
    }
  } catch (error) {
    console.error('❌ Error securing permanent admin:', error);
  }
};

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Successfully connected to Local MongoDB!');
    createPermanentAdmin(); 
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));


// ==========================================
// --- USER AUTHENTICATION ROUTES ---
// ==========================================
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "An account with this email already exists." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ 
      message: "Account created successfully!", 
      user: { name: newUser.name, email: newUser.email, balance: newUser.balance, investment: newUser.investment, riskProfile: newUser.riskProfile, role: newUser.role } 
    });
  } catch (error) { res.status(500).json({ message: "Server error during registration." }); }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password." }); 

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password." });

    res.status(200).json({ 
      message: "Login successful!",
      user: { name: user.name, email: user.email, balance: user.balance, investment: user.investment, riskProfile: user.riskProfile, role: user.role }
    });
  } catch (error) { res.status(500).json({ message: "Server error during login." }); }
});


// ==========================================
// --- FINANCIAL TRANSACTIONS ROUTES ---
// ==========================================
app.put('/api/deposit', async (req, res) => {
  try {
    const { email, amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid deposit amount." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    user.balance += Number(amount);
    await user.save();
    res.status(200).json({ message: "Deposit successful!", balance: user.balance });
  } catch (error) { res.status(500).json({ message: "Server error during deposit." }); }
});

app.put('/api/withdraw', async (req, res) => {
  try {
    const { email, amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid withdrawal amount." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.balance < Number(amount)) return res.status(400).json({ message: "Insufficient funds!" });

    user.balance -= Number(amount);
    await user.save();
    res.status(200).json({ message: "Withdrawal successful!", balance: user.balance });
  } catch (error) { res.status(500).json({ message: "Server error during withdrawal." }); }
});

app.put('/api/invest', async (req, res) => {
  try {
    const { email, amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid investment amount." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.balance < Number(amount)) return res.status(400).json({ message: "Insufficient cash balance." });

    user.balance -= Number(amount);
    user.investment += Number(amount);
    await user.save();
    res.status(200).json({ message: "Investment successful!", balance: user.balance, investment: user.investment });
  } catch (error) { res.status(500).json({ message: "Server error during investment." }); }
});

app.put('/api/sell', async (req, res) => {
  try {
    const { email, amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid sell amount." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.investment < Number(amount)) return res.status(400).json({ message: "Cannot sell more than invested." });

    user.investment -= Number(amount);
    user.balance += Number(amount);
    await user.save();
    res.status(200).json({ message: "Sale successful!", balance: user.balance, investment: user.investment });
  } catch (error) { res.status(500).json({ message: "Server error during sale." }); }
});


// ==========================================
// --- ADMIN USER MANAGEMENT ROUTES ---
// ==========================================
app.get('/api/admin/users', async (req, res) => {
  try {
    const allUsers = await User.find().select('-password');
    res.status(200).json(allUsers);
  } catch (error) { res.status(500).json({ message: "Failed to fetch users." }); }
});

app.put('/api/admin/users/:id', async (req, res) => {
  try {
    const { name, email, balance, investment, role, riskProfile } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, { name, email, balance, investment, role, riskProfile }, { new: true } 
    ).select('-password');
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json(updatedUser);
  } catch (error) { res.status(500).json({ message: "Failed to update user." }); }
});

app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);
    if (userToDelete.email === 'admin@gmail.com') return res.status(403).json({ message: "Cannot delete master admin!" });
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) { res.status(500).json({ message: "Failed to delete user." }); }
});


// ==========================================
// --- NEW MODULE: INVESTMENT PLANS ---
// ==========================================
app.get('/api/investments', async (req, res) => {
  try {
    const investments = await Investment.find();
    res.status(200).json(investments);
  } catch (error) { res.status(500).json({ message: "Failed to fetch investments." }); }
});

app.post('/api/admin/investments', async (req, res) => {
  try {
    const newInvestment = new Investment(req.body);
    await newInvestment.save();
    res.status(201).json(newInvestment);
  } catch (error) { res.status(500).json({ message: "Failed to create investment plan." }); }
});

app.delete('/api/admin/investments/:id', async (req, res) => {
  try {
    await Investment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Investment plan deleted." });
  } catch (error) { res.status(500).json({ message: "Failed to delete investment plan." }); }
});


// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: "Success! The Wahed clone backend is officially running.", status: "Active" });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});