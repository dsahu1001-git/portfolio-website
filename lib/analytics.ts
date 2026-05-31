interface AnalyticsEvent {
  name: string;
  payload?: Record<string, string | number | boolean>;
}

export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent('brand:analytics', { detail: event }));
}
