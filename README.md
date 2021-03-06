Note that this is under developement and not ready for production.

# boarsmith — a frontend site workflow

Boarsmith is a custom site structure and workflow, made for frontend small sites, working with Grunt.js for testing, building and publishing.

It can be used with Pure CSS, SASS, LESS, Coffeescript or Vanilla JS, Twitter Bootstrap or HTML5 Boilerplate template.

StaticJS generator uses great technologies for making your workflow simpler, like Assemble.io, Bower, Davis.js and more.

It contains out of the box : pushstate JS routing, handlebar templates system with multilingual friendly Markdown + YAML Front Matter system for publishing articles (provided by Assemble).

## Requirements

For this workflow to work, you need this external dependencies to be installed on your computer :

* Phantomjs ~1.9.2 `homebrew install phantomjs` or [download here](http://phantomjs.org/download.html)

## Temporary Quick Start

This quick start is used until the yeoman generator is build.

Install NPM modules

    npm install
    
Install Bower dependencies    
    
    bower install
    
Run the demo

	grunt server

Enjoy!
    


## Grunt Tasks

You can test your files (not ready)

	grunt test
	
You can build the site

	grunt build 		 # Dev environement
	grunt build --prod   # Prod environement
	
You can build and watch on a node server

	grunt server         # Dev environement
	grunt server --prod  # Prod environement

you can deploy to zip file, via rsync or event FTP. Make sure your condig is correctly setup before deploying.

	grunt deploy:zip 	# Export to a zipfile
	grunt deploy:rsync	# Sync with rsync to a remote server via SSH
	grunt deploy:ftp 	# Push your files to a remote server via FTP



__Further steps will be used when the generator is ready__

---


## Quick start (not ready)

First install it globally

	npm install -g boarsmith-generator
	
Then generate the project with yeoman, you will be prompted

    yo boarsmith
    
Create your first page

    yo boarsmith:page
    
Install your components with bower

	bower install jquery
	
Add your own assets in `src/coffee`, `src/sass`, `src/img`

Add your `*.hbs` templates in `src/templates`

Add your data files in `src/data`

Add all files to be public in `public` folder (will be copied as is to the root of the server)

## Yeoman Generator (not ready)

The best way to bootstrap your project is to use the Yeoman Generator. You will be ask for details about your project like

* Multilingual ? [Y/n]
* LESS, SASS or CSS
* Coffeescript or JS
* Boostrap, HTML5 Boilerplate or Basic
* Use Routing with Davis.js ?
* Include CreateJS ?
* Include HTML5 Boilerplate ?
* Include PNG Optimizer ?
* Include Spritesheet Generator ?
* List some bower components you want in your projects


## Yeoman Tasks (not ready)

You also can add some articles/pages with Yeaoman using

    yo boarsmith:article
    
or

    yo boarsmith:page
    
Or fill the `src/data/routes.yml` and then generate your structure

	yo boarsmith:routes:generate




