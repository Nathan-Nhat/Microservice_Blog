FROM nginx:1.17.10

RUN rm -rf /etc/nginx/conf.d/default.conf

COPY ./build /usr/share/nginx/html

COPY ./config/blog.conf /etc/nginx/conf.d

EXPOSE 80

#CMD ['nginx', '-g', 'daemon off;']