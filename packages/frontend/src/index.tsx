import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import Amplify from 'aws-amplify';
import Authenticator from './Authenticator';
import {CognitoUpPreRegistrationWithSocialSigninStack as cdkProps} from './output.json';

Amplify.configure({
  Auth: {
    region: cdkProps.region,
    userPoolId: cdkProps.userPoolId,
    userPoolWebClientId: cdkProps.userPoolWebClientId,
    oauth: {
      domain: `${cdkProps.domain}.auth.${cdkProps.region}.amazoncognito.com`,
      redirectSignIn: cdkProps.redirectSignIn,
      redirectSignOut: cdkProps.redirectSignOut,
      scope: ['openid', 'email', 'profile'],
      responseType: 'code',
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Authenticator />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
