<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'base_mail.php';

$mail->setLanguage('ru', 'phpmailer/language/');
$mail->IsHTML(true);

// Тема письма
$mail->Subject = 'Термоусадочная рукавная слив — sleeve этикетка';

// Тело письма
$body = '<h1>Контактные данные</h1>';

if(trim(!empty($_POST['name']))){
   $body.='<p><strong>Имя:</strong> '.$_POST['name'].'</p>';
  }

if(trim(!empty($_POST['tel']))){
   $body.='<p><strong>Телефон:</strong> '.$_POST['tel'].'</p>';
  }

if(trim(!empty($_POST['email']))){
  $body.='<p><strong>E-mail:</strong> '.$_POST['email'].'</p>';
}

if(trim(!empty($_POST['message']))){
  $body.='<p><strong>Сообщение:</strong> '.$_POST['message'].'</p>';
}

 $mail->Body = $body;

//  Отправляем
 if (!$mail->send()) {
  $message = 'Ошибка';
 } else {
  $message = 'Данные отправлены!';
 }

 $response = ['message' => $message];

 header('Content-type: application/json');
 echo json_encode($response);
?>
