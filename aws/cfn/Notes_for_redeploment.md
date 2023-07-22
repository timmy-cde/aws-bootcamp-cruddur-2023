## Due to rising AWS charges, I deleted the ALB and Backend service, which introduced drifts in cloudformation.

## Redeploy the following stacks:
- CrdCluster for ALB (rename ALB name to ALB-2 to fix drift)
- task def
- service