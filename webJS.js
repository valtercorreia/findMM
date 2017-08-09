var webSocket = new WebSocket("ws://localhost:9000");

webSocket.onmessage = function (messageEvent){

    var msgReceivedSplitted = messageEvent.data.split("|");

    // Add a new row

    var newRow = document.createElement("tr");
    var profileTh = document.createElement("td");
    profileTh.innerHTML = "<a href='" + msgReceivedSplitted[0] + "'>" + msgReceivedSplitted[0] + "</a>";
    newRow.appendChild(profileTh);

    var rankTh = document.createElement("td");
    rankTh.innerText = msgReceivedSplitted[1];
    newRow.appendChild(rankTh);

    var timeTh = document.createElement("td");
    var currTime = new Date();
    var hours =  currTime.getHours();
    if(hours < 10){
        hours = "0" + hours;
    }
    var minutes =  currTime.getMinutes();
    if(minutes < 10){
        minutes = "0" + minutes;
    }
    timeTh.innerText = hours + ":" + minutes;
    newRow.appendChild(timeTh);

    if(document.getElementById(rankTh.innerText).checked){
        newRow.style.display = ""; 
    }else {
        newRow.style.display = "none";
    } 

    document.getElementById("profiles").children[0].appendChild(newRow);


    console.log(event.data);
}

function filterRanks(checkboxData) {

  table = document.getElementById("profiles");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 1; i < tr.length; i++) {
    rank = tr[i].children[1].innerText;
    if (checkboxData.id == rank) {
        if(checkboxData.checked){
           tr[i].style.display = ""; 
        }else {
            tr[i].style.display = "none";
        } 
    }
  }
}
