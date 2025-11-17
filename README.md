<p align="center">
  <img width="128" height="128" src="https://github.com/athaapa/axis/blob/main/images/axis.png" alt="Axis logo">

  <h1 align="center"><b>Axis</b></h1>
  <p align="center">3D graphing calculator with AI-powered problem solving.</p>
</p>

Axis is a 3D graphing calculator for multivariable calculus. It lets you visualize surfaces, vectors, and equations in 3D.

**What this repo contains**
- **Project:** A Next.js frontend and visualization utilities under `src/`.

**Requirements**
- **Node:** Recommended `>= 18.x`.
- **Package manager:** `pnpm` (this repo includes `pnpm-lock.yaml`).

**Quick Setup**

- Install dependencies:

```bash
pnpm install
```

- Run the development server:

```bash
pnpm dev
```

- Build for production:

```bash
pnpm build
pnpm start
```

**Helpful Scripts**
- **Lint / format:** If available in `package.json`, run `pnpm lint` and `pnpm format`.
- **Type check:** `pnpm tsc --noEmit` (if TypeScript scripts are configured).

**Notes for contributors**
- The LaTeX → math parsing and validation logic is in `src/lib/math.tsx`.
  - The validator currently accepts only equations of the form `left = right`.
  - Free variables are restricted to `x` and `y`.
  - Common math function names such as `sin`, `cos`, `tan`, `ln`, and `sqrt` are allowed.
- There is a known TypeScript index-typing warning in `src/lib/math.tsx` related to `lookupTable` indexing; this is tracked separately.

**How to contribute**
- Fork, create a feature branch, and open a PR. Provide a clear description and, where applicable, screenshots or tests.

**License & credits**
- Check `package.json` for license information.
- Icons credited to Freepik / Flaticon.

If you'd like a more detailed developer guide (debugging tips, component architecture, test examples), tell me which sections to expand and I'll add them.
<p align="center">
  <p align="center">
	<img width="128" height="128" src="https://github.com/athaapa/axis/blob/6b74df22d1ce3f398cec4de458c2f6bfd7aa7b0a/images/axis.png" alt="Logo">
  </p>

  <h1 align="center"><b>Axis</b></h1>
  <p align="center">
     3D graphing calculator with AI-powered problem solving.
    <br />
    <a href="https://www.flaticon.com/free-icons/axis" title="axis icons">Axis icons created by Freepik - Flaticon</a>
  </p>
</p>

**Axis** is a 3D graphing calculator made for multivariable calculus. It lets you visualize surfaces, vectors, and equations in 3D.

