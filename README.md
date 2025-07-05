# TeenyQuestsAngular

## Start

- Install dependencies `npm i`
- Create a file `src/config/configConstants.ts` to contain your apiGatewayId. This is imported by the app configuration.

## IaC

- This projects uses AWS CloudFormation for IaC
- To deploy CF changes, use the `create-stack` command to create a fresh CF stack, use `update-stack` to issue changes:
  - aws cloudformation create-stack --stack-name TQCFStack --template-body file://tq-cf.yaml --capabilities CAPABILITY_IAM
  - aws cloudformation update-stack --stack-name TQCFStack --template-body file://tq-cf.yaml --capabilities CAPABILITY_IAM
- Validation
  - aws cloudformation validate-template --template-body file://tq-cf.yaml

## Update Lambda Layer Content

- zip -r ../TQ-SharedApiLambda-layer.zip nodejs
