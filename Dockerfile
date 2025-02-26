FROM nginx:latest

MAINTAINER HHL

ADD default.conf /etc/nginx/conf.d/

COPY dist/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx","-g","daemon off;"]
