<?php
    header("Cache-Control: max-age=1");
    
    $debug = $_REQUEST['debug'];
    if( $debug ) {
        ini_set('display_errors', 1);
        ini_set('log_errors', 1);
        ini_set('error_log', dirname(__file__) . '/log_error_php.txt');
        error_reporting(E_ALL);
        echo "version 5"."<br/>";
    }
?>

<?php

// db sqlite
$db = new SQLite3(dirname(__FILE__).'/db/gaia.sqlite');
if( $debug ) echo print_r($db, true)."<br/>";

// action
$action = isset($_REQUEST['action']) ? $_REQUEST['action'] : '';
if( $debug ) echo $action."<br/>";

if( isset($_REQUEST['login']) && $action == 'user_exist' ) {
    
    $login = $_REQUEST['login'];
    if( $debug ) echo $login.'<br/>';
    
    $query = "SELECT rank, login FROM user WHERE login = '".stripslashes($login)."';";
    if( $debug ) echo $query.'<br/>';
    
    $res = $db->query($query);
    if( $debug ) echo print_r($res, true)."<br/>";
    
    $rest = $res->fetchArray();
    if( $debug ) echo print_r($rest, true)."<br/>";
    
    if ( is_array($rest) ) {
        if( $debug ) echo $login." exist".'<br/>';
        if( $debug ) echo 'rank '.$rest['rank'].'<br/>';
        
        $results = new stdClass();
        $results->login = $login;
        $results->rank = $rest['rank'];
    } else {
        if( $debug ) echo $login." unexist".'<br/>';
        
        $results = new stdClass();
        $results->login = $login;
        $results->rank = 0;
    }
    
    echo json_encode ( $results );
}

?>
