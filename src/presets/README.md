## 🧩 Presets by example

Presets are small, pure functions that transform an `AssetRef`.

They are meant to encode **intent**, not infrastructure.

This section documents presets **by example**, which is the recommended way
to understand and extend `cdnkit`.

---

### Example 1 — Multi-project dev CDN (namespaced assets)

**Goal**

```
https://<owner>.github.io/<repo>/<project>/assets/hero/f-prec.png?v=build-42
```

**Preset**

```ts
const presets = {
  "dev:neptune": devCdnPreset("neptune", {
    query: { v: "build-42" }
  })
};
```

**Usage**

```ts
resolveAsset(
  { ...asset("hero/f-prec.png"), preset: "dev:neptune" },
  cdn,
  presets
);
```

---

### Example 2 — Same CDN, different project

```ts
const presets = {
  "dev:apollo": devCdnPreset("apollo", {
    query: { v: "build-42" }
  })
};

resolveAsset(
  { ...asset("icons/logo.svg"), preset: "dev:apollo" },
  cdn,
  presets
);
```

**Result**

```
.../apollo/assets/icons/logo.svg?v=build-42
```

---

### Example 3 — Cache-busting only

**Intent:** keep paths stable, bust cache on deploy.

```ts
const cacheBust: AssetPreset = (ref) => ({
  ...ref,
  query: { ...(ref.query ?? {}), v: BUILD_ID }
});
```

```ts
resolveAsset(
  cacheBust(asset("people/a.jpg")),
  cdn
);
```

---

### Example 4 — Logical variants (no CDN magic)

**Intent:** same asset, different variant folders.

```ts
const presets = {
  thumb: (ref) => ({ ...ref, prefix: "thumbs/" }),
  hero:  (ref) => ({ ...ref, prefix: "hero/" })
};
```

```ts
resolveAsset(
  { ...asset("a.jpg"), preset: "thumb" },
  cdn,
  presets
);
```

---

### Example 5 — Data vs image assets

```ts
const presets = {
  image: (ref) => ({ ...ref, prefix: "assets/img/" }),
  data:  (ref) => ({ ...ref, prefix: "assets/data/" })
};
```

```ts
resolveAsset(
  { ...asset("people.json"), preset: "data" },
  cdn,
  presets
);
```

---

### Example 6 — Composing presets manually

Presets are just functions — they can be composed.

```ts
const withProject = devCdnPreset("neptune");

const cacheBust: AssetPreset = (ref) => ({
  ...ref,
  query: { v: BUILD_ID }
});

const ref =
  cacheBust(
    withProject(
      asset("hero/f-prec.png")
    )
  );

resolveAsset(ref, cdn);
```

---

## Notes (by design)

- Presets do **not** fetch, proxy, resize, or sign anything.
- Presets do **not** depend on the CDN provider.
- Presets express **intent** ("dev", "thumb", "data"), not transport.
- If you can explain a preset in one sentence, it belongs here.

If not, it probably belongs in infrastructure, not in `cdnkit`.
