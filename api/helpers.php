<?php
require_once '../vendor/mandrill/mandrill/src/Mandrill.php'; //Not required with Composer
define("IDdigits", 6);
define("pwchars","bcdefghijkmnpqrstvwxyzABCDEFGHIJKLMNPQRSTVWXYZ23456789@#$%^&*()+=");
define("less","<=");
define("greater",">=");


function randomNumber($digits){
  return rand(pow(10, $digits - 1) - 1, pow(10, $digits) - 1);
}

function generateLogin($firstname, $lastname){
    // 6 digit userid

    $sql = "SELECT userid from login where userid=:userid";
    $userid = generateUniqueID($sql, "userid");

    // username = first letter of first name + last name + last 5 digits of userid
    $firstname = strtolower($firstname);
    $lastname = strtolower($lastname);
    $username = $firstname[0].$lastname.substr($userid, -5);

    // password to be hashed
    $password='';
    $chars = pwchars;
    $count = strlen($chars);
    $desired_length = rand(8, 12);
    for($length = 0; $length < $desired_length; $length++) {
     $index = rand(0, $count-1);
     $password .= $chars[$index];
    }
    return array($userid, $username, $password);
}

function generateUniqueID($sql, $param, $digit=IDdigits){
    $id = randomNumber($digit);
    $bindparam = array($param=>$id);
    while (perform_query($sql, 'GET', $bindparam)!= FALSE){
        $id = randomNumber($digit);
    }
    return $id;
}

function getKey($name){
    $sql = "SELECT keyid from apikeys where name=:name";
    return perform_query($sql, 'GETCOL', array("name"=>$name));
}

// array of array(emailAddr, username, password, firstname, lastname)?
function massEmailLogin($userInfoList){
    $mandrill = new Mandrill((string)getKey('mandrill'));
    foreach ($userInfoList as $user){
        try {

            $template_content = array(
                array( 'name' => 'USER_NAME', 'content' => $user["username"] ),
                array( 'name' => 'EMAIL', 'content' => $user["emailAddr"] ),
                array( 'name' => 'FIRST_NAME', 'content' => $user["firstName"] ),
                array( 'name' => 'LAST_NAME', 'content' => $user["lastName"] ),
                array( 'name' => 'PASSWORD', 'content' => $user["password"] ),
                array( 'name' => 'LOGIN_URL', 'content' => "https://gobind-sarvar.rhcloud.com" ),
                array( 'name' => 'IMG_SRC', 'content' => "https://gobind-sarvar.rhcloud.com/img/logo.png"),
                );

            $message = array(
                'subject' => 'Gobind Sarvar: Your username and password',
                'from_email' => 'info@GobindSarvar.com',
                'from_name' => 'Gobind Sarvar School',
                'to' => array( array( 'email' => $user["emailAddr"], 'name' => $user["firstName"].' '.$user["lastName"], 'type' => 'to' ) ),
            // Pass the same parameters for merge vars and template params
            // to make them available in both variable passing methods
                'merge_vars' => array(array(
                    'rcpt' => $user["emailAddr"],
                    'vars' => $template_content,
                    )));
            $template_name = 'welcometogs';

            $mandrill->messages->sendTemplate($template_name, $template_content, $message);
        } catch(Mandrill_Error $e) {
            echo 'A mandrill error occurred: ' . get_class($e) . ' - ' . $e->getMessage();
            throw $e;
        }
    }
}


function emailLogin($emailAddr, $username, $password, $firstname, $lastname){
    $mandrill = new Mandrill((string)getKey('mandrill'));

    try {

        $template_content = array(
            array( 'name' => 'USER_NAME', 'content' => $username ),
            array( 'name' => 'EMAIL', 'content' => $emailAddr ),
            array( 'name' => 'FIRST_NAME', 'content' => $firstname ),
            array( 'name' => 'LAST_NAME', 'content' => $lastname ),
            array( 'name' => 'PASSWORD', 'content' => $password ),
            array( 'name' => 'LOGIN_URL', 'content' => "https://gobind-sarvar.rhcloud.com" ),
            array( 'name' => 'IMG_SRC', 'content' => "https://gobind-sarvar.rhcloud.com/img/logo.png"),
            );

        $message = array(
            'subject' => 'Gobind Sarvar: Your username and password',
            'from_email' => 'info@GobindSarvar.com',
            'from_name' => 'Gobind Sarvar School',
            'to' => array( array( 'email' => $emailAddr, 'name' => $firstname.' '.$lastname, 'type' => 'to' ) ),
            // Pass the same parameters for merge vars and template params
            // to make them available in both variable passing methods
            'merge_vars' => array(array(
                'rcpt' => $emailAddr,
                'vars' => $template_content,
                )));
        $template_name = 'welcometogs';

        $mandrill->messages->sendTemplate($template_name, $template_content, $message);
    } catch(Mandrill_Error $e) {
        echo 'A mandrill error occurred: ' . get_class($e) . ' - ' . $e->getMessage();
        throw $e;
    }
}

/*
* wrapper to perform sql queries
*/
function perform_query($sql, $querytype, $bindparams=array()) {
    try {
        $db = getConnection();
        if (array_filter($bindparams)){
            $stmt = $db->prepare($sql);
            $stmt->execute($bindparams);
        }
        else{
            $stmt = $db->query($sql);
        }

        if ($querytype == 'GET') {
            $result = $stmt->fetchObject();
        }
        elseif ($querytype == 'GETALL') {
            $result = $stmt->fetchAll(PDO::FETCH_OBJ);
        }
        elseif ($querytype == 'GETCOL'){
            $result = $stmt->fetchColumn();
        }
        elseif ($querytype == 'GETASSO'){
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        else {
            $result = array("status"=>"success");
        }
        $db = null;
        return $result;
    } catch(PDOException $e) {
        echo $e->getMessage();
        return array("status"=>"failure");
    }
}

function perform_transaction($queries, $bindparams=array()){
    try {
        $db = getConnection();
        $db->beginTransaction();

        foreach($queries as $i => $query){
            if (array_filter($bindparams)){
                $stmt = $db->prepare($query);
                $stmt->execute($bindparams[$i]);
            }
            else{
                $stmt = $db->query($query);
            }
        }
        $db->commit();
        return array("status"=>"success");
    } catch (Exception $e) {
    echo $e->getMessage();
        $db->rollback();
        return array("status"=>"failure");
    }
}

/*
 * TODO: put the credentials in a separate config file
 */
function getConnection() {
    $dbhost = "127.4.196.130";
    $dbname = "testdb";
    $dbuser = "adminpVaqD1a";
    $dbpass = "GpFqpeavU2dT";
    $dbname = "gobind";
    //$dbname = "testdb";
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}

function buildDayClause($days){
    $clause= "";
    $bindparams = array();
    $days = explode('-', $days);
    foreach($days as $i=> $day) {
        $clause.=" and find_in_set(':day".$i."', s.day)";
        $bindparams["day".$i] = $day;
    }
    return array($clause, $bindparams);
}

function buildWhereClause($fields){
    $clause = "";
    $bindparams = array();
    foreach ($fields as $key=>$value) {
        $clause.= " AND ";
        if(substr($key, -4) === 'Name'){
            $clause.=$key." like '%".$value."%'";
        }
        else {
            $clause.=$key."=:".$key;
            $bindparams[$key] = $value;
        }

    }
    return array($clause, $bindparams);
}

function generatePasswordHash($password){
	$cost = 10;
    $salt = strtr(base64_encode(mcrypt_create_iv(16, MCRYPT_DEV_URANDOM)), '+', '.');
    $salt = sprintf("$2a$%02d$", $cost).$salt;
    return crypt($password, $salt);
}

function parenthesisList($ids){
    $bindparams = array();
    $sql = "(";
    foreach (array_values($ids) as $i => $id) {
        $sql.= ":id".$i.",";
        $bindparams["id".$i] = $id;
    }
    $sql = rtrim($sql, ",");
    $sql.= ")";
    return array($sql, $bindparams);
}


// for walking fetchAll(PDO::FETCH_ASSOC) array
// e.g. a row in the array
// "userid" => 1234, "marks" => "90"
// extract_value
// gets the marks of userid 1234

// $colarray in form of:
// array(
//     array("id"=>$id, "$id_colname"=>$id_colname)
// );
function extract_value($array, $colarray, $val_colname) {
    foreach($array as $row) {
        $match = 1;
        foreach($colarray as $col){
            if ($row[$col["id_colname"]] != $col["id"]){
                $match = 0;
                break;
            }
        }
        if ($match == 1) {
            return $row[$val_colname];
        }
        else { continue; }
    }
    return 0;
}