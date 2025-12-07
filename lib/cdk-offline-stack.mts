import * as cdk from "aws-cdk-lib";
import { CfnOutput } from "aws-cdk-lib";
import { FunctionUrlAuthType, Runtime } from "aws-cdk-lib/aws-lambda";
import {
  type BundlingOptions,
  NodejsFunction,
} from "aws-cdk-lib/aws-lambda-nodejs";
import type { Construct } from "constructs";
import { esbuildOptions, handlerEntryPoint } from "../esbuild.config.js";

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
      entry: handlerEntryPoint,
      handler: "apiHandler",
      runtime: Runtime.NODEJS_24_X,
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
