FROM arm64v8/node:10-alpine3.10
RUN npm install puppeteer@2.0.0
CMD ["node"]
