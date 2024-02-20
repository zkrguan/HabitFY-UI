const awsconfig = {
    Auth: {
      region: 'us-east-1',
      userPoolId: 'us-east-1_4HifTZrM4',
      userPoolWebClientId: '309nvlfov3ioandke2pippaj17',
      oauth: {
        domain: 'habitfy-app.auth.us-east-1.amazoncognito.com',
        scope: ['aws.cognito.signin.user.admin', 'email', 'openid' , 'phone', 'profile'],
        redirectSignIn: 'http://localhost:4200/home',
        redirectSignOut: 'http://localhost:4200',
        responseType: 'code'
      }
    }
  };
  
  export default awsconfig;