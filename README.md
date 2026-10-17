# openbeast-releases

Two things live here:

- **The repository files are the official website** at <https://openbeast.app>, deployed by the Vercel project `tigerspace/openbeast-site` on every push to `main`. Static files only, no build step.
- **The GitHub Releases hold the macOS installers** (DMG for first installs, ZIP plus `latest-mac.yml` for in-app updates), uploaded by OpenBeast's "Build DMG → publish" flow.

## Stable addresses (do not change)

Installed copies of OpenBeast have these addresses compiled in, so changing or removing them breaks updates for everyone already installed. To move the files elsewhere, change only the `destination` in `vercel.json`.

| Address | Redirects to | Used by |
| --- | --- | --- |
| `https://openbeast.app/update/<file>` | the file in the latest release | the in-app updater (`latest-mac.yml`, the update ZIP) |
| `https://openbeast.app/download` | `OpenBeast-arm64.dmg` in the latest release | the website's download button and the "update failed" fallback |

Each release must therefore include an asset named exactly `OpenBeast-arm64.dmg` (a stable-named copy of the versioned DMG).

The OpenBeast web version moved to <https://app.openbeast.app> (Vercel project `tigerspace/openbeast-web`).
