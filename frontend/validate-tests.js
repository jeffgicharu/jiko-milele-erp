#!/usr/bin/env node

/**
 * Simple test validation script for Jiko Milele ERP Authentication Tests
 */

const fs = require('fs');
const path = require('path');

const TEST_FILES = [
  'tests/landing.spec.ts',
  'tests/auth/login.spec.ts',
  'tests/auth/dashboard.spec.ts',
  'tests/auth/auth-flows.spec.ts',
  'tests/navigation.spec.ts'
];

const UTIL_FILES = [
  'tests/utils/auth-helpers.ts',
  'tests/utils/test-helpers.ts',
  'tests/fixtures/test-users.ts',
  'tests/global-setup.ts',
  'tests/global-teardown.ts'
];

const CONFIG_FILES = [
  'playwright.config.ts',
  'package.json'
];

console.log('🔍 Validating Jiko Milele ERP test configuration...\n');

let allValid = true;

// Check configuration files
console.log('📋 Checking configuration files:');
CONFIG_FILES.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - NOT FOUND`);
    allValid = false;
  }
});

// Check test files
console.log('\n🧪 Checking test files:');
TEST_FILES.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - NOT FOUND`);
    allValid = false;
  }
});

// Check utility files
console.log('\n🛠️  Checking utility files:');
UTIL_FILES.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - NOT FOUND`);
    allValid = false;
  }
});

// Check directories
console.log('\n📁 Checking directories:');
const directories = ['tests', 'tests/auth', 'tests/utils', 'tests/fixtures'];
directories.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}/`);
  } else {
    console.log(`❌ ${dir}/ - NOT FOUND`);
    allValid = false;
  }
});

// Check package.json for test scripts
console.log('\n📦 Checking package.json test scripts:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const testScripts = ['test', 'test:headed', 'test:debug', 'test:ui', 'test:report'];
  
  testScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`✅ ${script}: ${packageJson.scripts[script]}`);
    } else {
      console.log(`❌ ${script} - NOT FOUND`);
      allValid = false;
    }
  });
  
  // Check for Playwright dependency
  if (packageJson.devDependencies && packageJson.devDependencies['@playwright/test']) {
    console.log(`✅ @playwright/test: ${packageJson.devDependencies['@playwright/test']}`);
  } else {
    console.log(`❌ @playwright/test dependency - NOT FOUND`);
    allValid = false;
  }
} catch (error) {
  console.log(`❌ Error reading package.json: ${error.message}`);
  allValid = false;
}

// Summary
console.log('\n' + '='.repeat(50));
if (allValid) {
  console.log('🎉 All test configuration files are present and valid!');
  console.log('\n📖 Test Suite Summary:');
  console.log('• Landing Page Tests: Basic navigation and redirect functionality');
  console.log('• Login Tests: Form validation, authentication, error handling');
  console.log('• Dashboard Tests: Protected routes, role-based content');
  console.log('• Auth Flow Tests: Complete login-to-logout scenarios');
  console.log('• Navigation Tests: Route protection and navigation behavior');
  
  console.log('\n🚀 Ready to run tests! Use these commands:');
  console.log('• npm run test           - Run all tests');
  console.log('• npm run test:headed    - Run tests with browser visible');
  console.log('• npm run test:debug     - Run tests in debug mode');
  console.log('• npm run test:ui        - Run tests with Playwright UI');
  console.log('• npm run test:report    - View test report');
  
  console.log('\n⚠️  Note: You need to install Playwright browsers first:');
  console.log('• npx playwright install');
} else {
  console.log('❌ Some test configuration files are missing!');
  console.log('Please ensure all files are created properly.');
}

console.log('\n' + '='.repeat(50));