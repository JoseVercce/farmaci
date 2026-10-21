<?php
$data = json_decode(file_get_contents("farmacia.json"), true);
echo json_encode($data);
?>
