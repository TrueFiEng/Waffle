build:
	go build -buildmode c-shared -o build/wafflegeth.dylib github.com/Ethworks/Waffle/main
	go build -buildmode c-archive -o build/wafflegeth.a github.com/Ethworks/Waffle/main
	cp main/main.h build

build-napi:
	go build -buildmode c-shared -o build/wafflegeth.node github.com/Ethworks/Waffle/gonapi


.PHONY: build build-napi
