-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-10-2026 a las 03:39:16
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `berti2`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `almacen`
--

CREATE TABLE `almacen` (
  `id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `ubicacion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `almacen`
--

INSERT INTO `almacen` (`id`, `nombre`, `ubicacion`) VALUES
(5, 'Principal', 'Disponible'),
(6, 'Secundario', 'Deposito'),
(8, 'Transporte', 'Transito');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `caja`
--

CREATE TABLE `caja` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `ubicacion` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `caja`
--

INSERT INTO `caja` (`id`, `nombre`, `ubicacion`) VALUES
(1, 'Caja Principal', 'Entrada'),
(2, 'Caja Secundaria', 'Pasillo 2');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`id`, `nombre`, `descripcion`) VALUES
(1, 'Analgesicos', 'Medicamentos para el dolar'),
(2, 'Antibioticos', 'Medicamentos antibacterianos'),
(3, 'Peluches', 'Juguetes de felpa y algodon'),
(4, 'Aseo Personal', 'Artículos de aseo personal y uso diario'),
(5, 'Hogar', 'Artículos del hogar como limpieza y mantenimiento'),
(6, 'Miscelaneos', 'Miscelaneos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `cedula` varchar(15) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id`, `nombre`, `cedula`, `telefono`, `direccion`) VALUES
(2, 'María González', '30902965', '04261239876', 'Av. Bella Vista'),
(5, 'Juan Pérez', '18180424', '04221234567', 'Sector La alhambra'),
(6, 'María Fernanda Rivas', 'V-18765432', '0412-5567890', 'Av. Sucre, Caracas'),
(8, 'Daniela Sofía Márquez', 'V-25678901', '0424-7789012', 'La Candelaria, Caracas'),
(9, 'Luis Eduardo Zambrano', 'V-16543210', '0416-8890123', 'San Martín, Caracas'),
(10, 'Carolina del Valle Torres', 'V-19876543', '0426-9901232', 'Guarenas, Edo. Miranda'),
(11, 'Gabriel Antonio Rojas', 'V-21567890', '0412-1234567', 'El Paraíso, Caracas'),
(12, 'Patricia Andreína Lugo', 'V-23456781', '0414-2345678', 'Catia, Caracas'),
(13, 'Ricardo José Medina', 'V-22334455', '0424-3456789', 'Los Dos Caminos, Caracas'),
(14, 'Valentina Paola Herrera', 'V-24567892', '0416-4567890', 'Altamira, Caracas'),
(15, 'Miguel Ángel Cordero', 'V-26789012', '0426-5678901', 'La Urbina, Caracas'),
(16, 'Andrea Valentina Suárez', 'V-27890123', '0412-6789012', 'El Rosal, Caracas'),
(17, 'Héctor Manuel Figueroa', 'V-18902345', '0414-7890123', 'Santa Mónica, Caracas'),
(18, 'Sofía Alejandra Pinto', 'V-21098765', '0424-8901234', 'La California Norte, Caracas'),
(19, 'Carlos Alberto Villalba', 'V-17654321', '0416-9012345', 'San Bernardino, Caracas'),
(20, 'Mariana del Carmen Prieto', 'V-19870234', '0426-0123456', 'Los Chaguaramos, Caracas'),
(21, 'Jorge Luis Barrios', 'V-22345678', '0412-3456789', 'Macaracuay, Caracas'),
(22, 'Isabella Antonella Rangel', 'V-24567901', '0414-4567891', 'La Castellana, Caracas'),
(23, 'Francisco Javier Mendoza', 'V-26543219', '0424-5678912', 'El Marqués, Caracas'),
(24, 'Camila Victoria Aponte', 'V-23456709', '0416-6789123', 'Los Ruices, Caracas'),
(25, 'Eduardo José Salazar', 'V-25678123', '0426-7891234', 'Chacao, Caracas'),
(26, 'Nathalia Garcia', '30550687', '04146472372', 'San Francisco Manzanillo'),
(38, 'Veguita', '12345678', '44', '44'),
(39, 'juan sierra', '31213170', '88888888', 'los gallos'),
(40, 'Jeisser Vegas', '3123456', '09876543', 'POLAR'),
(41, 'javid', '30902966', '73459834', 'kghr'),
(42, 'Jose Vegas', 'V-30902965', '0414-6901837', 'Praderas del Sur');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compras`
--

CREATE TABLE `compras` (
  `id` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `id_proveedor` int(11) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `compras`
--

INSERT INTO `compras` (`id`, `fecha`, `id_proveedor`, `total`, `id_usuario`) VALUES
(39, '2026-07-06 01:50:00', 9, 7000.00, 1),
(40, '2026-07-06 01:51:00', 1, 264000.00, 1),
(41, '2026-07-06 01:52:00', 5, 112500.00, 1),
(42, '2026-07-06 01:53:00', 2, 84500.00, 1),
(43, '2026-07-06 04:34:00', 9, 4750.00, 1),
(44, '2026-07-06 14:55:00', 8, 400000.00, 1),
(48, '2026-07-07 14:54:00', 9, 15000.00, 15),
(49, '2026-07-07 18:22:00', 9, 3622.00, 15),
(50, '2026-07-08 13:17:00', 13, 955000.00, 1),
(51, '2026-07-08 13:46:00', 9, 30000.00, 17),
(52, '2026-07-08 14:05:00', 13, 30000.00, 17),
(53, '2026-08-24 02:45:00', 11, 360.00, 1),
(62, '2026-10-07 23:51:00', 9, 132.00, 1),
(65, '2026-10-08 01:44:00', 13, 97500.00, 1),
(66, '2026-10-08 01:46:00', 9, 21000.00, 1),
(67, '2026-10-08 17:26:00', 15, 25000.00, 1),
(68, '2026-10-08 21:38:00', 9, 12300.00, 1),
(69, '2026-10-08 21:40:00', 9, 123.00, 1),
(70, '2026-10-08 21:51:00', 9, 15000.00, 1),
(87, '2026-10-08 22:36:00', 9, 1.00, 1),
(93, '2026-10-08 23:09:00', 13, 1.00, 1),
(104, '2026-10-08 23:48:00', 15, 6.00, 1),
(110, '2026-10-08 23:56:00', 9, 1.00, 1),
(112, '2026-10-09 00:01:00', 9, 12.00, 1),
(118, '2026-10-09 00:31:00', 9, 2.00, 1),
(120, '2026-10-09 00:44:00', 9, 2.00, 1),
(121, '2026-10-09 00:44:00', 9, 2.00, 1),
(122, '2026-10-09 00:46:00', 9, 144.00, 1),
(125, '2026-10-09 00:51:00', 9, 4.00, 1),
(126, '2026-10-09 00:55:00', 9, 12.00, 1),
(127, '2026-10-09 00:59:00', 9, 24.00, 1),
(128, '2026-10-09 01:08:00', 9, 69.00, 1),
(129, '2026-10-09 01:14:00', 9, 37400.00, 1),
(130, '2026-10-09 01:34:00', 5, 3500.00, 1),
(131, '2026-10-09 01:37:00', 9, 69.00, 1),
(132, '2026-10-09 01:39:00', 9, 36.00, 1),
(133, '2026-10-09 01:40:00', 9, 23.00, 1),
(134, '2026-10-09 01:40:00', 9, 339.00, 1),
(136, '2026-10-12 19:05:00', 9, 4.00, 1),
(137, '2026-10-12 19:08:00', 1, 50000.00, 1),
(138, '2026-10-12 19:12:00', 1, 1.00, 1),
(139, '2026-10-12 19:12:00', 8, 1.00, 1),
(140, '2026-10-13 22:54:00', 8, 52500.00, 1),
(141, '2026-10-24 02:05:00', 9, 467501.50, 1),
(142, '2026-10-24 02:07:00', 9, 160000.00, 1),
(156, '2026-10-25 01:52:00', 9, 246.00, 1),
(157, '2026-10-25 01:52:00', 9, 5000.00, 1),
(158, '2026-10-25 01:57:00', 9, 35000.00, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_compras`
--

CREATE TABLE `detalle_compras` (
  `id` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `id_compra` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `costo_unitario` decimal(10,2) NOT NULL,
  `id_almacen` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_compras`
--

INSERT INTO `detalle_compras` (`id`, `id_producto`, `id_compra`, `cantidad`, `costo_unitario`, `id_almacen`) VALUES
(46, 35, 39, 14, 500.00, 0),
(47, 32, 40, 90, 1000.00, 0),
(48, 31, 40, 120, 1450.00, 0),
(49, 34, 41, 25, 4500.00, 0),
(50, 33, 42, 130, 650.00, 0),
(51, 37, 43, 5, 950.00, 0),
(52, 38, 44, 5, 80000.00, 0),
(56, 36, 48, 30, 500.00, 0),
(57, 35, 49, 1, 22.00, 0),
(58, 39, 49, 30, 120.00, 0),
(59, 40, 50, 10, 38000.00, 0),
(60, 32, 50, 25, 23000.00, 0),
(61, 40, 51, 30, 1000.00, 0),
(62, 40, 52, 30, 1000.00, 0),
(63, 41, 53, 2, 180.00, 0),
(64, 42, 62, 11, 12.00, 5),
(67, 45, 65, 75, 1300.00, 8),
(68, 46, 66, 10, 2100.00, 6),
(69, 47, 67, 20, 1250.00, 8),
(70, 47, 68, 10, 1230.00, 8),
(71, 47, 69, 1, 123.00, 8),
(72, 48, 70, 15, 1000.00, 8),
(73, 48, 87, 1, 1.00, 8),
(74, 48, 93, 1, 1.00, 8),
(75, 49, 104, 3, 2.00, 8),
(76, 49, 110, 1, 1.00, 8),
(77, 40, 112, 12, 1.00, 6),
(78, 50, 118, 2, 1.00, 6),
(79, 50, 120, 2, 1.00, 8),
(80, 50, 121, 2, 1.00, 6),
(81, 51, 122, 12, 12.00, 8),
(82, 52, 125, 2, 2.00, 8),
(83, 53, 126, 12, 1.00, 8),
(84, 54, 127, 2, 12.00, 8),
(85, 55, 128, 3, 23.00, 8),
(86, 56, 129, 34, 1100.00, 8),
(87, 57, 130, 50, 70.00, 8),
(88, 58, 131, 3, 23.00, 8),
(89, 58, 132, 3, 12.00, 8),
(90, 58, 133, 1, 23.00, 8),
(91, 58, 134, 3, 113.00, 6),
(93, 57, 136, 2, 2.00, 8),
(94, 54, 137, 50, 1000.00, 8),
(95, 54, 138, 1, 1.00, 8),
(96, 54, 139, 1, 1.00, 8),
(97, 59, 140, 70, 750.00, 8),
(98, 67, 141, 100, 1000.00, 8),
(99, 66, 141, 150, 2450.01, 8),
(100, 60, 142, 50, 800.00, 8),
(101, 61, 142, 30, 4000.00, 8),
(102, 68, 156, 2, 123.00, 8),
(103, 69, 157, 2, 2500.00, 8),
(104, 70, 158, 50, 700.00, 8);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_pago`
--

CREATE TABLE `detalle_pago` (
  `id` int(11) NOT NULL,
  `id_venta` int(11) NOT NULL,
  `id_metodo_pago` int(11) NOT NULL,
  `monto` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_pago`
--

INSERT INTO `detalle_pago` (`id`, `id_venta`, `id_metodo_pago`, `monto`) VALUES
(1, 32, 1, 3909.20),
(2, 33, 2, 5835.96),
(3, 34, 7, 12992.00),
(4, 35, 6, 3353.43),
(5, 36, 2, 5568.00),
(6, 37, 1, 348000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_ventas`
--

CREATE TABLE `detalle_ventas` (
  `id` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `id_venta` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `aplica_iva` tinyint(1) NOT NULL DEFAULT 1,
  `alicuota_iva` decimal(5,2) NOT NULL DEFAULT 16.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_ventas`
--

INSERT INTO `detalle_ventas` (`id`, `id_producto`, `id_venta`, `cantidad`, `precio_unitario`, `aplica_iva`, `alicuota_iva`) VALUES
(35, 32, 33, 2, 1500.33, 1, 16.00),
(36, 31, 33, 1, 2030.34, 1, 16.00),
(37, 34, 34, 2, 5600.00, 1, 16.00),
(38, 33, 35, 2, 1000.00, 1, 16.00),
(39, 35, 35, 1, 890.89, 1, 16.00),
(40, 37, 36, 4, 1200.00, 1, 16.00),
(41, 38, 37, 3, 100000.00, 1, 16.00),
(42, 32, 38, 3, 1500.33, 1, 16.00),
(43, 31, 38, 1, 2030.34, 1, 16.00),
(44, 40, 39, 5, 38000.00, 1, 16.00),
(45, 40, 40, 3, 38000.00, 1, 16.00),
(46, 40, 41, 4, 38000.00, 1, 16.00),
(47, 34, 42, 1, 5600.00, 1, 16.00),
(48, 34, 43, 2, 5600.00, 1, 16.00),
(49, 31, 44, 1, 2030.34, 1, 16.00),
(50, 40, 45, 1, 38000.00, 1, 16.00),
(56, 40, 51, 1, 38000.00, 1, 16.00),
(57, 33, 52, 1, 1000.00, 1, 16.00),
(58, 31, 52, 1, 2030.34, 1, 16.00),
(59, 39, 53, 1, 2300.00, 1, 16.00),
(62, 61, 55, 2, 3800.00, 1, 16.00),
(63, 61, 56, 2, 3800.00, 1, 16.00),
(65, 69, 58, 1, 3500.00, 1, 16.00),
(66, 70, 59, 1, 1000.00, 1, 16.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `direccion`
--

CREATE TABLE `direccion` (
  `id` int(11) NOT NULL,
  `calle` varchar(150) DEFAULT NULL,
  `avenida` varchar(150) DEFAULT NULL,
  `sector` varchar(150) DEFAULT NULL,
  `numero_casa` varchar(20) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `direccion`
--

INSERT INTO `direccion` (`id`, `calle`, `avenida`, `sector`, `numero_casa`, `status`, `id_usuario`) VALUES
(1, 'Calle 1', 'Av. Principal', 'Centro', 'Casa 12', 'ACTIVO', 1),
(2, 'Calle 8', 'Av. Libertador', 'La Lago', 'Casa 45', 'ACTIVO', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metodo_pago`
--

CREATE TABLE `metodo_pago` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `metodo_pago`
--

INSERT INTO `metodo_pago` (`id`, `nombre`) VALUES
(1, 'Punto de Venta'),
(2, 'Pago Movil'),
(6, 'Transferencia'),
(7, 'Efectivo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modulo`
--

CREATE TABLE `modulo` (
  `id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `modulo`
--

INSERT INTO `modulo` (`id`, `nombre`) VALUES
(1, 'Dashboard'),
(2, 'Categorías'),
(3, 'Clientes'),
(4, 'Productos'),
(5, 'Stock'),
(6, 'Movimientos'),
(7, 'Compras'),
(8, 'Facturas'),
(9, 'Proveedores'),
(10, 'Roles'),
(11, 'Usuarios'),
(12, 'Almacenes');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos`
--

CREATE TABLE `movimientos` (
  `id` int(11) NOT NULL,
  `id_stock` int(11) NOT NULL,
  `id_almacen` int(11) NOT NULL,
  `tipo` enum('ENTRADA','SALIDA','TRASLADO') NOT NULL,
  `cantidad_inicio` int(11) NOT NULL,
  `cantidad_ingreso` int(11) NOT NULL DEFAULT 0,
  `cantidad_salida` int(11) NOT NULL DEFAULT 0,
  `cantidad_final` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `referencia` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `movimientos`
--

INSERT INTO `movimientos` (`id`, `id_stock`, `id_almacen`, `tipo`, `cantidad_inicio`, `cantidad_ingreso`, `cantidad_salida`, `cantidad_final`, `fecha`, `referencia`) VALUES
(12, 19, 0, 'ENTRADA', 0, 100, 0, 100, '2026-07-05 21:48:55', 'Compra #38'),
(13, 18, 0, 'ENTRADA', 0, 14, 0, 14, '2026-07-05 21:50:52', 'Compra #39'),
(14, 15, 0, 'ENTRADA', 0, 90, 0, 90, '2026-07-05 21:52:24', 'Compra #40'),
(15, 14, 0, 'ENTRADA', 0, 120, 0, 120, '2026-07-05 21:52:24', 'Compra #40'),
(16, 17, 0, 'ENTRADA', 0, 25, 0, 25, '2026-07-05 21:53:10', 'Compra #41'),
(17, 16, 0, 'ENTRADA', 0, 130, 0, 130, '2026-07-05 21:53:33', 'Compra #42'),
(18, 19, 0, 'SALIDA', 100, 0, 3, 97, '2026-07-05 21:54:31', 'Venta factura FAC-000001'),
(19, 16, 0, 'SALIDA', 130, 0, 1, 129, '2026-07-05 21:54:31', 'Venta factura FAC-000001'),
(20, 15, 0, 'SALIDA', 90, 0, 2, 88, '2026-07-05 22:02:45', 'Venta factura FAC-000002'),
(21, 14, 0, 'SALIDA', 120, 0, 1, 119, '2026-07-05 22:02:45', 'Venta factura FAC-000002'),
(22, 17, 0, 'SALIDA', 25, 0, 2, 23, '2026-07-05 22:04:03', 'Venta factura FAC-000003'),
(23, 16, 0, 'SALIDA', 129, 0, 2, 127, '2026-07-05 22:04:23', 'Venta factura FAC-000004'),
(24, 18, 0, 'SALIDA', 14, 0, 1, 13, '2026-07-05 22:04:23', 'Venta factura FAC-000004'),
(25, 20, 0, 'ENTRADA', 0, 5, 0, 5, '2026-07-06 00:34:36', 'Compra #43'),
(26, 20, 0, 'SALIDA', 5, 0, 4, 1, '2026-07-06 00:36:03', 'Venta factura FAC-000005'),
(27, 21, 0, 'ENTRADA', 0, 5, 0, 5, '2026-07-06 10:56:21', 'Compra #44'),
(28, 21, 0, 'SALIDA', 5, 0, 3, 2, '2026-07-06 10:57:35', 'Venta factura FAC-000006'),
(29, 19, 0, 'ENTRADA', -3, 1, 0, -2, '2026-07-07 10:41:38', 'Compra #45'),
(30, 19, 0, 'ENTRADA', -3, 1, 0, -2, '2026-07-07 10:47:50', 'Compra #46'),
(31, 19, 0, 'ENTRADA', -3, 1, 0, -2, '2026-07-07 10:51:40', 'Compra #47'),
(32, 19, 0, 'ENTRADA', -3, 30, 0, 27, '2026-07-07 10:54:34', 'Compra #48'),
(33, 18, 0, 'ENTRADA', 13, 1, 0, 14, '2026-07-07 14:23:26', 'Compra #49'),
(35, 15, 0, 'SALIDA', 88, 0, 3, 85, '2026-07-07 14:25:53', 'Venta factura FAC-000007'),
(38, 15, 0, 'ENTRADA', 85, 25, 0, 110, '2026-07-08 09:18:31', 'Compra #50'),
(39, 23, 0, 'SALIDA', 10, 0, 5, 5, '2026-07-08 09:20:29', 'Venta factura FAC-000008'),
(40, 23, 0, 'ENTRADA', 5, 30, 0, 35, '2026-07-08 09:46:29', 'Compra #51'),
(41, 23, 0, 'SALIDA', 35, 0, 3, 32, '2026-07-08 09:47:24', 'Venta factura FAC-000009'),
(42, 23, 0, 'ENTRADA', 32, 30, 0, 62, '2026-07-08 10:05:34', 'Compra #52'),
(43, 23, 0, 'SALIDA', 62, 0, 4, 58, '2026-07-08 10:16:15', 'Venta factura FAC-000010'),
(44, 17, 0, 'SALIDA', 23, 0, 1, 22, '2026-08-23 22:42:16', 'Venta factura FAC-000011'),
(45, 17, 0, 'SALIDA', 22, 0, 2, 20, '2026-08-23 22:43:44', 'Venta factura FAC-000012'),
(46, 14, 0, 'SALIDA', 118, 0, 1, 117, '2026-08-23 22:43:59', 'Venta factura FAC-000013'),
(47, 24, 0, 'ENTRADA', 0, 2, 0, 2, '2026-08-23 22:45:35', 'Compra #53'),
(48, 23, 0, 'SALIDA', 58, 0, 1, 57, '2026-09-29 19:50:40', 'Venta factura FAC-000014'),
(49, 23, 0, 'SALIDA', 57, 0, 1, 56, '2026-09-29 19:50:48', 'Venta factura FAC-000015'),
(50, 22, 0, 'SALIDA', 30, 0, 1, 29, '2026-09-29 19:58:35', 'Venta factura FAC-000016'),
(51, 22, 0, 'SALIDA', 29, 0, 1, 28, '2026-09-29 19:59:45', 'Venta factura FAC-000017'),
(52, 21, 0, 'SALIDA', 2, 0, 1, 1, '2026-09-29 20:32:24', 'Venta factura FAC-000018'),
(53, 21, 0, 'SALIDA', 1, 0, 1, 0, '2026-09-29 20:32:26', 'Venta factura FAC-000019'),
(54, 23, 0, 'SALIDA', 56, 0, 1, 55, '2026-09-29 21:03:06', 'Venta factura FAC-000015'),
(55, 16, 0, 'SALIDA', 127, 0, 1, 126, '2026-09-29 21:27:44', 'Venta factura FAC-000016'),
(56, 14, 0, 'SALIDA', 117, 0, 1, 116, '2026-09-29 21:27:44', 'Venta factura FAC-000016'),
(57, 22, 0, 'SALIDA', 28, 0, 1, 27, '2026-09-29 21:34:11', 'Venta factura FAC-000017'),
(58, 25, 5, 'ENTRADA', 0, 11, 0, 11, '2026-10-07 19:51:39', 'Compra #62'),
(59, 27, 8, 'ENTRADA', 0, 12, 0, 12, '2026-10-07 20:02:30', 'Compra #63'),
(60, 30, 8, 'ENTRADA', 0, 95, 0, 95, '2026-10-07 21:34:28', 'Compra #64'),
(61, 31, 8, 'ENTRADA', 0, 75, 0, 75, '2026-10-07 21:45:15', 'Compra #65'),
(62, 32, 6, 'ENTRADA', 0, 10, 0, 10, '2026-10-07 21:47:03', 'Compra #66'),
(67, 42, 8, 'ENTRADA', 0, 1, 0, 1, '2026-10-08 18:36:28', 'Compra #87'),
(68, 42, 8, 'ENTRADA', 0, 1, 0, 1, '2026-10-08 19:09:30', 'Compra #93'),
(69, 43, 8, 'ENTRADA', 0, 3, 0, 3, '2026-10-08 19:48:19', 'Compra #104'),
(70, 43, 8, 'ENTRADA', 3, 1, 0, 4, '2026-10-08 19:56:44', 'Compra #110'),
(71, 44, 6, 'ENTRADA', 1, 12, 0, 13, '2026-10-08 20:01:11', 'Compra #112'),
(72, 45, 6, 'ENTRADA', 0, 2, 0, 2, '2026-10-08 20:31:21', 'Compra #118'),
(73, 46, 8, 'ENTRADA', 0, 2, 0, 2, '2026-10-08 20:44:48', 'Compra #120'),
(74, 45, 6, 'ENTRADA', 2, 2, 0, 4, '2026-10-08 20:44:56', 'Compra #121'),
(75, 48, 8, 'ENTRADA', 0, 12, 0, 12, '2026-10-08 20:46:12', 'Compra #122'),
(76, 50, 8, 'ENTRADA', 0, 2, 0, 2, '2026-10-08 20:51:45', 'Compra #125'),
(77, 52, 8, 'ENTRADA', 0, 12, 0, 12, '2026-10-08 20:55:56', 'Compra #126'),
(78, 55, 8, 'ENTRADA', 0, 2, 0, 2, '2026-10-08 20:59:28', 'Compra #127'),
(79, 56, 8, 'ENTRADA', 0, 3, 0, 3, '2026-10-08 21:08:29', 'Compra #128'),
(80, 59, 8, 'ENTRADA', 0, 34, 0, 34, '2026-10-08 21:14:41', 'Compra #129'),
(81, 61, 8, 'ENTRADA', 0, 50, 0, 50, '2026-10-08 21:34:48', 'Compra #130'),
(82, 64, 8, 'ENTRADA', 0, 3, 0, 3, '2026-10-08 21:37:17', 'Compra #131'),
(83, 64, 8, 'ENTRADA', 6, 3, 0, 9, '2026-10-08 21:39:54', 'Compra #132'),
(84, 64, 8, 'ENTRADA', 9, 1, 0, 10, '2026-10-08 21:40:19', 'Compra #133'),
(85, 65, 6, 'ENTRADA', 0, 3, 0, 3, '2026-10-08 21:40:34', 'Compra #134'),
(86, 64, 8, 'ENTRADA', 10, 80, 0, 90, '2026-10-12 14:56:30', 'Compra #135'),
(87, 61, 8, 'ENTRADA', 0, 2, 0, 2, '2026-10-12 15:05:44', 'Compra #136'),
(88, 54, 8, 'ENTRADA', 0, 50, 0, 50, '2026-10-12 15:09:11', 'Compra #137'),
(89, 54, 8, 'ENTRADA', 50, 1, 0, 51, '2026-10-12 15:12:19', 'Compra #138'),
(90, 54, 8, 'ENTRADA', 51, 1, 0, 52, '2026-10-12 15:12:41', 'Compra #139'),
(91, 66, 8, 'ENTRADA', 0, 70, 0, 70, '2026-10-13 18:55:02', 'Compra #140'),
(92, 76, 8, 'ENTRADA', 0, 100, 0, 100, '2026-10-23 22:06:24', 'Compra #141'),
(93, 75, 8, 'ENTRADA', 0, 150, 0, 150, '2026-10-23 22:06:24', 'Compra #141'),
(94, 69, 8, 'ENTRADA', 0, 50, 0, 50, '2026-10-23 22:07:59', 'Compra #142'),
(95, 70, 8, 'ENTRADA', 0, 30, 0, 30, '2026-10-23 22:07:59', 'Compra #142'),
(96, 76, 0, 'SALIDA', 100, 0, 1, 99, '2026-10-23 22:08:20', 'Venta factura FAC-000018'),
(97, 76, 0, 'SALIDA', 99, 0, 2, 97, '2026-10-23 22:08:20', 'Venta factura FAC-000018'),
(98, 70, 0, 'SALIDA', 30, 0, 2, 28, '2026-10-24 15:26:02', 'FACT-000054'),
(99, 70, 0, 'SALIDA', 28, 0, 2, 26, '2026-10-24 15:31:07', 'FACT-000056'),
(100, 79, 8, 'ENTRADA', 0, 2, 0, 2, '2026-10-24 21:52:25', 'Compra #156'),
(101, 81, 8, 'ENTRADA', 0, 2, 0, 2, '2026-10-24 21:52:40', 'Compra #157'),
(102, 94, 0, 'SALIDA', 2, 0, 1, 1, '2026-10-24 21:54:16', 'FACT-000057'),
(103, 95, 8, 'ENTRADA', 0, 50, 0, 50, '2026-10-24 21:58:01', 'Compra #158'),
(104, 96, 0, 'SALIDA', 50, 0, 1, 49, '2026-10-24 22:00:15', 'FACT-000059');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagina`
--

CREATE TABLE `pagina` (
  `id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pagina`
--

INSERT INTO `pagina` (`id`, `nombre`, `url`) VALUES
(18, 'Listado de Productos', '../productos/index.html'),
(20, 'Listado de compras', '../compras/index.html'),
(21, 'Dashboard', '../dashboard/index.html'),
(22, 'Stock General', '../stock/index.html'),
(23, 'Listado de Movimientos', '../movimientos/index.html'),
(24, 'Listado de Facturas', '../facturas/index.html'),
(25, 'Listado de Proveedores', '../proveedores/index.html'),
(26, 'Listado de Clientes', '../clientes/index.html'),
(27, 'Listado de Usuarios', '../usuarios/index.html'),
(28, 'Listado de Roles', '../roles/index.html'),
(29, 'Listado de Almacenes', '../almacenes/index.html'),
(30, 'Listado de Categorías', '../categorias/index.html');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos`
--

CREATE TABLE `permisos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `permisos`
--

INSERT INTO `permisos` (`id`, `nombre`) VALUES
(1, 'Crear'),
(2, 'Leer'),
(3, 'Actualizar'),
(4, 'Eliminar');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `id_categoria` int(11) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `descripcion`, `id_categoria`, `precio`, `estado`) VALUES
(31, 'Biotina 20,000mg', 'Cápsulas para cabello y uñas', 2, 2030.34, 1),
(32, 'Biotina 10,000mcg', 'Cápsulas para cabello y uñas', 4, 1500.33, 1),
(33, 'Amoxicilina 500mg', 'Cápsulas', 1, 1000.00, 1),
(34, 'Boss Light Year', 'Muñeco de peluche de 30cm', 3, 5600.00, 1),
(35, 'Escoba Amarilla', 'Escoba plástica de mango de madera', 5, 890.89, 1),
(36, 'Vitamina C', 'Cápsulas', 2, 790.34, 1),
(37, 'Juan Sierra', 'Pato', 5, 1200.00, 0),
(38, 'PC Mesa', 'Tecnologia', 5, 100000.00, 0),
(39, 'Bactron Forte', 'Pastillas comestibles de 400mg', 2, 2300.00, 1),
(40, 'Amoxicilina-Acido Clavunalico 875-125mg ', 'Drotafarma', 2, 38000.00, 1),
(41, 'Teclado', 'Teclado blanco 30cm', 5, 14.00, 0),
(42, 'Teclado', 'Teclado blanco 30cm', 6, 1.34, 1),
(44, 'Cefalexina', 'Tab 675mg', 2, 122.00, 0),
(45, 'Cefalexina', 'Tab 675mg', 2, 1000.00, 1),
(46, 'Kuromi', 'Peluche 20cm', 6, 1800.00, 1),
(47, 'Tasa', 'Porcelana roja', 6, 1700.00, 1),
(48, 'Jabón BIOS', 'jabón para piel grasa', 4, 1234.00, 1),
(49, 'Jose Berti', 'gordo', 6, 0.00, 1),
(50, 'Bolso Totto', 'Bolso escolar negro', 6, 10.00, 1),
(51, 'Sabana', 'Cobija roja de 194x180 cm', 6, 5000.00, 0),
(52, 'Cobijas', 'Cobija roja de 194x180 cm', 6, 12.00, 1),
(53, 'Cobijasin', 'Cobija roja de 194x180 cm', 6, 0.00, 1),
(54, 'Biotina 10,000mg', '234', 2, 23.00, 1),
(55, 'Wheeler', 'Cantante', 6, 12.00, 1),
(56, 'Cuaderno', 'Tesis Norma', 6, 900.00, 0),
(57, 'Cuadernosss', 'Tesis Norma', 6, 123.00, 1),
(58, 'telefono', 'sansung a51', 6, 1234.00, 0),
(59, 'Colador', 'Colador de pasta', 6, 1000.00, 1),
(60, 'Pilas AA', ' Pack de 2 unidades', 6, 1500.00, 1),
(61, 'Ambientador en spray', 'Aroma floral', 5, 3800.00, 1),
(62, 'Shampoo Pantene', ' Anticaspa — 400 ml', 4, 7450.00, 1),
(63, 'Crema dental Colgate', 'Crema dental - 75 ml', 4, 2000.00, 1),
(64, 'Oso de peluche', ' Color marrón - 25 cm', 3, 7000.00, 1),
(65, 'Peluche de unicornio', 'Felpa - 30 cm', 3, 9450.00, 1),
(66, 'Amoxicilina 500mg', '6 Cápsulas - La Sante', 2, 3000.00, 1),
(67, 'Azitromicina 500mg', '3 Tabletas - Calox', 2, 1700.00, 1),
(68, 'Unicornio de felpa', 'Rosado - 30cm', 6, 7500.00, 1),
(69, 'Cepillo dental', 'golgate cerdas suaves', 4, 3500.00, 1),
(70, 'lapiz caja', 'mongol 12u', 6, 1000.00, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(150) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`id`, `nombre`, `telefono`, `correo`, `direccion`, `estado`) VALUES
(1, 'Laboratorios FarmaPlus', '04141234567', 'labo@gmail.com', 'Av. Libertador, Caracas', 1),
(2, 'Distribuidora Medisalud', '04241239872', 'joosee@gmail.com', 'Calle 12, Maracaibo', 0),
(5, 'Empresas Polar CA', '04141112233', 'jugueteria200@gmail.com', 'Urb. Las Flores, Calle 34', 0),
(8, 'TecnoMed Global', '04161234598', 'contacto@tecnomedglobal.com', 'Torre Médica, Piso 4, Maracaibos', 0),
(9, 'CleanHouse Distribuciones', '04241230011', 'ventas@cleanhouse.com.ve', 'Av. 5 de Julio, Sector Paraíso, Maracaibo', 1),
(10, 'NutriPlus Venezuela', '04121239888', 'info@nutriplusvzla.com', 'Centro Empresarial La Trinidad, Caracas', 1),
(11, 'MedEquip Solutions', '04141233456', 'soporte@medequipsol.com', 'Zona Industrial II, Valencia', 1),
(13, 'Drogueria Solidaria De Venezuela', '0412-5555555', 'drogueriaSolidaria@gmail.com', 'Maracaibo Zona Norte', 1),
(15, 'IdealProv C.A', '0414-1112233', 'jdvegas12@gmail.com', 'Av. Principal, Bobures', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rm_pagin`
--

CREATE TABLE `rm_pagin` (
  `id` int(11) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `id_modulo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rm_pagin`
--

INSERT INTO `rm_pagin` (`id`, `id_rol`, `id_modulo`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 2),
(4, 1, 3),
(5, 1, 3),
(6, 1, 4),
(7, 1, 4),
(8, 1, 5),
(9, 1, 6),
(10, 1, 7),
(11, 1, 7),
(12, 1, 8),
(13, 1, 8),
(14, 1, 9),
(15, 1, 9),
(16, 1, 10),
(17, 1, 11),
(18, 2, 1),
(19, 2, 3),
(20, 2, 4),
(21, 2, 5),
(22, 2, 6),
(23, 2, 7),
(24, 2, 8),
(25, 2, 9),
(26, 3, 3),
(27, 3, 4),
(28, 3, 8),
(29, 3, 2),
(31, 12, 1),
(32, 12, 4),
(33, 12, 5),
(34, 12, 7),
(35, 12, 6),
(36, 3, 1),
(37, 3, 7),
(38, 12, 3),
(39, 12, 9),
(40, 3, 9),
(41, 12, 8),
(42, 3, 5),
(43, 2, 2),
(44, 12, 2),
(45, 3, 6),
(48, 1, 12),
(49, 2, 12),
(50, 3, 12),
(51, 12, 12);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rm_per`
--

CREATE TABLE `rm_per` (
  `id` int(11) NOT NULL,
  `id_rm_pagin` int(11) NOT NULL,
  `id_pagina` int(11) NOT NULL,
  `id_permiso` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rm_per`
--

INSERT INTO `rm_per` (`id`, `id_rm_pagin`, `id_pagina`, `id_permiso`) VALUES
(130, 27, 18, 2),
(131, 29, 30, 2),
(133, 16, 28, 1),
(134, 16, 28, 2),
(135, 16, 28, 3),
(136, 16, 28, 4),
(137, 1, 21, 1),
(138, 1, 21, 2),
(139, 1, 21, 3),
(140, 1, 21, 4),
(141, 2, 30, 1),
(142, 2, 30, 2),
(143, 2, 30, 3),
(144, 2, 30, 4),
(145, 4, 26, 1),
(146, 4, 26, 2),
(147, 4, 26, 3),
(148, 4, 26, 4),
(149, 6, 18, 1),
(150, 6, 18, 2),
(151, 6, 18, 3),
(152, 6, 18, 4),
(153, 8, 22, 1),
(154, 8, 22, 2),
(155, 8, 22, 3),
(156, 8, 22, 4),
(157, 9, 23, 1),
(158, 9, 23, 2),
(159, 9, 23, 3),
(160, 9, 23, 4),
(161, 10, 20, 1),
(162, 10, 20, 2),
(163, 10, 20, 3),
(164, 10, 20, 4),
(165, 12, 24, 1),
(166, 12, 24, 2),
(167, 12, 24, 3),
(168, 12, 24, 4),
(169, 14, 25, 1),
(170, 14, 25, 2),
(171, 14, 25, 3),
(172, 14, 25, 4),
(173, 17, 27, 1),
(174, 17, 27, 2),
(175, 17, 27, 3),
(176, 17, 27, 4),
(185, 31, 21, 1),
(186, 31, 21, 2),
(187, 31, 21, 3),
(188, 31, 21, 4),
(193, 35, 23, 2),
(194, 36, 21, 2),
(195, 20, 18, 1),
(196, 20, 18, 2),
(197, 20, 18, 3),
(198, 32, 18, 2),
(199, 23, 20, 1),
(200, 23, 20, 2),
(201, 23, 20, 3),
(202, 34, 20, 2),
(204, 37, 20, 2),
(205, 19, 26, 1),
(206, 19, 26, 2),
(207, 19, 26, 3),
(208, 26, 26, 1),
(209, 26, 26, 2),
(210, 38, 26, 2),
(211, 39, 25, 2),
(213, 25, 25, 2),
(214, 25, 25, 3),
(215, 24, 24, 2),
(216, 24, 24, 3),
(217, 28, 24, 1),
(218, 28, 24, 2),
(219, 41, 24, 2),
(220, 33, 22, 2),
(221, 42, 22, 2),
(222, 21, 22, 2),
(223, 21, 22, 3),
(224, 43, 30, 1),
(225, 43, 30, 2),
(226, 43, 30, 3),
(227, 44, 30, 2),
(228, 45, 23, 2),
(247, 48, 29, 1),
(248, 48, 29, 2),
(249, 48, 29, 3),
(250, 48, 29, 4),
(251, 49, 29, 1),
(252, 49, 29, 2),
(253, 49, 29, 3),
(254, 50, 29, 2),
(255, 51, 29, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`id`, `nombre`, `descripcion`) VALUES
(1, 'Administrador', 'Acceso a todo el sistema'),
(2, 'Gerente', 'Supervisa operaciones y reportes'),
(3, 'Vendedor', 'Gestiona ventas y atención al cliente'),
(12, 'Farmaceuticos', 'Farmaceuticos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `stock`
--

CREATE TABLE `stock` (
  `id` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad_actual` int(11) NOT NULL DEFAULT 0,
  `cantidad_minima` int(11) DEFAULT 0,
  `cantidad_maxima` int(11) DEFAULT 0,
  `id_almacen` int(11) DEFAULT NULL,
  `estado` tinyint(4) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `stock`
--

INSERT INTO `stock` (`id`, `id_producto`, `cantidad_actual`, `cantidad_minima`, `cantidad_maxima`, `id_almacen`, `estado`) VALUES
(14, 31, 116, 10, 150, 5, 1),
(15, 32, 110, 10, 100, 5, 1),
(16, 33, 71, 10, 150, 5, 1),
(17, 34, 20, 5, 20, 5, 1),
(18, 35, 14, 5, 15, 5, 1),
(19, 36, 27, 10, 150, 5, 1),
(20, 37, 1, 1, 10, 5, 1),
(21, 38, -12, 1, 14, 5, 1),
(22, 39, 27, 10, 90, 5, 1),
(23, 40, 54, 4, 12, 5, 1),
(24, 41, 2, 5, 20, 5, 1),
(25, 42, 11, 5, 20, 5, 1),
(27, 38, 0, 1, 14, 8, 1),
(30, 44, 0, 0, 999999, 8, 1),
(31, 45, 75, 10, 100, 8, 1),
(32, 46, 10, 5, 15, 6, 1),
(35, 33, 29, 10, 150, 6, 1),
(38, 47, 31, 5, 40, 5, 1),
(41, 48, 16, 11, 12, 5, 1),
(42, 48, 1, 11, 12, 8, 1),
(43, 49, 4, 12, 18, 8, 1),
(44, 40, 13, 4, 12, 6, 1),
(45, 50, 4, 1, 10, 6, 1),
(46, 50, 2, 1, 999999, 8, 1),
(47, 51, 0, 3, 10, 6, 1),
(48, 51, 12, 1, 999999, 8, 1),
(49, 52, 0, 4, 14, 6, 1),
(50, 52, 2, 1, 999999, 8, 1),
(51, 53, 0, 22, 122, 6, 1),
(52, 53, 0, 22, 122, 8, 0),
(53, 53, 12, 22, 122, 5, 1),
(54, 54, 52, 3, 123, 8, 1),
(55, 54, 2, 3, 123, 8, 1),
(56, 55, 2, 1, 10, 8, 1),
(57, 55, 0, 1, 10, 5, 0),
(58, 55, 1, 1, 10, 6, 1),
(59, 56, 68, 10, 50, 8, 1),
(60, 56, 133, 10, 50, 5, 1),
(61, 57, 2, 5, 100, 8, 1),
(62, 57, 50, 5, 100, 5, 1),
(63, 57, 50, 5, 100, 6, 1),
(64, 58, 10, 5, 15, 8, 1),
(65, 58, -77, 5, 15, 6, 1),
(66, 59, 0, 10, 100, 8, 0),
(67, 59, 0, 10, 100, 6, 0),
(68, 59, 70, 10, 100, 5, 1),
(69, 60, 50, 5, 50, 8, 1),
(70, 61, 0, 10, 40, 8, 0),
(71, 62, 0, 5, 50, NULL, 1),
(72, 63, 0, 5, 100, NULL, 1),
(73, 64, 0, 5, 15, NULL, 1),
(74, 65, 0, 5, 15, NULL, 1),
(75, 66, 0, 5, 150, 8, 0),
(76, 67, 97, 20, 150, 8, 1),
(77, 66, 100, 5, 150, 5, 1),
(78, 66, 50, 5, 150, 6, 1),
(79, 68, 2, 3, 15, 8, 1),
(80, 61, 26, 10, 40, 5, 1),
(81, 69, 0, 5, 40, 8, 0),
(94, 69, 1, 5, 40, 5, 1),
(95, 70, 0, 10, 100, 8, 0),
(96, 70, 49, 10, 100, 5, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `usuario` varchar(100) NOT NULL,
  `clave` varchar(255) NOT NULL,
  `correo` varchar(150) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `nombre`, `usuario`, `clave`, `correo`, `telefono`, `estado`) VALUES
(1, 'Dayana Nava', 'admin', '$2y$10$NG8dP2vz2Zn5Y0hUukbfq.8w/KF9FPPO5WDSGqSCmdmXnUuXdio0e', 'jdvegas12@gmail.com', '0414-6901837', 1),
(5, 'Jose Berti', 'vendedor', '$2y$10$i0MOzeG19UKlAS8Wd.A/i.Z5qahSQAW8iJ0S.uO3s7UddRIirHdI.', 'joosee@gmail.com', '0412-4445566', 1),
(15, 'Josue Pineda', 'pineda', '$2y$10$Pp6XOF1QsPpXfQp7oVmFn.W3KNZzj456aQ9rPRLjVDnmrPjlIgKaG', 'riooooo@gmail.com', '04161234567', 0),
(17, 'Adelso Berti', 'adelso', '$2y$10$prQ07/kfNFIrREdbOXir7.31Wb2/aaWb0Lpxn2NPKgDlrW.THkCeO', 'adelsoberti@gmail.com', '04121025140', 1),
(19, 'Carlos Ponce', 'farma', '$2y$10$Xez4rknemX4rPOXQBlpwuOfygn.0stKg486u1/YnEvtzfYNmeDIbS', 'riooooo@gmail.com', '0414-1112233', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_rol`
--

CREATE TABLE `usuario_rol` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_rol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario_rol`
--

INSERT INTO `usuario_rol` (`id`, `id_usuario`, `id_rol`) VALUES
(44, 1, 1),
(59, 17, 3),
(60, 17, 2),
(61, 17, 1),
(62, 5, 3),
(63, 19, 12);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id` int(11) NOT NULL,
  `numero_factura` varchar(20) NOT NULL,
  `fecha` datetime NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `id_caja` int(11) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`id`, `numero_factura`, `fecha`, `id_cliente`, `id_caja`, `total`, `id_usuario`) VALUES
(32, 'FAC-000001', '2026-07-05 21:54:31', 16, 1, 3909.20, 1),
(33, 'FAC-000002', '2026-07-05 22:02:45', 17, 1, 5835.96, 1),
(34, 'FAC-000003', '2026-07-05 22:04:03', 21, 2, 12992.00, 1),
(35, 'FAC-000004', '2026-07-05 22:04:23', 10, 1, 3353.43, 1),
(36, 'FAC-000005', '2026-07-06 00:36:03', 9, 2, 5568.00, 1),
(37, 'FAC-000006', '2026-07-06 10:57:35', 20, 2, 348000.00, 1),
(38, 'FAC-000007', '2026-07-07 14:25:53', 16, 2, 7576.34, 1),
(39, 'FAC-000008', '2026-07-08 09:20:29', 17, 1, 220400.00, 1),
(40, 'FAC-000009', '2026-07-08 09:47:24', 16, 2, 132240.00, 1),
(41, 'FAC-000010', '2026-07-08 10:16:15', 16, 1, 176320.00, 1),
(42, 'FAC-000011', '2026-08-23 22:42:16', 16, 1, 6496.00, 1),
(43, 'FAC-000012', '2026-08-23 22:43:44', 16, 1, 12992.00, 1),
(44, 'FAC-000013', '2026-08-23 22:43:59', 19, 1, 2355.19, 1),
(45, 'FAC-000014', '2026-09-29 19:50:40', 2, 1, 44080.00, 1),
(51, 'FAC-000015', '2026-09-29 21:03:06', 2, 1, 44080.00, 1),
(52, 'FAC-000016', '2026-09-29 21:27:44', 38, 2, 3515.19, 1),
(53, 'FAC-000017', '2026-09-29 21:34:11', 2, 1, 2668.00, 1),
(55, 'FACT-000054', '2026-10-24 15:26:01', 8, 1, 8816.00, 1),
(56, 'FACT-000056', '2026-10-24 15:31:07', 2, 1, 8816.00, 1),
(58, 'FACT-000057', '2026-10-24 21:54:16', 2, 1, 4060.00, 1),
(59, 'FACT-000059', '2026-10-24 22:00:15', 2, 1, 1044.00, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `almacen`
--
ALTER TABLE `almacen`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `caja`
--
ALTER TABLE `caja`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `compras`
--
ALTER TABLE `compras`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_proveedor` (`id_proveedor`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `detalle_compras`
--
ALTER TABLE `detalle_compras`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `id_compra` (`id_compra`);

--
-- Indices de la tabla `detalle_pago`
--
ALTER TABLE `detalle_pago`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_venta` (`id_venta`),
  ADD KEY `id_metodo_pago` (`id_metodo_pago`);

--
-- Indices de la tabla `detalle_ventas`
--
ALTER TABLE `detalle_ventas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `id_venta` (`id_venta`);

--
-- Indices de la tabla `direccion`
--
ALTER TABLE `direccion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `metodo_pago`
--
ALTER TABLE `metodo_pago`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `modulo`
--
ALTER TABLE `modulo`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_stock` (`id_stock`);

--
-- Indices de la tabla `pagina`
--
ALTER TABLE `pagina`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `permisos`
--
ALTER TABLE `permisos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_categoria` (`id_categoria`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `rm_pagin`
--
ALTER TABLE `rm_pagin`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_rol` (`id_rol`),
  ADD KEY `id_modulo` (`id_modulo`);

--
-- Indices de la tabla `rm_per`
--
ALTER TABLE `rm_per`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_rm_pagin` (`id_rm_pagin`),
  ADD KEY `id_permiso` (`id_permiso`),
  ADD KEY `id_pagina` (`id_pagina`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `id_almacen` (`id_almacen`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario` (`usuario`);

--
-- Indices de la tabla `usuario_rol`
--
ALTER TABLE `usuario_rol`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_rol` (`id_rol`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero_factura` (`numero_factura`),
  ADD KEY `id_cliente` (`id_cliente`),
  ADD KEY `id_caja` (`id_caja`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `almacen`
--
ALTER TABLE `almacen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `caja`
--
ALTER TABLE `caja`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT de la tabla `compras`
--
ALTER TABLE `compras`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=159;

--
-- AUTO_INCREMENT de la tabla `detalle_compras`
--
ALTER TABLE `detalle_compras`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT de la tabla `detalle_pago`
--
ALTER TABLE `detalle_pago`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `detalle_ventas`
--
ALTER TABLE `detalle_ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT de la tabla `direccion`
--
ALTER TABLE `direccion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `metodo_pago`
--
ALTER TABLE `metodo_pago`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `modulo`
--
ALTER TABLE `modulo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT de la tabla `pagina`
--
ALTER TABLE `pagina`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `permisos`
--
ALTER TABLE `permisos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `rm_pagin`
--
ALTER TABLE `rm_pagin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT de la tabla `rm_per`
--
ALTER TABLE `rm_per`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=256;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `stock`
--
ALTER TABLE `stock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `usuario_rol`
--
ALTER TABLE `usuario_rol`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `compras`
--
ALTER TABLE `compras`
  ADD CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id`),
  ADD CONSTRAINT `compras_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `detalle_compras`
--
ALTER TABLE `detalle_compras`
  ADD CONSTRAINT `detalle_compras_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`),
  ADD CONSTRAINT `detalle_compras_ibfk_2` FOREIGN KEY (`id_compra`) REFERENCES `compras` (`id`);

--
-- Filtros para la tabla `detalle_pago`
--
ALTER TABLE `detalle_pago`
  ADD CONSTRAINT `detalle_pago_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id`),
  ADD CONSTRAINT `detalle_pago_ibfk_2` FOREIGN KEY (`id_metodo_pago`) REFERENCES `metodo_pago` (`id`);

--
-- Filtros para la tabla `detalle_ventas`
--
ALTER TABLE `detalle_ventas`
  ADD CONSTRAINT `detalle_ventas_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`),
  ADD CONSTRAINT `detalle_ventas_ibfk_2` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id`);

--
-- Filtros para la tabla `direccion`
--
ALTER TABLE `direccion`
  ADD CONSTRAINT `direccion_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `movimientos`
--
ALTER TABLE `movimientos`
  ADD CONSTRAINT `movimientos_ibfk_1` FOREIGN KEY (`id_stock`) REFERENCES `stock` (`id`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id`);

--
-- Filtros para la tabla `rm_pagin`
--
ALTER TABLE `rm_pagin`
  ADD CONSTRAINT `rm_pagin_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id`),
  ADD CONSTRAINT `rm_pagin_ibfk_3` FOREIGN KEY (`id_modulo`) REFERENCES `modulo` (`id`);

--
-- Filtros para la tabla `rm_per`
--
ALTER TABLE `rm_per`
  ADD CONSTRAINT `rm_per_ibfk_1` FOREIGN KEY (`id_rm_pagin`) REFERENCES `rm_pagin` (`id`),
  ADD CONSTRAINT `rm_per_ibfk_2` FOREIGN KEY (`id_permiso`) REFERENCES `permisos` (`id`),
  ADD CONSTRAINT `rm_per_ibfk_3` FOREIGN KEY (`id_pagina`) REFERENCES `pagina` (`id`);

--
-- Filtros para la tabla `stock`
--
ALTER TABLE `stock`
  ADD CONSTRAINT `stock_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`),
  ADD CONSTRAINT `stock_ibfk_2` FOREIGN KEY (`id_almacen`) REFERENCES `almacen` (`id`);

--
-- Filtros para la tabla `usuario_rol`
--
ALTER TABLE `usuario_rol`
  ADD CONSTRAINT `usuario_rol_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `usuario_rol_ibfk_2` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id`);

--
-- Filtros para la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id`),
  ADD CONSTRAINT `ventas_ibfk_2` FOREIGN KEY (`id_caja`) REFERENCES `caja` (`id`),
  ADD CONSTRAINT `ventas_ibfk_3` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
