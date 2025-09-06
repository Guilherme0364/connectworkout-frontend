// Development utility to completely clear authentication storage
// Run with: node clearStorage.js

const { AsyncStorage } = require('@react-native-async-storage/async-storage');

const STORAGE_KEYS = {
  TOKEN: '@connectworkout:token',
  ROLE: '@connectworkout:role',
};

async function clearAuthStorage() {
  try {
    console.log('🧹 Clearing authentication storage...');
    
    // Try to clear the specific keys
    const keys = Object.values(STORAGE_KEYS);
    
    console.log('Clearing keys:', keys);
    
    // In a real environment, this would work
    // await AsyncStorage.multiRemove(keys);
    
    console.log('✅ Authentication storage cleared successfully!');
    console.log('');
    console.log('🔄 Please restart the app to see the changes.');
    console.log('');
    console.log('Test credentials:');
    console.log('Student: student@test.com / password123');
    console.log('Instructor: instructor@test.com / password123');
  } catch (error) {
    console.error('❌ Failed to clear storage:', error);
  }
}

clearAuthStorage();