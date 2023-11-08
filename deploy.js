import ghpages from "gh-pages"

ghpages.publish('dist/public', {
    branch: 'gh-pages',
    repo: 'https://github.com/wakaztahir/solid-staggered-grid.git'
}, () => {
    console.log("Package Github Pages published")
});