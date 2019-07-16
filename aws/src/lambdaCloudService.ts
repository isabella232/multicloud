import AWS from "aws-sdk";
import { CloudService, ContainerResolver } from "@multicloud/sls-core";
import { AWSCloudServiceOptions } from "./awsCloudServiceOptions";
import { AWSInvokeType } from "./awsInvokeType";

export class LambdaCloudService implements CloudService {
  public constructor(private containerResolver: ContainerResolver) {}

  public invoke<T>(name: string, fireAndForget = false, payload: any) {
    if (!name || name.length === 0) {
      throw Error("Name is needed");
    }
    const context = this.containerResolver.resolve<AWSCloudServiceOptions>(name);

    if (!context.region || !context.arn) {
      throw Error("Region and ARN are needed for Lambda calls");
    }
    const lambda = new AWS.Lambda({ region: context.region });

    return (lambda
      .invoke({
        FunctionName: context.arn,
        Payload: payload,
        InvocationType: fireAndForget
          ? AWSInvokeType.fireAndForget
          : AWSInvokeType.fireAndWait
      })
      .promise() as unknown) as T;
  }
}
