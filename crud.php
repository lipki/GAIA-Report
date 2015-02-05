<?php
    header("Cache-Control: max-age=1");
    
    if( $_REQUEST['debug'] ) {
        ini_set('display_errors', 1);
        ini_set('log_errors', 1);
        ini_set('error_log', dirname(__file__) . '/log_error_php.txt');
        error_reporting(E_ALL);
        echo "version 5"."<br/>";
    }
    
    function d ( $obj, $det = false ) {
        if( $_REQUEST['debug'] && $det )
            echo print_r($obj, true)."<br/>";
        else if( $_REQUEST['debug'] )
            echo $obj."<br/>";
    }
?>

<?php

// db sqlite
$db = new SQLite3(dirname(__FILE__).'/db/gaia.sqlite');                         d($db, true);

// action
$action = isset($_REQUEST['action']) ? $_REQUEST['action'] : '';                d($action);

if( isset($_REQUEST['login']) && $action == 'user_exist' ) {
    
    $login = stripslashes($_REQUEST['login']);                                  d($login);
    
    $query = "SELECT * FROM user WHERE login = '".$login."';";                  d($query);
    $res = $db->query($query);                                                  d($res, true);
    $rest = $res->fetchArray();                                                 d($rest, true);
    
    if ( is_array($rest) ) {                                                    d($login." exist");
        $rest['reply'] = true;
    } else {                                                                    d($login." unexist");
        
        $req =  'INSERT INTO user '.
                '(login, `group`, create_date, last_login_date, suspend, rank) '.
                'VALUES ("'.$login.'", "", datetime(), datetime(), 0, 1);';     d($req);
        $do = $db->exec($req);                                                  d($do, true);
    
        $query = "SELECT * FROM user WHERE login = '".$login."';";              d($query);
        $res = $db->query($query);                                              d($res, true);
        $rest = $res->fetchArray();                                             d($rest, true);
        
        $rest['reply'] = false;
    }
    
    if( isset($_REQUEST['X']) && isset($_REQUEST['Y']) ) {
    
        $X = stripslashes($_REQUEST['X']);                                      d($X);
        $Y = stripslashes($_REQUEST['Y']);                                      d($Y);
        
        $req = 'INSERT INTO position '.
               '(user, X, Y, date, time) '.
               'VALUES ("'.$login.'", '.$X.', '.$Y.', date(), datetime());';    d($req);
        $do = @$db->exec($req);                                                 d($do, true);
    
    }
    
    echo json_encode ( $rest );
}

if( isset($_REQUEST['login']) && $action == 'user_move' ) {
    
    $login = stripslashes($_REQUEST['login']);                                  d($login);
    
    $query = "SELECT * FROM position ".
             "WHERE user = '".$login."' ORDER BY time ASC;";                    d($query);
    $res = $db->query($query);                                                  d($res, true);
    $rest = [];
    while($row=$res->fetchArray())
        $rest[] = $row;                                                         d($rest, true);
    
    echo json_encode ( $rest );
}

?>
