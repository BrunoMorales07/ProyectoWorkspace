CREATE DATABASE IF NOT EXISTS ecommerce;
USE ecommerce;

--tabla user
CREATE TABLE IF NOT EXISTS `user` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `lastName` VARCHAR(100) NOT NULL,
    `phone` INT(11) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--tabla categories
CREATE TABLE IF NOT EXISTS `categories` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT,
    `productCount` INT(11) DEFAULT 0,
    `imgSrc` VARCHAR(255),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--tabla products
CREATE TABLE IF NOT EXISTS `products` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(200) NOT NULL,
    `description` TEXT,
    `cost` INT(11) NOT NULL,
    `currency` VARCHAR(10) NOT NULL,
    `soldCount` INT(11) DEFAULT 0,
    `category` VARCHAR(100),
    `images` VARCHAR(100),
    `relatedProducts` VARCHAR(100),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--tabla cart 
CREATE TABLE IF NOT EXISTS `cart` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `user_id` INT(11) NOT NULL,
    `product_id` INT(11) NOT NULL,
    `count` INT(11) NOT NULL DEFAULT 1,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `user_product` (`user_id`, `product_id`),
    INDEX `FK_cart_product` (`product_id`),
    INDEX `FK_cart_user` (`user_id`),
    CONSTRAINT `FK_cart_product` FOREIGN KEY (`product_id`) 
        REFERENCES `products` (`id`) 
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT `FK_cart_user` FOREIGN KEY (`user_id`) 
        REFERENCES `user` (`id`) 
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--tabla ordenes
CREATE TABLE IF NOT EXISTS `ordenes` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `user_id` INT(11) NOT NULL,
    `subtotal` DECIMAL(10,2) NOT NULL,
    `shippingType` INT(11) NOT NULL,
    `totalWithShipping` DECIMAL(10,2) NOT NULL,
    `paymentMethod` VARCHAR(50) NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `FK_orden_user` (`user_id`),
    CONSTRAINT `FK_orden_user` FOREIGN KEY (`user_id`) 
        REFERENCES `user` (`id`) 
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--tabla ordenDetails
CREATE TABLE IF NOT EXISTS `orderDetails` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `order_id` INT(11) NOT NULL,
    `product_id` INT(11) NOT NULL,
    `quantity` INT(11) NOT NULL,
    `unitPrice` DECIMAL(10,2) NOT NULL,
    `subtotal` DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `FK_detail_order` (`order_id`),
    INDEX `FK_detail_product` (`product_id`),
    CONSTRAINT `FK_detail_order` FOREIGN KEY (`order_id`) 
        REFERENCES `ordenes` (`id`) 
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT `FK_detail_product` FOREIGN KEY (`product_id`) 
        REFERENCES `products` (`id`) 
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--tabla direccion de envio
CREATE TABLE IF NOT EXISTS `shippingAddress` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `user_id` INT(11) NOT NULL,
    `order_id` INT(11),
    `street` VARCHAR(255) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `state` VARCHAR(100) NOT NULL,
    `zipCode` VARCHAR(20) NOT NULL,
    `country` VARCHAR(100) NOT NULL DEFAULT 'Uruguay',
    PRIMARY KEY (`id`),
    INDEX `FK_address_user` (`user_id`),
    INDEX `FK_address_order` (`order_id`),
    CONSTRAINT `FK_address_user` FOREIGN KEY (`user_id`) 
        REFERENCES `user` (`id`) 
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT `FK_address_order` FOREIGN KEY (`order_id`) 
        REFERENCES `ordenes` (`id`) 
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--datos iniciales 

--usuario
INSERT INTO `user` (`name`, `email`, `password`, `lastName`, `phone`) VALUES
('Juan', 'juan@test.com', 'password123', 'Pérez', 091234567),
('Ana', 'ana@example.com', 'password123', 'Rey', 099876543);

-- Categorías
INSERT INTO `categories` (`id`, `name`, `description`, `productCount`, `imgSrc`) VALUES
(101, 'Autos', 'Los mejores precios en autos 0 kilómetro, de alta y media gama.', 5, 'img/cat101_1.jpg'),
(102, 'Juguetes', 'Encuentra aquí los mejores precios para niños/as de cualquier edad.', 4, 'img/cat102_1.jpg'),
(103, 'Muebles', 'Muebles antiguos, nuevos y para ser armados por uno mismo.', 4, 'img/cat103_1.jpg'),
(104, 'Herramientas', 'Herramientas para cualquier tipo de trabajo.', 0, 'img/cat104_1.jpg'),
(105, 'Computadoras', 'Todo en cuanto a computadoras, para uso de oficina y/o juegos.', 1, 'img/cat105_1.jpg'),
(106, 'Vestimenta', 'Gran variedad de ropa, nueva y de segunda mano.', 0, 'img/cat106_1.jpg'),
(107, 'Electrodomésticos', 'Todos los electrodomésticos modernos y de bajo consumo.', 0, 'img/cat107_1.jpg'),
(108, 'Deporte', 'Toda la variedad de indumentaria para todo tipo de deporte.', 0, 'img/cat108_1.jpg'),
(109, 'Celulares', 'Celulares de todo tipo para cubrir todas las necesidades.', 0, 'img/cat109_1.jpg');

-- Productos
INSERT INTO `products` (`id`, `name`, `description`, `cost`, `currency`, `soldCount`, `category`, `images`, `relatedProducts`) VALUES
(40281, 'Computadora de escritorio', 'Computadora de escritorio. Potencia y rendimiento, para juegos o trabajo', 2599, 'USD', 11, 'Computadoras', '["img/prod40281_1.jpg","img/prod40281_2.jpg","img/prod40281_3.jpg","img/prod40281_4.jpg"]', '[{"id":50743,"name":"PlayStation 5"},{"id":50744,"name":"Bicicleta"}]'),

(50741, 'Oso de peluche', 'Oso de peluche gigante, con el bebé. Resistente y lavable. Tus hijos los amarán', 2400, 'UYU', 97, 'Juguetes', '["img/prod50741_1.jpg","img/prod50741_2.jpg","img/prod50741_3.jpg","img/prod50741_4.jpg"]', '[{"id":50742,"name":"Pelota"},{"id":50744,"name":"Bicicleta"}]'),

(50742, 'Pelota de básquetbol', 'Balón de baloncesto profesional, para interiores, tamaño 5, 27.5 pulgadas. Oficial de la NBA', 2999, 'UYU', 11, 'Juguetes', '["img/prod50742_1.jpg","img/prod50742_2.jpg","img/prod50742_3.jpg","img/prod50742_4.jpg"]', '[{"id":50741,"name":"Oso"},{"id":50743,"name":"PlayStation 5"}]'),

(50743, 'PlayStation 5', 'Maravíllate con increíbles gráficos y disfruta de nuevas funciones de PS5. Con E/S integrada.', 59999, 'UYU', 16, 'Juguetes', '["img/prod50743_1.jpg","img/prod50743_2.jpg","img/prod50743_3.jpg","img/prod50743_4.jpg"]', '[{"id":50742,"name":"Pelota"},{"id":50744,"name":"Bicicleta"}]'),

(50744, 'Bicicleta', '¡La mejor BMX pequeña del mercado! Frenos traseros y cuadro duradero de acero Hi-Ten.', 10999, 'UYU', 8, 'Juguetes', '["img/prod50744_1.jpg","img/prod50744_2.jpg","img/prod50744_3.jpg","img/prod50744_4.jpg"]', '[{"id":50741,"name":"Oso"},{"id":50743,"name":"PlayStation 5"}]'),

(50921, 'Chevrolet Onix Joy', 'Generación 2019, variedad de colores. Motor 1.0, ideal para ciudad.', 13500, 'USD', 14, 'Autos', '["img/prod50921_1.jpg","img/prod50921_2.jpg","img/prod50921_3.jpg","img/prod50921_4.jpg"]', '[{"id":50924,"name":"Peugeot 208"},{"id":50922,"name":"Fiat Way"}]'),

(50922, 'Fiat Way', 'La versión de Fiat que brinda confort y a un precio accesible.', 14500, 'USD', 52, 'Autos', '["img/prod50922_1.jpg","img/prod50922_2.jpg","img/prod50922_3.jpg","img/prod50922_4.jpg"]', '[{"id":50921,"name":"Chevrolet Onix"},{"id":50923,"name":"Suzuki Celerio"}]'),

(50923, 'Suzuki Celerio', 'Un auto que se ha ganado la buena fama por su economía con el combustible.', 12500, 'USD', 25, 'Autos', '["img/prod50923_1.jpg","img/prod50923_2.jpg","img/prod50923_3.jpg","img/prod50923_4.jpg"]', '[{"id":50924,"name":"Peugeot 208"},{"id":50922,"name":"Fiat Way"}]'),

(50924, 'Peugeot 208', 'El modelo de auto que se sigue renovando y manteniendo su prestigio en comodidad.', 15200, 'USD', 17, 'Autos', '["img/prod50924_1.jpg","img/prod50924_2.jpg","img/prod50924_3.jpg","img/prod50924_4.jpg"]', '[{"id":50921,"name":"Chevrolet Onix"},{"id":50923,"name":"Suzuki Celerio"}]'),

(50925, 'Bugatti Chiron', 'El mejor hiperdeportivo de mundo. Producción limitada a 500 unidades.', 3500000, 'USD', 0, 'Autos', '["img/prod50925_1.jpg","img/prod50925_2.jpg","img/prod50925_3.jpg","img/prod50925_4.jpg"]', '[{"id":50924,"name":"Peugeot 208"},{"id":50921,"name":"Chevrolet Onix"}]'),

(60801, 'Juego de comedor', 'Un conjunto sencillo y sólido, ideal para zonas de comedor pequeñas, hecho en madera maciza de pino', 4000, 'UYU', 88, 'Muebles', '["img/prod60801_1.jpg","img/prod60801_2.jpg","img/prod60801_3.jpg","img/prod60801_4.jpg"]', '[{"id":60802,"name":"Sofá"},{"id":60804,"name":"Mesa de centro"}]'),

(60802, 'Sofá', 'Cómodo sofá de tres cuerpos, con chaiselongue intercambiable. Ideal para las siestas', 24000, 'UYU', 12, 'Muebles', '["img/prod60802_1.jpg","img/prod60802_2.jpg","img/prod60802_3.jpg","img/prod60802_4.jpg"]', '[{"id":60801,"name":"Juego de comedor"},{"id":60803,"name":"Armario"}]'),

(60803, 'Armario', 'Diseño clásico con puertas con forma de panel. Espejo de cuerpo entero para ver cómo te queda la ropa', 8000, 'UYU', 24, 'Muebles', '["img/prod60803_1.jpg","img/prod60803_2.jpg","img/prod60803_3.jpg","img/prod60803_4.jpg"]', '[{"id":60802,"name":"Sofá"},{"id":60804,"name":"Mesa de centro"}]'),

(60804, 'Mesa de centro', 'Añade más funciones a tu sala de estar, ya que te permite cambiar fácilmente de actividad.', 10000, 'UYU', 37, 'Muebles', '["img/prod60804_1.jpg","img/prod60804_2.jpg","img/prod60804_3.jpg","img/prod60804_4.jpg"]', '[{"id":60801,"name":"Juego de comedor"},{"id":60803,"name":"Armario"}]');
