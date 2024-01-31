const awsconfig = {
    Auth: {
      region: 'us-east-1',
      userPoolId: 'us-east-1_lsLUaoZ8N',
      userPoolWebClientId: '54ntlct3osltphnap1h5dokm1g',
      oauth: {
        domain: 'habitfy-app.auth.us-east-1.amazoncognito.com',
        scope: ['email', 'openid' , 'phone'],
        redirectSignIn: 'http://localhost:4200/home',
        redirectSignOut: 'http://localhost:4200',
        responseType: 'code'
      }
    }
  };
  
  export default awsconfig;