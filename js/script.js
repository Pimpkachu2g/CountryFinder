let cData;
let header = document.getElementsByClassName('header')[0];
let cContainer = document.getElementsByClassName('card-container')[0];
let searchBtn = document.getElementsByClassName('search')[0];
let searchBar = document.getElementsByClassName('searchBar')[0];
let extraInfo = document.getElementsByClassName('extra-info')[0];

function postCountry (flag, name, population, capital, area, language, alphaCode) {
    cContainer.innerHTML += 
    `<div class="card" onclick="openExtra('${name}')">
        <div class="top"  style="background:linear-gradient(300deg, ${generateColor()} 20%, ${generateColor()} 60%);">
        <div class="flag" style="background-image: url('${flag}')">
        <div class="alpha"><span>${alphaCode}<span></div>
        </div>
        </div>
        <div class="bottom">
            <h4>${name}</h4>
            <div class="stats">
                <span>${shortenNum(population)}</span>
                <span>${language}</span>
                <span>${capital}</span>
                <span>${shortenNum(area)} Km²</span>
            </div>
        </div>
    </div>`;
}

function postExtra (flag, name, population, capital, area, alphaCode, timezone, currency, language, areaCode, region, nativeName) {
    extraInfo.innerHTML = 
    `<div class="exit" onclick='closeExtra()'>X</div>
    <div class="info-header">
        <div class="border" style="background:linear-gradient(300deg, ${generateColor()} 20%, ${generateColor()} 60%);">
            <div class="info-flag" style="background-image: url('${flag}')">
            <div class="info-alpha"><span>${alphaCode}<span></div>
            </div>
        </div>
        <h2>${name}</h2>
    </div>
    <div class="info-body">
        ${generateSection ('./style/images/breathable.svg', 'Native Name', `${nativeName}`)}
        ${generateSection ('./style/images/world-map.svg', 'Region', `${region}`)}
        ${generateSection ('./style/images/cityscape.svg', 'Capital', capital)}
        ${generateSection ('./style/images/location-pointer.svg', 'Area', `${area} Km²`)}
        ${generateSection ('./style/images/human.svg', 'Population', population)}
        ${generateSection ('./style/images/open-book.svg', 'Language', `${generateLanguage (language)}`)}
        ${generateSection ('./style/images/money.svg', 'Currency', `${currency}`)}
        ${generateSection ('./style/images/clock-circular-outline.svg', 'Timezone', `${timezone}`)}
        ${generateSection ('./style/images/telephone.svg', 'Area-code', `+${areaCode}`)}
    </div>`;
}

function generateLanguage (languages) {
    let result = '';
    languages.forEach( lang => {
        if (result !== '') {
            result += ', ';
        }
        result += lang.name;
    });  
    return result; 
}

function generateCurrency (name, symbol) {
    let result = '';
    if (name) {
        result = name;
        if (symbol) {
            result += `<br>${symbol}`;
        }
    }
    return result;
}

function generateSection (icon, type, stat) {
    let section = 
    `<div class="info-section">
        <div class="info-icon">
            <img src="${icon}" alt="${type}">
        </div>
        <div class="type">
            <div>${type}</div>
            <hr>
            <div>${stat}</div>
        </div>
    </div>`;
    return section;
}

function openExtra (name) {
    extraInfo.style.opacity = '1';
    extraInfo.style.zIndex = '11';
    cContainer.style.overflow = 'hidden';
    let data = fetchData(name)
    .then(data => {
        postExtra(data[0].flag, data[0].name, data[0].population, data[0].capital, data[0].area, data[0].alpha2Code, data[0].timezones[0], generateCurrency(data[0].currencies[0].name, data[0].currencies[0].symbol), data[0].languages, data[0].callingCodes[0], data[0].region, data[0].nativeName);
    })
}

function closeExtra () {
    extraInfo.innerHTML = '';
    extraInfo.style.opacity = '0';
    extraInfo.style.zIndex = '-1';
    cContainer.style.overflow = 'auto';
}

async function fetchData (country) {
    let call = await fetch(`https://restcountries.eu/rest/v2/name/${country}`);
    let data = await call.json();
    return data;
}

function randomNum (min, max) {
    return Math.floor(Math.random() * (max - min) + min); 
}

function generateColor () {
    return `rgba(${randomNum(0, 255)}, ${randomNum(0, 255)}, ${randomNum(0, 255)}, 0.5)`;
}

function shortenNum (num) {
    let strLength = num.length;
    let result;
    let arr = num.split('');
    if (num == 'null') {
        return '';
    }
    switch (strLength) {
        case 4:
            result = `${arr[0]}`;
            result += generateNumPoint(arr[1]);
            break;
        case 5:
            result = `${arr[0]}${arr[1]}`;
            result += generateNumPoint(arr[2]);
            break;
        case 6:
            result = `${arr[0]}${arr[1]}${arr[2]}`;
            result += generateNumPoint(arr[3]);
            break;
        case 7:
            result = `${arr[0]}`;
            result += generateNumPoint(arr[1]);
            break;
        case 8:
            result = `${arr[0]}${arr[1]}`;
            result += generateNumPoint(arr[2]);
            break;
        case 9:
            result = `${arr[0]}${arr[1]}${arr[2]}`;
            result += generateNumPoint(arr[3]);
            break;
        case 10:
            result = `${arr[0]}`;
            result += generateNumPoint(arr[1]);
            break;
        default:
            result = num;
    }
    result += generateScale(strLength);
    return result;
}

function generateNumPoint (element) {
    if (element !== '0') {
        return `.${element}`; 
    }
    return '';
}

function generateScale (num) {
    if (num > 3 && num < 7) {
        return `K`
    } else if (num > 6 && num < 10) {
        return `M`
    } else if (num > 9 && num < 13) {
        return `B`
    } else {
        return '';
    }
}

searchBtn.addEventListener ("click", (e) => {
    e.preventDefault();
    cData = fetchData(searchBar.value)
    .then(data => {
        cContainer.innerHTML = ''; //reset html 
        for (let i = 0; i < data.length; i++) {
            postCountry(data[i].flag, data[i].name, `${data[i].population}`, data[i].capital, `${data[i].area}`, data[i].languages[0].name, data[i].alpha2Code);
       }
    })
})

searchBar.addEventListener ('keypress', (e) => {
    if(e.charCode === 13) {
        e.preventDefault();
        cData = fetchData(searchBar.value)
        .then(data => {
        cContainer.innerHTML = ''; //reset html 
            for (let i = 0; i < data.length; i++) {
                postCountry(data[i].flag, data[i].name, `${data[i].population}`, data[i].capital, `${data[i].area}`, data[i].languages[0].name, data[i].alpha2Code);
            }
        })
    }
})