

function clearTT() {
    for (var i = 0; i < 5; ++i) {
        for (var j = 0; j < 9; ++j) {
            $('#' + i.toString() + j.toString()).removeClass('border border-danger');
            $('#' + i.toString() + j.toString()).removeClass('table-danger');
            $('#' + i.toString() + j.toString()).removeClass('table-clash');
            $('#' + i.toString() + j.toString()).html('');
            $('#9' + i.toString() + j.toString()).html(":");
        }
    }
    clearSelected();
    $('#details-div').html("");
}


function getTimeTable(){
    var timetable = [];
    var todaysDate = new Date();
    var todaysDay = todaysDate.getDay();
    if(todaysDay == 0)
        todaysDay = 6;
    else
        todaysDay = todaysDay - 1;
    for (var i = 0; i < 5; ++i) {
        for (var j = 0; j < 5; ++j) {
            if($('#' + i.toString() + j.toString()).hasClass('table-danger') || $('#' + i.toString() + j.toString()).hasClass('table-clash')){
                var curr = [];
                curr.push($('#' + i.toString() + j.toString()).html())
                var d = new Date();
                var numberOfDaysToAdd = 0;
                if(i < todaysDay){
                    numberOfDaysToAdd = i + 7 - todaysDay;
                }
                else{
                    numberOfDaysToAdd = i - todaysDay;
                }
                d.setDate(d.getDate() + numberOfDaysToAdd);
                var ye = d.getFullYear().toString();
                var mo = (d.getMonth() + 1).toString();
                var da = d.getDate().toString();
                if(mo.length == 1)
                    mo = '0' + mo
                if(da.length == 1)
                    da = '0' + da
                var start = '' + ye + '-' + mo + '-' + da + ' ';
                var end = start;
                if(j == 0){
                    start = start + '09:15:00';
                    end = end + '10:45:00';
                }
                else if(j == 1){
                    start = start + '11:00:00';
                    end = end + '12:30:00';
                }
                else if(j == 2){
                    start = start + '13:45:00';
                    end = end + '15:15:00';
                }
                else if(j == 3){
                    start = start + '15:30:00';
                    end = end + '17:00:00';
                }
                else if(j == 4){
                    start = start + '17:30:00';
                    end = end + '19:00:00';
                }
                curr.push(start)
                curr.push(end)
                timetable.push(curr)
            }
        }
    }
    return timetable
}

function addToCalendar(){
    var timetable = JSON.stringify(getTimeTable());
    $.ajax({
        url: '/',
        type: 'post',
        contentType: 'application/json',
        dataType: 'text',
        data: timetable
    }).done(function(result){
        console.log(result);
        var url = '/download_helper';
        window.location = url;
    }).fail(function(jqXHR, textStatus, errorThrown){
        console.log(timetable)
        console.warn(jqXHR.responseText)
        console.log("fail: ", textStatus, errorThrown);
    });

};

function sdCallback(data, id, course, clear_var) {
    if(clear_var == 0){
        if (typeof data['Name'] !== "undefined") {
            if (id === undefined) {
                var details = "";
                var x = 0;
                details += "<b>Name: </b>" + data['Name'] + " <br>";
                courseData = data['Data'];
                for (var key in courseData) {
                    if(key != 'Slot'){
                        details += "<b>" + key + ": </b>" + courseData[key] + " <br>";
                    }
                }
                var old_name = []
                for (var slot in courseData['Slot']) {
                    if($('#' + courseData['Slot'][slot]).hasClass('table-danger') || $('#' + courseData['Slot'][slot]).hasClass('table-clash')){
                        if($('#' + courseData['Slot'][slot]).hasClass('table-danger')){
                            $('#' + courseData['Slot'][slot]).removeClass('table-danger');
                            $('#' + courseData['Slot'][slot]).addClass('table-clash');
                        }
                        var temp_list = ($('#' + '9' + courseData['Slot'][slot]).html().split(":"));
                        var cnt = parseInt(temp_list[0]);
                        cnt = cnt + 1
                        temp_list[0] = cnt
                        temp_list.push(data['Name'].split(":")[0])
                        console.log(cnt)
                        $('#9' + courseData['Slot'][slot]).html(temp_list.join(":"))
                        curr_name = $('#' + courseData['Slot'][slot]).html()
                        if(curr_name.length == 0)
                            curr_name = "your occupied slot";
                        if(old_name.includes(curr_name) == 0)
                            old_name.push(curr_name)
                        x = 1;
                    }
                }
                if(x == 0){
                    $('#details-div').html("");
                    $('#details-div').html(details);
                    for (var slot in courseData['Slot']) {
                        $('#' + courseData['Slot'][slot]).addClass('border border-danger');
                        $('#' + courseData['Slot'][slot]).addClass('table-danger');
                        $('#' + courseData['Slot'][slot]).html(data['Name'].split(':')[0])
                        $('#' + '9' + courseData['Slot'][slot]).html("1" + ":" + data['Name'].split(':')[0])
                    }
                }
                else{
                     for (var slot in courseData['Slot']) {
                    if($('#' + courseData['Slot'][slot]).hasClass('table-danger') == 0 && $('#' + courseData['Slot'][slot]).hasClass('table-clash') == 0){
                        $('#' + courseData['Slot'][slot]).addClass('border border-danger');
                        $('#' + courseData['Slot'][slot]).addClass('table-danger');
                        $('#' + courseData['Slot'][slot]).html(data['Name'].split(':')[0])
                        $('#' + '9' + courseData['Slot'][slot]).html("1" + ":" + data['Name'].split(':')[0])
                    }
                }
                    $('#details-div').html("");
                    details = "<b> Warning!! </b><br> Course " + data['Name'] + " clashes with "
                    var i = 0
                    for(i = 0; i < old_name.length; i++){
                        if(i > 0 && i < old_name.length - 1)
                            details += ", ";
                        else if(i >0 && i == old_name.length - 1)
                            details += "and ";
                        details += old_name[i]
                    }
                    details += ".<br>";
                    details += "Unselect one of the clashing courses to continue."
                    $('#details-div').html(details);
                }
            }
            else {
                $('#details-div').html("");
                parentList = document.getElementById(id);
                var item = document.createElement('li');
                item.className = "course";
                item.setAttribute("onclick", "searchData(this)");
                item.innerHTML = course;
                parentList.appendChild(item);
            }
        }
    }
    else{
        if (typeof data['Name'] !== "undefined") {
            if (id === undefined) {
                var details = "";
                courseData = data['Data'];
                for (var slot in courseData['Slot']) {
                    if($('#' + courseData['Slot'][slot]).hasClass('table-danger')){
                        if((data['Name'].split(':')[0].toString().localeCompare($('#' + courseData['Slot'][slot]).html().toString())) == 0) {
                            $('#' + courseData['Slot'][slot]).removeClass('table-danger');
                            $('#' + courseData['Slot'][slot]).removeClass('border border-danger');
                            $('#' + courseData['Slot'][slot]).html("")
                            $('#9' + courseData['Slot'][slot]).html(":")
                        }
                    }
                    else if($('#' + courseData['Slot'][slot]).hasClass('table-clash')){
                        var temp_list = ($('#' + '9' + courseData['Slot'][slot]).html().split(":"));
                        var cnt = parseInt(temp_list[0]);
                        cnt = cnt - 1;
                        console.log(cnt)
                        var index = temp_list.indexOf(data['Name'].split(":")[0])
                        console.log(temp_list)
                        if(index > 0){
                            temp_list.splice(index, 1)
                        }
                        console.log(temp_list)
                        temp_list[0] = cnt
                        if(cnt == 1){
                            $('#' + courseData['Slot'][slot]).removeClass('table-clash');
                            $('#' + courseData['Slot'][slot]).addClass('table-danger');
                        }
                        $('#' + courseData['Slot'][slot]).html(temp_list[1])
                        $('#9' + courseData['Slot'][slot]).html(temp_list.join(":"))
                    }
                }
                $('#details-div').html("");
            }
            else {
                $('#details-div').html("");
                parentList = document.getElementById(id);
                var item = document.createElement('li');
                item.className = "course";
                item.setAttribute("onclick", "searchData(this)");
                item.innerHTML = course;
                parentList.appendChild(item);
            }
        }
    }
}

function clearSelected() {
    $('.active').removeClass('active');
}


function searchData(q = $("#search-bar").val(), id = undefined) {
    clear_var = 0
    if(typeof q.className !== "undefined" && q.className.length == 13){
        clear_var = 1;
    }
    var searchString = "";
    if (typeof q !== "string") {
        searchString = q.innerHTML; // Get list item's name
        if(clear_var == 0)
            q.className += ' active';
        else
            q.className = 'course'
    }
    else {
        searchString = q;
    }
    $.post("/ajax/",
        {
            "query": searchString
        },
        function (data) {
            sdCallback(data, id, searchString, clear_var);
        },
        "json"
    );
}

$("#search-but").click(searchData);
$("#search-bar").on('keypress', function (e) {
    if (e.which === 13) {
        $(this).attr("disabled", "disabled");
        searchData();
        $(this).removeAttr("disabled");
    }
});

function loadMinor() {
    $.get("/minor/", function (data) {
        minorDiv = document.getElementById('minor-div');
        var jdata = JSON.parse(data);
        for (var i in jdata) {
            var minor = jdata[i];

            // Create heading
            var heading = document.createElement('h3');
            heading.className = "accordion";
            heading.innerHTML = "<i data-feather='chevron-down'></i>" + minor['Name'];
            heading.addEventListener(
                'click',
                function (e) {
                    var elem = $(e.target)[0].nextElementSibling;
                    $(elem).toggleClass('open');
                    e.target.removeChild(e.target.childNodes[0]);
                    innerHTML = e.target.innerHTML;
                    if ($(elem).hasClass('open')) {
                        e.target.innerHTML = "<i data-feather='chevron-right'></i>" + innerHTML;
                    } else {
                        e.target.innerHTML = "<i data-feather='chevron-down'></i>" + innerHTML;
                    }
                    feather.replace();
                } //onclick displays course list of each dept
                , false
            )
            minorDiv.appendChild(heading);

            // Create list
            var list = document.createElement('ul');
            list.className = "panel";
            list.id = i.toString();

            // Populate list
            for (var j in minor['Courses']) {
                course = minor['Courses'][j];
                searchData(course, i.toString());
            }

            // Add to page
            minorDiv.appendChild(list);
        }
        new SimpleBar(minorDiv, { autoHide: false });
    }).promise().done(
        () => {
            feather.replace()
        }
    );
}

loadMinor();
setTimeout(
    () => {
        new SimpleBar($('.ui-menu')[0]);

    }, 1000

)

function toggle(el) {
    element = $(el);
    element_id = element.attr('id')
    if(element.hasClass('table-clash')){
        return;
    }
    if (element.hasClass('table-danger')){
        if(element.html().length == 0){
            element.removeClass('table-danger');
            element.removeClass('border border-danger');
            details = "You clearerd an occupied slot";
            $('#details-div').html("");
            $('#details-div').html(details);
            $('#9' + element_id).html(":")
        }
    }
    else{
        element.addClass('table-danger');
        details = "You marked a slot as occupied";
        $('#details-div').html("");
        $('#details-div').html(details);
        $('#9' + element_id).html("1:")
    }
}

$('#timet td').attr('onclick', 'toggle(this)');

function readICS() {
    var file = document.getElementById('file-in').files[0];
    if (file) {
        $('#timet td').removeClass('table-clash');

        var reader = new FileReader();
        reader.onload = function (e) {
            var content = e.target.result;
            var slots = content.split('DTSTART;TZID=Asia/Kolkata;VALUE=DATE-TIME:');
            for (i in slots) {
                var slot = slots[i];
                if (i > 0) {
                    var hour = parseInt(slot.substring(9, 11));
                    var year = parseInt(slot.substring(0, 4));
                    var month = parseInt(slot.substring(4, 6)) - 1;
                    var date = parseInt(slot.substring(6, 8));

                    var d = new Date(year, month, date);

                    var day = d.getDay() - 1;

                    var duration = parseInt(slot.substring(28, 29));

                    if (hour < 14)
                        hour -= 8;
                    else
                        hour -= 9;

                    for (var i = 0; i < duration; ++i) {
                        var id = day.toString() + (hour + i).toString();
                        $('#' + id).addClass('table-clash');
                    }

                }
            }
        }

        reader.readAsText(file);
    }
}
