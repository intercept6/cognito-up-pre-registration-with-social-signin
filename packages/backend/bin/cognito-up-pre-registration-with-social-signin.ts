#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import {CognitoUpPreRegistrationWithSocialSigninStack} from '../lib/cognito-up-pre-registration-with-social-signin-stack';

const app = new cdk.App();
new CognitoUpPreRegistrationWithSocialSigninStack(
  app,
  'CognitoUpPreRegistrationWithSocialSigninStack',
  {
    env: {region: 'ap-northeast-1'},
    clientId: process.env.CLIENT_ID!,
    clientSecret: process.env.CLIENT_SECRET!,
  }
);
