/**
 * Backend API Test Script
 *
 * Tests all major endpoints of the ConnectWorkout backend API
 * Run with: node test-backend.js
 */

const BASE_URL = 'http://localhost:7009';

// ANSI color codes for better terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
};

// Helper function to make HTTP requests
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const method = options.method || 'GET';

  console.log(`\n${colors.cyan}${colors.bright}🔍 ${method} ${endpoint}${colors.reset}`);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (response.ok) {
      console.log(`${colors.green}✅ SUCCESS (${response.status})${colors.reset}`);
      console.log(JSON.stringify(data, null, 2));
      return { success: true, status: response.status, data };
    } else {
      console.log(`${colors.red}❌ ERROR (${response.status})${colors.reset}`);
      console.log(JSON.stringify(data, null, 2));
      return { success: false, status: response.status, data };
    }
  } catch (error) {
    console.log(`${colors.red}💥 REQUEST FAILED${colors.reset}`);
    console.error(error.message);
    return { success: false, error: error.message };
  }
}

// Main test function
async function runTests() {
  console.log(`${colors.bright}${colors.blue}
╔════════════════════════════════════════════════════════════╗
║     ConnectWorkout Backend API Test Suite                 ║
║     Testing: ${BASE_URL}${' '.repeat(37 - BASE_URL.length)}║
╚════════════════════════════════════════════════════════════╝
${colors.reset}`);

  let authToken = null;
  let studentToken = null;
  let instructorId = null;
  let studentId = null;

  // ============================================================================
  // 1. AUTHENTICATION TESTS
  // ============================================================================

  console.log(`\n${colors.bright}${colors.yellow}━━━ AUTHENTICATION TESTS ━━━${colors.reset}`);

  // Register Instructor
  const instructorEmail = `instructor_${Date.now()}@test.com`;
  const instructorResult = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Test Instructor',
      email: instructorEmail,
      password: 'Password123!',
      userType: 1, // Instructor
      age: 30,
      gender: 1, // Male
      description: 'Certified personal trainer'
    })
  });

  if (instructorResult.success && instructorResult.data?.accessToken) {
    authToken = instructorResult.data.accessToken;
    instructorId = instructorResult.data.user?.id;
    console.log(`${colors.green}🔑 Instructor token acquired${colors.reset}`);
    console.log(`${colors.green}👤 Instructor ID: ${instructorId}${colors.reset}`);
  }

  // Register Student
  const studentEmail = `student_${Date.now()}@test.com`;
  const studentResult = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Test Student',
      email: studentEmail,
      password: 'Password123!',
      userType: 2, // Student
      age: 25,
      gender: 2, // Female
      description: 'Looking to get fit'
    })
  });

  if (studentResult.success && studentResult.data?.accessToken) {
    studentToken = studentResult.data.accessToken;
    studentId = studentResult.data.user?.id;
    console.log(`${colors.green}🔑 Student token acquired${colors.reset}`);
    console.log(`${colors.green}👤 Student ID: ${studentId}${colors.reset}`);
  }

  // Test Login
  await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: instructorEmail,
      password: 'Password123!'
    })
  });

  // ============================================================================
  // 2. USER PROFILE TESTS
  // ============================================================================

  console.log(`\n${colors.bright}${colors.yellow}━━━ USER PROFILE TESTS ━━━${colors.reset}`);

  if (authToken) {
    // Get User Profile
    await request('/api/users/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    // Update User Profile
    await request('/api/users/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        name: 'Test Instructor Updated',
        age: 31,
        description: 'Experienced personal trainer'
      })
    });

    // Search Users
    await request('/api/users/search?name=Test', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  }

  // ============================================================================
  // 3. STUDENT PROFILE TESTS
  // ============================================================================

  console.log(`\n${colors.bright}${colors.yellow}━━━ STUDENT PROFILE TESTS ━━━${colors.reset}`);

  if (studentToken) {
    // Get Student Profile
    await request('/api/students/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${studentToken}`
      }
    });

    // Update Student Profile with all fields
    await request('/api/students/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        name: 'Test Student Updated',
        age: 26,
        gender: 2, // IMPORTANT: Send as number!
        description: 'Active lifestyle, looking to build muscle',
        cpf: '123.456.789-00',
        phone: '(11) 98765-4321'
      })
    });

    // Get Current Trainer (should be null initially)
    await request('/api/students/current-trainer', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${studentToken}`
      }
    });

    // Get Trainer Requests (should be empty initially)
    await request('/api/students/trainer-requests', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${studentToken}`
      }
    });
  }

  // ============================================================================
  // 4. INSTRUCTOR TESTS
  // ============================================================================

  console.log(`\n${colors.bright}${colors.yellow}━━━ INSTRUCTOR TESTS ━━━${colors.reset}`);

  if (authToken && studentId) {
    // Get Instructor's Students (should be empty initially)
    await request('/api/instructors/students', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    // Connect with Student
    await request('/api/instructors/connect', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        studentId: studentId
      })
    });

    // Get Instructor's Students again (should now show the connected student)
    await request('/api/instructors/students', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    // Get specific student details
    if (studentId) {
      await request(`/api/instructors/students/${studentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
    }
  }

  // ============================================================================
  // 5. STUDENT TRAINER CONNECTION TESTS
  // ============================================================================

  console.log(`\n${colors.bright}${colors.yellow}━━━ STUDENT-TRAINER CONNECTION TESTS ━━━${colors.reset}`);

  if (studentToken && instructorId) {
    // Get Trainer Requests (should now show pending request)
    await request('/api/students/trainer-requests', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${studentToken}`
      }
    });

    // Accept Trainer Request
    await request(`/api/students/accept-trainer/${instructorId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${studentToken}`
      }
    });

    // Get Current Trainer (should now show the accepted trainer)
    await request('/api/students/current-trainer', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${studentToken}`
      }
    });
  }

  // ============================================================================
  // 6. EXERCISE API TESTS (Public endpoints)
  // ============================================================================

  console.log(`\n${colors.bright}${colors.yellow}━━━ EXERCISE API TESTS ━━━${colors.reset}`);

  // Search Exercises
  await request('/api/exercises/search?name=push', {
    method: 'GET'
  });

  // Get Body Parts
  await request('/api/exercises/bodyparts', {
    method: 'GET'
  });

  // Get Equipments
  await request('/api/exercises/equipments', {
    method: 'GET'
  });

  // Get Targets
  await request('/api/exercises/targets', {
    method: 'GET'
  });

  // ============================================================================
  // 7. ERROR HANDLING TESTS
  // ============================================================================

  console.log(`\n${colors.bright}${colors.yellow}━━━ ERROR HANDLING TESTS ━━━${colors.reset}`);

  // Test invalid login
  await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'nonexistent@test.com',
      password: 'wrongpassword'
    })
  });

  // Test unauthorized access
  await request('/api/users/profile', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer invalid_token'
    }
  });

  // Test invalid registration (missing required fields)
  await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: 'incomplete@test.com'
      // Missing required fields
    })
  });

  // ============================================================================
  // SUMMARY
  // ============================================================================

  console.log(`\n${colors.bright}${colors.blue}
╔════════════════════════════════════════════════════════════╗
║     Test Suite Complete!                                  ║
╚════════════════════════════════════════════════════════════╝
${colors.reset}`);

  console.log(`\n${colors.bright}Test Credentials:${colors.reset}`);
  console.log(`${colors.cyan}Instructor:${colors.reset}`);
  console.log(`  Email: ${instructorEmail}`);
  console.log(`  Password: Password123!`);
  console.log(`  ID: ${instructorId}`);
  console.log(`  Token: ${authToken?.substring(0, 20)}...`);

  console.log(`\n${colors.cyan}Student:${colors.reset}`);
  console.log(`  Email: ${studentEmail}`);
  console.log(`  Password: Password123!`);
  console.log(`  ID: ${studentId}`);
  console.log(`  Token: ${studentToken?.substring(0, 20)}...`);

  console.log(`\n${colors.green}✨ All tests completed!${colors.reset}\n`);
}

// Run the tests
runTests().catch((error) => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
