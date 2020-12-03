import { createConnection } from 'typeorm';

createConnection().then(() => console.log('🔥 successfully connected with database'));