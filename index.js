(function () {     
    $(".all").bind("click", function() 
    {
        clear_table();
        let sql_code =  "SELECT first_name, last_name, middle_name, position.name as position, department.name as department, salary, user.created_at FROM user_position JOIN user ON user_id = user.id JOIN department ON department_id = department.id JOIN position ON position_id = position.id WHERE PERIOD_DIFF(EXTRACT(YEAR_MONTH FROM user.created_at), EXTRACT(YEAR_MONTH FROM NOW())) > 3";
        Call_table(sql_code);
    });

    $(".probation").bind("click", function() 
    { 
        clear_table();
        let sql_code =  "SELECT user_dismission.id, user.first_name, user.last_name, dismission_reason.name FROM user_dismission JOIN user ON user_dismission.user_id = user.id JOIN dismission_reason ON user_dismission.reason_id = dismission_reason.id";
        Call_table(sql_code);
     });

     $(".dismission").bind("click", function() 
     { 
        clear_table()
        let sql_code =  "SELECT GROUP_CONCAT(DISTINCT fup.user_id) AS boss_id, up.department_id, MAX(up.user_id) AS employee_user_id, (SELECT created_at FROM user_position WHERE user_id = MAX(up.user_id)) AS created_at FROM user_position AS up LEFT JOIN (SELECT user_id, department_id FROM user_position WHERE position_id < 10) AS fup ON up.department_id = fup.department_id WHERE up.user_id >= 10 GROUP BY up.department_id;";
        Call_table(sql_code);
     });
}());

function Call_table(sql_code) 
{
    $.ajax ({
        url: "database.php",
        data: {
            sql_code,
        },
        type: "POST",
        success: function(result) {
            var array = JSON.parse(result);
            var column_count = getColumnCount(array);
            var row_count = getRowCount(array);
            var array_titles = getTitles(array, column_count);

            var quantityforselection = (column_count * 20);
            var max_buttons = numberofbuttons(array, quantityforselection);
            onPage = row_count > 20 ? 20 : ++row_count;

            // div for pagination results
            var main = document.getElementsByTagName("main")[0]; //Get block Main
            main.after(main);

            // Block for paint results
            var result = document.createElement("table"); //Create tag table
            result.setAttribute("id","result"); //Set id = results

            var column_title = paintResult(array_titles, column_count, 1); //Get title for column 
            
            result.innerHTML = column_title + paintResult(array.slice(0, quantityforselection), column_count, onPage); //Primary paint results

            main.append(result, CreateButtons(max_buttons)); //Set result and buttons in Main

            // Вешаем обработчик для всех кнопок пагинации
            document.addEventListener('click', function(event) { //If the tag buttons is clicked
                if (max_buttons > 1) { //If max_buttons more than one
                    if([...event.target.classList].includes("pb")) { //If user click on the class "pb"  
                        var y = event.target.textContent; //Get number of tag pb
                        var start = quantityforselection*(y - 1); //Calculate the first elemement for an array
                        var end = quantityforselection*y; //Calculate the last elemement for an array
                        
                        if (y == max_buttons) { //If last buttons
                            onPage = ++row_count - ((--max_buttons) * onPage); //Calculate amount elements for last page
                        } else {
                            onPage = 20;
                        }
                        result.innerHTML = column_title + paintResult (array.slice(start, end), column_count, onPage); //Add result in page
                    }else{
                    console.log(event.target);
                    }
                }
            });
        }
    });
}

function clear_table() //Delete table
{
    $("#result").remove();
    $("#buttons").remove();
}

function getTitles(array, column_count) //Get titles from array
{ 
    let array_titles = new Array(column_count);
    
    for (i = 0; i < column_count; ++i) {
        array_titles[i] = array[0];
        array.shift();   
    }
    return array_titles;
}

function getColumnCount(array) //Get number of colums
{
    let column_count = array[0];
    array.shift();

    return column_count;
}

function getRowCount(array) //Get number of row
{
    let row_count = array[0];
    array.shift();

    return --row_count;
} 

function paintResult (arr, column_count, row_count) //Paint result in variable
{
    for(i = 0, value = 0, line = ""; i < arr.length && i < row_count; i++) {
        line += "<tr>";
        for (j = 0; j < column_count; ++j, ++value) {
            line += `<td>${arr[value]}</td>`;
        }
        line += "</tr>";
    }
    return line;
}

function numberofbuttons(arr,num) //Calculate number of buttons
{ 
    return Math.ceil(arr.length/num)
}

function paintPaginationButton (count) //Paint buttons in variable
{
    for(i = 1, r= ""; i <= count; i++){
        r += `<button class="pb">${i}</button>`
    }
    return r
}

function CreateButtons(max_buttons) 
{
    // Buttons for pagination
    var buttons = document.createElement("div"); //Create div for buttons
    buttons.setAttribute("id","buttons"); //Set id = buttons
    buttons.innerHTML = paintPaginationButton(max_buttons); //Get tag button

    return buttons;
}