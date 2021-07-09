import {
  DeleteItemCommand,
  DynamoDB,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb';

interface SignUpEvent {
  request: {
    userAttributes: {
      [key: string]: string;
    };
    validationData: {
      [key: string]: string;
    };
    clientMetadata: {
      [key: string]: string;
    };
  };
  response: {
    autoConfirmUser: boolean;
    autoVerifyPhone: boolean;
    autoVerifyEmail: boolean;
  };
}

const ddb = new DynamoDB({});

export const handler = async (event: SignUpEvent) => {
  const email = event.request.userAttributes['email'];

  const {Item} = await ddb.send(
    new GetItemCommand({
      TableName: process.env.TABLE_NAME!,
      Key: {email: {S: email}},
    })
  );

  if (Item === undefined) {
    throw new Error('this email address is not allowed to sign up');
  }

  await ddb.send(
    new DeleteItemCommand({
      TableName: process.env.TABLE_NAME!,
      Key: {email: {S: email}},
    })
  );

  return event;
};
