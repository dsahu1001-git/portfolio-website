---
title: 'Your CI/CD Platform Is Not a Museum: A Practical Modernization Playbook'
description: 'A practical technical playbook for replacing fragile centralized pipelines with reusable GitHub Actions workflows, GitOps deployments through Argo CD, and Helm configuration teams can safely own.'
publishedAt: 2026-06-01
updatedAt: 2026-06-01
author: 'Deepak Kumar Sahu'
tags:
  - devops
  - cicd
  - github-actions
  - argocd
  - gitops
  - helm
  - kubernetes
category: 'platform'
draft: false
featured: true
readingTime: '11 min read'
---

Every mature CI/CD platform has a pipeline nobody wants to touch.

It may have been created years ago by someone who has since moved on. It may depend on a build agent with a carefully preserved set of packages. It may contain deployment steps that work reliably, but only if nobody asks too many questions.

The problem is not that the pipeline is old. The problem is that delivery knowledge has become trapped inside it.

CI/CD modernization is the work of making that knowledge visible, repeatable, and safe to change. Replacing one build server with another is only one part of it.

A durable modernization effort connects four moves:

1. Use GitHub Actions to standardize build and validation workflows.
2. Use Argo CD to make Kubernetes deployments declarative and observable.
3. Restructure Helm charts so application teams can update configuration safely through pull requests.
4. Encode governance as reusable defaults instead of routing every routine change through a platform team.

This is a practical playbook for doing that without attempting a dangerous big-bang rewrite. The examples are intentionally generic and can be adapted to different teams, repositories, and Kubernetes environments.

## The Architecture Shift That Matters

The most important decision is simple: stop treating build and deployment as one long pipeline.

GitHub Actions should build, test, scan, and publish artifacts. Argo CD should reconcile the desired deployment state stored in Git with the actual state running in Kubernetes.

```text
Developer pull request
  -> GitHub Actions: test, build, scan
      -> Container registry
      -> Deployment configuration pull request
          -> Git configuration repository
          -> Argo CD reconciliation
          -> Kubernetes environment
          -> Deployment visibility and health status
```

That boundary changes the daily experience of delivery. CI answers, "Can we trust this artifact?" GitOps answers, "What should be running, and is the cluster actually running it?"

The responsibility model becomes much easier to reason about:

| Concern                            | Recommended Owner       |
| ---------------------------------- | ----------------------- |
| Application build and tests        | Application team        |
| Reusable CI workflow standards     | Platform or DevOps team |
| Container artifact publishing      | CI workflow             |
| Desired deployment state           | Git repository          |
| Kubernetes reconciliation          | Argo CD                 |
| Base Helm templates and guardrails | Platform team           |
| Service-specific values            | Application team        |

## How Delivery Knowledge Gets Trapped

Centralized CI/CD servers rarely become difficult overnight. They accumulate hidden behavior one reasonable decision at a time:

- Build logic is configured through a UI rather than versioned alongside code.
- Similar pipelines diverge because teams copy and modify existing jobs.
- Agents require manual maintenance and inconsistent tooling.
- Deployment credentials are embedded in job configuration.
- Application teams depend on a small platform group for routine configuration changes.
- Troubleshooting requires access to a specialized system that developers may not use regularly.

This is why a literal job-for-job migration is a trap. It preserves the accidental complexity while changing the logo on the screen.

The migration goal is to identify recurring patterns, discard obsolete workarounds, and rebuild the useful behavior as maintainable, version-controlled workflows.

## Phase 1: Start With Forensics, Not YAML

Before writing a single workflow, build a pipeline inventory. Treat it as a forensic exercise. For each pipeline, capture:

| Field               | Questions to Answer                                                                |
| ------------------- | ---------------------------------------------------------------------------------- |
| Trigger             | Does it run on pull requests, merges, tags, schedules, or manual approval?         |
| Build steps         | Which commands, package managers, and runtime versions are required?               |
| Dependencies        | Does it rely on internal registries, shared folders, or custom agents?             |
| Secrets             | Which credentials are required, and where are they currently stored?               |
| Artifacts           | Does it publish a container image, package, report, or binary?                     |
| Deployment behavior | Does the pipeline deploy directly to Kubernetes or update configuration elsewhere? |
| Validation          | Who verifies the result, and what evidence is needed?                              |

Then resist the urge to migrate everything at once. Choose a small pilot set that represents the real shape of the platform:

1. A straightforward service with build and unit tests.
2. A containerized service that publishes an image.
3. A service with Kubernetes deployment configuration.
4. A more complex pipeline with approvals or environment-specific behavior.

The pilot is where architecture diagrams meet reality. It exposes edge cases without placing the entire release process at risk.

## Phase 2: Turn Repeated Build Logic Into a Product

The fastest way to rebuild the old mess in a new tool is to copy a workflow into every repository.

Treat reusable workflows as an internal product instead. Give teams a small, stable interface and keep shared implementation details in one reviewed location.

A reusable workflow can provide a controlled baseline:

```yaml
name: Reusable container build

on:
  workflow_call:
    inputs:
      image_name:
        required: true
        type: string
    secrets:
      registry_token:
        required: true

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read

    steps:
      - uses: actions/checkout@v4

      - name: Run tests
        run: make test

      - name: Build image
        run: docker build -t "${{ inputs.image_name }}:${{ github.sha }}" .

      - name: Publish image
        run: |
          echo "${{ secrets.registry_token }}" | docker login registry.example.com \
            --username token --password-stdin
          docker push "${{ inputs.image_name }}:${{ github.sha }}"
```

An application repository can call it with a short workflow:

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  build:
    uses: platform-engineering/reusable-workflows/.github/workflows/container-build.yml@v1
    with:
      image_name: registry.example.com/example-service
    secrets:
      registry_token: ${{ secrets.REGISTRY_TOKEN }}
```

This is not only a reduction in YAML. Reusable workflows make it easier to:

- Standardize required checks.
- Patch shared behavior centrally.
- Apply consistent security controls.
- Reduce onboarding effort for new services.
- Review exceptions explicitly instead of discovering them accidentally.

### Do Not Recreate a Fleet of Fragile Agents

Do not treat runner selection as an afterthought. Decide early whether jobs can use GitHub-hosted runners or require self-hosted runners.

Self-hosted runners may be appropriate when builds need:

- Access to private networks.
- Internal registries or artifact systems.
- Specialized tools or large caches.
- Compliance controls that prohibit hosted execution.

Keep runner groups limited and purposeful. A collection of bespoke runners recreates the maintenance burden of legacy build agents under a different name.

### Make Credentials Boring

Separate secrets by scope:

- Repository secrets for application-specific credentials.
- Organization secrets for shared integrations.
- Environment secrets for deployment-specific values.

Use protected GitHub environments when production changes require approvals or restricted access. Avoid long-lived credentials where workload identity or short-lived authentication is available. Credentials should be scoped, rotated, and uneventful.

## Phase 3: Stop Asking CI to Operate the Cluster

A common anti-pattern is allowing CI pipelines to run imperative deployment commands directly against Kubernetes:

```bash
kubectl apply -f deployment.yaml
```

This approach makes it difficult to answer basic questions:

- Which Git commit represents the desired state?
- Did someone modify the cluster manually?
- Is the running version consistent with the repository?
- Can a developer understand deployment status without inspecting CI logs?

When CI deploys directly, the pipeline is not merely building software. It is also acting as a partially hidden operations console.

With Argo CD, the pipeline updates a Git repository and Argo CD reconciles the cluster. Git becomes the reviewable record of desired state.

A simplified Argo CD application looks like this:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: example-service
  namespace: argocd
spec:
  project: applications
  source:
    repoURL: https://github.com/example-org/deployment-config.git
    targetRevision: main
    path: environments/dev/example-service
  destination:
    server: https://kubernetes.default.svc
    namespace: example-service-dev
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

For production environments, automated synchronization may not always be appropriate. The correct policy depends on risk tolerance, approval requirements, and rollback procedures.

### Give Developers Visibility Before Giving Them Power

Role-based access should be designed deliberately:

| Role                   | Typical Permissions                                               |
| ---------------------- | ----------------------------------------------------------------- |
| Developer              | View applications, health, history, and logs where permitted      |
| Application maintainer | Trigger approved sync operations for owned applications           |
| Platform engineer      | Manage projects, repositories, policies, and shared configuration |
| Administrator          | Manage Argo CD platform settings and emergency access             |

The goal is controlled self-service. Developers should gain visibility and safe operational actions without receiving broad cluster-admin access. Often, visibility alone removes a surprising amount of friction: developers can see health, history, drift, and synchronization state without asking another team to investigate.

## Phase 4: Make Helm a Contract, Not a Queue

Helm becomes a bottleneck when one repository contains every service, environment value, and deployment rule. Application teams then depend on a centralized group for changes as routine as adjusting resources or promoting an image.

A better pattern treats the base chart as a contract. The platform team owns sensible defaults and guardrails. Application teams own the approved configuration surface for their services.

```text
platform-charts/
  charts/
    service-base/
      templates/
      values.yaml

service-repository/
  deploy/
    values-dev.yaml
    values-stage.yaml
    values-prod.yaml
```

The base chart contains governance defaults such as:

- Resource requests and limits.
- Health probes.
- Security context.
- Pod disruption budgets.
- Common labels and annotations.
- Ingress conventions.
- Observability hooks.

The application repository contains values that the service team can safely modify:

```yaml
replicaCount: 2

image:
  repository: registry.example.com/example-service
  tag: 'replace-with-release-tag'

resources:
  requests:
    cpu: 200m
    memory: 256Mi
  limits:
    cpu: 500m
    memory: 512Mi
```

Decentralized ownership should not mean unreviewed ownership. Use pull-request reviews, schema validation, policy checks, and automated Helm rendering to protect the shared platform.

```yaml
name: Validate Helm configuration

on:
  pull_request:
    paths:
      - 'deploy/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Render chart
        run: helm template example-service platform-charts/service-base -f deploy/values-dev.yaml
```

## Put the Guardrails in the Road

Modernization should reduce manual coordination while preserving guardrails. A good platform makes the safe path the easy path.

Useful controls include:

- Branch protection and required reviews.
- CODEOWNERS for sensitive deployment paths.
- Reusable GitHub Actions workflows pinned to reviewed versions.
- Argo CD projects that limit repositories, namespaces, and clusters.
- Policy checks for Kubernetes manifests.
- Pull-request validation for Helm templates and values.
- Audit trails for configuration changes and deployment history.

The distinction matters: governance should be encoded in the delivery path, not implemented as a sequence of tickets and manual approvals. Tickets can record exceptional work. They should not be the runtime of your delivery platform.

## Roll Out in Waves, Not With a Countdown Clock

The safest migration is intentionally unexciting. Use a phased rollout:

1. Assess pipelines, repositories, Kubernetes environments, and Helm structures.
2. Design reusable workflows, runner strategy, secrets handling, Argo CD projects, and the Helm ownership model.
3. Migrate a representative pilot group.
4. Validate the pilot in parallel with the existing delivery path.
5. Expand migration in waves using the reusable patterns.
6. Stabilize, document, train teams, and retire legacy infrastructure gradually.

Parallel validation is important. A green checkmark is not sufficient evidence that the migration is complete. Teams should confirm artifacts, deployment behavior, health checks, access controls, and rollback paths.

## Five Ways a Modernization Project Goes Sideways

### 1. Rebuilding Legacy Behavior Exactly

Some old pipeline steps exist only because of historical constraints. Question them before carrying them forward.

### 2. Mixing Build and Deployment Credentials

CI should publish artifacts and propose configuration changes. Argo CD should reconcile Kubernetes state. Separating these duties reduces credential exposure.

### 3. Giving Developers Broad Cluster Access

Developer self-service does not require cluster-admin permissions. Provide Argo CD visibility, scoped actions, and pull-request workflows.

### 4. Decentralizing Helm Without Guardrails

Moving values into service repositories is useful only when paired with validation and clear ownership boundaries.

### 5. Ignoring Enablement

Modernization is incomplete if internal teams cannot operate the new platform. Use real repositories and deployment scenarios for training, documentation, and hands-on exercises.

## Measure the New Operating Model

Tool installation is not the finish line. Track outcomes that reflect operational improvement:

| Area                   | Example Measures                                                                   |
| ---------------------- | ---------------------------------------------------------------------------------- |
| CI standardization     | Percentage of repositories using reusable workflows                                |
| Delivery visibility    | Percentage of Kubernetes applications visible through Argo CD                      |
| Recovery               | Time required to identify and roll back a failed deployment                        |
| Developer self-service | Number of routine changes completed through pull requests without platform tickets |
| Reliability            | Deployment success rate and recurring failure patterns                             |
| Legacy retirement      | Remaining workloads dependent on the old CI/CD system                              |

## The Real Outcome

The strongest CI/CD modernization programs are not tool swaps. They create a clearer operating model:

- GitHub Actions provides version-controlled CI workflows.
- Argo CD reconciles Kubernetes deployments from Git.
- Helm templates encode shared platform standards.
- Application teams own safe, reviewable configuration changes.
- Platform teams focus on reusable capabilities and governance.

The result is not a perfect platform. It is a delivery system that teams can understand.

That means fewer hidden steps, fewer credentials with unclear ownership, fewer routine tickets, and a much shorter path from "something failed" to "we know why."

That is what modernization is really buying.
