IMAGE_NAME := ghpages-nginx
CONTAINER_NAME := gh-demo
PORT := 8080

.PHONY: build start stop clean

default: build start

build:
	docker build -t $(IMAGE_NAME) .

start:
	docker run --rm \
		--name $(CONTAINER_NAME) \
		-p $(PORT):80 \
		-v $(PWD)/docs:/usr/share/nginx/html:ro \
		nginx:alpine

stop:
	docker stop $(CONTAINER_NAME)

clean:
	docker rmi $(IMAGE_NAME)