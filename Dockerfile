FROM arm64v8/alpine:3.11

# set repo to speed up
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories

# install dependencies
RUN apk add chromium qpdf nodejs npm fontconfig

# add chinese front
ADD wqy-zenhei.ttf /usr/share/fonts
RUN mkfontscale && mkfontdir && fc-cache

# install puppeteer@2.0.0 in application and you may need to add jdk (openjdk8)
# PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm install puppeteer@2.0.0

CMD ["node"]
