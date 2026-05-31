---
title: 'Platform in a Box: Building a Golden Path from Terraform to an IDP Portal'
description: 'A practical walkthrough of a small platform engineering project that connects AWS, EKS, GitHub Actions, Argo CD, observability, and a developer portal.'
publishedAt: 2026-05-31
updatedAt: 2026-05-31
author: 'Deepak Kumar Sahu'
tags:
  - platform-engineering
  - kubernetes
  - gitops
  - aws
  - developer-experience
category: 'platform'
draft: false
featured: true
readingTime: '10 min read'
heroImage: /images/blog/platform-in-a-box.svg
heroImageAlt: 'Platform in a Box architecture showing a golden path from service contract and Terraform through GitHub Actions, Argo CD, observability, and an internal developer portal'
---

Platform engineering is easiest to understand when the entire delivery path is visible.

That was the idea behind **Platform in a Box**, a compact learning project I built to demonstrate how a small application moves from source code to a governed Kubernetes workload. The repository is intentionally modest: one Go service, a Terraform stack, a Helm chart, GitHub Actions workflows, Argo CD manifests, an observability layer, and a lightweight internal developer portal.

The goal was not to pretend this is a production platform. The goal was to make the important handoffs concrete.

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

Each layer answers a different question. How is infrastructure created? How is a release packaged? Where is the desired state stored? Who applies changes to the cluster? How do we detect drift? How does a developer use the platform without memorizing the machinery underneath it?

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

The application team should be able to say:

- run this service on EKS
- keep two replicas available
- expose health and readiness checks
- scrape metrics from this path
- apply these resource boundaries

The platform then turns that intent into infrastructure, deployment configuration, runtime checks, and operational visibility.

## Prove the Manual Path First

The first version of the workflow is intentionally manual:

```text
Go service -> Docker build -> ECR push -> Helm deploy -> EKS -> kubectl inspection
```

Terraform provisions the AWS foundation: VPC, EKS, ECR, IAM, and useful outputs. The application is packaged as a Docker image and pushed to ECR. Helm deploys the workload into Kubernetes. `kubectl` verifies deployments, services, pods, logs, and rollout status.

This manual stage is not wasted work. It establishes the mechanics before introducing automation. When a later pipeline fails, there is a known-good path to compare against.

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

## Move from Deployment Scripts to CI/CD

Once the manual path works, GitHub Actions automates it.

The pipeline tests the Go service, authenticates to AWS, builds the image, pushes it to ECR, and updates the deployment configuration. AWS access uses OpenID Connect rather than long-lived access keys stored in GitHub.

```text
GitHub Actions
  -> requests an OIDC token
  -> assumes a scoped AWS role
  -> receives temporary credentials
  -> pushes the image to ECR
```

That distinction is worth teaching clearly. A deployment pipeline needs credentials, but it does not need permanent credentials. Short-lived access, scoped to a repository and branch, is a stronger default.

CI/CD makes the release path repeatable. It does not yet make Git the final authority for runtime state.

## Let GitOps Change the Operating Model

The next step introduces Argo CD.

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

That gives the team a clearer answer to a basic operational question:

> Why is this version running in this environment?

The answer can be traced through Git history, workflow history, the immutable image tag, and the Argo CD application state.

## Scale the Pattern with ApplicationSets

A single application proves the pattern. A platform has to apply the pattern repeatedly.

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

This allows two useful rollout demonstrations:

1. Change one application's values and reconcile only that application.
2. Change a shared default and let every generated application inherit the update.

That separation is small, but it captures a real platform design problem:

> How do we publish shared standards without forcing every application to adopt every change at the same moment?

Platforms need both leverage and control. Shared defaults provide leverage. Explicit per-application adoption gives teams a safer path for change.

## Add Observability to the Golden Path

A deployment path is incomplete if it stops at "the pod is running."

The project adds:

- Prometheus for metrics
- Grafana for dashboards
- Loki and Promtail for logs
- an OpenTelemetry Collector configuration for telemetry-routing discussion
- a `ServiceMonitor` so application metrics can be discovered consistently

The sample service exposes health, readiness, version, and metrics endpoints. It also emits structured request logs with fields such as method, path, status, duration, service, version, report name, and release ring.

This makes release verification practical. After a rollout, the questions are not limited to whether Kubernetes accepted the manifest:

- Did the new pods become ready?
- Did the application remain healthy?
- Can we see the deployed version?
- Are logs available?
- Did request behavior change?

Observability should not be a separate destination teams discover after an incident. It should be part of the supported path.

## Put a Small Portal in Front of the Machinery

The final layer is a lightweight internal developer portal.

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

The portal is not the platform. It is the user-facing surface. The platform is the set of contracts, automation, policies, runtime capabilities, and operational feedback loops behind that surface.

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

## Where This Could Go Next

This repository is intentionally a learning project rather than a production baseline. A production version would need deeper work around security boundaries, secrets, tenancy, policy coverage, progressive delivery, disaster recovery, auditability, and support ownership.

But the compact version is valuable because the full path fits in your head.

You can follow one application from code to image, from image to desired state, from desired state to reconciliation, and from reconciliation to runtime signals. You can also see how a portal makes the same path easier to consume without pretending the underlying systems disappeared.

That is the platform engineering idea I wanted the project to make tangible: create a safe, repeatable path, make it observable, and make the easiest way to ship software the way the platform team is prepared to support.

The project is available on GitHub: [Platform in a Box](https://github.com/dsahu1001-git/platform-in-a-box).
