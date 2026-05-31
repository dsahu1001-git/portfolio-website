import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowRight,
  Award,
  Bot,
  BriefcaseBusiness,
  CloudCog,
  Gauge,
  Network,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Work',
  description:
    'Career portfolio for Deepak Kumar Sahu: platform engineering leadership, Kubernetes, cloud migrations, observability, FinOps, and global team building.',
  path: '/work',
});

const metrics = [
  ['13+', 'Years in engineering'],
  ['100+', 'Kubernetes clusters'],
  ['1,200+', 'Production workloads'],
  ['20+', 'Products supported'],
  ['150+', 'Engineers trained'],
  ['30%+', 'Monthly cost reduction'],
];

const caseStudies = [
  {
    icon: Network,
    title: 'Internal Developer Platform',
    description:
      'Defined the architecture for a Rails-backed single pane of glass across 130+ projects and 1,200+ workloads, with real-time AWS and Kubernetes inventory, RBAC release workflows, security visibility, and right-sizing recommendations.',
    tags: ['Platform Engineering', 'Kubernetes', 'AWS', 'Prometheus'],
  },
  {
    icon: CloudCog,
    title: 'GitOps Control Plane',
    description:
      'Architected an ArgoCD app-of-apps model with 68 ApplicationSets across 12 product realms and 6 environment types, using label-based cluster targeting and layered Helm overrides.',
    tags: ['ArgoCD', 'Helm', 'Kustomize', 'GitOps'],
  },
  {
    icon: Gauge,
    title: 'Observability Migration',
    description:
      'Led the move from Datadog to Grafana Cloud across 60+ clusters and 20+ products, covering Mimir metrics, Loki logs, Tempo traces, dashboards, synthetic monitoring, and escalation policies.',
    tags: ['Grafana Cloud', 'Mimir', 'Loki', 'Tempo'],
  },
  {
    icon: Bot,
    title: 'AI Code Review Bot',
    description:
      'Built an LLM-powered CI/CD reviewer using Claude via AWS Bedrock and Jira context for merge-request feedback, security checks, and engineering standards.',
    tags: ['Claude', 'Bedrock', 'GitLab CI', 'Jira'],
  },
];

const roles = [
  {
    title: 'Senior Engineering Manager',
    company: 'Storable India',
    range: 'Aug 2023 - Present',
    summary:
      'Founding DevOps hire for the India GCC. Built and scaled DevOps, SRE, platform engineering, and observability capabilities for a multi-product portfolio.',
    highlights: [
      'Lead DevOps operations across 20+ products and 100+ Kubernetes clusters spanning payments, property management, and marketplace verticals.',
      'Drove Azure-to-AWS and GCP-to-AWS migrations with minimal downtime, including modernization of long-lived legacy systems.',
      'Established FinOps practices, automated right-sizing recommendations, and tooling migrations that achieved 30%+ month-over-month cost reduction.',
      'Manage cross-cultural teams across Australia, APAC, Europe, and the US while mentoring interns and developing future full-time hires.',
      'Own service-mesh, incident-management, vendor-assessment, security-review, and M&A infrastructure-integration programs.',
    ],
  },
  {
    title: 'DevOps Manager',
    company: 'Jio Platform Limited',
    range: 'Mar 2021 - Jul 2023',
    summary:
      'Led cloud infrastructure, reliability, and governance programs for large-scale consumer workloads.',
    highlights: [
      "Designed cloud infrastructure for IPL live streaming, one of India's highest-traffic digital events.",
      'Led an Azure-to-GCP migration within 3 months with zero customer-facing downtime after a strategic partnership change.',
      'Built enterprise monitoring, alerting, security, and incident-management systems across multi-subscription cloud environments.',
      'Automated database and cluster-management workflows for scaling, self-healing, and resource optimization.',
    ],
  },
  {
    title: 'Senior Systems Engineer',
    company: 'EPAM Systems',
    range: 'Sep 2018 - Mar 2021',
    summary:
      'Standardized delivery workflows for enterprise application teams across AWS and hybrid-cloud environments.',
    highlights: [
      'Built Jenkins pipelines and Groovy shared libraries that onboarded 70+ applications into a common delivery model.',
      'Reduced pipeline setup from weeks to hours by centralizing scripts and unifying branching strategies.',
      'Added SonarQube quality gates, Terraform-based AWS infrastructure, AWS Direct Connect, and Octopus Deploy automation.',
    ],
  },
  {
    title: 'Senior Engineer',
    company: 'Mindtree Ltd',
    range: 'May 2013 - Sep 2018',
    summary:
      'Built the production-operations foundation that shaped a career in reliability and platform engineering.',
    highlights: [
      'Worked alongside Microsoft FTEs on Windows Azure production-cluster operations across Fabric, Storage, and RDFE services.',
      'Served as SME for Active Directory, DNS, and DHCP, while automating monitoring, log analysis, and incident routing.',
      'Created Power BI capacity dashboards used in executive war rooms and trained 150+ engineers on Azure certification paths.',
    ],
  },
];

const skillGroups = [
  [
    'Cloud & Platform',
    'AWS',
    'EKS',
    'GCP',
    'Azure',
    'Terraform',
    'Karpenter',
    'KEDA',
  ],
  [
    'Containers & GitOps',
    'Kubernetes',
    'Docker',
    'Istio',
    'ArgoCD',
    'Argo Rollouts',
    'Helm',
    'Kustomize',
  ],
  [
    'Observability',
    'Grafana Cloud',
    'Prometheus',
    'Mimir',
    'Loki',
    'Tempo',
    'Grafana OnCall',
  ],
  [
    'Security & Reliability',
    'External Secrets',
    'Snyk',
    'CrowdStrike',
    'Cert-Manager',
    'Incident Management',
    'SLA Tracking',
  ],
  [
    'Data & Automation',
    'PostgreSQL',
    'Redis',
    'AWS DMS',
    'Jenkins',
    'GitLab CI',
    'Python',
    'N8N',
  ],
  [
    'Leadership',
    'Team Building',
    'Hiring',
    'Mentoring',
    'FinOps',
    'Vendor Management',
    'M&A Integration',
    'OKRs',
  ],
];

const recognition = [
  ['Storable Core Value Award', 'Cross-team collaboration'],
  ['Jio Star Award', 'Ownership on large-scale engagements'],
  ['EPAM Hackathon Runner-up', 'Blue-green deployment strategy'],
  [
    'Mindtree Recognition',
    'Outstanding Performer, Pillar Award, and Master Mind Award',
  ],
];

export default function WorkPage() {
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8 lg:py-20">
          <div>
            <p className="font-mono text-sm text-primary">Career portfolio</p>
            <h1 className="mt-3 max-w-4xl font-heading text-4xl font-bold tracking-tight sm:text-5xl">
              Platform engineering leadership from production operations to
              global-scale enablement.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
              I build reliable platforms, teams, and operating models that let
              product engineers ship without fighting infrastructure. My
              experience spans Kubernetes, multi-cloud migrations, GitOps,
              observability, FinOps, incident management, and developer
              experience.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild href="/contact">
                Start a conversation{' '}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                asChild
                href="mailto:hello@deepaksahu.dev"
                variant="outline"
              >
                Email directly
              </Button>
            </div>
          </div>
          <aside className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <BriefcaseBusiness
                className="h-5 w-5 text-primary"
                aria-hidden="true"
              />
              <h2 className="font-heading text-lg font-bold">
                Recruiter snapshot
              </h2>
            </div>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
              <li>
                Senior Engineering Manager with 13+ years in cloud and platform
                engineering.
              </li>
              <li>
                Built the DevOps function for Storable India GCC from the ground
                up.
              </li>
              <li>
                Led distributed teams and programs across APAC, Australia,
                Europe, and the US.
              </li>
              <li>
                Experienced across AWS, GCP, Azure, Kubernetes, observability,
                and FinOps.
              </li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="font-mono text-sm text-primary">Impact at scale</p>
        <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight">
          The numbers behind the work
        </h2>
        <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3 lg:grid-cols-6">
          {metrics.map(([value, label]) => (
            <div className="bg-card p-5" key={label}>
              <dt className="font-heading text-3xl font-bold text-primary">
                {value}
              </dt>
              <dd className="mt-2 text-sm text-muted-foreground">{label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="font-mono text-sm text-primary">Selected programs</p>
        <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight">
          Systems I have helped build and scale
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {caseStudies.map((study) => {
            const Icon = study.icon;
            return (
              <Card className="h-full hover:shadow-md" key={study.title}>
                <CardHeader>
                  <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
                  <h3 className="mt-4 font-heading text-2xl font-bold">
                    {study.title}
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {study.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {study.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="font-mono text-sm text-primary">Experience</p>
        <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight">
          Career progression
        </h2>
        <div className="mt-8 space-y-5">
          {roles.map((role) => (
            <article
              className="rounded-xl border border-border bg-card p-5 sm:p-6"
              key={role.company}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-heading text-2xl font-bold">
                    {role.title}
                  </h3>
                  <p className="mt-1 font-semibold text-primary">
                    {role.company}
                  </p>
                </div>
                <p className="font-mono text-xs text-muted-foreground">
                  {role.range}
                </p>
              </div>
              <p className="mt-4 max-w-4xl text-sm leading-6 text-muted-foreground">
                {role.summary}
              </p>
              <ul className="mt-5 grid gap-3 lg:grid-cols-2">
                {role.highlights.map((highlight) => (
                  <li
                    className="flex gap-3 rounded-lg border border-border p-3 text-sm leading-6 text-muted-foreground"
                    key={highlight}
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.25fr_0.75fr] lg:px-8">
        <div>
          <p className="font-mono text-sm text-primary">Technical breadth</p>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight">
            Tools are useful. Outcomes matter more.
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {skillGroups.map(([title, ...skills]) => (
              <div
                className="rounded-xl border border-border bg-card p-5"
                key={title}
              >
                <h3 className="font-heading text-lg font-bold">{title}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="font-mono text-sm text-primary">Leadership profile</p>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight">
            How I tend to operate
          </h2>
          <div className="mt-8 space-y-4">
            {[
              {
                icon: Users,
                title: 'Build teams',
                description:
                  'Hiring, mentoring, internships, and cross-cultural collaboration.',
              },
              {
                icon: ShieldCheck,
                title: 'Design for reliability',
                description:
                  'Incident systems, security reviews, compliance, and resilient rollout patterns.',
              },
              {
                icon: Gauge,
                title: 'Balance value and cost',
                description:
                  'FinOps, vendor evaluation, right-sizing, and pragmatic platform investment.',
              },
            ].map(({ icon: Icon, title, description }) => (
              <div
                className="rounded-xl border border-border bg-card p-5"
                key={title}
              >
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="mt-3 font-heading text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-xl border border-border bg-card p-6 md:grid-cols-[1fr_1.15fr]">
          <div>
            <div className="flex items-center gap-3">
              <Award className="h-6 w-6 text-accent" aria-hidden="true" />
              <h2 className="font-heading text-2xl font-bold">Recognition</h2>
            </div>
            <ul className="mt-5 space-y-3">
              {recognition.map(([title, description]) => (
                <li key={title}>
                  <p className="font-semibold">{title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold">
              Credentials and focus areas
            </h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                'Diploma in Management - EPAM',
                'FranklinCovey: 6 Critical Practices for Leading a Team',
                'Azure Infrastructure Solutions (70-533)',
                'Azure Solution Architect (70-535)',
                'AI Champion - India GCC',
              ].map((credential) => (
                <Badge key={credential}>{credential}</Badge>
              ))}
            </div>
            <p className="mt-6 text-sm leading-6 text-muted-foreground">
              My working philosophy: infrastructure should become invisible
              enough that developers can focus on shipping products, while
              platform teams keep reliability, security, and cost visible.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="font-mono text-sm text-primary">Let&apos;s connect</p>
        <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight">
          Looking for a platform engineering leader who stays close to the work?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          I am always open to thoughtful conversations around engineering
          leadership, cloud platforms, developer experience, and reliability at
          scale.
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild href="/contact">
            Get in touch{' '}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Or reach me directly at{' '}
          <Link
            className="font-semibold text-primary hover:underline"
            href="mailto:hello@deepaksahu.dev"
          >
            hello@deepaksahu.dev
          </Link>
        </p>
      </section>
    </>
  );
}
