# cdnkit

`cdnkit` is a tiny, opinionated library for **deterministic asset URL addressing**.

It does **not** serve files, proxy requests, or manage infrastructure.
It only **builds URLs** — in a predictable, explicit, and extensible way.

---

## 🧠 Mental model

`cdnkit` operates at two clearly separated levels.

### **Level 1 — URL rewriting**
> `string → string`

- deterministic
- stateless
- no runtime
- no secrets
- no network calls

Typical use cases:
- local paths
- GitHub Pages
- jsDelivr (GitHub repositories)
- raw.githubusercontent.com

### **Level 2 — Asset composition**
> `string → AssetRef → string`

- prefixes / suffixes
- variants / presets
- query parameters
- cache‑busting
- future extensibility (images, bundles, etc.)

---

## ✅ Providers included in the library

Only services exposing **stable, well‑defined URL models** are included.

These are *addressable*, not *configurable*.

### GitHub Pages

```
https://<owner>.github.io/<repo>/<path>
```

Supported via a dedicated adapter.

---

### jsDelivr (GitHub repositories)

```
https://cdn.jsdelivr.net/gh/<owner>/<repo>@<ref>/<path>
```

Supports tags, branches, and commit SHAs.

---

### GitHub raw content

```
https://raw.githubusercontent.com/<owner>/<repo>/<ref>/<path>
```

Useful for JSON, Markdown, CSV, and other non‑image assets.

---

## 📘 Hosting platforms documented (but not adapted)

Some platforms **do not define a specific URL model**.
They simply expose files behind a base URL.

For these, **no adapter is required**.

### Netlify

```
https://<site>.netlify.app/<path>
https://assets.example.com/<path>
```

Usage:

```ts
import { cdn } from "cdnkit";

cdn("assets/logo.png", {
  base: "https://my-site.netlify.app"
});
```

This also applies to:
- deploy previews
- custom domains
- Netlify Edge CDN

There is no additional URL logic to encode.

---

### Cloudflare Pages, Vercel, and similar platforms

These platforms expose assets as:

```
<base-url> + <path>
```

They do **not** introduce:
- versioned URLs
- variant semantics
- URL‑level transforms

They are **origins**, not **URL models**.

Documented usage is sufficient.

---

## 🚫 Why some services are not included as adapters

### Cloudflare (R2, Pages, Workers)

Cloudflare is **not just a CDN**.

It is a distributed **reverse proxy platform**, including:
- routing
- runtime logic
- cache decisions
- optional compute

Even when used for static assets, the URL alone does **not**
fully describe the resulting response.

This places Cloudflare **outside the scope** of `cdnkit`.

---

### Signed object storage (S3, GCS, R2 signed URLs)

Signed URLs require:
- secrets
- cryptography
- runtime clocks

`cdnkit` is intentionally **dumb**:
- no crypto
- no signing
- no request‑time decisions

Such URLs may be *composed*, but not *generated*, by this library.

---

## 🎯 Design principle (important)

> **If a service can be expressed as a pure function**  
> from `(path, options) → URL`, it belongs in `cdnkit`.

> **If it requires infrastructure, runtime logic, secrets, or request‑time decisions, it does not.**

This boundary is intentional and enforced.

---

## 🧩 Extensibility

If a service later introduces:
- deterministic URL‑level variants
- stable public addressing schemes
- pure, declarative URL transforms

…it may qualify for inclusion.

Until then, the core `cdn()` resolver and Level 2 asset composition
are sufficient and preferred.
