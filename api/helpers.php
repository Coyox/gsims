<?php

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
    $bindparam = array("userid"=>$userid);
    $userid = generateUniqueID($sql, $bindparam);

    // username = first letter of first name + last name + last 5 digits of userid
    $firstname = strtolower($firstname);
    $lastname = strtolower($lastname);
    $username=$username=$firstname[0].$lastname.substr($userid, -5);

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

/*TODO*/
function emailLogin($emailAddr, $username, $password){

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
        elseif ($querytype == 'POST'){
            $result = $db->lastInsertId();
        }
        else {
            $result = null;
        }
        $db = null;
        return $result;
    } catch(PDOException $e) {
        echo $e->getMessage();
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
    $days = explode(',', $days);
    foreach($days as $day) {
        $clause.=" and find_in_set('".$day."',`day`)";
    }
    return $clause;
}

function buildWhereClause($fieldArray, $clause=""){
    foreach ($fieldArray as $key => $value) {
        $clause.= ($clause==''? "WHERE ": " AND ");
        if(substr($key, -4) === 'Name'){
            $value = "%".$value."%";
            $clause.=$key." like '".$value."'";
        }
        else if ($key=='year'){
            $clause.=$key."(dateOfBirth)".$value."'";
        }
        else {
            $clause.=$key."='".$value."'";
        }
    }
    return $clause;
}


function generatePasswordHash($password){
	$cost = 10;
    $salt = strtr(base64_encode(mcrypt_create_iv(16, MCRYPT_DEV_URANDOM)), '+', '.');
    $salt = sprintf("$2a$%02d$", $cost).$salt;
    return crypt($password, $salt);
}