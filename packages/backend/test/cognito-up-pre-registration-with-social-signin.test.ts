import {expect as expectCDK, matchTemplate, MatchStyle} from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as CognitoUpPreRegistrationWithSocialSignin from '../lib/cognito-up-pre-registration-with-social-signin-stack';

test('Empty Stack', () => {
  const app = new cdk.App();
  // WHEN
  const stack =
    new CognitoUpPreRegistrationWithSocialSignin.CognitoUpPreRegistrationWithSocialSigninStack(
      app,
      'MyTestStack'
    );
  // THEN
  expectCDK(stack).to(
    matchTemplate(
      {
        Resources: {},
      },
      MatchStyle.EXACT
    )
  );
});
