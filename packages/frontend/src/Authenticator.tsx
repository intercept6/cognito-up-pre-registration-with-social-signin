import React from 'react';
import {Auth} from 'aws-amplify';
import {CognitoUser, CognitoHostedUIIdentityProvider} from '@aws-amplify/auth';
import App from './App';

const Authenticator: React.VFC = () => {
  const [cognitoUser, setCognitoUser] = React.useState<CognitoUser | null>(
    null
  );

  async function getCognitoUser() {
    const cognitoUser = (await Auth.currentAuthenticatedUser()) as
      | CognitoUser
      | unknown;

    if (!(cognitoUser instanceof CognitoUser)) {
      throw new Error('failed to get user');
    }

    return cognitoUser;
  }

  React.useEffect(() => {
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const error = params.get('error_description');
      if (error !== null) {
        alert(error);
        window.location.href = '/';
      }

      setCognitoUser(await getCognitoUser());
    })();
  }, []);

  return (
    <div>
      {cognitoUser ? (
        <App />
      ) : (
        <button
          onClick={() =>
            Auth.federatedSignIn({
              provider: CognitoHostedUIIdentityProvider.Google,
            })
          }
        >
          Open Google
        </button>
      )}
    </div>
  );
};

export default Authenticator;
