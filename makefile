VERSION=`git rev-parse --abbrev-ref HEAD`
BUILD=`date +%FT%T%z`
LDFLAGS=-ldflags "-X main.Version=${VERSION} -X main.Build=${BUILD}"

.PHONY: help
help: ## - Show help message
	@printf "\033[32m\xE2\x9c\x93 usage: make [target]\n\n\033[0m"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: build
build:	## - Build the smallest and secured golang docker image based on scratch
	@printf "\033[32m\xE2\x9c\x93 Build the smallest and secured golang docker image based on scratch\n\033[0m"
	@docker build -f Dockerfile -t web .

.PHONY: build-no-cache
build-no-cache:	## - Build the smallest and secured golang docker image based on scratch with no cache
	@printf "\033[32m\xE2\x9c\x93 Build the smallest and secured golang docker image based on scratch\n\033[0m"
	@docker build --no-cache -f Dockerfile -t web .

.PHONY: ls
ls: ## - List 'smallest-secured-golang' docker images
	@printf "\033[32m\xE2\x9c\x93 Look at the size dude !\n\033[0m"
	@docker image ls web

.PHONY: run
run:	## - Run the smallest and secured golang docker image based on scratch
	@printf "\033[32m\xE2\x9c\x93 Run the smallest and secured golang docker image based on scratch\n\033[0m"
	@docker run web:latest

.PHONY: push
push:	## - Push docker image to ecr container registry
	docker tag web:latest registry.cn-guangzhou.aliyuncs.com/szkdx/web:$(VERSION)
	docker push registry.cn-guangzhou.aliyuncs.com/szkdx/web:$(VERSION)

