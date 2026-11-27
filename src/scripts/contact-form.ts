/** Contact form: accessible validation + Web3Forms submit, mailto fallback. */
type Field = HTMLInputElement | HTMLTextAreaElement;

const form = document.querySelector<HTMLFormElement>('[data-contact-form]');

if (form) {
  const status = form.querySelector<HTMLElement>('[data-status]')!;
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]')!;
  const success = document.querySelector<HTMLElement>('[data-success]');
  const required = ['name', 'email', 'message'].map((n) => form.elements.namedItem(n) as Field);
  const messages: Record<string, string> = {
    name: 'Please enter your name.',
    email: 'Please enter a valid email address.',
    message: 'Please write a short message (at least 10 characters).',
  };
  let attempted = false;

  const validate = (field: Field) => {
    const value = field.value.trim();
    let ok = value.length > 0 && field.checkValidity();
    if (field.name === 'message') ok = ok && value.length >= 10;
    if (field.name === 'email') ok = ok && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    field.setAttribute('aria-invalid', String(!ok));
    const error = form.querySelector<HTMLElement>(`[data-error-for="${field.name}"]`);
    if (error) error.textContent = ok ? '' : messages[field.name];
    return ok;
  };

  required.forEach((field) =>
    field.addEventListener('input', () => {
      if (attempted) validate(field);
    }),
  );

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    attempted = true;
    const results = required.map(validate);
    const firstInvalid = required[results.indexOf(false)];
    if (firstInvalid) {
      status.textContent = 'Please check the highlighted fields.';
      firstInvalid.focus();
      return;
    }

    const data = new FormData(form);
    if (data.get('botcheck')) return; // honeypot tripped
    const interests = data.getAll('interests').join(', ');
    const endpoint = form.dataset.endpoint ?? '';
    const email = form.dataset.email ?? '';

    if (!endpoint) {
      const body = [
        `Name: ${data.get('name')}`,
        `Email: ${data.get('email')}`,
        `Company: ${data.get('company') || '-'}`,
        `Interested in: ${interests || '-'}`,
        '',
        String(data.get('message')),
      ].join('\n');
      status.textContent = 'Opening your email app…';
      window.location.href = `mailto:${email}?subject=${encodeURIComponent('Project inquiry')}&body=${encodeURIComponent(body)}`;
      return;
    }

    submit.disabled = true;
    submit.setAttribute('aria-busy', 'true');
    status.textContent = 'Sending…';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: data.get('access_key'),
          subject: data.get('subject'),
          from_name: data.get('from_name'),
          name: data.get('name'),
          email: data.get('email'),
          company: data.get('company') || '',
          interests,
          message: data.get('message'),
          botcheck: '',
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) throw new Error(result.message || 'Request failed');
      form.hidden = true;
      if (success) {
        success.hidden = false;
        success.focus();
      }
    } catch {
      status.textContent = `Sorry, something went wrong. Please try again, or email ${email}.`;
    } finally {
      submit.disabled = false;
      submit.removeAttribute('aria-busy');
    }
  });
}
