const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(express.json())
try{
    const url = 'mongodb+srv://vatsalvasani:vatsalvasani@cluster0.dc8bxub.mongodb.net/carsellrent';
    mongoose.connect(url);
    const con = mongoose.connection;
    
    con.on('open',function(){
    
    console.log("connected");
    
    })
}
catch(e){console.log(e);}

app.use(cors());
app.use('/uploads',express.static('uploads'))

const authrouter = require('./routes/auth')
app.use('/auth', authrouter)

const jwt = require('jsonwebtoken');
const secretKey = '12abcd342hkjsd'; // You should store the secret key securely and not expose it in your code

// Middleware function to check for a valid JWT token
function authenticateToken(req, res, next) {
  // Retrieve the JWT token from the request headers or cookies
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
  if (!token) {
    // If the token is not present, return an unauthorized error response
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Set the decoded token data as a property on the request object
    next(); // Call the next middleware function or route handler
  } catch (err) {
    // If the token is invalid or expired, return an unauthorized error response
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}



const customerrouter = require('./routes/customer')
app.use('/customer',authenticateToken, customerrouter)

const sellcarrouter = require('./routes/sellcar')
app.use('/sellcar',authenticateToken, sellcarrouter)

const payrouter = require('./routes/payment')
app.use('/payment',authenticateToken, payrouter)

const rentcarrouter = require('./routes/rentcar')
app.use('/rentcar',authenticateToken, rentcarrouter)

const reviewrouter = require('./routes/review')
app.use('/review',authenticateToken, reviewrouter)



app.listen(8080,()=>
{
    console.log("Its Connected To The Port 8080")
})