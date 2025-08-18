export interface TestUser {
  username: string;
  password: string;
  role: string;
  expectedRoleDisplay: string;
  description: string;
}

export const TEST_USERS: Record<string, TestUser> = {
  manager: {
    username: 'admin',
    password: 'SecurePass123',
    role: 'general_manager',
    expectedRoleDisplay: 'GENERAL MANAGER',
    description: 'General Manager with full system access'
  },
  chef: {
    username: 'chef',
    password: 'SecurePass123',
    role: 'head_chef',
    expectedRoleDisplay: 'HEAD CHEF',
    description: 'Head Chef with kitchen management access'
  },
  server: {
    username: 'server1',
    password: 'SecurePass123',
    role: 'server',
    expectedRoleDisplay: 'SERVER',
    description: 'Server with front-of-house access'
  },
  host: {
    username: 'host',
    password: 'SecurePass123',
    role: 'host',
    expectedRoleDisplay: 'HOST',
    description: 'Host with customer service access'
  },
  bartender: {
    username: 'bartender',
    password: 'SecurePass123',
    role: 'bartender',
    expectedRoleDisplay: 'BARTENDER',
    description: 'Bartender with bar operations access'
  }
};

export const INVALID_USERS = {
  invalidUsername: {
    username: 'nonexistent',
    password: 'SecurePass123',
    expectedError: 'Invalid username or password'
  },
  invalidPassword: {
    username: 'admin',
    password: 'wrongpassword',
    expectedError: 'Invalid username or password'
  },
  emptyCredentials: {
    username: '',
    password: '',
    expectedErrors: {
      username: 'Username is required',
      password: 'Password is required'
    }
  },
  shortPassword: {
    username: 'admin',
    password: '123',
    expectedError: 'Password must be at least 6 characters'
  }
};