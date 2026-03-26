FROM php:8.2-fpm-bookworm

COPY deploy/php-fpm-env.conf /usr/local/etc/php-fpm.d/zz-clear-env.conf
