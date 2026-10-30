import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/milan_portfolio';

  // Check if placeholder is still in the connection string
  if (uri.includes('<db_password>') || uri.includes('<password>') || uri.includes('<')) {
    console.error('\n⚠️ [MongoDB Configuration Alert]');
    console.error('It looks like your MONGODB_URI still contains "<db_password>" or "<password>".');
    console.error('Please open Backend/.env and replace "<db_password>" (including the angle brackets < >) with your actual database user password.\n');
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`\n[Database Warning] Could not connect to MongoDB: ${error.message}`);

    if (error.message.includes('bad auth') || error.message.includes('authentication failed')) {
      console.error('👉 Cause: Authentication Failed.');
      console.error('   Please double-check the database username and password in Backend/.env.');
      console.error('   Note: If your password contains special characters (like @, #, $, %), you must URL-encode them.');
    } else if (error.message.includes('whitelist') || error.message.includes('timed out') || error.message.includes('queryTxt ETIMEOUT')) {
      console.error('👉 Cause: Network Connection Timeout.');
      console.error('   Please check MongoDB Atlas -> Security -> Network Access.');
      console.error('   Ensure "Allow Access from Anywhere" (0.0.0.0/0) or your current IP is added.');
    } else {
      console.log('[Database Guide]');
      console.log('  1. Check your MONGODB_URI in Backend/.env.');
      console.log('  2. In MongoDB Atlas, verify your IP is whitelisted under Network Access.');
    }
    return null;
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[Database] MongoDB connection disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('[Database] MongoDB reconnected successfully');
});
