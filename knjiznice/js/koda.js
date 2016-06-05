
var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';

var username = "ois.seminar";
var password = "ois4fri";

var trenutniUporabnik = "";
/**
 * Prijava v sistem z privzetim uporabnikom za predmet OIS in pridobitev
 * enolične ID številke za dostop do funkcionalnosti
 * @return enolični identifikator seje za dostop do funkcionalnosti
 */
function getSessionId() {
    var response = $.ajax({
        type: "POST",
        url: baseUrl + "/session?username=" + encodeURIComponent(username) +
                "&password=" + encodeURIComponent(password),
        async: false
    });
    return response.responseJSON.sessionId;
}


/**
 * Generator podatkov za novega pacienta, ki bo uporabljal aplikacijo. Pri
 * generiranju podatkov je potrebno najprej kreirati novega pacienta z
 * določenimi osebnimi podatki (ime, priimek in datum rojstva) ter za njega
 * shraniti nekaj podatkov o vitalnih znakih.
 * @param stPacienta zaporedna številka pacienta (1, 2 ali 3)
 * @return ehrId generiranega pacienta
 */
function generirajUporabnike() {
  var uporabniki = [
  "Janez",
  "Novak",
  "1971-10-9T23:39",
  "Rok",
  "Daneu",
  "1987-8-5T08:15",
  "Tjaša",
  "Rogelj",
  "1997-10-9T11:45"
  ];
  var Rok = [
      "2016-3-2T12:30Z", "188", "87.5", "80", "120",
      "2016-3-4T15:16Z", "188", "86.1", "78", "122",
      "2016-3-6T14:26Z", "188", "87.0", "76", "130",
      "2016-3-8T15:00Z", "188", "87.9", "88", "144",
      "2016-3-10T15:36Z", "188", "87.8", "87", "150",
      "2016-3-12T17:46Z", "188", "87.5", "72", "119",
      "2016-3-14T11:10Z", "188", "87.7", "66", "116",
      "2016-3-16T16:26Z", "188", "87.9", "81", "133",
      "2016-3-18T15:10Z", "188", "87.8", "82", "133",
      "2016-3-20T14:55Z", "188", "87.7", "74", "124",
      "2016-3-22T16:10Z", "188", "87.5", "76", "120",
      "2016-3-24T13:46Z", "188", "87.3", "77", "125",
      "2016-3-26T15:00Z", "188", "87.0", "81", "133"
  ];
  var Janez = [
      "2015-10-28T16:30Z", "181", "117.5", "80", "120",
      "2015-11-10T15:17Z", "181", "116.1", "78", "142",
      "2015-11-26T18:20Z", "181", "117.0", "86", "130",
      "2015-12-1T20:00Z", "181", "117.9", "88", "144",
      "2015-12-12T15:36Z", "181", "117.8", "87", "150",
      "2016-1-10T17:46Z", "181", "117.5", "72", "139",
      "2016-1-14T21:10Z", "181", "116.7", "96", "146",
      "2016-1-20T20:26Z", "181", "115.9", "81", "133",
      "2016-1-26T19:10Z", "181", "115.8", "82", "133",
      "2016-2-2T20:55Z", "181", "115.7", "84", "124",
      "2016-2-10T22:10Z", "181", "116.5", "76", "160",
      "2016-2-9T20:46Z", "181", "115.3", "90", "165",
      "2016-2-15T18:00Z", "181", "115.0", "81", "133"
  ];
  var Tjasa =[
      "2016-1-28T16:30Z", "175", "67.5", "63", "100",
      "2016-2-1T15:16Z", "175", "66.1", "72", "112",
      "2016-2-11T18:26Z", "175", "67.0", "76", "110",
      "2016-2-22T20:00Z", "175", "67.9", "66", "99",
      "2016-3-1T15:36Z", "175", "67.8", "67", "100",
      "2016-3-13T17:46Z", "175", "67.5", "72", "109",
      "2016-3-26T21:10Z", "175", "67.7", "66", "106",
      "2016-4-4T20:26Z", "175", "67.9", "71", "102",
      "2016-4-16T19:10Z", "175", "67.8", "72", "103",
      "2016-4-27T20:55Z", "175", "67.7", "74", "114",
      "2016-5-5T22:10Z", "175", "67.5", "76", "120",
      "2016-5-18T20:46Z", "175", "67.3", "77", "105",
      "2016-5-29T18:00Z", "175", "67.0", "66", "113"
      ];
      var id1 = generirajPodatke(1, uporabniki, Janez);
      var id2 = generirajPodatke(2, uporabniki, Rok);
      var id3 = generirajPodatke(3, uporabniki, Tjasa);
} 

function generirajPodatke(stPacienta, table, info) {
    var i = 0;
    if (stPacienta == 2)
        i = 3;
    else if (stPacienta == 3)
        i = 6;
    var ime = table[i];
    var priimek = table[i + 1];
    var datum = table[i + 2];
    var sessionID = getSessionId();
        $.ajaxSetup({
            headers: {"Ehr-Session": sessionID}
        });
        $.ajax({
            url: baseUrl + "/ehr",
            type: 'POST',
            success: function(data) {
                var ehrId = data.ehrId;
                var partyData = {
                    firstNames: ime,
                    lastNames: priimek,
                    dateOfBirth: datum,
                    partyAdditionalInfo: [{key: "ehrId", value: ehrId}]
                };
                $.ajax({
                    url: baseUrl + "/demographics/party",
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(partyData),
                    success: function(party) {
                                dodajUporabnika(ime, priimek, datum, ehrId);
                                generirajMeritve(ehrId, sessionID, info);
                    }
                    });
                }
        });
    }
    
   
function generirajMeritve(ehrId, sessionID, data) {
     for(var j = 0; j < 65; j = j + 5)
        {
            var datumInUraMeritve = data[j];
            var telesnaVisina = data[j+1];
            var telesnaTeza = data[j+2];
            var diastolicniTlak = data[j+3];
            var sistolicniTlak = data[j+4];
            $.ajaxSetup({
                headers: {"Ehr-Session": sessionID}
            });
            var podatkiMeritev = {
                "ctx/language": "en",
                "ctx/territory": "SI", 
                "ctx/time": datumInUraMeritve,
                "vital_signs/height_length:0/any_event:0/body_height_length|magnitude": telesnaVisina,
                "vital_signs/body_weight:0/any_event:0/body_weight|magnitude": telesnaTeza,
                "vital_signs/blood_pressure:0/any_event:0/systolic|magnitude": sistolicniTlak,
                "vital_signs/blood_pressure:0/any_event:0/diastolic|magnitude": diastolicniTlak
            };
            var zahteva = {
                ehrId: ehrId,
                templateId: 'Vital Signs',
                format: 'FLAT'
            };
            $.ajax({
                url: baseUrl + "/composition?" + $.param(zahteva),
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(podatkiMeritev),
                error: function(err) {
                    console.log(JSON.parse(err.responseText).userMessage);
                }
            });  
        }
}

// TODO: Tukaj implementirate funkcionalnost, ki jo podpira vaša aplikacija
function dodajUporabnika(ime, priimek, datum, ehrId) {
    
    var x = document.getElementById("preberiUporabnika");
    var option = document.createElement("option");
    option.text = ime + " " + priimek + " " + datum;
    option.value = ehrId;
    x.add(option);
    
}

function dodajNovegaUporabnika() {
    var sessionID = getSessionId();
    
    var ime = $("#vnosImena").val();
    var priimek = $("#vnosPriimka").val();
    var datum = $("#vnosDatumRojstva").val();
    
    if(!ime || !priimek || !datum || ime.trim().length == 0 || priimek.trim().length == 0 || datum.trim().length == 0) {
        $("#sporociloDodajanjeUporabnika").html("<span class='obvestilo label " + 
        "label-warning fade in'>Vnesite potrebne podatke.</span>");
    } else {
        $.ajaxSetup({
            headers: {"Ehr-Session": sessionID}
        });
        $.ajax({
            url: baseUrl + "/ehr",
            type: 'POST',
            success: function(data) {
                var ehrId = data.ehrId;
                var partyData = {
                    firstNames: ime,
                    lastNames: priimek,
                    dateOfBirth: datum,
                    partyAdditionalInfo: [{key: "ehrId", value: ehrId}]
                };
                $.ajax({
                    url: baseUrl + "/demographics/party",
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(partyData),
                    success: function(party) {
                        if(party.action == 'CREATE') {
                            $("#sporociloDodajanjeUporabnika").html("<span class='obvestilo " +
                            "label label-success fade-in'>Uspešno kreiran nov uporabnik z EHRID: "+
                            ehrId + "</span>");
                                //shrani ehrID v izbiro uporabnika
                                dodajUporabnika(ime, priimek, datum, ehrId);
                        }
                    },
                    error: function(err) {
                        $("#sporociloDodajanjeUporabnika").html("<span class='obvestilo label " +
                        "label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
                    }
                });
            }
        });
    }
}
var e = 0;
function izberiUporabnika() {
    var x = document.getElementById("preberiUporabnika");
    trenutniUporabnik = x.options[x.selectedIndex].value;
    if (trenutniUporabnik.length != 0) {
        $("#sporociloIzbiranjeUporabnika").html("<span class='obvestilo " +
        "label label-success fade-in'>Izbran uporabnik z EHRID: "+
        trenutniUporabnik + "</span>");
        e = 0;
    } else {
          $("#sporociloIzbiranjeUporabnika").html("<span class='obvesilo " + 
        "label label-warning fade-in'>NAPAKA: ni bil izbran noben uporabnik!</span>");
    }
}


function dodajMeritve() {
    var sessionID = getSessionId();
    var ehrID = trenutniUporabnik; //id trenutno izbranega uporabnika
    var datumInUraMeritve = $("#vnosDatumMeritve").val();
    var telesnaVisina = $("#vnosTelesnaVisina").val();
    var telesnaTeza = $("#vnosTelesneTeze").val();
    var diastolicniTlak = $("#vnosDiastolicni").val();
    var sistolicniTlak = $("#vnosSistolicni").val();
    
    // napaka ni bil izran noben uporabnik
    if(!ehrID || ehrID.trim().length == 0) {
        $("#sporociloDodajanjeMeritev").html("<span class='obvesilo " + 
        "label label-warning fade-in'>NAPAKA: ni bil izbran noben uporabnik!</span>");
    } else {
        $.ajaxSetup({
            headers: {"Ehr-Session": sessionID}
        });
        var podatkiMeritev = {
            "ctx/language": "en",
            "ctx/territory": "SI", 
            "ctx/time": datumInUraMeritve,
            "vital_signs/height_length:0/any_event:0/body_height_length|magnitude": telesnaVisina,
            "vital_signs/body_weight:0/any_event:0/body_weight|magnitude": telesnaTeza,
            "vital_signs/blood_pressure:0/any_event:0/systolic|magnitude": sistolicniTlak,
            "vital_signs/blood_pressure:0/any_event:0/diastolic|magnitude": diastolicniTlak
        };
        var zahteva = {
            ehrId: trenutniUporabnik,
            templateId: 'Vital Signs',
            format: 'FLAT'
        };
        $.ajax({
            url: baseUrl + "/composition?" + $.param(zahteva),
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(podatkiMeritev),
            success: function (res) {
                $("#sporociloDodajanjeMeritev").html("<span class='obvestilo label label-success fade-in'>Meritve so bile uspešno shranjene.</span");
            },
            error: function(err) {
                $("#sporociloDodajanjeMeritev").html(
                    "<span class='obvestilo label label-danger fade-in'>Napaka: '" +
                    JSON.parse(err.responseText).userMessage + "'!");
            }
        });
    }
}

var cas = new Array(100);
var teza = new Array(100);
var visina = new Array(100);
var diastolicni = new Array(100);
var sistolicni = new Array(100);

function prikaziMeritve() {
    var sessionID = getSessionId();
    var ehrId = trenutniUporabnik;
    
    if(!ehrId || ehrId.trim().length == 0) {
        $("#sporociloPrikazMeritev").html("<span class='obvesilo " + 
        "label label-warning fade-in'>Prvo izberite uporabnika.");
    } else {
         $.ajax({
            url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
            type: 'GET',
            headers: {"Ehr-Session": sessionID},
            success: function (data) {
                var party = data.party;
                $("#prikaziMeritve").html("<br/><span>Podatki za " + party.firstNames + " " + party.lastNames + ".<span><br/><br/>");
                $.ajax({
                    url: baseUrl + "/view/" + ehrId + "/" + "height",
                    type: 'GET',
                    headers: {"Ehr-Session": sessionID},
                    success: function(res) {
                        if (res.length > 0) {
                            for (var i in res)  {
                                visina[i] = res[i].height;
                            }
                        } else {
                            $("#sporociloPrikazMeritev").html(
                                "<span class='obvesilo label label-warning fade-in'>Ni zabeleženih preteklih meritev.</span>");
                        }
                    },
                    error: function() {
                        $("#sporociloPrikazMeritev").html(
                  "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                  JSON.parse(err.responseText).userMessage + "'!");
                    }
                });
            }
        });
         $.ajax({
            url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
            type: 'GET',
            headers: {"Ehr-Session": sessionID},
            success: function (data) {
                var party = data.party;
                $("#prikaziMeritve").html("<br/><span>Podatki za " + party.firstNames + " " + party.lastNames + ".<span><br/><br/>");
                $.ajax({
                    url: baseUrl + "/view/" + ehrId + "/" + "blood_pressure",
                    type: 'GET',
                    headers: {"Ehr-Session": sessionID},
                    success: function(res) {
                        if (res.length > 0) {
                            for (var i in res)  {
                                sistolicni[i] = res[i].systolic;
                                diastolicni[i] = res[i].diastolic;
                            }
                        } else {
                            $("#sporociloPrikazMeritev").html(
                                "<span class='obvesilo label label-warning fade-in'>Ni zabeleženih preteklih meritev.</span>");
                        }
                    },
                    error: function(err) {
                        $("#sporociloPrikazMeritev").html(
                  "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                  JSON.parse(err.responseText).userMessage + "'!");
                    }
                });
            }
        });
        $.ajax({
            url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
            type: 'GET',
            headers: {"Ehr-Session": sessionID},
            success: function (data) {
                var party = data.party;
                $("#prikaziMeritve").html("<br/><span>Podatki za " + party.firstNames + " " + party.lastNames + ".<span><br/><br/>");
                $.ajax({
                    url: baseUrl + "/view/" + ehrId + "/" + "weight",
                    type: 'GET',
                    headers: {"Ehr-Session": sessionID},
                    success: function(res) {
                        if (res.length > 0) {
                            var rezultat = "<table class='table table-striped " +
                            "table-hover'><tr><th>Datum in ura</th>" + 
                            "<th class='text-right'>Telesna teža</th>" + 
                            "<th class='text-right'>Telesna višina</th>" +
                            "<th class='text-right'>BMI</th>" +
                            "<th class='text-right'>Diastolični tlak</th>" + 
                            "<th class='text-right'>Sistolični tlak</th></tr>";
                                for (var i in res) {
                                    teza[i] = res[i].weight;
                                    rezultat += "<tr><td>" + res[i].time + 
                                    "</td><td class='text-right'>" + res[i].weight + " " + res[i].unit + "</td>" + 
                                    "<td class='text-right'>" + visina[i] + "</td>" +
                                    "<td class='text-right'>" + Math.round(res[i].weight/((visina[i]/100)*(visina[i]/100))) + "</td>" +
                                    "<td class='text-right'>" + diastolicni[i] + "</td>" +
                                    "<td class='text-right'>" + sistolicni[i] + "</td></tr>";
                                    
                                }
                                rezultat += "</table>";
                                $("#prikaziMeritve").append(rezultat);
                        } else {
                            $("#sporociloPrikazMeritev").html(
                                "<span class='obvesilo label label-warning fade-in'>Ni zabeleženih preteklih meritev.</span>");
                        }
                    },
                    error: function() {
                        $("#sporociloPrikazMeritev").html(
                  "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                  JSON.parse(err.responseText).userMessage + "'!");
                    }
                });
            }
        });
    }
}
function prikaz () {
    feedBack();
    prikaziMeritve();
    
}

function feedBack () {
    var x = 0;
    var y = 0;
    for (var i in teza)
    {
        x += teza[i]/((visina[i]/100)*(visina[i]/100));
        y++;
    }
    var povprecjeBMI = x/y;
    console.log(povprecjeBMI);
    if((!povprecjeBMI &&  trenutniUporabnik) || e==0){
        $("#sporociloPrikazMeritev").html(
                  "<span class='obvestilo label label-danger fade-in'>Napaka: '" +
                  "'Se enkrat pritisnite na gumb PRIKAŽI PRETEKLE MERITVE!");
                  e=1;
    } else if(trenutniUporabnik){
         $("#sporociloPrikazMeritev").html(
                  "<span class='obvestilo label label-success fade-in'>Uspesen prikaz");
        
        if(povprecjeBMI <= 16){
            $("#feedbackSporocilo").html("<p><b>HUDA PODHRANJENOST, ČIM PREJ POJDITE NA PREGLED K ZDRAVNIKU!" + 
            "<a href='https://sl.wikipedia.org/wiki/Nedohranjenost'> Klikni za več informacij</p></b>");
        } else if (povprecjeBMI <= 17){
             $("#feedbackSporocilo").html("<p><b>ZMERNA PODHRANJENOST, BODITE POZORNI NA SVOJO TELESNO TEŽO IN PREHRANO.</p></b>");
        } else if (povprecjeBMI <= 18.5){
            $("#feedbackSporocilo").html("<p><b>BLAGA PODHRANJENOST, KAKŠEN DODATEN KILOGRAM VAM NEBI ŠKODIL ;)</p></b>");
        } else if (povprecjeBMI <= 25){
            $("#feedbackSporocilo").html("<p><b>ODLIČNO IMATE NORAMALNO TELSESNO TEŽO.</p></b>");
        } else if (povprecjeBMI <= 30){
            $("#feedbackSporocilo").html("<p><b>IMATE POVEČANO TELESNO TEŽO, PAZITE NA PREHRANO IN PAZITE DA SE ČIM VEČ GIBATE.</p></b>");
        } else {
             $("#feedbackSporocilo").html("<p><b>NUJNO SE POZANIMAJTE SE NA KAKŠEN NAČIN LAHKO IZBUBITE TELESNO TEŽO, SAJ IMATE LAHKO PROBLEME ZARADI PREVELIKE TELESNE TEŽE!"+
             "<a href='https://sl.wikipedia.org/wiki/Debelost'>Klikni za več informacij</p></b>");
        }
        var stevec = 0;
        for (var i = 0; i < y; i++){
            if (sistolicni[i] > 120){
                stevec++;
            }
            if (diastolicni[i] > 80 && sistolicni[i] < 120){
                stevec++;
            }
        }
        if (stevec < 3 && stevec > 0){
            $("#feedbackSporocilo2").html("<p><b>"+stevec+"x STE IMELI PREVISOK PRITISK, PRIPOROČAM DA SI REDNO MERITE PRITISK IN STE NA TO POZORNI.</p></b>");
        } else if (stevec > 2){
             $("#feedbackSporocilo2").html("<p><b>"+stevec+"x STE IMELI PREVISOK PRITISK, KAR POMENI DA IMATE VERJETNO PROBLEME Z PREVISOKIM KRVNIM TLAKOM.</p>" +
             "<p>MOŽNI VZROKI ZA TO SO PREVELIK STRES, NEPRAVILNA PREHRANA, PITJE ALKOHOLA. VEČ SI LAHKO PREBERITE: "+
             "<a href = 'http://www.ezdravje.com/srce-in-zilje/visok-krvni-tlak/?s=vse'>Visok krvni tlak.</p></b>");
        } else {
            $("#feedbackSporocilo2").html("<p><b>SUPER, NIMATE PROBLEMOV S KRVNIM TLAKOM</b></p>");
        }
    }
}

