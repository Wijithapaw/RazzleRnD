// razzle-cdk/lib/razzle-cdk-stack.ts
import * as CDK from '@aws-cdk/core';
import * as S3 from '@aws-cdk/aws-s3';
import * as S3Deployment from '@aws-cdk/aws-s3-deployment';
import * as Lambda from '@aws-cdk/aws-lambda';
import * as APIGateway from '@aws-cdk/aws-apigateway';
import * as SSM from '@aws-cdk/aws-ssm';
import * as SecretsManager from '@aws-cdk/aws-secretsmanager';
import { ConfigProps, getParam, ModeStack } from './helpers';
export class RazzleCdkStack extends ModeStack {
  constructor(app: CDK.App, id: string, props: ConfigProps) {
    super(app, id, props);
    /**
     * S3 bucket to the /public folder
     */
    const publicBucketName = `wijitest-razzle-app-bucket-public-files-${this.mode}`;
    const bucketPublicFiles = new S3.Bucket(this, publicBucketName, {
      publicReadAccess: true,
      bucketName: publicBucketName.toLowerCase(),
    });
    /**
     * Store S3 bucket name
     */
    new SSM.StringParameter(this, `WijiTestRazzleAppBucketAssetsName${this.Mode}`, {
      description: `My Razzle App S3 Bucket Name for Assets on ${this.Mode}`,
      parameterName: `/${props.name}/S3/Assets/Name`,
      stringValue: bucketPublicFiles.bucketName,
    });
    /**
     * Store S3 domainName name
     */
    new SSM.StringParameter(this, `WijiTestRazzleAppBucketAssetsDomainName${this.Mode}`, {
      description: `My Razzle App S3 Bucket DomainName for Assets on ${this.Mode}`,
      parameterName: `/${props.name}/S3/Assets/DomainName`,
      stringValue: bucketPublicFiles.bucketDomainName,
    });
    /**
     * Deploy public folder of build to `wijitest-razzle-app-bucket-public-files-${this.mode}` bucket
     */
    new S3Deployment.BucketDeployment(this, `${publicBucketName}-deploy`, {
      sources: [S3Deployment.Source.asset('../build/public')],
      destinationBucket: bucketPublicFiles,
    });
    /**
     * Environment Variables for SSR Function
     */
    const environmentKeys = [
      'NODE_ENV',
    ];
    const environmentSecret = SecretsManager.Secret.fromSecretAttributes(
      this,
      `WijiTestRazzleAppEnvironmentSecret${this.Mode}`,
      {
        secretArn: getParam(this, `WijiTestRazzleAppSecretsArn${this.Mode}`),
      },
    );
    let environment: { [key: string]: string } = {};
    for (const key of environmentKeys) {
      environment[key] = environmentSecret.secretValueFromJson(key).toString();
    }
    environment['PUBLIC_BUCKET_DOMAIN'] = bucketPublicFiles.bucketRegionalDomainName;
    /**
     * Razzle SSR Function
     */
    const myRazzleAppSsrFunction = new Lambda.Function(this, `WijiTestRazzleAppSSRFunction${this.Mode}`, {
      description: `Lambda Function that runs My Razzle App SSR on ${this.Mode}`,
      code: Lambda.Code.fromAsset('../build', {
        exclude: ['public', 'static', '*.json'],
      }),
      handler: 'server.handler',
      runtime: Lambda.Runtime.NODEJS_12_X,
      memorySize: 512,
      timeout: CDK.Duration.seconds(5),
      environment,
      tracing: Lambda.Tracing.ACTIVE,
    });
    /**
     * Razzle ApiGateway
     */
    const razzleSsrApiGatewayName = `WijiTestRazzleAppSSRApiGateway${this.Mode}`;
    const api = new APIGateway.RestApi(this, razzleSsrApiGatewayName, {
      description: `ApiGateway that exposes My Razzle App SSR on ${this.Mode}`,
      binaryMediaTypes: ['*/*'],
      endpointTypes: [APIGateway.EndpointType.REGIONAL],
      deployOptions: {
        stageName: this.mode,
      },
    });
    const integration = new APIGateway.LambdaIntegration(myRazzleAppSsrFunction);
    const root = api.root;
    const pathApi = api.root.addResource('{proxy+}');
    root.addMethod('GET', integration);
    pathApi.addMethod('ANY', integration);
    /**
     * Razzle ApiGateway ID
     */
    new SSM.StringParameter(this, `WijiTestRazzleAppAPIGatewayRestId${this.Mode}`, {
      description: `My Razzle App ApiGateway ID on ${this.Mode}`,
      parameterName: `/${props.name}/APIGateway/ApiId`,
      stringValue: api.restApiId,
    });
  }
}