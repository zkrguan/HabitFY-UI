const awsconfig = {
    Auth: {
      region: 'us-east-1',
      userPoolId: 'us-east-1_P3AIb3OoJ',
      userPoolWebClientId: '2hk11bq8o4fn9bkr8f7t3610tc',
      oauth: {
        domain: 'habitfy.auth.us-east-1.amazoncognito.com',
        scope: ['phone', 'openid' , 'email'],
        redirectSignIn: 'http://localhost:4200/home',
        redirectSignOut: 'http://localhost:4200',
        responseType: 'code'
      }
    }
  };
  
  export default awsconfig;