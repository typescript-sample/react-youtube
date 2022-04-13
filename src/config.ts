export const config = {
  authentication_url: 'http://localhost:8080',
  signup_url: 'http://localhost:8082/signup',
  password_url: 'http://localhost:8082/password',
  oauth2_url: 'http://localhost:8082/oauth2',

  user_url: 'http://localhost:8080/users',
  role_url: 'http://localhost:8080/roles',
  privilege_url: 'http://localhost:8080/privileges',
  audit_log_url: 'http://localhost:8080/audit-logs',
  public_privilege_url: 'http://localhost:8080/public-privilege',
  myprofile_url: 'http://localhost:8082/my-profile'
};

export const env = {
  sit: {
    authentication_url: 'http://10.1.0.234:3003'
  },
  deploy: {
    authentication_url: '/server'
  }
};
