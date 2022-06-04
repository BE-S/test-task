<?php

if ($_POST["sql_code"] != NULL)
{
    $conn = new PDO("mysql:host=localhost:3307; dbname=workers", "root", "root");
    $req = $conn->prepare($_POST["sql_code"]);
    $req->execute();
    $result = $req->fetchAll(PDO::FETCH_ASSOC);
    
    $DataTable = new DataTable($result, $req);
    $DataTable->GetTable();
}

Class DataTable
{
    private $result;
    private $req;
    private $table_array = array();

    function __construct($result, $req) 
    {
        $this->result = $result;
        $this->req = $req;
    }

    public function GetTable() 
    {
        try {
            if(!empty($this->result))
            {
                array_push($this->table_array, $this->req->columnCount());
                array_push($this->table_array, $this->req->rowCount());
    
                foreach($this->result as $row_count => $row)
                {
                    if ($row_count <= 0) {
                        foreach($row as $count => $row_value) 
                            array_push($this->table_array, $count);
                    }
    
                    foreach($row as $row_value) 
                        array_push($this->table_array, $row_value);
                }
                echo json_encode($this->table_array);
            } else {
                array_push($this->table_array, 1, 1, "В данные таблице временно отсутствуют");
                echo json_encode($this->table_array);
            }
        } catch(PDOException $e) {
            echo $e;
        }
    }
}