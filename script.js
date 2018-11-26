var scrollEff = false;
$(document).ready(() => {
    console.log("we on this")
    localStorage.setItem("selectedCoins", JSON.stringify([]));
    localStorage.setItem("infoRequests", JSON.stringify([]));
    $("a[name='liveRep']").click(liveRepBtn);
    $("a[name='home']").click(homeBtn);
    $("a[name='about']").click(aboutBtn);
    $("#home").load("homeHtml.txt").promise().done(allCoins());
    $("#searchBar button.btn-primary").click(searchBtn);
    $("#searchBar button.btn-secondary").click(clearSeachBtn);
    $("#searchBar").submit((e) => {
        e.preventDeafult();
    });
    $(window).scrollTop(0);
    $(window).scroll(windowScroll)
});

function scrollToDiv(divName) {
    scrollEff = true;
    $('html,body').animate({
        scrollTop: $(`#${divName}`).offset().top - 200
    }, 1000, function () {
        scrollEff = false;
    });
}

function windowScroll(e) {
    if (scrollEff == false) {
        let homeH = $("#home").height();
        let repH = $("#liveRep").height();
        if ($("a[name='home']")[0].classList.contains("active")) {
            if (window.scrollY > homeH) {
                if ($("#liveRep").data("status") == "notRunning") {
                    $("#liveRep").html("");
                    liveRepOn();

                }
                $("a[name='home']").removeClass("active");
                $("a[name='liveRep']").addClass("active");
            }
        } else if ($("a[name='liveRep']")[0].classList.contains("active")) {
            if (window.scrollY > homeH + repH) {
                aboutOn();
            }
            if (window.scrollY < homeH) {
                $("a[name='liveRep'").removeClass("active");
                $("a[name='home']").addClass("active");
                if ($("#liveRep").data("status") == "notRunning") {
                    $("#liveRep").html("");
                }
                $("a[name='liveRep']").removeClass("active");
                $("a[name='home']").addClass("active");
            }
        } else

        if ($("a[name='about']")[0].classList.contains("active")) {
            if (window.scrollY < homeH + repH) {
                $("a[name='about']").removeClass("active");
                $("a[name='liveRep']").addClass("active");
                $("#about").html("");
            }
        }

    }
}

function aboutBtn() {
    scrollToDiv("about");
    if (!($("a[name='about']")[0].classList.contains("active"))) {
        aboutOn();
    }
}

function aboutOn() {
    $("#about").load("aboutHtml.txt");
    $(".form-inline").hide();
    $("a[name='about']").addClass("active");
    $("a[name='liveRep']").removeClass("active");
    $("a[name='home']").removeClass("active");
}

function homeBtn() {
    scrollToDiv(this.name);
    if (!(this.classList.contains("active"))) {
        $("#home").load("homeHtml.txt").promise().done(allCoins());
        $(".form-inline").show();
        $("a[name='home']").addClass("active");
        $("a[name='liveRep']").removeClass("active");
        $("a[name='about']").removeClass("active");
    }
}

function allCoins() {
    $.getJSON("https://api.coingecko.com/api/v3/coins/list", function (data) {
            coinCard(data);
        })
        .fail(function () {
            console.log("fail");
        })
        .always(function () {
            let existingCoinsArr = JSON.parse(localStorage.getItem("selectedCoins"));
            if (existingCoinsArr.length > 5) {
                existingCoinsArr.forEach(checked => {
                    $(`.card input[name='${checked}']`).prop("checked", true);
                });
            }
        })
}

function searchBtn() {
    var inpVal = $("#searchBar input").val().toLowerCase();
    var allCoins = $(".coinB");
    if (inpVal == "") {
        for (let i = 0; i < allCoins.length; i++) {
            if (allCoins[i].classList.contains("nodisp")) {
                allCoins[i].classList.replace("nodisp", "disp");
            }

        }
        $("#searchBar button.btn-secondary")[0].classList.replace("disp", "nodisp");
    } else {
        $("#searchBar button.btn-secondary")[0].classList.replace("nodisp", "disp");
        for (let i = 0; i < allCoins.length; i++) {
            if (allCoins[i].dataset.coinsymbol == inpVal || allCoins[i].dataset.coinid == inpVal) {
                if (allCoins[i].classList.contains("nodisp")) {
                    allCoins[i].classList.replace("nodis", "disp");
                }
            } else {
                allCoins[i].classList.replace("disp", "nodisp");
            }


        }
    }
}

function clearSeachBtn() {
    var allCoins = $(".coinB");
    for (let i = 0; i < allCoins.length; i++) {
        if (allCoins[i].classList.contains("nodisp")) {
            allCoins[i].classList.replace("nodisp", "disp");
        }
    }
    $("#searchBar button.btn-secondary")[0].classList.replace("disp", "nodisp");
}

function coinCard(coin) {
    for (let i = 0; i < 30; i++) {
        Cour = `     <div class="col-sm-4 px-0 coinContainer disp" data-coinid="${coin[i].id}" data-coinsymbol="${coin[i].symbol}">
        <div class="card">

            <label class="switch">
                <input type="checkbox" name="${coin[i].symbol}">
                <span class="slider round"></span>
            </label>

            <div class="card-body">
                <h4 class="card-title">${coin[i].symbol}</h4>
                <p class="card-text">${coin[i].name}</p>
                <button name="moreInf" class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapse${coin[i].id}"
                    aria-expanded="false" aria-controls="collapse${coin[i].id}" data-id="${coin[i].id}">More Info</button>
                <div class="collapse" id="collapse${coin[i].id}">
                    <div class="pad">
                        <progress class="progress" value="0" max="100" name="${coin[i].id}PB">0%</progress>
                    </div>

                </div>
            </div>
        </div>
    </div>
     
    `
        $(".coins>.row").append(Cour);
    }
    $(".card input[type='checkbox']").change(checkVal);
    $("button[name='moreInf']").click(moreInfoBtn);
}

function checkVal() {
    $("#liveRep").data("status", "notRunning");
    var coinCheck = "";
    var coinArr = JSON.parse(localStorage.getItem("selectedCoins"));
    if (this.checked == true) {
        if (coinArr.length < 5) {
            coinArr.push(this.name);
            localStorage.setItem("selectedCoins", JSON.stringify(coinArr));
        } else {
            coinCheck = this;
            overFiveModal(coinArr, coinCheck);
        }
    } else {
        let thisCoin = this.name;
        coinArr = coinArr.filter(function (coins) {
            return coins != thisCoin;
        });
        localStorage.setItem("selectedCoins", JSON.stringify(coinArr));
    }
}

function overFiveModal(coinArr, coinCheck) {
    debugger;
    $(".modal-body").html("");
    coinArr.forEach(element => {
        divSort = `
        <div class="sortCoins clearfix">
        <h5>${element}</h5>
        <label class="switch modalswitch">
        <input type="checkbox" checked="true" name="${element}">
        <span class="slider round"></span>
        </label>
        </div>
              `;
        $(".modal-body").append(divSort);
    });
    $("#myModal").modal('show');
    $(".modal-footer>.btn-danger").click([coinCheck], tmCoins);
    $(".modal-footer>.btn-success").click([coinCheck], checkBox);

    function tmCoins() {
        $(coinCheck).prop("checked", false);
        coinCheck = "";

    }

    function checkBox() {
        var coinMas = [];
        coinMas = $(".modalswitch>input");
        var tempCoinArr = [];
        for (let i = 0; i < coinMas.length; i++) {
            if (coinMas[i].checked == false) {
                $(`.card input[name='${coinMas[i].name}']`).prop("checked", false)
            } else {
                tempCoinArr.push(coinMas[i].name)
            };

        }
        if (tempCoinArr.length == 5) {
            $(coinCheck).prop("checked", false);
            localStorage.setItem("selectedCoins", JSON.stringify(tempCoinArr));
        } else {
            tempCoinArr.push(coinCheck.name);
            localStorage.setItem("selectedCoins", JSON.stringify(tempCoinArr));
        }
        coinCheck = "";
    }
}

function liveRepBtn() {
    scrollToDiv("liveRep");
    if (!($("a[name='liveRep']")[0].classList.contains("active"))) {
        liveRepOn();
    }
}

function liveRepOn() {
    if ($("#liveRep").data("status") == "notRunning") {
        $("#liveRep").load("reportHtml.txt")
    }
    $(".form-inline").hide();
    $("a[name='liveRep']").addClass("active");
    $("a[name='home']").removeClass("active");
    $("a[name='about']").removeClass("active");
    if (JSON.parse(localStorage.getItem("selectedCoins")).length > 0) {
        generatoreRep();
    }
}

function generatoreRep() {
    $("#liveRep").data("status", "running");
    var coinArr = JSON.parse(localStorage.getItem("selectedCoins"));
    if (coinArr.length > 0) {
        $("#chartCon").html("");
        var upperCaseArr = $.map(coinArr, function (c) {
            return c.toUpperCase();
        });
        var chartData = createVariables(upperCaseArr);
        var str = upperCaseArr.join(",");
        $.getJSON(`https://min-app.cryptocompare.com/data/pricemulti?fsyms=${str}&tsyms=USD`, function (dataApi) {
            for (let i = 0; i < chartData.length; i++) {
                let currname = chartData[i].name;
                chartData[i].yValue = dataApi[currname].USD;
                chartData[i].dataPoints[0].y = chartData[i].yValue;

            }
        }).always(function () {
            drawChart(chartData, str);
        });
    }
}

function createVariables(upperCaseArr) {
    var dataArr = [];
    for (let i = 0; i < upperCaseArr.length; i++) {
        dataArr[i] = {
            type: "line",
            xValueType: "dateTime",
            xValueFormatString: "###.00WH",
            xValueFormatString: "hh:mm:ss TT",
            showInLegend: true,
            name: upperCaseArr[i],
            dataPoints: [{
                x: new Date(),
                y: 0,
            }],
            yValue: 0,
        }
    }
    return dataArr;
}

function drawChart(chartData, str) {
    var data = chartData;
    var options = {
        title: {
            text: "Current in USD Value"
        },
        axisX: {
            title: "every 2 seccond"

        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "top",
            fontSize: 24,
            fontColor: "lightCoral",
            itemClick: toggleDataSeries
        },
        data: data
    };
    var chart = $("#chartCon").CanvasJSChart(options);

    function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }
    var upInt = 2000;
    var time = new Date($.now());

    function reChart() {
        time.setTime(time.getTime() + upInt);
        for (let i = 0; i < data.length; i++) {
            data[i].dataPoints.push({
                x: time.getTime(),
                y: data[i].yValue
            });
            options.data[i].legendText = `${data[i].name}:` + data[i].yValue + "USD";
        }
        $("#chartCon").CanvasJSChart().render();
    }
    reChart();
    var dataInt = setInterval(function () {
        $.getJSON(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${str}&tsyms=USD`, function (dataApi) {
            for (let i = 0; i < data.length; i++) {
                let currname = data[i].name;
                data[i].yValue = dataApi[currname].USD;
                data[i].dataPoints[0].y = data[i].yValue;
            }

        }).always(function () {
            reChart(data);
        });
        if (JSON.parse(localStorage.getItem("selectedCoins")).length == 0) {
            clearInterval(dataInt);
        }
    }, upInt);
}

function moreInfoBtn() {
    if (this.nextElementSibling.className == "collapse") {
        progressBar(this, cryptoInfo);
    } else {
        if (($(`#collapse${this.dataset.id}`).children()[1]) != undefined) {
            $(`#collapse${this.dataset.id}`).children()[1].remove();
        }
    }
}

function cryptoInfo(coinBtn) {
    var reInfo = false;
    var reqInfoId = coinBtn.dataset.id;
    var currCoinArr = JSON.parse(localStorage.getItem("infoRequests"));
    if (currCoinArr.length == 0) {
        getInfoApi(reqInfoId, coinBtn);
    } else {
        var arrInedx = currCoinArr.findIndex(c => c.id == reqInfoId);
        if (arrInedx != -1) {
            reInfo = timeT(currCoinArr[arrInedx].timeset);
            if (reInfo) {
                currCoinArr.splice(arrInedx, arrInedx + 1);
                localStorage.setItem("infoRequests", JSON.stringify(currCoinArr));
                getInfoApi(reqInfoId, coinBtn);
            } else {
                newDiv(reqInfoId);
            }
        } else {
            getInfoApi(reqInfoId, coinBtn);
        }
    }
}

function timeT(objTime) {
    var currTime = new Date($.now());
    var time = {
        hours: currTime.getHours(),
        minutes: currTime.getMinutes()
    };
    if (time.hours = objTime.hours) {
        if (time.minutes - objTime.minutes > 2) {
            return true;
        }
    } else if (time.hours > objTime.hours) {
        if (time.minutes < objTime.minutes) {
            if ((60 + time.minutes) - objTime.minutes > 2) {
                return true;
            }
        } else {
            return true;
        }
    }
}

function newCoinObj(id, img, timeset, dispInf) {
    var currCoinArr = JSON.parse(localStorage.getItem("infoRequests"));
    currCoinArr.push(new CoinInfo(id, img, timeset, dispInf));
    localStorage.setItem("infoRequests", JSON.stringify(currCoinArr))
}

function newDiv(reqInfoId) {
    var coin = JSON.parse(localStorage.getItem("infoRequests"));
    var index = coin.findIndex(c => c.id == reqInfoId);
    var thisCoinInfo = `
    <div class="card card-body" name="${coin[index].id}">
    <img src="${coin[index].img}" width="50px"height="50px" style="border:black solid">
    <p>Price in USD:${coin[index].dispInf.USD}<span>&dollar;</span></p>
    <p>Price in EUR${coin[index].dispInf.eur}<span>&euro;</span></p>
    <p>Price in ILS${coin[index].dispInf.ils}<span>&#8362;</spa></p>
    </div>
    `;
    $(`#collapse${coin[index].id}`).append(thisCoinInfo);
}

function getInfoApi(reqInfoId, coinBtn) {
    var jqxhr = $.getJSON(`https://api.coingecko.com/api/v3/coins/${reqInfoId}`, function (data) {
            var currTime = new Date($.now());
            newCoinObj(data.id, data.image.small, {
                usd: data.market_data.current_price.usd,
                eur: data.market_data.current_price.eur,
                ils: data.market_data.current_price.ils
            });
            newDiv(data.id);
        })
        .fail(function () {
            console.log("error");
        })
        .always(function () {
            console.log("complete");
        });
}

function progressBar(coin, getCoinInfo) {
    var coinId = coin.dataset.id;
    var progressBar = $(`.progress[name="${coinId}PB"]`);
    progressBar.css('display', 'block');
    var progress = 0;
    var timeout = 5;
    var increment = .5;
    var maxprogress = 105;

    function animate() {
        setTimeout(function () {
            progress += increment;
            if (progress < maxprogress) {
                progressBar.attr('value', progress);
                animate()
            } else {
                progressBar.css('display', 'none');
                getCoinInfo(coin);
            }

        }, timeout);
    };
    animate();
}

function CoinInfo(id, img, dispInf) {
    this.id = id;
    this.img = img;
    this.timeset = function () {
        let date = new Date($.now());
        return {
            hours: date.getHours(),
            minutes: date.getMinutes(),
        };
    }();
    new Date($.now());
    this.dispInf = dispInf;
}

