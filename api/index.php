<?php

error_reporting(E_ALL);

class MyData {
    private $data;

    public function __construct () {
        $json = file_get_contents('data.json');
        $this->data = json_decode($json, true);
    }

    public function getSideMenuItems () {
        return array_keys($this->data);
    }

    public function getTabs ($menu) {
        if (!isset($this->data[$menu])) {
            return array();
        }

        return $this->data[$menu];
    }

    public function getAccordions ($menu, $tab) {
        $tabs = $this->getTabs($menu);

        if (!isset($tabs[$tab])) {
            return array();
        }

        return $tabs[$tab];
    }
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(501);
    exit;
}

$data = new MyData();

switch ($_GET['q']) {
case 'menu':
    $res = $data->getSideMenuItems();
    $result = array();
    foreach ($res as $value) {
        $result[] = array('name' => $value);
    }

    break;
case 'tab':
    if (!isset($_GET['menu'])) {
        http_response_code(400);
        exit;
    }

    $res = $data->getTabs($_GET['menu']);
    $result = array();
    foreach ($res as $key => $value) {
        $accordions = array();
        foreach ($value as $key2 => $value2) {
            $accordions[] = array('name' => $key2, 'content' => $value2);
        }

        $result[] = array('name' => $key, 'menu' => $_GET['menu'], 'data' => $accordions);
    }

    break;
default:
    http_response_code(404);
    exit;
}

$result = json_encode($result);

if (isset($_GET['callback'])) {
    header('Content-Type: text/javascript');
    echo $_GET['callback'] . '(' . $result . ');';
} else {
    header('Content-Type: application/json');
    echo $result;
}
