-- Run this once on the existing berti database before deploying the updated PHP/JS files.
-- Back up the database first. Foreign-key columns, rows, indexes and other schema are preserved.

ALTER TABLE `compras`
  DROP FOREIGN KEY `compras_ibfk_1`,
  DROP FOREIGN KEY `compras_ibfk_2`;
ALTER TABLE `detalle_compras`
  DROP FOREIGN KEY `detalle_compras_ibfk_1`,
  DROP FOREIGN KEY `detalle_compras_ibfk_2`;
ALTER TABLE `detalle_pago`
  DROP FOREIGN KEY `detalle_pago_ibfk_1`,
  DROP FOREIGN KEY `detalle_pago_ibfk_2`;
ALTER TABLE `detalle_ventas`
  DROP FOREIGN KEY `detalle_ventas_ibfk_1`,
  DROP FOREIGN KEY `detalle_ventas_ibfk_2`;
ALTER TABLE `direccion`
  DROP FOREIGN KEY `direccion_ibfk_1`;
ALTER TABLE `movimientos`
  DROP FOREIGN KEY `movimientos_ibfk_1`;
ALTER TABLE `productos`
  DROP FOREIGN KEY `productos_ibfk_1`;
ALTER TABLE `rm_pagin`
  DROP FOREIGN KEY `rm_pagin_ibfk_1`,
  DROP FOREIGN KEY `rm_pagin_ibfk_3`;
ALTER TABLE `rm_per`
  DROP FOREIGN KEY `rm_per_ibfk_1`,
  DROP FOREIGN KEY `rm_per_ibfk_2`,
  DROP FOREIGN KEY `rm_per_ibfk_3`;
ALTER TABLE `stock`
  DROP FOREIGN KEY `stock_ibfk_1`,
  DROP FOREIGN KEY `stock_ibfk_2`;
ALTER TABLE `usuario_rol`
  DROP FOREIGN KEY `usuario_rol_ibfk_1`,
  DROP FOREIGN KEY `usuario_rol_ibfk_2`;
ALTER TABLE `ventas`
  DROP FOREIGN KEY `ventas_ibfk_1`,
  DROP FOREIGN KEY `ventas_ibfk_2`,
  DROP FOREIGN KEY `ventas_ibfk_3`;

ALTER TABLE `almacen` CHANGE COLUMN `id_almacen` `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `caja` CHANGE COLUMN `id_caja` `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `categoria` CHANGE COLUMN `id_categoria` `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `clientes` CHANGE COLUMN `id_cliente` `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `compras` CHANGE COLUMN `id_compra` `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `detalle_compras` CHANGE COLUMN `id_detalle_compra` `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `detalle_pago` CHANGE COLUMN `id_detalle_pago` `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `detalle_ventas` CHANGE COLUMN `id_detalle_venta` `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `direccion` CHANGE COLUMN `id_direccion` `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `metodo_pago` CHANGE COLUMN `id_metodo_pago` `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `modulo` CHANGE COLUMN `id_modulo` `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `movimientos` CHANGE COLUMN `id_movimiento` `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `pagina` CHANGE COLUMN `id_pagina` `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `permisos` CHANGE COLUMN `id_permiso` `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `productos` CHANGE COLUMN `id_producto` `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `proveedores` CHANGE COLUMN `id_proveedor` `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `rm_pagin` CHANGE COLUMN `id_rm_pagin` `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `rm_per` CHANGE COLUMN `id_rm_per` `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `rol` CHANGE COLUMN `id_rol` `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `stock` CHANGE COLUMN `id_stock` `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `usuario` CHANGE COLUMN `id_usuario` `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `usuario_rol` CHANGE COLUMN `id_usuario_rol` `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `ventas` CHANGE COLUMN `id_venta` `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `compras`
  ADD CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id`),
  ADD CONSTRAINT `compras_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`);
ALTER TABLE `detalle_compras`
  ADD CONSTRAINT `detalle_compras_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`),
  ADD CONSTRAINT `detalle_compras_ibfk_2` FOREIGN KEY (`id_compra`) REFERENCES `compras` (`id`);
ALTER TABLE `detalle_pago`
  ADD CONSTRAINT `detalle_pago_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id`),
  ADD CONSTRAINT `detalle_pago_ibfk_2` FOREIGN KEY (`id_metodo_pago`) REFERENCES `metodo_pago` (`id`);
ALTER TABLE `detalle_ventas`
  ADD CONSTRAINT `detalle_ventas_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`),
  ADD CONSTRAINT `detalle_ventas_ibfk_2` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id`);
ALTER TABLE `direccion`
  ADD CONSTRAINT `direccion_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`);
ALTER TABLE `movimientos`
  ADD CONSTRAINT `movimientos_ibfk_1` FOREIGN KEY (`id_stock`) REFERENCES `stock` (`id`);
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id`);
ALTER TABLE `rm_pagin`
  ADD CONSTRAINT `rm_pagin_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id`),
  ADD CONSTRAINT `rm_pagin_ibfk_3` FOREIGN KEY (`id_modulo`) REFERENCES `modulo` (`id`);
ALTER TABLE `rm_per`
  ADD CONSTRAINT `rm_per_ibfk_1` FOREIGN KEY (`id_rm_pagin`) REFERENCES `rm_pagin` (`id`),
  ADD CONSTRAINT `rm_per_ibfk_2` FOREIGN KEY (`id_permiso`) REFERENCES `permisos` (`id`),
  ADD CONSTRAINT `rm_per_ibfk_3` FOREIGN KEY (`id_pagina`) REFERENCES `pagina` (`id`);
ALTER TABLE `stock`
  ADD CONSTRAINT `stock_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`),
  ADD CONSTRAINT `stock_ibfk_2` FOREIGN KEY (`id_almacen`) REFERENCES `almacen` (`id`);
ALTER TABLE `usuario_rol`
  ADD CONSTRAINT `usuario_rol_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `usuario_rol_ibfk_2` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id`);
ALTER TABLE `ventas`
  ADD CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id`),
  ADD CONSTRAINT `ventas_ibfk_2` FOREIGN KEY (`id_caja`) REFERENCES `caja` (`id`),
  ADD CONSTRAINT `ventas_ibfk_3` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`);