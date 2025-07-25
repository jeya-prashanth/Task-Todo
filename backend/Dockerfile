FROM php:8.1-apache

RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

RUN a2enmod rewrite headers && \
    a2enmod deflate && \
    a2enmod filter && \
    a2enmod expires && \
    a2enmod include

WORKDIR /var/www/html

COPY . /var/www/html

COPY ./docker/apache-config.conf /etc/apache2/sites-available/000-default.conf

EXPOSE 80

CMD ["apache2-foreground"]
