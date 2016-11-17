# Static Site Gulp Starter Pack

Simple starter pack for a static web site using the task-runner gulp (with focus on good practice). Use lots of sweet 
gulp plugin to make the development easier.

Why static? Because you can easily deploy it on github-pages!

![Demo-live-reload](Screenshot/demo-live-reload.gif)


## How to use

This project allows to use every command in different env mode. Currently two modes in available
* development: optimize (minimize, concat, uglify,...) files
* production: leave them mostly untouched (easier debugging)

You can set the environment by adding the arguments at the end of a gulp command, by example: 

```sh
--env=production
```
(the default environnment is development)


#### You have the following npm script:

* build: build the project to be production ready
```sh
npm run build
```

* deploy: build and deploy the project on gh-pages (the branch must exist)
```sh
npm run deploy
```

#### You have the following gulp script:

* server: setup a live-reaload environnement
```sh
gulp server
```

* lint: check if your files follow the defined standards
```sh
gulp lint
```


## How to "install"

Download the template in the repository you want to create your web application.

Install the dependencies

```sh
npm install
```

## Integrated gulp plugins

Build plugins
* [Sass](https://github.com/dlmanning/gulp-sass): support Sass 
* [Uglify](https://github.com/terinjokes/gulp-uglify): minify JavaScript
* [Cssnano](https://github.com/ben-eb/gulp-cssnano): minify css 
* [Autoprefixer](https://github.com/sindresorhus/gulp-autoprefixer): Add vendor prefix for you (in css)
* [Imagemin](https://github.com/sindresorhus/gulp-imagemin): minify image
* [Useref](https://github.com/jonkemp/gulp-useref): Enable file concatenation


Utility plugins: 
* [browser-sync](https://www.browsersync.io/docs/gulp) : Enable auto lives reload  

Linting plugins:
* [eslint](https://github.com/adametry/gulp-eslint) : linter for JavaScript
* [stylelint](https://github.com/stylelint/stylelint) : linter for style sheets (css and scss)
* [stylefmt](https://github.com/morishitter/stylefmt) : auto-format style sheet (may be removed: could be moved to IDE)


## What next

* Avoid piping non-newer files
* Add templating system
* Add testing
