FROM alpine:3.17

RUN apk update && \
	apk add --no-cache musl brotli-libs busybox c-ares ca-certificates icu-libs libcrypto1.1 libssl1.1 libstdc++ nghttp2-libs zlib nodejs npm && \
	npm i -g @nestjs/cli

WORKDIR /khrovChat

COPY work/package*.json ./

RUN npm install

COPY work/ ./

COPY --chmod=0755 conf/entrypoint.sh ./

ENTRYPOINT ["./entrypoint.sh"]

CMD ["nest", "start"]
