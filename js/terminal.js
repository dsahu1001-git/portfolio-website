(function() {
  'use strict';

  var overlay = document.getElementById('terminal-overlay');
  var toggleBtn = document.getElementById('terminal-toggle');
  var closeBtn = document.querySelector('.terminal__close');
  var input = document.getElementById('terminal-input');
  var output = document.getElementById('terminal-output');

  if (!overlay || !input) return;

  var history = [];
  var historyIndex = -1;

  // Command registry
  var commands = {
    help: function() {
      return [
        '<span class="terminal__highlight">Available commands:</span>',
        '',
        '  <span class="terminal__highlight">about</span>       — Who is Deepak?',
        '  <span class="terminal__highlight">skills</span>      — Technical skills & tools',
        '  <span class="terminal__highlight">experience</span>  — Work history',
        '  <span class="terminal__highlight">projects</span>    — Things I\'ve built',
        '  <span class="terminal__highlight">awards</span>      — Awards & recognition',
        '  <span class="terminal__highlight">contact</span>     — Get in touch',
        '  <span class="terminal__highlight">education</span>   — Education & certs',
        '',
        '  <span class="terminal__highlight">ls</span>          — List available files',
        '  <span class="terminal__highlight">cat [file]</span>  — Read a file',
        '  <span class="terminal__highlight">whoami</span>      — Who are you?',
        '  <span class="terminal__highlight">pwd</span>         — Current directory',
        '  <span class="terminal__highlight">clear</span>       — Clear terminal',
        '  <span class="terminal__highlight">exit</span>        — Close terminal',
        '',
        '  <span class="terminal__highlight">kubectl get experience</span>  — K8s style!',
        '  <span class="terminal__highlight">sudo</span>        — Nice try ;)',
      ].join('\n');
    },

    about: function() {
      return [
        '<span class="terminal__highlight">Deepak Kumar Sahu</span>',
        'Senior Engineering Manager | DevOps, Cloud, Platform & Observability',
        '',
        'Founding DevOps hire at Storable India GCC.',
        'Built the entire DevOps function from scratch.',
        '13+ years driving cloud infrastructure at scale.',
        '',
        'Currently managing 20+ products, 60+ K8s clusters,',
        'and 1,200+ workloads on AWS.',
        '',
        'Philosophy: Infrastructure should be invisible.',
        'Developers should ship code, not fight tooling.',
      ].join('\n');
    },

    skills: function() {
      return [
        '<span class="terminal__highlight">Cloud & Platform:</span>  AWS, GCP, Azure, EKS, Terraform, Karpenter',
        '<span class="terminal__highlight">Containers:</span>       Kubernetes, Docker, Istio, DAPR, Helm',
        '<span class="terminal__highlight">GitOps & CI/CD:</span>   ArgoCD, GitLab CI, Jenkins, Azure DevOps',
        '<span class="terminal__highlight">Observability:</span>    Grafana Cloud, Mimir, Loki, Tempo, Prometheus',
        '<span class="terminal__highlight">Security:</span>         External Secrets, Snyk, CrowdStrike, Cert-Manager',
        '<span class="terminal__highlight">AI & Automation:</span>  GitHub Copilot, Claude Code, Glean, N8N, Ollama',
        '<span class="terminal__highlight">Data:</span>             PostgreSQL, Redis, AWS DMS, Redshift, Athena',
        '<span class="terminal__highlight">Leadership:</span>       Team building, M&A, vendor mgmt, OKR alignment',
      ].join('\n');
    },

    experience: function() {
      return [
        '<span class="terminal__highlight">Storable India Pvt Ltd</span> — Senior Engineering Manager',
        '  Aug 2023 - Present | Hyderabad',
        '  20+ products, 60+ EKS clusters, IDP, ArgoCD, Grafana migration',
        '',
        '<span class="terminal__highlight">Jio Platform Limited</span> — DevOps Manager',
        '  Mar 2021 - Jul 2023 | Hyderabad',
        '  IPL live streaming infra, Azure-to-GCP migration in 3 months',
        '',
        '<span class="terminal__highlight">EPAM Systems</span> — Senior Systems Engineer',
        '  Sep 2018 - Mar 2021 | Hyderabad',
        '  Jenkins pipelines, 70+ apps onboarded, Terraform, AWS Direct Connect',
        '',
        '<span class="terminal__highlight">Mindtree Ltd</span> — Senior Engineer',
        '  May 2013 - Sep 2018 | Hyderabad',
        '  Azure production ops with Microsoft, trained 150+ engineers',
      ].join('\n');
    },

    projects: function() {
      return [
        '<span class="terminal__highlight">1. Internal Developer Platform (IDP)</span>',
        '   Rails 8, 130+ projects, 1200+ workloads, RBAC workflows',
        '',
        '<span class="terminal__highlight">2. ArgoCD Omnibus</span>',
        '   68 ApplicationSets, 12 realms, 60+ clusters, GitOps control plane',
        '',
        '<span class="terminal__highlight">3. Grafana Observability Migration</span>',
        '   Datadog to Grafana Cloud (Mimir + Loki + Tempo), 60+ clusters',
        '',
        '<span class="terminal__highlight">4. AI Code Review Bot ("Storable Steve")</span>',
        '   Claude + Bedrock, automated MR reviews with Jira context',
      ].join('\n');
    },

    awards: function() {
      return [
        '<span class="terminal__highlight">Storable Core Value Award</span> — Cross-team collaboration',
        '<span class="terminal__highlight">Jio Star Award</span> — Ownership mindset on large-scale engagements',
        '<span class="terminal__highlight">EPAM Hackathon Runner-up</span> — Blue-green deployment strategy',
        '<span class="terminal__highlight">Mindtree Triple Recognition</span> — Outstanding Performer x3, Pillar Award, Master Mind',
      ].join('\n');
    },

    contact: function() {
      return [
        '<span class="terminal__highlight">Email:</span>    hello@deepaksahu.dev',
        '<span class="terminal__highlight">LinkedIn:</span> linkedin.com/in/dsahu1001',
        '<span class="terminal__highlight">GitHub:</span>   github.com/dsahu1001',
        '<span class="terminal__highlight">Web:</span>      deepaksahu.dev',
      ].join('\n');
    },

    education: function() {
      return [
        '<span class="terminal__highlight">B.Tech — Computer Science</span>',
        'BPUT, Odisha — 2012',
        '',
        '<span class="terminal__highlight">Certifications:</span>',
        '  Diploma in Management — EPAM',
        '  6 Critical Practices for Leading a Team — FranklinCovey',
        '  Azure Infrastructure Solutions (70-533)',
        '  Azure Solution Architect (70-535)',
      ].join('\n');
    },

    ls: function() {
      return 'about.txt  skills.txt  experience.txt  projects.txt  awards.txt  contact.txt  education.txt';
    },

    cat: function(args) {
      if (!args || !args.length) return 'Usage: cat <filename>';
      var file = args[0].replace('.txt', '');
      if (commands[file]) return commands[file]();
      return 'cat: ' + args[0] + ': No such file or directory';
    },

    whoami: function() {
      return 'visitor — Welcome to deepaksahu.dev!';
    },

    pwd: function() {
      return '/home/visitor/deepaksahu.dev';
    },

    clear: function() {
      output.innerHTML = '';
      return '';
    },

    exit: function() {
      closeTerminal();
      return 'Goodbye!';
    },

    sudo: function() {
      return 'Nice try! You don\'t have sudo access on this portfolio. But you can try "help" instead.';
    },

    kubectl: function(args) {
      if (args && args.join(' ') === 'get experience') {
        return [
          'NAME                  ROLE                          COMPANY     AGE',
          'storable-india        Senior Engineering Manager    Storable    2y+',
          'jio-platform          DevOps Manager                Jio         2y4m',
          'epam-systems          Senior Systems Engineer       EPAM        2y6m',
          'mindtree-ltd          Senior Engineer               Mindtree    5y4m',
        ].join('\n');
      }
      if (args && args[0] === 'get') {
        return 'NAME                  STATUS    CLUSTERS    WORKLOADS\n' +
               'deepak-sahu           Active    60+         1200+';
      }
      return 'error: unknown command "' + (args ? args.join(' ') : '') + '". Try "kubectl get experience"';
    },

    docker: function() {
      return 'CONTAINER ID   IMAGE              STATUS    NAMES\n' +
             'ds2023         storable/devops    Running   career-current\n' +
             'ds2021         jio/platform       Exited    career-previous';
    },

    neofetch: function() {
      return [
        '       ___       <span class="terminal__highlight">deepak@portfolio</span>',
        '      (.. |      ————————————————',
        '      (<> |      <span class="terminal__highlight">OS:</span> DevOps Manager v13+',
        '     / __  \\     <span class="terminal__highlight">Host:</span> Storable India GCC',
        '    ( /  \\ /|    <span class="terminal__highlight">Kernel:</span> Kubernetes 1.30',
        '   _/\\ __)/_)    <span class="terminal__highlight">Uptime:</span> 13+ years',
        '   \\/-____\\/     <span class="terminal__highlight">Clusters:</span> 60+',
        '                 <span class="terminal__highlight">Workloads:</span> 1,200+',
        '                 <span class="terminal__highlight">Shell:</span> bash/zsh',
      ].join('\n');
    },

    secret: function() {
      return 'Games are coming soon! Stay tuned at deepaksahu.dev/games';
    },
  };

  // Process command
  function processCommand(cmdString) {
    var parts = cmdString.trim().split(/\s+/);
    var cmd = parts[0].toLowerCase();
    var args = parts.slice(1);

    // Add command line to output
    var cmdLine = document.createElement('div');
    cmdLine.className = 'terminal__line terminal__line--command';
    cmdLine.textContent = cmdString;
    output.appendChild(cmdLine);

    // Execute
    var result = '';
    if (commands[cmd]) {
      result = commands[cmd](args);
    } else if (cmdString.trim() === '') {
      result = '';
    } else {
      result = 'command not found: ' + cmd + '. Type <span class="terminal__highlight">help</span> for available commands.';
    }

    if (result) {
      var resultLine = document.createElement('div');
      resultLine.className = 'terminal__line';
      resultLine.innerHTML = result;
      output.appendChild(resultLine);
    }

    // Scroll to bottom
    var termBody = document.getElementById('terminal-body');
    termBody.scrollTop = termBody.scrollHeight;
  }

  // Open / close
  function openTerminal() {
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    input.focus();
  }

  function closeTerminal() {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
  }

  toggleBtn.addEventListener('click', openTerminal);
  closeBtn.addEventListener('click', closeTerminal);

  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeTerminal();
  });

  // Input handling
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      var cmd = input.value;
      if (cmd.trim()) {
        history.push(cmd);
        historyIndex = history.length;
      }
      processCommand(cmd);
      input.value = '';
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = history[historyIndex];
      }
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        input.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        input.value = '';
      }
    }

    if (e.key === 'Escape') {
      closeTerminal();
    }
  });

  // Keyboard shortcut: Ctrl+` to toggle
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === '`') {
      e.preventDefault();
      if (overlay.classList.contains('active')) {
        closeTerminal();
      } else {
        openTerminal();
      }
    }
  });

  // Click terminal body to focus input
  document.querySelector('.terminal__body').addEventListener('click', function() {
    input.focus();
  });
})();
