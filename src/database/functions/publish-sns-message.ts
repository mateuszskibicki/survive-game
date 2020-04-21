import { sns } from "@app/aws";

/**
 * Function - publish sns message
 * @param {string} TopicArn
 * @param {string} Message
 * @return {void}
 */
export const publishSnsMessage = async (
  TopicArn: string,
  Message: string
): Promise<void> => {
  await sns().publish({ TopicArn, Message }).promise();
};
