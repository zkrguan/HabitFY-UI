const awsconfig = {
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_4HifTZrM4',
    userPoolWebClientId: '309nvlfov3ioandke2pippaj17',
    oauth: {
      domain: 'habitfy-app.auth.us-east-1.amazoncognito.com',
      scope: ['aws.cognito.signin.user.admin', 'email', 'openid', 'phone', 'profile'],
      redirectSignIn: 'https://habitfy.vercel.app/home',
      redirectSignOut: 'https://habitfy.vercel.app',
      responseType: 'code'
    }
  }
};

export default awsconfig;
