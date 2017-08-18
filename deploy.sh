npm run build
cp README.md dist/README.md
cd dist/
git init
git add -A
git commit -m 'update site'
git push -f git@github.com:MoeFE/Lyric.git master:gh-pages
