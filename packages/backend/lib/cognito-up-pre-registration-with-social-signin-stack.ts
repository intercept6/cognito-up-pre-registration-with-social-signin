import * as cdk from '@aws-cdk/core';
import * as cognito from '@aws-cdk/aws-cognito';
import * as nodejs from '@aws-cdk/aws-lambda-nodejs';
import * as ddb from '@aws-cdk/aws-dynamodb';

export interface CognitoUpPreRegistrationWithSocialSigninStackProps
  extends cdk.StackProps {
  clientId: string;
  clientSecret: string;
}

export class CognitoUpPreRegistrationWithSocialSigninStack extends cdk.Stack {
  constructor(
    scope: cdk.Construct,
    id: string,
    props: CognitoUpPreRegistrationWithSocialSigninStackProps
  ) {
    super(scope, id, props);

    const table = new ddb.Table(this, 'pre-registered-users', {
      partitionKey: {name: 'email', type: ddb.AttributeType.STRING},
    });

    const preSignUp = new nodejs.NodejsFunction(this, 'pre-sign-up', {
      entry: 'src/pre-sign-up.ts',
      environment: {
        TABLE_NAME: table.tableName,
      },
    });
    table.grantReadWriteData(preSignUp);

    const userPool = new cognito.UserPool(this, 'user-pool', {
      selfSignUpEnabled: false,
      standardAttributes: {email: {required: true}},
      signInAliases: {email: true},
      lambdaTriggers: {preSignUp},
    });
    const domainPrefix = 'up-pre-registration-social-sign-in';
    userPool.addDomain('domain', {cognitoDomain: {domainPrefix}});

    const userPoolIdentityProviderGoogle =
      new cognito.UserPoolIdentityProviderGoogle(this, 'google', {
        userPool,
        clientId: props.clientId,
        clientSecret: props.clientSecret,
        scopes: ['profile', 'email', 'openid'],
        attributeMapping: {
          email: cognito.ProviderAttribute.GOOGLE_EMAIL,
        },
      });

    const redirectSignIn = 'http://localhost:3000/';
    const redirectSignOut = 'http://localhost:3000/';
    const client = userPool.addClient('client', {
      oAuth: {
        scopes: [
          cognito.OAuthScope.EMAIL,
          cognito.OAuthScope.OPENID,
          cognito.OAuthScope.PROFILE,
        ],
        callbackUrls: [redirectSignIn],
        logoutUrls: [redirectSignOut],
        flows: {
          authorizationCodeGrant: true,
        },
      },
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.GOOGLE,
      ],
    });

    client.node.addDependency(userPoolIdentityProviderGoogle);

    new cdk.CfnOutput(this, 'userPoolId', {value: userPool.userPoolId});
    new cdk.CfnOutput(this, 'userPoolWebClientId', {
      value: client.userPoolClientId,
    });
    new cdk.CfnOutput(this, 'domain', {value: domainPrefix});
    new cdk.CfnOutput(this, 'region', {value: props.env!.region!});
    new cdk.CfnOutput(this, 'redirectSignIn', {value: redirectSignIn});
    new cdk.CfnOutput(this, 'redirectSignOut', {value: redirectSignOut});
  }
}
