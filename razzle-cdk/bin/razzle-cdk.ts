#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { RazzleCdkStack } from '../lib/razzle-cdk-stack';
const app = new cdk.App();
new RazzleCdkStack(app, 'RazzleCdkStack', {name:'basic'});