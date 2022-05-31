<?php

if ($_POST["sql_code"] != NULL)
{
    read($_POST["sql_code"]);
}

function read($sql) 
{
    $table_array = array();
    $db_host = "localhost:3307";
    $db_login = "root";
    $db_password = "root";
    $db_name = "workers";

    try {
        $conn = new PDO("mysql:host=$db_host; dbname=$db_name", $db_login, $db_password);
        $req = $conn->prepare($sql);
        $req->execute();
        $result = $req->fetchAll(PDO::FETCH_ASSOC);

        if(!empty($result))
        {
            array_push($table_array, $req->columnCount());
            array_push($table_array, $req->rowCount());

            foreach($result as $row_count => $row)
            {
                if ($row_count <= 0) {
                    foreach($row as $count => $row_value) 
                        array_push($table_array, $count);
                }

                foreach($row as $row_value) 
                    array_push($table_array, $row_value);
            }
            echo json_encode($table_array);
        } else {
            array_push($table_array, 1, 1, "В данные таблице временно отсутствуют");
            echo json_encode($table_array);
        }
    } catch(PDOException $e) {
        echo $e;
    }
};