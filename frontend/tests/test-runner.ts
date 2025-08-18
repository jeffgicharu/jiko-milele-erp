#!/usr/bin/env ts-node

/**
 * Test Runner for Jiko Milele ERP Authentication Tests
 * 
 * This script provides utilities to run specific test suites and generate reports.
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface TestSuite {
  name: string;
  file: string;
  description: string;
}

const TEST_SUITES: TestSuite[] = [
  {
    name: 'landing',
    file: 'tests/landing.spec.ts',
    description: 'Landing page tests - navigation, content, and redirect behavior'
  },
  {
    name: 'login',
    file: 'tests/auth/login.spec.ts',
    description: 'Login page tests - form validation, authentication, error handling'
  },
  {
    name: 'dashboard',
    file: 'tests/auth/dashboard.spec.ts',
    description: 'Dashboard tests - protected routes, role-based content, user info'
  },
  {
    name: 'auth-flows',
    file: 'tests/auth/auth-flows.spec.ts',
    description: 'Authentication flow tests - complete login-to-logout scenarios'
  },
  {
    name: 'navigation',
    file: 'tests/navigation.spec.ts',
    description: 'Navigation and protected route tests'
  }
];

class TestRunner {
  private baseCommand = 'npx playwright test';
  
  constructor() {
    this.ensureDirectoriesExist();
  }

  private ensureDirectoriesExist() {
    const dirs = [
      'playwright-report',
      'test-results',
      'test-results/screenshots'
    ];
    
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Run all test suites
   */
  async runAllTests(options: { headed?: boolean, debug?: boolean } = {}) {
    console.log('🚀 Running all Jiko Milele ERP authentication tests...\n');
    
    let command = this.baseCommand;
    
    if (options.headed) {
      command += ' --headed';
    }
    
    if (options.debug) {
      command += ' --debug';
    }
    
    try {
      console.log(`Executing: ${command}`);
      execSync(command, { stdio: 'inherit' });
      console.log('\n✅ All tests completed successfully!');
    } catch (error) {
      console.error('\n❌ Some tests failed. Check the report for details.');
      throw error;
    }
  }

  /**
   * Run specific test suite
   */
  async runTestSuite(suiteName: string, options: { headed?: boolean, debug?: boolean } = {}) {
    const suite = TEST_SUITES.find(s => s.name === suiteName);
    
    if (!suite) {
      throw new Error(`Test suite "${suiteName}" not found. Available suites: ${TEST_SUITES.map(s => s.name).join(', ')}`);
    }
    
    console.log(`🧪 Running ${suite.description}...\n`);
    
    let command = `${this.baseCommand} ${suite.file}`;
    
    if (options.headed) {
      command += ' --headed';
    }
    
    if (options.debug) {
      command += ' --debug';
    }
    
    try {
      console.log(`Executing: ${command}`);
      execSync(command, { stdio: 'inherit' });
      console.log(`\n✅ ${suite.name} tests completed successfully!`);
    } catch (error) {
      console.error(`\n❌ ${suite.name} tests failed. Check the report for details.`);
      throw error;
    }
  }

  /**
   * List available test suites
   */
  listTestSuites() {
    console.log('📋 Available test suites:\n');
    
    TEST_SUITES.forEach(suite => {
      console.log(`• ${suite.name}: ${suite.description}`);
      console.log(`  File: ${suite.file}\n`);
    });
  }

  /**
   * Validate test configuration
   */
  validateConfiguration() {
    console.log('🔍 Validating test configuration...\n');
    
    // Check if Playwright config exists
    if (!fs.existsSync('playwright.config.ts')) {
      throw new Error('playwright.config.ts not found');
    }
    console.log('✅ Playwright configuration found');
    
    // Check if test files exist
    TEST_SUITES.forEach(suite => {
      if (!fs.existsSync(suite.file)) {
        throw new Error(`Test file not found: ${suite.file}`);
      }
      console.log(`✅ ${suite.file} found`);
    });
    
    // Check if test utilities exist
    const utilFiles = [
      'tests/utils/auth-helpers.ts',
      'tests/utils/test-helpers.ts',
      'tests/fixtures/test-users.ts'
    ];
    
    utilFiles.forEach(file => {
      if (!fs.existsSync(file)) {
        throw new Error(`Utility file not found: ${file}`);
      }
      console.log(`✅ ${file} found`);
    });
    
    console.log('\n🎉 All test configuration validated successfully!');
  }

  /**
   * Generate test report summary
   */
  generateReportSummary() {
    console.log('📊 Generating test report summary...\n');
    
    // Check if HTML report exists
    if (fs.existsSync('playwright-report/index.html')) {
      console.log('✅ HTML report available at: playwright-report/index.html');
    }
    
    // Check if JUnit report exists
    if (fs.existsSync('playwright-report/results.xml')) {
      console.log('✅ JUnit report available at: playwright-report/results.xml');
    }
    
    // List screenshots if any
    const screenshotsDir = 'test-results/screenshots';
    if (fs.existsSync(screenshotsDir)) {
      const screenshots = fs.readdirSync(screenshotsDir);
      if (screenshots.length > 0) {
        console.log(`✅ ${screenshots.length} screenshots captured`);
      }
    }
    
    console.log('\n📖 Run "npm run test:report" to view the detailed HTML report');
  }

  /**
   * Clean test artifacts
   */
  cleanArtifacts() {
    console.log('🧹 Cleaning test artifacts...\n');
    
    const cleanDirs = [
      'playwright-report',
      'test-results'
    ];
    
    cleanDirs.forEach(dir => {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        console.log(`✅ Cleaned ${dir}`);
      }
    });
    
    console.log('\n🧽 Test artifacts cleaned successfully!');
  }
}

// CLI interface
if (require.main === module) {
  const runner = new TestRunner();
  const args = process.argv.slice(2);
  const command = args[0];
  
  try {
    switch (command) {
      case 'all':
        runner.runAllTests({ 
          headed: args.includes('--headed'), 
          debug: args.includes('--debug') 
        });
        break;
        
      case 'suite':
        const suiteName = args[1];
        if (!suiteName) {
          throw new Error('Please specify a test suite name');
        }
        runner.runTestSuite(suiteName, { 
          headed: args.includes('--headed'), 
          debug: args.includes('--debug') 
        });
        break;
        
      case 'list':
        runner.listTestSuites();
        break;
        
      case 'validate':
        runner.validateConfiguration();
        break;
        
      case 'report':
        runner.generateReportSummary();
        break;
        
      case 'clean':
        runner.cleanArtifacts();
        break;
        
      default:
        console.log('Jiko Milele ERP Test Runner\n');
        console.log('Usage:');
        console.log('  npm run test                    # Run all tests');
        console.log('  ts-node test-runner.ts all      # Run all tests');
        console.log('  ts-node test-runner.ts suite <name>  # Run specific test suite');
        console.log('  ts-node test-runner.ts list     # List available test suites');
        console.log('  ts-node test-runner.ts validate # Validate test configuration');
        console.log('  ts-node test-runner.ts report   # Generate report summary');
        console.log('  ts-node test-runner.ts clean    # Clean test artifacts');
        console.log('\nOptions:');
        console.log('  --headed                        # Run tests in headed mode');
        console.log('  --debug                         # Run tests in debug mode');
    }
  } catch (error) {
    console.error(`\n❌ Error: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
}