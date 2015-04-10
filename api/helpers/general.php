<?php
define("IDdigits", 6);

function randomNumber($digits){
  return rand(pow(10, $digits - 1) - 1, pow(10, $digits) - 1);
}

function generateUniqueID($sql, $param, $digit=IDdigits){
    $id = randomNumber($digit);
    $bindparam = array($param=>$id);
    while (perform_query($sql, 'GET', $bindparam)!= FALSE){
        $id = randomNumber($digit);
    }
    return $id;
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
    $dbuser = "adminpVaqD1a";
    $dbpass = "GpFqpeavU2dT";
    $dbname = "thefinaltest";
    //$dbname = "gobind";
    //$dbname = "testdb";
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
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