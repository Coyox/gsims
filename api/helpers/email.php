<?php
require_once '../vendor/mandrill/mandrill/src/Mandrill.php'; //Not required with Composer

// array of array(emailAddr, username, password, firstname, lastname)
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

