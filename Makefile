.PHONY: setup lint format-check typecheck test build run scan-secrets ci

setup:
	npm install

lint:
	npm run lint

format-check:
	npm run format:check

typecheck:
	npm run typecheck

test:
	npm run test

build:
	npm run build

run:
	npm run dev

scan-secrets:
	@if command -v gitleaks >/dev/null 2>&1; then \
		gitleaks detect --source . -v; \
	else \
		echo "gitleaks not installed; running fallback history grep"; \
		git log --all -p -- . ':(exclude)node_modules' | grep -iE "(api[_-]?key|secret|token|password|aws_)" || true; \
	fi

ci: lint typecheck test
