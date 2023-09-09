<?php
// Файлы phpmailer
require '../phpmailer/src/PHPMailer.php';
require '../phpmailer/src/SMTP.php';
require '../phpmailer/src/Exception.php';

// Настройки PHPMailer
$mail = new PHPMailer\PHPMailer\PHPMailer();

$mail->isSMTP();
$mail->CharSet = "UTF-8";
$mail->SMTPAuth   = true;

// Настройки вашей почты
$mail->Host       = 'smtp.gmail.com'; // SMTP сервера вашей почты
$mail->Username   = 'elenatechmail@gmail.com'; // Логин на почте
$mail->Password   = 'exmcuwyubcfsldvr'; // Пароль на почте
$mail->SMTPSecure = 'ssl';
$mail->Port       = 465;

$mail->setFrom('elenatechmail@gmail.com', 'Заявка с вашего сайта'); // Адрес самой почты и имя отправителя

// Получатель письма
$mail->addAddress('info@chtp-spb.ru');
