/**
 * Test script for new backend endpoints
 * Run with: node test-new-endpoints.js
 */

const BASE_URL = 'http://localhost:7009';

// You'll need to replace this with a valid access token
const ACCESS_TOKEN = 'your-access-token-here';

async function testExerciseSearch() {
  console.log('\n=== Testing Exercise Search with Pagination ===');
  try {
    const response = await fetch(
      `${BASE_URL}/api/exercises/search?name=bench&limit=5&offset=0`,
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Results:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function testExerciseFilter() {
  console.log('\n=== Testing Exercise Filter ===');
  try {
    const response = await fetch(
      `${BASE_URL}/api/exercises/filter?bodyPart=chest&equipment=barbell&limit=5`,
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Results:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function testBodyParts() {
  console.log('\n=== Testing Get Body Parts ===');
  try {
    const response = await fetch(
      `${BASE_URL}/api/exercises/bodyparts`,
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Body Parts:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function testEquipments() {
  console.log('\n=== Testing Get Equipments ===');
  try {
    const response = await fetch(
      `${BASE_URL}/api/exercises/equipments`,
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Equipments:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function testBulkWorkoutCreation() {
  console.log('\n=== Testing Bulk Workout Creation ===');
  
  const bulkWorkout = {
    name: "Test Full Body Workout",
    studentId: 1, // Replace with valid student ID
    workoutDays: [
      {
        dayOfWeek: 1, // Monday
        exercises: [
          {
            exerciseDbId: "0001",
            name: "Barbell Bench Press",
            bodyPart: "chest",
            equipment: "barbell",
            gifUrl: "https://v2.exercisedb.io/image/0001",
            sets: "3",
            repetitions: "12",
            weight: 60.0,
            restSeconds: 90,
            notes: "Keep elbows at 45 degrees"
          }
        ]
      },
      {
        dayOfWeek: 3, // Wednesday
        exercises: [
          {
            exerciseDbId: "0002",
            name: "Barbell Squat",
            bodyPart: "legs",
            equipment: "barbell",
            gifUrl: "https://v2.exercisedb.io/image/0002",
            sets: "4",
            repetitions: "10",
            weight: 80.0,
            restSeconds: 120,
            notes: "Depth to parallel"
          }
        ]
      }
    ]
  };

  try {
    const response = await fetch(
      `${BASE_URL}/api/workouts/bulk`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bulkWorkout),
      }
    );
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function runTests() {
  console.log('🧪 Testing New Backend Endpoints');
  console.log('================================');
  console.log('⚠️  Make sure to set ACCESS_TOKEN in the script!');
  
  if (ACCESS_TOKEN === 'your-access-token-here') {
    console.log('\n❌ Please set a valid ACCESS_TOKEN first!');
    console.log('You can get one by logging in via the frontend or using /api/auth/login');
    return;
  }

  await testBodyParts();
  await testEquipments();
  await testExerciseSearch();
  await testExerciseFilter();
  // await testBulkWorkoutCreation(); // Uncomment when you have valid student ID
  
  console.log('\n✅ Tests completed!');
}

runTests();
