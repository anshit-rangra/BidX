process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.RABBIT_MQ = process.env.RABBIT_MQ || 'amqp://localhost';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test-db';
process.env.IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY || 'test-private';
process.env.IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY || 'test-public';
process.env.IMAGEKIT_URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT || 'https://test.example.com';
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'test-google-client';
process.env.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'test-google-secret';
