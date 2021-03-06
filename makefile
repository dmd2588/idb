.DEFAULT_GOAL := build

ifeq ($(shell uname), Darwin)          # Apple
    PYTHON   := python3.5
    PIP      := pip3.5
    PYLINT   := pylint
    COVERAGE := coverage-3.5
    PYDOC    := pydoc3.5
    AUTOPEP8 := autopep8
else ifeq ($(CI), true)                # Travis CI
    PYTHON   := python3.5
    PIP      := pip3.5
    PYLINT   := pylint
    COVERAGE := coverage-3.5
    PYDOC    := pydoc3.5
    AUTOPEP8 := autopep8
else ifeq ($(shell uname -p), unknown) # Docker
    PYTHON   := python3.5
    PIP      := pip3.5
    PYLINT   := pylint
    COVERAGE := coverage-3.5
    PYDOC    := pydoc3.5
    AUTOPEP8 := autopep8
else                                   # UTCS
    PYTHON   := python3
    PIP      := pip3
    PYLINT   := pylint3
    COVERAGE := coverage-3.5
    PYDOC    := pydoc3.5
    AUTOPEP8 := autopep8
endif

.pylintrc:
	$(PYLINT) --disable=locally-disabled --reports=no --generate-rcfile > $@

IDB2.html: app/models.py
	pydoc3 -w app/models.py
	cp models.html IDB2.html
	rm models.html

config:
	git config -l

status:
	git branch
	git remote -v
	git status

build: standard
	node_modules/.bin/webpack -p --progress --colors --optimize-minimize --config ./webpack.production.config.js

watch:
	node_modules/.bin/webpack --progress --colors --watch

dev_build: standard
	node_modules/.bin/webpack --progress --colors --config ./webpack.config.js

standard:
	node_modules/.bin/standard

pylint:
	pylint --ignore RedditScraper.py app
	pep8 --ignore E501 --exclude query.py,RedditScraper.py,test_models.py app

test-client: build

test-server: pylint
	python3 -m app.tests.test_http
	-$(COVERAGE) run -m --branch app.tests.test_models
	-$(COVERAGE) report -m --include=app/\*

test: test-client test-server

install:
	npm install
	pip3 install --upgrade -r requirements.txt

start:
	gunicorn --access-logfile - --error-logfile - -b 0.0.0.0:$(FLASK_PORT) --reload --worker-class eventlet app.api:app

