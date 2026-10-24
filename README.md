# openbeast-releases

Two things live here:

- **The repository files are the official website** at <https://openbeast.app>, deployed by the Vercel project `tigerspace/openbeast-site` on every push to `main`. Static files only, no build step.
  The pages (`index.html` in English, `zh.html` in Chinese, `privacy.html`, `terms.html`, `404.html`, `home.css`, `home.js`, `style.css`, `icon.png`, `site-version.json`) are generated from `remote/site` in [oktiger/openbeast](https://github.com/oktiger/openbeast), the same files as <https://openbeast.cn>, by `node remote/server/deploy/deploy-global-site.mjs` there. Change them in that repository and publish again; edits made here are overwritten. `vercel.json`, `README.md` and `logo.png` belong to this repository.
- **The GitHub Releases hold the macOS installers** (DMG for first installs, ZIP plus `latest-mac.yml` for in-app updates), uploaded by OpenBeast's "Build DMG → publish" flow.

## Stable addresses (do not change)

Installed copies of OpenBeast have these addresses compiled in, so changing or removing them breaks updates for everyone already installed. To move the files elsewhere, change only the `destination` in `vercel.json`.

| Address | Redirects to | Used by |
| --- | --- | --- |
| `https://openbeast.app/update/<file>` | the file in the latest release | the in-app updater (`latest-mac.yml`, the update ZIP) |
| `https://openbeast.app/download` | `OpenBeast-arm64.dmg` in the latest release | the website's "Apple 芯片" (Apple silicon) button and the "update failed" fallback |
| `https://openbeast.app/download/intel` | `OpenBeast-x64.dmg` in the latest release | the website's "Intel 芯片" (Intel chip) button |

Each release must therefore include assets named exactly `OpenBeast-arm64.dmg` and `OpenBeast-x64.dmg` (stable-named copies of the versioned DMGs), plus one `latest-mac.yml` listing both update ZIPs (`OpenBeast-<version>-arm64-mac.zip` and `OpenBeast-<version>-x64-mac.zip`); the in-app updater picks the one for its CPU. There is no Universal build. Until a release contains `OpenBeast-x64.dmg`, the website shows the Intel button as unavailable instead of linking to a missing file.

The OpenBeast web version moved to <https://app.openbeast.app> (Vercel project `tigerspace/openbeast-web`).
