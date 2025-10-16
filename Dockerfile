FROM --platform=linux/amd64 mirrors-ssl.aliyuncs.com/node:18.20.4 AS web

WORKDIR /web/
COPY . .

RUN cat .env.production
COPY .docker-compose/web-handle.sh .
RUN sh ./web-handle.sh
RUN cat .env.production
RUN rm -f web-handle.sh

# 带参数安装
RUN npm install --legacy-peer-deps

RUN #npx update-browserslist-db@latest
RUN #npm install --unsafe-perm node-sass
# RUN npm rebuild node-sass
RUN npm run build

# copy web

FROM --platform=linux/amd64 mirrors-ssl.aliyuncs.com/nginx:alpine
LABEL MAINTAINER="leiwuhen2004@gmail.com"

COPY .docker-compose/nginx/conf.d/my.conf /etc/nginx/conf.d/my.conf
COPY --from=web /web/dist /usr/share/nginx/html
RUN cat /etc/nginx/conf.d/my.conf
RUN ls -al /usr/share/nginx/html