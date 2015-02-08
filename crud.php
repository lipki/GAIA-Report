<?php

header("Cache-Control: max-age=1");

if( $_REQUEST['debug'] ) {
    ini_set('display_errors', 1);
    ini_set('log_errors', 1);
    ini_set('error_log', dirname(__file__) . '/log_error_php.txt');
    error_reporting(E_ALL);
    echo "version 5"."<br/>";
}

function d ( $obj ) {
    if( $_REQUEST['debug'] )
        echo print_r($obj, true)."<br/>";
}

class CRUD {

    var $dbname = '/db/gaia.sqlite';
    var $reply = [ "data"=>[], "erreur"=>'', "success"=>false ];
    var $db;
    
    function CRUD() {
    
        d('Action : '.$this->is($_REQUEST['action']));
        switch ( $this->is($_REQUEST['action']) ) {
            case 'isUserExist' : $this->isUserExist(); break;
            case 'getUserMove' : $this->getUserMove(); break;
            case 'getCellInfo' : $this->getCellInfo(); break;
            case 'setCellInfo' : $this->setCellInfo(); break;
            default :
                $this->reply['erreur'] = 'Action inconnu';
                echo json_encode ( $this->reply );
        }
        
        if( !isset($this->db) )
            $this->db->close();
    }
    
    function is( $obj ) {
        return isset($obj) ? stripslashes($obj) : '';
    }
    
    function query( $query ) {
        if( !isset($this->db) ) $this->db = new SQLite3(dirname(__FILE__).$this->dbname);
        
        d($query);
        @$res = $this->db->query($query);
        
        if ( is_array($res->fetchArray()) ) {
        
            $res->reset();
            
            $data = [];
            while( $row=$res->fetchArray(SQLITE3_ASSOC) ) {
                $data[] = $row;
            }
            
            d($data);
            return $data;
        } else {
            d('false');
            return false;
        }
    }
    
    
    
    
    
    function isUserExist() {
        
        $login = $this->is($_REQUEST['login']);
        
        if( $login != '' ) {
            
            $this->reply['data'] = $this->query("SELECT * FROM user WHERE login = '".$login."'");
            
            if ( is_array($this->reply['data']) ) {
                d($login." exist");
                $this->reply['success'] = true;
            } else {
                d($login." unexist");
                
                $rep = $this->query('INSERT INTO user '.
                                    '(login, `group`, create_date, last_login_date, suspend, rank) '.
                                    'VALUES ("'.$login.'", "", datetime(), datetime(), 0, 1)');
                
                $this->reply['data'] = $this->query("SELECT * FROM user WHERE login = '".$login."'");
                
                $this->reply['success'] = false;
                $this->reply['erreur'] = 'nouveaux';
            }
            
            echo json_encode ( $this->reply );
        } else {
            $this->reply['success'] = false;
            $this->reply['erreur'] = 'Argument incomplet';
            echo json_encode ( $this->reply );
        }
        
    }
    
    function getUserMove() {
        
        $login = $this->is($_REQUEST['login']);
        
        if( $login != '' ) {
        
            $this->reply['data'] = $this->query("SELECT * FROM position ".
                                                "WHERE user = '".$login."' ORDER BY time ASC");
            
            $this->reply['success'] = true;
    
            echo json_encode ( $this->reply );
        } else {
            $this->reply['success'] = false;
            $this->reply['erreur'] = 'Argument incomplet';
            echo json_encode ( $this->reply );
        }
        
    }
    
    function getCellInfo() {
    
        $X = $this->is($_REQUEST['X']);
        $Y = $this->is($_REQUEST['Y']);
        
        if( $X != '' && $Y != '' ) {
            
            $this->reply['data'] = $this->query("SELECT * FROM cells ".
                                                "WHERE X = '".$X."' AND Y = '".$Y."'");
            
            $this->reply['success'] = true;
    
            echo json_encode ( $this->reply );
        } else {
            $this->reply['success'] = false;
            $this->reply['erreur'] = 'Argument incomplet';
            echo json_encode ( $this->reply );
        }
        
    }
    
    function setCellInfo() {
    
        $mineral = $this->is($_REQUEST['mineral']);
        $missile = $this->is($_REQUEST['missile']);
        $antiradar = $_REQUEST['antiradar'] == 'on' ? 1 : 0;
        $bonusp = $this->is($_REQUEST['bonusp']);
        $X = $this->is($_REQUEST['X']);
        $Y = $this->is($_REQUEST['Y']);
        $login = $this->is($_REQUEST['user']);
        
        if(    $login != '' && $X != '' && $Y != '' 
            && $mineral != '' && $missile != '' && $antiradar != '' && $bonusp != '' ) {
            
            $rep = $this->query('INSERT OR IGNORE INTO cells '.
                                '(X, Y, mineral, missile, bonus, antiradar, user, date) '.
                                'VALUES ('.$X.', '.$Y.', '.$mineral.', '.$missile.', '.$bonusp.', '.$antiradar.', "'.$login.'", date())');
    
            $rep = $this->query('UPDATE cells '.
                                'SET mineral='.$mineral.' , missile='.$missile.' , bonus='.$bonusp.' , antiradar='.$antiradar.' , date=date() '.
                                'WHERE X='.$X.' AND Y='.$Y.' AND user="'.$login.'"');
            
            $this->reply['data'] = $this->query("SELECT * FROM cells ".
                                                "WHERE X = '".$X."' AND Y = '".$Y."'");
            
            $this->reply['success'] = true;
    
            echo json_encode ( $this->reply );
        } else {
            $this->reply['success'] = false;
            $this->reply['erreur'] = 'Argument incomplet';
            echo json_encode ( $this->reply );
        }
    
    }
    
}
new CRUD();
