FROM node:6
#change timezone to local  ( America / Sao_Paulo)
#RUN cp /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime
# add project to build
ADD . /root/app
WORKDIR /root/app
RUN npm install && \
    npm -g install gulp-cli && \
    # https://github.com/Microsoft/TypeScript/issues/2056
    # this line is add until the problema with debug is solved
    sed '3168d'  node_modules/typescript/lib/typescript.js >>  node_modules/typescript/lib/typescript_new.js && \
    cp  node_modules/typescript/lib/typescript_new.js  node_modules/typescript/lib/typescript.js && \
    gulp ts

EXPOSE 3000
CMD ["npm","start"]