<?php
//require_once '../vendor/mandrill/mandrill/src/Mandrill.php'; //Not required with Composer
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
    echo "userid: ".$userid;
    echo "username: ".$username;
    echo "password: ".$password;

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

// function emailLogin($emailAdd, $username, $password, $firstname, $lastname){
//     $mandrill = new Mandrill('C_s6D7OmZEgKBIspAvuBcw');
//     try {
//         $message = array(
//         'html' => '<p>Example HTML content</p>',
//         'text' => 'hello',
//         'subject' => 'Welcome to Gobind Sarvar School',
//         'from_email'=>'shaniferseit@hotmail.com',
//         'from_name' => 'Gobind Sarvar School',
//         'to' => array(
//             array(
//                 'email' => 'shanifer@gmail.com',
//                 'name' => 'Shanifer',
//                 'type' => 'to'
//             )
//         ),
//         );
//     $async = false;
//     $result = $mandrill->messages->send($message, $async);
//     print_r($result);
// } catch(Mandrill_Error $e) {
//     // Mandrill errors are thrown as exceptions
//     echo 'A mandrill error occurred: ' . get_class($e) . ' - ' . $e->getMessage();
//     // A mandrill error occurred: Mandrill_Unknown_Subaccount - No subaccount exists with the id 'customer-123'
//     throw $e;
// }
// }


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
    //return $password;
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