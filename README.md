# cdk-offline

A demo project showing the concept of `cdk-offline`. This could eventually become a real library / project. But I think
it's simple enough to just include in a project as most of the heavy lifting is conceptual more-so than code.

## How it works

- Create a web server (using `hono` here) as the main way routing works for your application
  - What about non-http events? They should still be added into the `http-handler.ts` but only in the `isLocal` branch
    and is just useful for simulating an event. If you don't want that functionality, just treat them like normal and
    do not include them in the http handler
- Create an `offline.ts`, this has a small script to facilitate:
  - Building the application
  - Watching for changes and rebuilding the project
  - Running the built project
- This will be a simulation of the lambda http environment!

## FAQ

- What if I want AWS lambda specific values in the router?
  - You'll need to add in a converter that will pass these values into your routes and normalise them between standard
    http and what AWS lambda gives
  - Examples: https://hono.dev/getting-started/aws-lambda
- This doesn't really fully emulate lambda does it?
  - Not really :) But it does a good enough job that we do not need to overly-complicate it. The `hono/aws-lambda`
    gets us most of the way for most http apps.
- What if I need to access resources in AWS such as DDB, SQS, etc?
  - Make sure you are authenticated to AWS locally and that you point your code to the relevant resources, although
    this is running locally it can still access most of these resources over the internet
- What if I need to access resources in AWS that's only accessible in a particular VPC?
  - Unfortunately this approach will not work, you'll need to either deploy to that AWS environment or use SST (which
    runs your code **in** AWS)
- What if I don't want to bundle all my http functions into one?
  - You can create as many Lambda functions as you need, you can have additional http-handlers too, you do not need to
    limit yourself to one. But it will make the process a little bit more complicated. In my experience, there's only
    a limited amount of need to split http into distinct functions, so I would recommend starting with one and only
    expanding as needed.
- I want the smallest possible bundle size
  - Because the `@hono/node-server` is relatively chunky (`~10kb`), we can optimise the bundle by marking
    the `@hono/node-server` as external in the cdk build options and using dynamic imports. We've built it in such a
    way (and in the example) where you can do this easily.
  - You can also swap from `hono/quick` to `hono/tiny` which will change from improved runtime performance to improved
    bundle size. Which one makes a larger impact will likely depend on your workload. This will reduce bundle size
    by `~12kb`
  - You could also remove `hono/logger` for an additional `1.2kb` size reduction
  - At this point, it's about `~16kb` after minification you may be needlessly optimising at this point, I'd focus on
    your own code / dependencies from here on out.
- I want typechecking during offline builds
  - If you want real-time typechecking you can add in `@jgoz/esbuild-plugin-typecheck` as a plugin into `offline.ts` (
    install it first)
  - If you do not run `tsc --noEmit` in your lint stage in CI, then I would recommend using this. Otherwise, IDE and
    CI linting is probably sufficient

## How do I add this to my own CDK project?

1. Install required dependencies:

```shell
npm i --save-dev esbuild ts-node @es-exec/esbuild-plugin-serve
npm i --save hono @hono/node-server
```

2. Add the following to your `package.json` scripts

```json
    "offline": "ts-node offline.ts"
```

3. Copy `src/http-handler.ts` to your project and modify the routes to bind to your functions handlers
4. Copy `esbuild.config.ts` to your project. It is recommended to pull in the esbuild options from this file into your
   stack, see `lib/cdk-offline-stack.ts` for an example. You should also customise the esbuild config for your project (
   defaults will be mostly fine)
5. Should be done :) You can now test by running `npm run offline`

As this is an example project, please bear in mind you may need to make alterations to fit your project, this is a
starting point, not the destination.

## Useful commands

- `npm run test` perform the jest unit tests
- `npm run deploy` deploy this stack to your default AWS account/region
- `npm run offline` run this http lambda cdk stack locally
- `npx cdk diff` compare deployed stack with current state
- `npx cdk synth` emits the synthesized CloudFormation template
