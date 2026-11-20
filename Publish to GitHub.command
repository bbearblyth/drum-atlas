#!/bin/bash
# Drum Atlas: create the GitHub repo, push the site and switch on GitHub Pages.
# Double-click to run (first time: right-click > Open, because macOS blocks downloaded scripts).
set -e
REPO="drum-atlas"
cd "$(dirname "$0")"

echo "== Drum Atlas: publish to GitHub =="

# 1. GitHub CLI
if ! command -v gh >/dev/null 2>&1; then
  if command -v brew >/dev/null 2>&1; then
    echo "Installing the GitHub CLI (gh) with Homebrew..."
    brew install gh
  else
    echo "Homebrew isn't installed. Install it from https://brew.sh then run this again."
    read -n 1 -s -r -p "Press any key to close."; exit 1
  fi
fi

# 2. Sign in (opens your browser the first time)
if ! gh auth status >/dev/null 2>&1; then
  echo "Signing in to GitHub. Choose: GitHub.com > HTTPS > Login with a web browser."
  gh auth login --hostname github.com --git-protocol https --web
fi
gh auth setup-git >/dev/null 2>&1 || true
OWNER="$(gh api user -q .login)"
echo "Signed in as $OWNER"

# 3. Commit
if [ ! -d .git ]; then
  git init -q
  git checkout -q -b main 2>/dev/null || git branch -M main
fi
git add -A
git -c user.name="$OWNER" -c user.email="$OWNER@users.noreply.github.com" commit -q -m "Drum Atlas" || echo "(nothing new to commit)"

# 4. Create the repo and push (or just push if it already exists)
if gh repo view "$OWNER/$REPO" >/dev/null 2>&1; then
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$OWNER/$REPO.git"
  git push -u origin main
else
  gh repo create "$REPO" --public --source=. --remote=origin --push \
    --description "Drum patterns from many genres and cultures as circular Euclidean rhythm diagrams. BB DSP."
fi

# 5. GitHub Pages from main / root
gh api -X POST "repos/$OWNER/$REPO/pages" -f "source[branch]=main" -f "source[path]=/" >/dev/null 2>&1 \
  || gh api -X PUT "repos/$OWNER/$REPO/pages" -f "source[branch]=main" -f "source[path]=/" >/dev/null 2>&1 || true

URL="https://$OWNER.github.io/$REPO/"
echo ""
echo "Done. Repo:  https://github.com/$OWNER/$REPO"
echo "Site:  $URL  (allow a minute or two for the first build)"
open "https://github.com/$OWNER/$REPO" 2>/dev/null || true
read -n 1 -s -r -p "Press any key to close."
