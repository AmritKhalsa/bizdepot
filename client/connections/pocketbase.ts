import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.POCKETBASE_URL);

// Function to log in with username and password from environment variables
const authenticate = async () => {
  const username = process.env.POCKETBASE_EMAIL;
  const password = process.env.POCKETBASE_PASSWORD;
  

  if (username && password) {
    try {
      await pb.collection('_superusers').authWithPassword(username, password);
      console.log("PocketBase authentication successful!")
    } catch (error) {
      console.error('PocketBase authentication failed:', error);
    }
  } else {
    console.warn('PocketBase username and/or password not found in environment variables.');
  }
};

// Authenticate when the module is loaded
await authenticate();

export default pb;
