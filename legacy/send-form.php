<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Получаем данные формы
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    // Пробуем получить данные из POST
    $data = $_POST;
}

// Проверяем обязательные поля
$required_fields = ['Имя', 'Email', 'Телефон', 'Город'];
$missing_fields = [];

foreach ($required_fields as $field) {
    if (empty($data[$field])) {
        $missing_fields[] = $field;
    }
}

if (!empty($missing_fields)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields: ' . implode(', ', $missing_fields)]);
    exit;
}

// Формируем сообщение
$message = "Новая заявка на тест-драйв\n\n";
$message .= "Имя: " . htmlspecialchars($data['Имя']) . "\n";
$message .= "Email: " . htmlspecialchars($data['Email']) . "\n";
$message .= "Телефон: " . htmlspecialchars($data['Телефон']) . "\n";
$message .= "Город: " . htmlspecialchars($data['Город']) . "\n";

if (!empty($data['Дополнительная информация'])) {
    $message .= "Дополнительная информация: " . htmlspecialchars($data['Дополнительная информация']) . "\n";
}

$message .= "\nДата отправки: " . date('d.m.Y H:i:s');

// Настройки для отправки
$to = 'Delivery.Help.me@gmail.com';
$subject = 'Новая заявка на тест-драйв';
$headers = "From: noreply@deli-bag.ru\r\n";
$headers .= "Reply-To: " . htmlspecialchars($data['Email']) . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Отправляем email
$mail_sent = mail($to, $subject, $message, $headers);

if ($mail_sent) {
    echo json_encode(['success' => true, 'message' => 'Форма успешно отправлена']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка при отправке email']);
}
?>
