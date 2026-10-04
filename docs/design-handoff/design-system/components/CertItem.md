# CertItem

One row in the Certifications list: name, issuer · year, and a Verify ↗ link.

- Provide `name`, `issuer`, `year`, optional `verifyUrl`. No `verifyUrl` → no link at all (never a disabled one).
- Wrap in `<ul class="am-certs">`. Newest first.
