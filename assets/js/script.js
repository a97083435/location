$(document).on('click', '#copyFromQR, #copyUrl', function (e) {
    e.preventDefault();
    const input = document.getElementById('subUrl');
    input.select();
    input.setSelectionRange(0, 99999);
    document.execCommand('copy');
    $("#qrModal").modal('hide');
    alert('آدرس در کلیپ‌بورد کپی شد.');
});

let source = 'soroushmirzaei/telegram-configs-collector';
$(document).on('click', 'a[data-loc]', function (e) {
    e.preventDefault();
    let location = $(this).data('loc');
    //let title = location.toUpperCase();
    let title = location.toLowerCase();
    $('#countryLoc a').removeClass('active');
    $(this).addClass('active');
    let config = 'https://raw.githubusercontent.com/'+source+'/main/countries/'+title+'/mixed';
    $('#qrcode img').attr('src', "https://quickchart.io/qr/?size=300x200&light=ffffff&text="+encodeURIComponent(config));
    $('#qrModal h4').html('QRCode ('+title+')');
    $('#qrcode input').val(config);
    $("#qrModal").modal('show');
});

$('#qrModal').on('hidden.bs.modal', function () {
    $('#countryLoc a').removeClass('active');
});

function flagToCountryCode(flag) {
    const codePoints = flag.split(' ');
    return codePoints[1].toLowerCase();
}

function renderLocationData(locationPaths) {
    let html = '';
    locationPaths.forEach(function(element) {
        //let countryCode = flagToCountryCode(element);
        let countryCode = element;
        html += '<a href="" data-loc="'+element.toLowerCase()+'">';
        html += '<div class="slide">';
        html += '<img src="./assets/img/flags/'+countryCode+'.svg?v1.2" alt="'+element+'" />';
        html += '<p dir="auto">'+countryCode.toUpperCase()+'</p>';
        html += '</div>';
        html += '</a>';
    });
    $('#countryLoc').html(html);
}

window.addEventListener('load', function() {
    const cachedData = localStorage.getItem('locationData');
    const cachedTime = localStorage.getItem('locationDataTime');
    if (cachedData !== "undefined" && cachedTime !== "undefined" && (Date.now() - cachedTime < 15 * 60 * 1000)) {
        renderLocationData(cachedData.split(','));
    }
    else {
        fetch('https://api.github.com/repos/'+source+'/contents/countries')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                let locationPaths = data.filter(item => !item.name.includes("🇽🇽 XX") && !item.name.includes("🆥🆥"));
                locationPaths = locationPaths.map(item => item.name);
                console.log(locationPaths);
                localStorage.setItem('locationData', locationPaths);
                localStorage.setItem('locationDataTime', Date.now());
                renderLocationData(locationPaths);
            })
            .catch(error => {
                //renderLocationData(["🇮🇷 IR", "🇹🇷 TR", "🇬🇧 GB", "🇺🇸 US", "🇵🇱 PL", "🇫🇮 FI", "🇸🇪 SE", "🇩🇪 DE", "🇫🇷 FR"]);
                renderLocationData(["ir", "tr", "gb", "us", "pl", "fi", "se", "de", "fr"]);
            });
    }
});