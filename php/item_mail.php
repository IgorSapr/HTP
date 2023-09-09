<?php
require 'base_mail.php';

$title = "Тема письма";

$postData = file_get_contents('php://input');
$data = json_decode($postData, true);

$c = true;
// Формирование самого письма
$title = "Заголовок письма";

$name = $data['Имя'];
$tel = $data['Телефон'];
$email = $data['Email'];

$body = "<p style='font-size: 24px;'>Данные о покупателе:</p>";
$body = "$body<table style='width: 100%;'>
  <tr style='background-color: #f8f8f8;'>
    <td style='padding: 10px; border: #e9e9e9 1px solid;'><b>Имя</b></td>
    <td style='padding: 10px; border: #e9e9e9 1px solid;'>$name</td>
  </tr>
  <tr style='background-color: #f8f8f8;'>
    <td style='padding: 10px; border: #e9e9e9 1px solid;'><b>Телефон</b></td>
    <td style='padding: 10px; border: #e9e9e9 1px solid;'>$tel</td>
  </tr>
  <tr style='background-color: #f8f8f8;'>
    <td style='padding: 10px; border: #e9e9e9 1px solid;'><b>Email</b></td>
    <td style='padding: 10px; border: #e9e9e9 1px solid;'>$email</td>
  </tr>
</table>";

$body = "$body<p style='font-size: 24px;'>Список товаров:</p>";

$items_body = "
    " . ( ($c = !$c) ? '<tr>':'<tr style="background-color: #f8f8f8;">' ) . "
      <td style='padding: 10px; border: #e9e9e9 1px solid;'><b>Название товара</b></td>
      <td style='padding: 10px; border: #e9e9e9 1px solid;'><b>Артикль</b></td>
      <td style='padding: 10px; border: #e9e9e9 1px solid;'><b>Количество товара</b></td>
    </tr>
    ";

foreach ( $data["items"] as $value ) {

  $item_name = $value["name"];
  $item_article = $value["article"];
  $item_count = $value["count"];

  $items_body .= "
    " . ( ($c = !$c) ? '<tr>':'<tr style="background-color: #f8f8f8;">' ) . "
      <td style='padding: 10px; border: #e9e9e9 1px solid;'>$item_name</td>
      <td style='padding: 10px; border: #e9e9e9 1px solid;'>$item_article</td>
      <td style='padding: 10px; border: #e9e9e9 1px solid;'>$item_count</td>
    </tr>
    ";
}

$items_body = "<table style='width: 100%;'>$items_body</table>";
$body = "$body $items_body";

try {
  // Отправка сообщения
  $mail->isHTML(true);
  $mail->Subject = $title;
  $mail->Body = $body;

  $mail->send();

} catch (Exception $e) {
  $status = "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
}
