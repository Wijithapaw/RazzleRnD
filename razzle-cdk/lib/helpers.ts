// razzle-cdk/lib/helpers.ts
import * as SSM from '@aws-cdk/aws-ssm';
import * as CDK from '@aws-cdk/core';
export const getParam = (scope: CDK.Construct, name: string) => {
  return SSM.StringParameter.valueForStringParameter(scope, name);
};
export interface ConfigProps extends CDK.StackProps {
  name: string;
}
export class ModeStack extends CDK.Stack {
  public readonly mode: string = this.node.tryGetContext('mode') || 'development';
  public readonly Mode: string =
    this.mode.replace(/^\w/, (c: string) => c.toUpperCase());
  constructor(scope: CDK.Construct, id: string, props?: ConfigProps) {
    super(scope, id, props);
  }
}