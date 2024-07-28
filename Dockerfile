FROM node
RUN npm install -g ionic@latest
WORKDIR /www/app
COPY QLOCKGENERATOR /www/app
RUN cd /www/app & ls -la
RUN npm install
EXPOSE 8100
ENTRYPOINT ["ionic"]
CMD ["serve", "--external", "--no-open"]
#RUN npm install --save-dev  --unsafe-perm node-sass@4.11.0
RUN npm install --save-dev  --unsafe-perm sass
ENV NODE_OPTIONS=--openssl-legacy-provider
