import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Runtime, FunctionUrlAuthType } from "aws-cdk-lib/aws-lambda";
import { BundlingOptions, NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { esbuildOptions } from "../esbuild.config";
import { CfnOutput } from "aws-cdk-lib";

const bundleOptions: BundlingOptions = {
  platform: esbuildOptions.platform,
  loader: esbuildOptions.loader,
  minify: esbuildOptions.minify,
  sourceMap: !!esbuildOptions.sourcemap,
  externalModules: ["@hono/node-server"],
};

export class CdkOfflineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const fn = new NodejsFunction(this, "httpFunction", {
      entry: "src/http-handler.ts",
      handler: "httpHandler",
      runtime: Runtime.NODEJS_20_X,
      bundling: bundleOptions,
      environment: {
        NODE_OPTIONS: "--enable-source-maps",
      },
    });

    const fnUrl = fn.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    });

    new CfnOutput(this, "lambdaFunctionUrl", {
      value: fnUrl.url,
    });
  }
}
