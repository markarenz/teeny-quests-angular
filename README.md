# TeenyQuestsAngular

## Start

- Install dependencies `npm i`
- Create a file `src/config/configConstants.ts` to contain your apiGatewayId. This is imported by the app configuration.

## IaC

- This projects uses AWS CloudFormation for IaC
- To deploy CF changes, use the `create-stack` command to create a fresh CF stack, use `update-stack` to issue changes:
  - use "create-stack" or "update-stack" depending on the circumstances
- Example: `aws cloudformation update-stack --stack-name TQCFStack01 --template-body file://tq-cf.yaml --capabilities CAPABILITY_IAM --parameters ParameterKey=AllowedIPAddresses1,ParameterValue=IP_ADDRESS_1 ParameterKey=AllowedIPAddresses2,ParameterValue=IP_ADDRESS_2`
- aws cloudformation validate-template --template-body file://tq-cf.yaml

- For IaC Setup, create a parameters.yml file in the /iac directory with the values for `AllowedIPAddresses`
  ```
    - ParameterKey: AllowedIPAddresses
      ParameterValue: ["200.200.200.200", "100.100.100.100"]
  ```

## Update Lambda Layer Content

- zip -r ../TQ-SharedApiLambda-layer.zip nodejs
