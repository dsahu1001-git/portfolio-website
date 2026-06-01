---
title: "Platform in a Box: What Really Happens After You Click Deploy?"
description: "A practical platform engineering journey from application code to AWS, EKS, GitOps, observability, and a developer portal."
publishedAt: 2026-05-31
updatedAt: 2026-05-31
author: "Deepak Kumar Sahu"
tags:
  - platform-engineering
  - kubernetes
  - gitops
  - aws
  - developer-experience
category: "platform"
draft: false
featured: true
readingTime: "15 min read"
---

An application is ready. The tests pass. Someone clicks **Deploy**.

What actually happens next?

For an application engineer, the answer determines whether releasing software feels routine or risky. For a platform engineer, it determines how much operational complexity gets repeated across teams. For an engineering leader, it determines whether delivery becomes faster without quietly weakening control.

Most platform engineering diagrams show a portal, a pipeline, and a Kubernetes cluster connected by clean arrows. They rarely show who is allowed to assume the delivery role, where the image tag is recorded, how drift is corrected, how one shared platform change reaches five applications, or what a developer sees when part of the platform is unavailable.

That is what I wanted to explore with **Platform in a Box**: a compact project that makes the entire path visible. The repository is intentionally modest: one Go service, a Terraform stack, a Helm chart, GitHub Actions workflows, Argo CD manifests, an observability layer, and a lightweight internal developer portal.

The goal was not to pretend this is a production platform. The goal was to make the important handoffs concrete enough to inspect, explain, and improve.

```text
application code
  -> container image
  -> Amazon ECR
  -> Kubernetes on Amazon EKS
  -> GitHub Actions automation
  -> GitOps desired state
  -> Argo CD reconciliation
  -> policy and observability
  -> developer-facing portal
```

Each layer answers a different question:

- How is infrastructure created?
- How is a release packaged?
- Which identity is allowed to push it?
- Where is the desired state stored?
- Who applies changes to the cluster?
- How do we detect drift?
- What signals tell us the release is healthy?
- How does a developer use the platform without memorizing the machinery underneath it?

The implementation is small enough to inspect end to end, but broad enough to expose the design decisions that matter.

## Read This at Your Level

You do not need to be a Kubernetes expert to get value from the project.

If you are an **intermediate engineer**, follow the path of one code change: source, image, registry, desired state, rollout, and metrics.

If you are a **senior or platform engineer**, look at the boundaries: OIDC trust, GitOps reconciliation, shared defaults, per-application overrides, and the point where the portal delegates to existing automation.

If you lead an engineering organization, ask a different question: which decisions should every product team solve independently, and which decisions should the platform make easy to consume by default?

## Start with a Service Contract

Before adding automation, the project defines a small service contract:

```json
{
  "service": "sample-platform-app",
  "owner": "platform-training",
  "environment": "training",
  "runtime": "eks",
  "namespace": "platform-demo",
  "replicas": 2,
  "healthPath": "/healthz",
  "readinessPath": "/readyz",
  "metricsPath": "/metrics"
}
```

This is deliberately simple, but the principle matters. A platform team needs a clear interface between application intent and platform implementation.

The application team should be able to express intent in a language that stays understandable:

- run this service on EKS
- keep two replicas available
- expose health and readiness checks
- scrape metrics from this path
- apply these resource boundaries

The platform turns that intent into infrastructure, deployment configuration, runtime checks, and operational visibility.

That contract is not yet a full developer-platform API. It is an intentionally small design anchor. If the platform grows, the contract can become the input to scaffolding, policy validation, catalog registration, or environment provisioning without forcing the application team to understand every implementation detail.

## Prove the Manual Path First

Before building a portal, prove that the underlying path works. The first version of this workflow is intentionally manual:

```text
Go service -> Docker build -> ECR push -> Helm deploy -> EKS -> kubectl inspection
```

Terraform provisions the AWS foundation: VPC, EKS, ECR, IAM, and useful outputs. The application is packaged as a Docker image and pushed to ECR. Helm deploys the workload into Kubernetes. `kubectl` verifies deployments, services, pods, logs, and rollout status.

This stage is not wasted work. It establishes the mechanics before introducing automation. When a later pipeline fails, there is a known-good path to compare against.

It also reveals an important platform engineering habit: reduce invisible steps. Common operations are exposed through a `Makefile`:

```bash
make infra-plan
make kubeconfig
make image-build IMAGE_TAG=v1
make image-push IMAGE_TAG=v1
make app-deploy IMAGE_TAG=v1
make app-status
```

The commands are not sophisticated. Their value is consistency. A golden path often starts by making the correct sequence easier to discover and repeat.

The Terraform layer makes the infrastructure assumptions explicit:

```hcl
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_endpoint_public_access = true
  enable_irsa                    = true

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets
}

resource "aws_ecr_repository" "app" {
  name                 = var.repository_name
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}
```

For a training environment, public cluster API access and mutable ECR tags keep the exercise approachable. For a production baseline, I would revisit both: restrict control-plane access, tighten network boundaries, prefer immutable tags, and add policy enforcement around image provenance and admission.

This is an important pattern for engineers at any level: first understand the path, then harden the boundaries deliberately. Complexity is useful when it protects something specific.

## Move from Deployment Scripts to CI/CD

Once the manual path works, GitHub Actions automates the repeatable parts.

The pipeline tests the Go service, authenticates to AWS, builds the image, pushes it to ECR, and updates the deployment path. AWS access uses OpenID Connect rather than long-lived access keys stored in GitHub.

```text
GitHub Actions
  -> requests an OIDC token
  -> assumes a scoped AWS role
  -> receives temporary credentials
  -> pushes the image to ECR
```

That distinction is worth teaching clearly. A deployment pipeline needs credentials, but it does not need permanent credentials. Short-lived access, scoped to a repository and branch, is a stronger default.

The Terraform trust policy is where that boundary becomes real:

```hcl
condition {
  test     = "StringLike"
  variable = "token.actions.githubusercontent.com:sub"
  values   = ["repo:${var.github_repository}:ref:refs/heads/${var.github_branch}"]
}
```

The workflow can assume the role only when the OIDC subject matches the configured repository and branch. The attached policy then narrows what the role can do: authenticate to ECR, push and inspect images in one repository, and describe the EKS cluster.

The training stack deliberately grants broad EKS access later so the exercise remains visible and debuggable. That is a teaching shortcut, not the endpoint. A production implementation should reduce cluster permissions to the smallest deploy surface and separate build, promotion, and reconciliation responsibilities.

CI/CD makes the release path repeatable. It does not yet make Git the final authority for runtime state.

## Let GitOps Change the Operating Model

The next step introduces Argo CD and changes a deceptively important part of the flow.

Instead of a pipeline directly changing the cluster, the workflow updates the desired state in Git. Argo CD watches that state and reconciles Kubernetes toward it.

```text
git push
  -> GitHub Actions tests and publishes an image
  -> workflow updates the image tag in Git
  -> Argo CD detects the desired-state change
  -> Argo CD reconciles EKS
```

This is more than a tooling swap. It changes the operating model.

Git becomes the durable record of what should run. Argo CD continuously compares desired state with cluster state. If somebody manually changes a managed resource in the cluster, drift becomes visible. If self-healing is enabled, Argo CD restores the declared configuration.

```yaml
syncPolicy:
  automated:
    prune: true
    selfHeal: true
  syncOptions:
    - CreateNamespace=true
```

`prune` removes resources deleted from Git. `selfHeal` corrects manual drift. This is the moment where delivery stops being a sequence of imperative commands and becomes a reconciliation loop.

That gives everyone a clearer answer to a basic operational question:

> Why is this version running in this environment?

The answer can be traced through Git history, workflow history, the immutable image tag, and the Argo CD application state.

## Scale the Pattern with ApplicationSets

A single application proves the pattern. A platform becomes useful when teams can repeat the pattern without rebuilding it from scratch.

The project adds a multi-application model using Argo CD ApplicationSets:

```text
shared-values.yaml
app-a.values.yaml
app-b.values.yaml
app-c.values.yaml
app-d.values.yaml
app-e.values.yaml
```

Shared values represent the platform default. Per-application values represent adoption state or exceptions.

The ApplicationSet renders the same Helm chart repeatedly while layering shared and application-specific values:

```yaml
generators:
  - list:
      elements:
        - app: app-a
        - app: app-b
        - app: app-c
        - app: app-d
        - app: app-e

template:
  spec:
    source:
      path: helm/sample-platform-app
      helm:
        valueFiles:
          - ../../deploy/apps/shared-values.yaml
          - ../../deploy/apps/{{app}}.values.yaml
```

The shared layer carries platform-level defaults such as resource requests, limits, environment, and release ring:

```yaml
resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 500m
    memory: 256Mi

env:
  APP_ENV: training
  RELEASE_RING: "dev"
```

The application layer carries identity and adoption state:

```yaml
nameOverride: app-a
replicaCount: 2

image:
  tag: "11d4c83"

env:
  SERVICE_NAME: app-a
  REPORT_NAME: "platform-demo"
```

This allows two useful rollout demonstrations:

1. Change one application's values and reconcile only that application.
2. Change a shared default and let every generated application inherit the update.

That separation looks small in YAML, but it captures a real platform design problem:

> How do we publish shared standards without forcing every application to adopt every change at the same moment?

Platforms need both leverage and control. Shared defaults provide leverage. Explicit per-application adoption gives teams a safer path for change. Product teams get a supported baseline without losing the ability to roll out carefully.

## Add Observability to the Golden Path

A deployment path is incomplete if it stops at "the pod is running." A successful rollout is not the same thing as a healthy service.

The project adds:

- Prometheus for metrics
- Grafana for dashboards
- Loki and Promtail for logs
- an OpenTelemetry Collector configuration for telemetry-routing discussion
- a `ServiceMonitor` so application metrics can be discovered consistently

The sample service exposes health, readiness, version, and metrics endpoints. It also emits structured request logs with fields such as method, path, status, duration, service, version, report name, and release ring.

The metrics endpoint is intentionally tiny:

```text
# HELP sample_platform_app_requests_total Total HTTP requests handled by the sample app.
# TYPE sample_platform_app_requests_total counter
sample_platform_app_requests_total 42
```

A `ServiceMonitor` selects services carrying the platform-demo label and tells Prometheus to scrape `/metrics` every 30 seconds:

```yaml
selector:
  matchLabels:
    training.openai/platform-demo: "true"
endpoints:
  - port: http
    path: /metrics
    interval: 30s
```

The metric itself is deliberately basic. The useful idea is that observability registration travels with the supported deployment path. A service should not need a separate onboarding project before its runtime signals are discoverable.

This makes release verification practical. After a rollout, the questions are not limited to whether Kubernetes accepted the manifest:

- Did the new pods become ready?
- Did the application remain healthy?
- Can we see the deployed version?
- Are logs available?
- Did request behavior change?

Observability should not be a separate destination teams discover after an incident. It should be part of the supported path.

## Put a Small Portal in Front of the Machinery

Only after the path is understandable do we add the final layer: a lightweight internal developer portal.

The portal is a Go service with an embedded HTML, CSS, and JavaScript frontend. It does not try to replace GitHub Actions or Argo CD. It provides a simpler entry point for a common developer action.

From the UI, a user can submit a deployment request with a report name, target application, release ring, and rollout scope. The portal dispatches the GitHub Actions workflow and polls for status.

It also runs platform proof checks for:

- Terraform workspace presence
- AWS caller identity
- GitHub repository access
- Kubernetes connectivity
- Argo CD applications
- namespace deployments
- Prometheus API availability
- Grafana health
- Loki pod presence

This is a useful way to explain what an internal developer platform is and is not.

The portal is not the platform. It is the user-facing surface. The platform is the set of contracts, automation, policies, runtime capabilities, and operational feedback loops behind it.

That distinction matters. A polished portal without dependable workflows behind it is a form with nowhere useful to go. A dependable platform without a usable entry point forces every developer to become a part-time platform operator. The useful result sits between those extremes.

The portal’s implementation is intentionally direct. A deployment request becomes a GitHub workflow dispatch:

```go
body := workflowDispatchBody{
    Ref: target.WorkflowRef,
    Inputs: map[string]string{
        "scope":        target.Scope,
        "app_name":     target.AppName,
        "report_name":  reportName,
        "release_ring": target.ReleaseRing,
    },
}
```

It then polls workflow runs created after the request timestamp and reports the status back to the UI. Before dispatching, it also reads the current GitHub values and skips requests that would make no meaningful change.

That small optimization matters. A portal should not turn every click into platform churn. Good self-service is not just a button in front of automation; it is a narrow, observable adapter that understands enough state to avoid unnecessary work.

## What This Project Reinforced

Building the project as one connected slice reinforced a few lessons.

### 1. A golden path should be inspectable

Abstraction is useful, but hidden magic is difficult to trust. Developers and operators should be able to see the workflow, desired state, runtime status, and observability signals when they need to troubleshoot.

### 2. Start with one repeatable path

An IDP does not have to begin as a large portal program. One service contract, one Terraform module, one deploy workflow, and one supported runtime path can already remove a surprising amount of friction.

### 3. GitOps is an operating model, not just another deployment tool

The important shift is that Git becomes the declared source of truth and the controller continuously reconciles toward it.

### 4. Shared defaults need an adoption strategy

Publishing a platform standard is only half the problem. Teams also need a controlled way to adopt, override, test, and roll back changes.

### 5. Cost controls belong in the learning path

Cloud-native demos create real resources. Cleanup is part of the platform story. The repository includes a teardown flow so cost awareness is treated as an operational responsibility, not an afterthought.

### 6. Training shortcuts should be visible

The repository favors readability over production hardening in a few places: public EKS API access, mutable ECR tags, broad training permissions, local port-forwards, and a portal token supplied through the environment. Naming those trade-offs is part of the exercise. A demo becomes more useful when it shows where the next design review should begin.

## Why This Matters Beyond the Demo

The interesting part of platform engineering is not the number of tools in the diagram. It is the reduction of repeated decision-making.

Without a supported path, every team answers the same questions independently:

- How should we package a service?
- Which deployment identity should we use?
- Where should runtime configuration live?
- How do we recover from drift?
- Which metrics and logs should exist by default?
- How do we roll out a shared standard safely?

At small scale, those questions feel manageable. As the number of services and teams grows, the repeated work becomes operational drag. Inconsistent answers also create risk: different permissions, different deployment habits, different observability coverage, and different recovery procedures.

A platform does not remove every choice. It removes unnecessary choices from the common path and keeps the important ones visible.

## Where This Could Go Next

This repository is intentionally a learning project rather than a production baseline. A production version would need deeper work around security boundaries, secrets, tenancy, policy coverage, progressive delivery, disaster recovery, auditability, and support ownership.

The next technical steps I would explore are:

- split build, promotion, and reconciliation permissions into separate trust boundaries
- use immutable ECR tags and verify signed artifacts before admission
- add policy-as-code checks for resource limits, approved registries, and deployment standards
- replace list-generated applications with repository or catalog-driven discovery
- add progressive delivery with automated health analysis
- move portal authentication and authorization behind an identity-aware boundary
- publish golden-path scorecards so teams can see which supported capabilities they have adopted

But the compact version is valuable because the full path fits in your head.

You can follow one application from code to image, from image to desired state, from desired state to reconciliation, and from reconciliation to runtime signals. You can also see how a portal makes the same path easier to consume without pretending the underlying systems disappeared.

That is the platform engineering idea I wanted the project to make tangible: create a safe, repeatable path, make it observable, and make the easiest way to ship software the way the platform team is prepared to support.

The project is available on GitHub: [Platform in a Box](https://github.com/dsahu1001-git/platform-in-a-box).
