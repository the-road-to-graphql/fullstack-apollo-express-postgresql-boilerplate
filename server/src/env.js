// separate file to be imported in src/index.js
// due to babel-node
// otherwise, env variables are not available in other files

import dotenv from 'dotenv';

dotenv.config();
