import { Injectable } from '@angular/core';

export class StaticService {
    constructor() { }
    
    getTimezones(){
        let getTimezones=
        [
            {
                "value": "-08:00 US/Alaska",
                "text": "(GMT-08:00) US/Alaska"
            },
            {
                "value": "-09:00 US/Aleutian",
                "text": "(GMT-09:00) US/Aleutian"
            },
            {
                "value": "-07:00 US/Arizona",
                "text": "(GMT-07:00) US/Arizona"
            },
            {
                "value": "-05:00 US/Central",
                "text": "(GMT-05:00) US/Central"
            },
            {
                "value": "-04:00 US/East-Indiana",
                "text": "(GMT-04:00) US/East-Indiana"
            },
            {
                "value": "-04:00 US/Eastern",
                "text": "(GMT-04:00) US/Eastern"
            },
            {
                "value": "-10:00 US/Hawaii",
                "text": "(GMT-10:00) US/Hawaii"
            },
            {
                "value": "-05:00 US/Indiana-Starke",
                "text": "(GMT-05:00) US/Indiana-Starke"
            },
            {
                "value": "-04:00 US/Michigan",
                "text": "(GMT-04:00) US/Michigan"
            },
            {
                "value": "-06:00 US/Mountain",
                "text": "(GMT-06:00) US/Mountain"
            },
            {
                "value": "-07:00 US/Pacific",
                "text": "(GMT-07:00) US/Pacific"
            },
            {
                "value": "-07:00 US/Pacific-New",
                "text": "(GMT-07:00) US/Pacific-New"
            },
            {
                "value": "-11:00 US/Samoa",
                "text": "(GMT-11:00) US/Samoa"
            },
            
            {
                "value": "+00:00 Africa/Abidjan",
                "text": "(GMT+00:00) Africa/Abidjan"
            },
            {
                "value": "+00:00 Africa/Accra",
                "text": "(GMT+00:00) Africa/Accra"
            },
            {
                "value": "+03:00 Africa/Addis_Ababa",
                "text": "(GMT+03:00) Africa/Addis_Ababa"
            },
            {
                "value": "+01:00 Africa/Algiers",
                "text": "(GMT+01:00) Africa/Algiers"
            },
            {
                "value": "+03:00 Africa/Asmara",
                "text": "(GMT+03:00) Africa/Asmara"
            },
            {
                "value": "+03:00 Africa/Asmera",
                "text": "(GMT+03:00) Africa/Asmera"
            },
            {
                "value": "+00:00 Africa/Bamako",
                "text": "(GMT+00:00) Africa/Bamako"
            },
            {
                "value": "+01:00 Africa/Bangui",
                "text": "(GMT+01:00) Africa/Bangui"
            },
            {
                "value": "+00:00 Africa/Banjul",
                "text": "(GMT+00:00) Africa/Banjul"
            },
            {
                "value": "+00:00 Africa/Bissau",
                "text": "(GMT+00:00) Africa/Bissau"
            },
            {
                "value": "+02:00 Africa/Blantyre",
                "text": "(GMT+02:00) Africa/Blantyre"
            },
            {
                "value": "+01:00 Africa/Brazzaville",
                "text": "(GMT+01:00) Africa/Brazzaville"
            },
            {
                "value": "+02:00 Africa/Bujumbura",
                "text": "(GMT+02:00) Africa/Bujumbura"
            },
            {
                "value": "+02:00 Africa/Cairo",
                "text": "(GMT+02:00) Africa/Cairo"
            },
            {
                "value": "+01:00 Africa/Casablanca",
                "text": "(GMT+01:00) Africa/Casablanca"
            },
            {
                "value": "+02:00 Africa/Ceuta",
                "text": "(GMT+02:00) Africa/Ceuta"
            },
            {
                "value": "+00:00 Africa/Conakry",
                "text": "(GMT+00:00) Africa/Conakry"
            },
            {
                "value": "+00:00 Africa/Dakar",
                "text": "(GMT+00:00) Africa/Dakar"
            },
            {
                "value": "+03:00 Africa/Dar_es_Salaam",
                "text": "(GMT+03:00) Africa/Dar_es_Salaam"
            },
            {
                "value": "+03:00 Africa/Djibouti",
                "text": "(GMT+03:00) Africa/Djibouti"
            },
            {
                "value": "+01:00 Africa/Douala",
                "text": "(GMT+01:00) Africa/Douala"
            },
            {
                "value": "+01:00 Africa/El_Aaiun",
                "text": "(GMT+01:00) Africa/El_Aaiun"
            },
            {
                "value": "+00:00 Africa/Freetown",
                "text": "(GMT+00:00) Africa/Freetown"
            },
            {
                "value": "+02:00 Africa/Gaborone",
                "text": "(GMT+02:00) Africa/Gaborone"
            },
            {
                "value": "+02:00 Africa/Harare",
                "text": "(GMT+02:00) Africa/Harare"
            },
            {
                "value": "+02:00 Africa/Johannesburg",
                "text": "(GMT+02:00) Africa/Johannesburg"
            },
            {
                "value": "+03:00 Africa/Juba",
                "text": "(GMT+03:00) Africa/Juba"
            },
            {
                "value": "+03:00 Africa/Kampala",
                "text": "(GMT+03:00) Africa/Kampala"
            },
            {
                "value": "+03:00 Africa/Khartoum",
                "text": "(GMT+03:00) Africa/Khartoum"
            },
            {
                "value": "+02:00 Africa/Kigali",
                "text": "(GMT+02:00) Africa/Kigali"
            },
            {
                "value": "+01:00 Africa/Kinshasa",
                "text": "(GMT+01:00) Africa/Kinshasa"
            },
            {
                "value": "+01:00 Africa/Lagos",
                "text": "(GMT+01:00) Africa/Lagos"
            },
            {
                "value": "+01:00 Africa/Libreville",
                "text": "(GMT+01:00) Africa/Libreville"
            },
            {
                "value": "+00:00 Africa/Lome",
                "text": "(GMT+00:00) Africa/Lome"
            },
            {
                "value": "+01:00 Africa/Luanda",
                "text": "(GMT+01:00) Africa/Luanda"
            },
            {
                "value": "+02:00 Africa/Lubumbashi",
                "text": "(GMT+02:00) Africa/Lubumbashi"
            },
            {
                "value": "+02:00 Africa/Lusaka",
                "text": "(GMT+02:00) Africa/Lusaka"
            },
            {
                "value": "+01:00 Africa/Malabo",
                "text": "(GMT+01:00) Africa/Malabo"
            },
            {
                "value": "+02:00 Africa/Maputo",
                "text": "(GMT+02:00) Africa/Maputo"
            },
            {
                "value": "+02:00 Africa/Maseru",
                "text": "(GMT+02:00) Africa/Maseru"
            },
            {
                "value": "+02:00 Africa/Mbabane",
                "text": "(GMT+02:00) Africa/Mbabane"
            },
            {
                "value": "+03:00 Africa/Mogadishu",
                "text": "(GMT+03:00) Africa/Mogadishu"
            },
            {
                "value": "+00:00 Africa/Monrovia",
                "text": "(GMT+00:00) Africa/Monrovia"
            },
            {
                "value": "+03:00 Africa/Nairobi",
                "text": "(GMT+03:00) Africa/Nairobi"
            },
            {
                "value": "+01:00 Africa/Ndjamena",
                "text": "(GMT+01:00) Africa/Ndjamena"
            },
            {
                "value": "+01:00 Africa/Niamey",
                "text": "(GMT+01:00) Africa/Niamey"
            },
            {
                "value": "+00:00 Africa/Nouakchott",
                "text": "(GMT+00:00) Africa/Nouakchott"
            },
            {
                "value": "+00:00 Africa/Ouagadougou",
                "text": "(GMT+00:00) Africa/Ouagadougou"
            },
            {
                "value": "+01:00 Africa/Porto-Novo",
                "text": "(GMT+01:00) Africa/Porto-Novo"
            },
            {
                "value": "+00:00 Africa/Sao_Tome",
                "text": "(GMT+00:00) Africa/Sao_Tome"
            },
            {
                "value": "+00:00 Africa/Timbuktu",
                "text": "(GMT+00:00) Africa/Timbuktu"
            },
            {
                "value": "+02:00 Africa/Tripoli",
                "text": "(GMT+02:00) Africa/Tripoli"
            },
            {
                "value": "+01:00 Africa/Tunis",
                "text": "(GMT+01:00) Africa/Tunis"
            },
            {
                "value": "+01:00 Africa/Windhoek",
                "text": "(GMT+01:00) Africa/Windhoek"
            },
            {
                "value": "-09:00 America/Adak",
                "text": "(GMT-09:00) America/Adak"
            },
            {
                "value": "-08:00 America/Anchorage",
                "text": "(GMT-08:00) America/Anchorage"
            },
            {
                "value": "-04:00 America/Anguilla",
                "text": "(GMT-04:00) America/Anguilla"
            },
            {
                "value": "-04:00 America/Antigua",
                "text": "(GMT-04:00) America/Antigua"
            },
            {
                "value": "-03:00 America/Araguaina",
                "text": "(GMT-03:00) America/Araguaina"
            },
            {
                "value": "-03:00 America/Argentina/Buenos_Aires",
                "text": "(GMT-03:00) America/Argentina/Buenos_Aires"
            },
            {
                "value": "-03:00 America/Argentina/Catamarca",
                "text": "(GMT-03:00) America/Argentina/Catamarca"
            },
            {
                "value": "-03:00 America/Argentina/ComodRivadavia",
                "text": "(GMT-03:00) America/Argentina/ComodRivadavia"
            },
            {
                "value": "-03:00 America/Argentina/Cordoba",
                "text": "(GMT-03:00) America/Argentina/Cordoba"
            },
            {
                "value": "-03:00 America/Argentina/Jujuy",
                "text": "(GMT-03:00) America/Argentina/Jujuy"
            },
            {
                "value": "-03:00 America/Argentina/La_Rioja",
                "text": "(GMT-03:00) America/Argentina/La_Rioja"
            },
            {
                "value": "-03:00 America/Argentina/Mendoza",
                "text": "(GMT-03:00) America/Argentina/Mendoza"
            },
            {
                "value": "-03:00 America/Argentina/Rio_Gallegos",
                "text": "(GMT-03:00) America/Argentina/Rio_Gallegos"
            },
            {
                "value": "-03:00 America/Argentina/Salta",
                "text": "(GMT-03:00) America/Argentina/Salta"
            },
            {
                "value": "-03:00 America/Argentina/San_Juan",
                "text": "(GMT-03:00) America/Argentina/San_Juan"
            },
            {
                "value": "-03:00 America/Argentina/San_Luis",
                "text": "(GMT-03:00) America/Argentina/San_Luis"
            },
            {
                "value": "-03:00 America/Argentina/Tucuman",
                "text": "(GMT-03:00) America/Argentina/Tucuman"
            },
            {
                "value": "-03:00 America/Argentina/Ushuaia",
                "text": "(GMT-03:00) America/Argentina/Ushuaia"
            },
            {
                "value": "-04:00 America/Aruba",
                "text": "(GMT-04:00) America/Aruba"
            },
            {
                "value": "-04:00 America/Asuncion",
                "text": "(GMT-04:00) America/Asuncion"
            },
            {
                "value": "-05:00 America/Atikokan",
                "text": "(GMT-05:00) America/Atikokan"
            },
            {
                "value": "-09:00 America/Atka",
                "text": "(GMT-09:00) America/Atka"
            },
            {
                "value": "-03:00 America/Bahia",
                "text": "(GMT-03:00) America/Bahia"
            },
            {
                "value": "-05:00 America/Bahia_Banderas",
                "text": "(GMT-05:00) America/Bahia_Banderas"
            },
            {
                "value": "-04:00 America/Barbados",
                "text": "(GMT-04:00) America/Barbados"
            },
            {
                "value": "-03:00 America/Belem",
                "text": "(GMT-03:00) America/Belem"
            },
            {
                "value": "-06:00 America/Belize",
                "text": "(GMT-06:00) America/Belize"
            },
            {
                "value": "-04:00 America/Blanc-Sablon",
                "text": "(GMT-04:00) America/Blanc-Sablon"
            },
            {
                "value": "-04:00 America/Boa_Vista",
                "text": "(GMT-04:00) America/Boa_Vista"
            },
            {
                "value": "-05:00 America/Bogota",
                "text": "(GMT-05:00) America/Bogota"
            },
            {
                "value": "-06:00 America/Boise",
                "text": "(GMT-06:00) America/Boise"
            },
            {
                "value": "-03:00 America/Buenos_Aires",
                "text": "(GMT-03:00) America/Buenos_Aires"
            },
            {
                "value": "-06:00 America/Cambridge_Bay",
                "text": "(GMT-06:00) America/Cambridge_Bay"
            },
            {
                "value": "-04:00 America/Campo_Grande",
                "text": "(GMT-04:00) America/Campo_Grande"
            },
            {
                "value": "-05:00 America/Cancun",
                "text": "(GMT-05:00) America/Cancun"
            },
            {
                "value": "-04:00 America/Caracas",
                "text": "(GMT-04:00) America/Caracas"
            },
            {
                "value": "-03:00 America/Catamarca",
                "text": "(GMT-03:00) America/Catamarca"
            },
            {
                "value": "-03:00 America/Cayenne",
                "text": "(GMT-03:00) America/Cayenne"
            },
            {
                "value": "-05:00 America/Cayman",
                "text": "(GMT-05:00) America/Cayman"
            },
            {
                "value": "-05:00 America/Chicago",
                "text": "(GMT-05:00) America/Chicago"
            },
            {
                "value": "-06:00 America/Chihuahua",
                "text": "(GMT-06:00) America/Chihuahua"
            },
            {
                "value": "-05:00 America/Coral_Harbour",
                "text": "(GMT-05:00) America/Coral_Harbour"
            },
            {
                "value": "-03:00 America/Cordoba",
                "text": "(GMT-03:00) America/Cordoba"
            },
            {
                "value": "-06:00 America/Costa_Rica",
                "text": "(GMT-06:00) America/Costa_Rica"
            },
            {
                "value": "-07:00 America/Creston",
                "text": "(GMT-07:00) America/Creston"
            },
            {
                "value": "-04:00 America/Cuiaba",
                "text": "(GMT-04:00) America/Cuiaba"
            },
            {
                "value": "-04:00 America/Curacao",
                "text": "(GMT-04:00) America/Curacao"
            },
            {
                "value": "+00:00 America/Danmarkshavn",
                "text": "(GMT+00:00) America/Danmarkshavn"
            },
            {
                "value": "-07:00 America/Dawson",
                "text": "(GMT-07:00) America/Dawson"
            },
            {
                "value": "-07:00 America/Dawson_Creek",
                "text": "(GMT-07:00) America/Dawson_Creek"
            },
            {
                "value": "-06:00 America/Denver",
                "text": "(GMT-06:00) America/Denver"
            },
            {
                "value": "-04:00 America/Detroit",
                "text": "(GMT-04:00) America/Detroit"
            },
            {
                "value": "-04:00 America/Dominica",
                "text": "(GMT-04:00) America/Dominica"
            },
            {
                "value": "-06:00 America/Edmonton",
                "text": "(GMT-06:00) America/Edmonton"
            },
            {
                "value": "-05:00 America/Eirunepe",
                "text": "(GMT-05:00) America/Eirunepe"
            },
            {
                "value": "-06:00 America/El_Salvador",
                "text": "(GMT-06:00) America/El_Salvador"
            },
            {
                "value": "-07:00 America/Ensenada",
                "text": "(GMT-07:00) America/Ensenada"
            },
            {
                "value": "-07:00 America/Fort_Nelson",
                "text": "(GMT-07:00) America/Fort_Nelson"
            },
            {
                "value": "-04:00 America/Fort_Wayne",
                "text": "(GMT-04:00) America/Fort_Wayne"
            },
            {
                "value": "-03:00 America/Fortaleza",
                "text": "(GMT-03:00) America/Fortaleza"
            },
            {
                "value": "-03:00 America/Glace_Bay",
                "text": "(GMT-03:00) America/Glace_Bay"
            },
            {
                "value": "-02:00 America/Godthab",
                "text": "(GMT-02:00) America/Godthab"
            },
            {
                "value": "-03:00 America/Goose_Bay",
                "text": "(GMT-03:00) America/Goose_Bay"
            },
            {
                "value": "-04:00 America/Grand_Turk",
                "text": "(GMT-04:00) America/Grand_Turk"
            },
            {
                "value": "-04:00 America/Grenada",
                "text": "(GMT-04:00) America/Grenada"
            },
            {
                "value": "-04:00 America/Guadeloupe",
                "text": "(GMT-04:00) America/Guadeloupe"
            },
            {
                "value": "-06:00 America/Guatemala",
                "text": "(GMT-06:00) America/Guatemala"
            },
            {
                "value": "-05:00 America/Guayaquil",
                "text": "(GMT-05:00) America/Guayaquil"
            },
            {
                "value": "-04:00 America/Guyana",
                "text": "(GMT-04:00) America/Guyana"
            },
            {
                "value": "-03:00 America/Halifax",
                "text": "(GMT-03:00) America/Halifax"
            },
            {
                "value": "-04:00 America/Havana",
                "text": "(GMT-04:00) America/Havana"
            },
            {
                "value": "-07:00 America/Hermosillo",
                "text": "(GMT-07:00) America/Hermosillo"
            },
            {
                "value": "-04:00 America/Indiana/Indianapolis",
                "text": "(GMT-04:00) America/Indiana/Indianapolis"
            },
            {
                "value": "-05:00 America/Indiana/Knox",
                "text": "(GMT-05:00) America/Indiana/Knox"
            },
            {
                "value": "-04:00 America/Indiana/Marengo",
                "text": "(GMT-04:00) America/Indiana/Marengo"
            },
            {
                "value": "-04:00 America/Indiana/Petersburg",
                "text": "(GMT-04:00) America/Indiana/Petersburg"
            },
            {
                "value": "-05:00 America/Indiana/Tell_City",
                "text": "(GMT-05:00) America/Indiana/Tell_City"
            },
            {
                "value": "-04:00 America/Indiana/Vevay",
                "text": "(GMT-04:00) America/Indiana/Vevay"
            },
            {
                "value": "-04:00 America/Indiana/Vincennes",
                "text": "(GMT-04:00) America/Indiana/Vincennes"
            },
            {
                "value": "-04:00 America/Indiana/Winamac",
                "text": "(GMT-04:00) America/Indiana/Winamac"
            },
            {
                "value": "-04:00 America/Indianapolis",
                "text": "(GMT-04:00) America/Indianapolis"
            },
            {
                "value": "-06:00 America/Inuvik",
                "text": "(GMT-06:00) America/Inuvik"
            },
            {
                "value": "-04:00 America/Iqaluit",
                "text": "(GMT-04:00) America/Iqaluit"
            },
            {
                "value": "-05:00 America/Jamaica",
                "text": "(GMT-05:00) America/Jamaica"
            },
            {
                "value": "-03:00 America/Jujuy",
                "text": "(GMT-03:00) America/Jujuy"
            },
            {
                "value": "-08:00 America/Juneau",
                "text": "(GMT-08:00) America/Juneau"
            },
            {
                "value": "-04:00 America/Kentucky/Louisville",
                "text": "(GMT-04:00) America/Kentucky/Louisville"
            },
            {
                "value": "-04:00 America/Kentucky/Monticello",
                "text": "(GMT-04:00) America/Kentucky/Monticello"
            },
            {
                "value": "-05:00 America/Knox_IN",
                "text": "(GMT-05:00) America/Knox_IN"
            },
            {
                "value": "-04:00 America/Kralendijk",
                "text": "(GMT-04:00) America/Kralendijk"
            },
            {
                "value": "-04:00 America/La_Paz",
                "text": "(GMT-04:00) America/La_Paz"
            },
            {
                "value": "-05:00 America/Lima",
                "text": "(GMT-05:00) America/Lima"
            },
            {
                "value": "-07:00 America/Los_Angeles",
                "text": "(GMT-07:00) America/Los_Angeles"
            },
            {
                "value": "-04:00 America/Louisville",
                "text": "(GMT-04:00) America/Louisville"
            },
            {
                "value": "-04:00 America/Lower_Princes",
                "text": "(GMT-04:00) America/Lower_Princes"
            },
            {
                "value": "-03:00 America/Maceio",
                "text": "(GMT-03:00) America/Maceio"
            },
            {
                "value": "-06:00 America/Managua",
                "text": "(GMT-06:00) America/Managua"
            },
            {
                "value": "-04:00 America/Manaus",
                "text": "(GMT-04:00) America/Manaus"
            },
            {
                "value": "-04:00 America/Marigot",
                "text": "(GMT-04:00) America/Marigot"
            },
            {
                "value": "-04:00 America/Martinique",
                "text": "(GMT-04:00) America/Martinique"
            },
            {
                "value": "-05:00 America/Matamoros",
                "text": "(GMT-05:00) America/Matamoros"
            },
            {
                "value": "-06:00 America/Mazatlan",
                "text": "(GMT-06:00) America/Mazatlan"
            },
            {
                "value": "-03:00 America/Mendoza",
                "text": "(GMT-03:00) America/Mendoza"
            },
            {
                "value": "-05:00 America/Menominee",
                "text": "(GMT-05:00) America/Menominee"
            },
            {
                "value": "-05:00 America/Merida",
                "text": "(GMT-05:00) America/Merida"
            },
            {
                "value": "-08:00 America/Metlakatla",
                "text": "(GMT-08:00) America/Metlakatla"
            },
            {
                "value": "-05:00 America/Mexico_City",
                "text": "(GMT-05:00) America/Mexico_City"
            },
            {
                "value": "-02:00 America/Miquelon",
                "text": "(GMT-02:00) America/Miquelon"
            },
            {
                "value": "-03:00 America/Moncton",
                "text": "(GMT-03:00) America/Moncton"
            },
            {
                "value": "-05:00 America/Monterrey",
                "text": "(GMT-05:00) America/Monterrey"
            },
            {
                "value": "-03:00 America/Montevideo",
                "text": "(GMT-03:00) America/Montevideo"
            },
            {
                "value": "-04:00 America/Montreal",
                "text": "(GMT-04:00) America/Montreal"
            },
            {
                "value": "-04:00 America/Montserrat",
                "text": "(GMT-04:00) America/Montserrat"
            },
            {
                "value": "-04:00 America/Nassau",
                "text": "(GMT-04:00) America/Nassau"
            },
            {
                "value": "-04:00 America/New_York",
                "text": "(GMT-04:00) America/New_York"
            },
            {
                "value": "-04:00 America/Nipigon",
                "text": "(GMT-04:00) America/Nipigon"
            },
            {
                "value": "-08:00 America/Nome",
                "text": "(GMT-08:00) America/Nome"
            },
            {
                "value": "-02:00 America/Noronha",
                "text": "(GMT-02:00) America/Noronha"
            },
            {
                "value": "-05:00 America/North_Dakota/Beulah",
                "text": "(GMT-05:00) America/North_Dakota/Beulah"
            },
            {
                "value": "-05:00 America/North_Dakota/Center",
                "text": "(GMT-05:00) America/North_Dakota/Center"
            },
            {
                "value": "-05:00 America/North_Dakota/New_Salem",
                "text": "(GMT-05:00) America/North_Dakota/New_Salem"
            },
            {
                "value": "-06:00 America/Ojinaga",
                "text": "(GMT-06:00) America/Ojinaga"
            },
            {
                "value": "-05:00 America/Panama",
                "text": "(GMT-05:00) America/Panama"
            },
            {
                "value": "-04:00 America/Pangnirtung",
                "text": "(GMT-04:00) America/Pangnirtung"
            },
            {
                "value": "-03:00 America/Paramaribo",
                "text": "(GMT-03:00) America/Paramaribo"
            },
            {
                "value": "-07:00 America/Phoenix",
                "text": "(GMT-07:00) America/Phoenix"
            },
            {
                "value": "-04:00 America/Port-au-Prince",
                "text": "(GMT-04:00) America/Port-au-Prince"
            },
            {
                "value": "-04:00 America/Port_of_Spain",
                "text": "(GMT-04:00) America/Port_of_Spain"
            },
            {
                "value": "-05:00 America/Porto_Acre",
                "text": "(GMT-05:00) America/Porto_Acre"
            },
            {
                "value": "-04:00 America/Porto_Velho",
                "text": "(GMT-04:00) America/Porto_Velho"
            },
            {
                "value": "-04:00 America/Puerto_Rico",
                "text": "(GMT-04:00) America/Puerto_Rico"
            },
            {
                "value": "-03:00 America/Punta_Arenas",
                "text": "(GMT-03:00) America/Punta_Arenas"
            },
            {
                "value": "-05:00 America/Rainy_River",
                "text": "(GMT-05:00) America/Rainy_River"
            },
            {
                "value": "-05:00 America/Rankin_Inlet",
                "text": "(GMT-05:00) America/Rankin_Inlet"
            },
            {
                "value": "-03:00 America/Recife",
                "text": "(GMT-03:00) America/Recife"
            },
            {
                "value": "-06:00 America/Regina",
                "text": "(GMT-06:00) America/Regina"
            },
            {
                "value": "-05:00 America/Resolute",
                "text": "(GMT-05:00) America/Resolute"
            },
            {
                "value": "-05:00 America/Rio_Branco",
                "text": "(GMT-05:00) America/Rio_Branco"
            },
            {
                "value": "-03:00 America/Rosario",
                "text": "(GMT-03:00) America/Rosario"
            },
            {
                "value": "-07:00 America/Santa_Isabel",
                "text": "(GMT-07:00) America/Santa_Isabel"
            },
            {
                "value": "-03:00 America/Santarem",
                "text": "(GMT-03:00) America/Santarem"
            },
            {
                "value": "-04:00 America/Santiago",
                "text": "(GMT-04:00) America/Santiago"
            },
            {
                "value": "-04:00 America/Santo_Domingo",
                "text": "(GMT-04:00) America/Santo_Domingo"
            },
            {
                "value": "-03:00 America/Sao_Paulo",
                "text": "(GMT-03:00) America/Sao_Paulo"
            },
            {
                "value": "+00:00 America/Scoresbysund",
                "text": "(GMT+00:00) America/Scoresbysund"
            },
            {
                "value": "-06:00 America/Shiprock",
                "text": "(GMT-06:00) America/Shiprock"
            },
            {
                "value": "-08:00 America/Sitka",
                "text": "(GMT-08:00) America/Sitka"
            },
            {
                "value": "-04:00 America/St_Barthelemy",
                "text": "(GMT-04:00) America/St_Barthelemy"
            },
            {
                "value": "-02:30 America/St_Johns",
                "text": "(GMT-02:30) America/St_Johns"
            },
            {
                "value": "-04:00 America/St_Kitts",
                "text": "(GMT-04:00) America/St_Kitts"
            },
            {
                "value": "-04:00 America/St_Lucia",
                "text": "(GMT-04:00) America/St_Lucia"
            },
            {
                "value": "-04:00 America/St_Thomas",
                "text": "(GMT-04:00) America/St_Thomas"
            },
            {
                "value": "-04:00 America/St_Vincent",
                "text": "(GMT-04:00) America/St_Vincent"
            },
            {
                "value": "-06:00 America/Swift_Current",
                "text": "(GMT-06:00) America/Swift_Current"
            },
            {
                "value": "-06:00 America/Tegucigalpa",
                "text": "(GMT-06:00) America/Tegucigalpa"
            },
            {
                "value": "-03:00 America/Thule",
                "text": "(GMT-03:00) America/Thule"
            },
            {
                "value": "-04:00 America/Thunder_Bay",
                "text": "(GMT-04:00) America/Thunder_Bay"
            },
            {
                "value": "-07:00 America/Tijuana",
                "text": "(GMT-07:00) America/Tijuana"
            },
            {
                "value": "-04:00 America/Toronto",
                "text": "(GMT-04:00) America/Toronto"
            },
            {
                "value": "-04:00 America/Tortola",
                "text": "(GMT-04:00) America/Tortola"
            },
            {
                "value": "-07:00 America/Vancouver",
                "text": "(GMT-07:00) America/Vancouver"
            },
            {
                "value": "-04:00 America/Virgin",
                "text": "(GMT-04:00) America/Virgin"
            },
            {
                "value": "-07:00 America/Whitehorse",
                "text": "(GMT-07:00) America/Whitehorse"
            },
            {
                "value": "-05:00 America/Winnipeg",
                "text": "(GMT-05:00) America/Winnipeg"
            },
            {
                "value": "-08:00 America/Yakutat",
                "text": "(GMT-08:00) America/Yakutat"
            },
            {
                "value": "-06:00 America/Yellowknife",
                "text": "(GMT-06:00) America/Yellowknife"
            },
            {
                "value": "+11:00 Antarctica/Casey",
                "text": "(GMT+11:00) Antarctica/Casey"
            },
            {
                "value": "+07:00 Antarctica/Davis",
                "text": "(GMT+07:00) Antarctica/Davis"
            },
            {
                "value": "+10:00 Antarctica/DumontDUrville",
                "text": "(GMT+10:00) Antarctica/DumontDUrville"
            },
            {
                "value": "+11:00 Antarctica/Macquarie",
                "text": "(GMT+11:00) Antarctica/Macquarie"
            },
            {
                "value": "+05:00 Antarctica/Mawson",
                "text": "(GMT+05:00) Antarctica/Mawson"
            },
            {
                "value": "+12:00 Antarctica/McMurdo",
                "text": "(GMT+12:00) Antarctica/McMurdo"
            },
            {
                "value": "-03:00 Antarctica/Palmer",
                "text": "(GMT-03:00) Antarctica/Palmer"
            },
            {
                "value": "-03:00 Antarctica/Rothera",
                "text": "(GMT-03:00) Antarctica/Rothera"
            },
            {
                "value": "+12:00 Antarctica/South_Pole",
                "text": "(GMT+12:00) Antarctica/South_Pole"
            },
            {
                "value": "+03:00 Antarctica/Syowa",
                "text": "(GMT+03:00) Antarctica/Syowa"
            },
            {
                "value": "+02:00 Antarctica/Troll",
                "text": "(GMT+02:00) Antarctica/Troll"
            },
            {
                "value": "+06:00 Antarctica/Vostok",
                "text": "(GMT+06:00) Antarctica/Vostok"
            },
            {
                "value": "+02:00 Arctic/Longyearbyen",
                "text": "(GMT+02:00) Arctic/Longyearbyen"
            },
            {
                "value": "+03:00 Asia/Aden",
                "text": "(GMT+03:00) Asia/Aden"
            },
            {
                "value": "+06:00 Asia/Almaty",
                "text": "(GMT+06:00) Asia/Almaty"
            },
            {
                "value": "+03:00 Asia/Amman",
                "text": "(GMT+03:00) Asia/Amman"
            },
            {
                "value": "+12:00 Asia/Anadyr",
                "text": "(GMT+12:00) Asia/Anadyr"
            },
            {
                "value": "+05:00 Asia/Aqtau",
                "text": "(GMT+05:00) Asia/Aqtau"
            },
            {
                "value": "+05:00 Asia/Aqtobe",
                "text": "(GMT+05:00) Asia/Aqtobe"
            },
            {
                "value": "+05:00 Asia/Ashgabat",
                "text": "(GMT+05:00) Asia/Ashgabat"
            },
            {
                "value": "+05:00 Asia/Ashkhabad",
                "text": "(GMT+05:00) Asia/Ashkhabad"
            },
            {
                "value": "+05:00 Asia/Atyrau",
                "text": "(GMT+05:00) Asia/Atyrau"
            },
            {
                "value": "+03:00 Asia/Baghdad",
                "text": "(GMT+03:00) Asia/Baghdad"
            },
            {
                "value": "+03:00 Asia/Bahrain",
                "text": "(GMT+03:00) Asia/Bahrain"
            },
            {
                "value": "+04:00 Asia/Baku",
                "text": "(GMT+04:00) Asia/Baku"
            },
            {
                "value": "+07:00 Asia/Bangkok",
                "text": "(GMT+07:00) Asia/Bangkok"
            },
            {
                "value": "+07:00 Asia/Barnaul",
                "text": "(GMT+07:00) Asia/Barnaul"
            },
            {
                "value": "+03:00 Asia/Beirut",
                "text": "(GMT+03:00) Asia/Beirut"
            },
            {
                "value": "+06:00 Asia/Bishkek",
                "text": "(GMT+06:00) Asia/Bishkek"
            },
            {
                "value": "+08:00 Asia/Brunei",
                "text": "(GMT+08:00) Asia/Brunei"
            },
            {
                "value": "+05:30 Asia/Calcutta",
                "text": "(GMT+05:30) Asia/Calcutta"
            },
            {
                "value": "+09:00 Asia/Chita",
                "text": "(GMT+09:00) Asia/Chita"
            },
            {
                "value": "+08:00 Asia/Choibalsan",
                "text": "(GMT+08:00) Asia/Choibalsan"
            },
            {
                "value": "+08:00 Asia/Chongqing",
                "text": "(GMT+08:00) Asia/Chongqing"
            },
            {
                "value": "+08:00 Asia/Chungking",
                "text": "(GMT+08:00) Asia/Chungking"
            },
            {
                "value": "+05:30 Asia/Colombo",
                "text": "(GMT+05:30) Asia/Colombo"
            },
            {
                "value": "+06:00 Asia/Dacca",
                "text": "(GMT+06:00) Asia/Dacca"
            },
            {
                "value": "+03:00 Asia/Damascus",
                "text": "(GMT+03:00) Asia/Damascus"
            },
            {
                "value": "+06:00 Asia/Dhaka",
                "text": "(GMT+06:00) Asia/Dhaka"
            },
            {
                "value": "+09:00 Asia/Dili",
                "text": "(GMT+09:00) Asia/Dili"
            },
            {
                "value": "+04:00 Asia/Dubai",
                "text": "(GMT+04:00) Asia/Dubai"
            },
            {
                "value": "+05:00 Asia/Dushanbe",
                "text": "(GMT+05:00) Asia/Dushanbe"
            },
            {
                "value": "+03:00 Asia/Famagusta",
                "text": "(GMT+03:00) Asia/Famagusta"
            },
            {
                "value": "+03:00 Asia/Gaza",
                "text": "(GMT+03:00) Asia/Gaza"
            },
            {
                "value": "+08:00 Asia/Harbin",
                "text": "(GMT+08:00) Asia/Harbin"
            },
            {
                "value": "+03:00 Asia/Hebron",
                "text": "(GMT+03:00) Asia/Hebron"
            },
            {
                "value": "+07:00 Asia/Ho_Chi_Minh",
                "text": "(GMT+07:00) Asia/Ho_Chi_Minh"
            },
            {
                "value": "+08:00 Asia/Hong_Kong",
                "text": "(GMT+08:00) Asia/Hong_Kong"
            },
            {
                "value": "+07:00 Asia/Hovd",
                "text": "(GMT+07:00) Asia/Hovd"
            },
            {
                "value": "+08:00 Asia/Irkutsk",
                "text": "(GMT+08:00) Asia/Irkutsk"
            },
            {
                "value": "+03:00 Asia/Istanbul",
                "text": "(GMT+03:00) Asia/Istanbul"
            },
            {
                "value": "+07:00 Asia/Jakarta",
                "text": "(GMT+07:00) Asia/Jakarta"
            },
            {
                "value": "+09:00 Asia/Jayapura",
                "text": "(GMT+09:00) Asia/Jayapura"
            },
            {
                "value": "+03:00 Asia/Jerusalem",
                "text": "(GMT+03:00) Asia/Jerusalem"
            },
            {
                "value": "+04:30 Asia/Kabul",
                "text": "(GMT+04:30) Asia/Kabul"
            },
            {
                "value": "+12:00 Asia/Kamchatka",
                "text": "(GMT+12:00) Asia/Kamchatka"
            },
            {
                "value": "+05:00 Asia/Karachi",
                "text": "(GMT+05:00) Asia/Karachi"
            },
            {
                "value": "+06:00 Asia/Kashgar",
                "text": "(GMT+06:00) Asia/Kashgar"
            },
            {
                "value": "+05:45 Asia/Kathmandu",
                "text": "(GMT+05:45) Asia/Kathmandu"
            },
            {
                "value": "+05:45 Asia/Katmandu",
                "text": "(GMT+05:45) Asia/Katmandu"
            },
            {
                "value": "+09:00 Asia/Khandyga",
                "text": "(GMT+09:00) Asia/Khandyga"
            },
            {
                "value": "+05:30 Asia/Kolkata",
                "text": "(GMT+05:30) Asia/Kolkata"
            },
            {
                "value": "+07:00 Asia/Krasnoyarsk",
                "text": "(GMT+07:00) Asia/Krasnoyarsk"
            },
            {
                "value": "+08:00 Asia/Kuala_Lumpur",
                "text": "(GMT+08:00) Asia/Kuala_Lumpur"
            },
            {
                "value": "+08:00 Asia/Kuching",
                "text": "(GMT+08:00) Asia/Kuching"
            },
            {
                "value": "+03:00 Asia/Kuwait",
                "text": "(GMT+03:00) Asia/Kuwait"
            },
            {
                "value": "+08:00 Asia/Macao",
                "text": "(GMT+08:00) Asia/Macao"
            },
            {
                "value": "+08:00 Asia/Macau",
                "text": "(GMT+08:00) Asia/Macau"
            },
            {
                "value": "+11:00 Asia/Magadan",
                "text": "(GMT+11:00) Asia/Magadan"
            },
            {
                "value": "+08:00 Asia/Makassar",
                "text": "(GMT+08:00) Asia/Makassar"
            },
            {
                "value": "+08:00 Asia/Manila",
                "text": "(GMT+08:00) Asia/Manila"
            },
            {
                "value": "+04:00 Asia/Muscat",
                "text": "(GMT+04:00) Asia/Muscat"
            },
            {
                "value": "+03:00 Asia/Nicosia",
                "text": "(GMT+03:00) Asia/Nicosia"
            },
            {
                "value": "+07:00 Asia/Novokuznetsk",
                "text": "(GMT+07:00) Asia/Novokuznetsk"
            },
            {
                "value": "+07:00 Asia/Novosibirsk",
                "text": "(GMT+07:00) Asia/Novosibirsk"
            },
            {
                "value": "+06:00 Asia/Omsk",
                "text": "(GMT+06:00) Asia/Omsk"
            },
            {
                "value": "+05:00 Asia/Oral",
                "text": "(GMT+05:00) Asia/Oral"
            },
            {
                "value": "+07:00 Asia/Phnom_Penh",
                "text": "(GMT+07:00) Asia/Phnom_Penh"
            },
            {
                "value": "+07:00 Asia/Pontianak",
                "text": "(GMT+07:00) Asia/Pontianak"
            },
            {
                "value": "+08:30 Asia/Pyongyang",
                "text": "(GMT+08:30) Asia/Pyongyang"
            },
            {
                "value": "+03:00 Asia/Qatar",
                "text": "(GMT+03:00) Asia/Qatar"
            },
            {
                "value": "+06:00 Asia/Qyzylorda",
                "text": "(GMT+06:00) Asia/Qyzylorda"
            },
            {
                "value": "+06:30 Asia/Rangoon",
                "text": "(GMT+06:30) Asia/Rangoon"
            },
            {
                "value": "+03:00 Asia/Riyadh",
                "text": "(GMT+03:00) Asia/Riyadh"
            },
            {
                "value": "+07:00 Asia/Saigon",
                "text": "(GMT+07:00) Asia/Saigon"
            },
            {
                "value": "+11:00 Asia/Sakhalin",
                "text": "(GMT+11:00) Asia/Sakhalin"
            },
            {
                "value": "+05:00 Asia/Samarkand",
                "text": "(GMT+05:00) Asia/Samarkand"
            },
            {
                "value": "+09:00 Asia/Seoul",
                "text": "(GMT+09:00) Asia/Seoul"
            },
            {
                "value": "+08:00 Asia/Shanghai",
                "text": "(GMT+08:00) Asia/Shanghai"
            },
            {
                "value": "+08:00 Asia/Singapore",
                "text": "(GMT+08:00) Asia/Singapore"
            },
            {
                "value": "+11:00 Asia/Srednekolymsk",
                "text": "(GMT+11:00) Asia/Srednekolymsk"
            },
            {
                "value": "+08:00 Asia/Taipei",
                "text": "(GMT+08:00) Asia/Taipei"
            },
            {
                "value": "+05:00 Asia/Tashkent",
                "text": "(GMT+05:00) Asia/Tashkent"
            },
            {
                "value": "+04:00 Asia/Tbilisi",
                "text": "(GMT+04:00) Asia/Tbilisi"
            },
            {
                "value": "+04:30 Asia/Tehran",
                "text": "(GMT+04:30) Asia/Tehran"
            },
            {
                "value": "+03:00 Asia/Tel_Aviv",
                "text": "(GMT+03:00) Asia/Tel_Aviv"
            },
            {
                "value": "+06:00 Asia/Thimbu",
                "text": "(GMT+06:00) Asia/Thimbu"
            },
            {
                "value": "+06:00 Asia/Thimphu",
                "text": "(GMT+06:00) Asia/Thimphu"
            },
            {
                "value": "+09:00 Asia/Tokyo",
                "text": "(GMT+09:00) Asia/Tokyo"
            },
            {
                "value": "+07:00 Asia/Tomsk",
                "text": "(GMT+07:00) Asia/Tomsk"
            },
            {
                "value": "+08:00 Asia/Ujung_Pandang",
                "text": "(GMT+08:00) Asia/Ujung_Pandang"
            },
            {
                "value": "+08:00 Asia/Ulaanbaatar",
                "text": "(GMT+08:00) Asia/Ulaanbaatar"
            },
            {
                "value": "+08:00 Asia/Ulan_Bator",
                "text": "(GMT+08:00) Asia/Ulan_Bator"
            },
            {
                "value": "+06:00 Asia/Urumqi",
                "text": "(GMT+06:00) Asia/Urumqi"
            },
            {
                "value": "+10:00 Asia/Ust-Nera",
                "text": "(GMT+10:00) Asia/Ust-Nera"
            },
            {
                "value": "+07:00 Asia/Vientiane",
                "text": "(GMT+07:00) Asia/Vientiane"
            },
            {
                "value": "+10:00 Asia/Vladivostok",
                "text": "(GMT+10:00) Asia/Vladivostok"
            },
            {
                "value": "+09:00 Asia/Yakutsk",
                "text": "(GMT+09:00) Asia/Yakutsk"
            },
            {
                "value": "+06:30 Asia/Yangon",
                "text": "(GMT+06:30) Asia/Yangon"
            },
            {
                "value": "+05:00 Asia/Yekaterinburg",
                "text": "(GMT+05:00) Asia/Yekaterinburg"
            },
            {
                "value": "+04:00 Asia/Yerevan",
                "text": "(GMT+04:00) Asia/Yerevan"
            },
            {
                "value": "+00:00 Atlantic/Azores",
                "text": "(GMT+00:00) Atlantic/Azores"
            },
            {
                "value": "-03:00 Atlantic/Bermuda",
                "text": "(GMT-03:00) Atlantic/Bermuda"
            },
            {
                "value": "+01:00 Atlantic/Canary",
                "text": "(GMT+01:00) Atlantic/Canary"
            },
            {
                "value": "-01:00 Atlantic/Cape_Verde",
                "text": "(GMT-01:00) Atlantic/Cape_Verde"
            },
            {
                "value": "+01:00 Atlantic/Faeroe",
                "text": "(GMT+01:00) Atlantic/Faeroe"
            },
            {
                "value": "+01:00 Atlantic/Faroe",
                "text": "(GMT+01:00) Atlantic/Faroe"
            },
            {
                "value": "+02:00 Atlantic/Jan_Mayen",
                "text": "(GMT+02:00) Atlantic/Jan_Mayen"
            },
            {
                "value": "+01:00 Atlantic/Madeira",
                "text": "(GMT+01:00) Atlantic/Madeira"
            },
            {
                "value": "+00:00 Atlantic/Reykjavik",
                "text": "(GMT+00:00) Atlantic/Reykjavik"
            },
            {
                "value": "-02:00 Atlantic/South_Georgia",
                "text": "(GMT-02:00) Atlantic/South_Georgia"
            },
            {
                "value": "+00:00 Atlantic/St_Helena",
                "text": "(GMT+00:00) Atlantic/St_Helena"
            },
            {
                "value": "-03:00 Atlantic/Stanley",
                "text": "(GMT-03:00) Atlantic/Stanley"
            },
            {
                "value": "+10:00 Australia/ACT",
                "text": "(GMT+10:00) Australia/ACT"
            },
            {
                "value": "+09:30 Australia/Adelaide",
                "text": "(GMT+09:30) Australia/Adelaide"
            },
            {
                "value": "+10:00 Australia/Brisbane",
                "text": "(GMT+10:00) Australia/Brisbane"
            },
            {
                "value": "+09:30 Australia/Broken_Hill",
                "text": "(GMT+09:30) Australia/Broken_Hill"
            },
            {
                "value": "+10:00 Australia/Canberra",
                "text": "(GMT+10:00) Australia/Canberra"
            },
            {
                "value": "+10:00 Australia/Currie",
                "text": "(GMT+10:00) Australia/Currie"
            },
            {
                "value": "+09:30 Australia/Darwin",
                "text": "(GMT+09:30) Australia/Darwin"
            },
            {
                "value": "+08:45 Australia/Eucla",
                "text": "(GMT+08:45) Australia/Eucla"
            },
            {
                "value": "+10:00 Australia/Hobart",
                "text": "(GMT+10:00) Australia/Hobart"
            },
            {
                "value": "+10:30 Australia/LHI",
                "text": "(GMT+10:30) Australia/LHI"
            },
            {
                "value": "+10:00 Australia/Lindeman",
                "text": "(GMT+10:00) Australia/Lindeman"
            },
            {
                "value": "+10:30 Australia/Lord_Howe",
                "text": "(GMT+10:30) Australia/Lord_Howe"
            },
            {
                "value": "+10:00 Australia/Melbourne",
                "text": "(GMT+10:00) Australia/Melbourne"
            },
            {
                "value": "+10:00 Australia/NSW",
                "text": "(GMT+10:00) Australia/NSW"
            },
            {
                "value": "+09:30 Australia/North",
                "text": "(GMT+09:30) Australia/North"
            },
            {
                "value": "+08:00 Australia/Perth",
                "text": "(GMT+08:00) Australia/Perth"
            },
            {
                "value": "+10:00 Australia/Queensland",
                "text": "(GMT+10:00) Australia/Queensland"
            },
            {
                "value": "+09:30 Australia/South",
                "text": "(GMT+09:30) Australia/South"
            },
            {
                "value": "+10:00 Australia/Sydney",
                "text": "(GMT+10:00) Australia/Sydney"
            },
            {
                "value": "+10:00 Australia/Tasmania",
                "text": "(GMT+10:00) Australia/Tasmania"
            },
            {
                "value": "+10:00 Australia/Victoria",
                "text": "(GMT+10:00) Australia/Victoria"
            },
            {
                "value": "+08:00 Australia/West",
                "text": "(GMT+08:00) Australia/West"
            },
            {
                "value": "+09:30 Australia/Yancowinna",
                "text": "(GMT+09:30) Australia/Yancowinna"
            },
            {
                "value": "-05:00 Brazil/Acre",
                "text": "(GMT-05:00) Brazil/Acre"
            },
            {
                "value": "-02:00 Brazil/DeNoronha",
                "text": "(GMT-02:00) Brazil/DeNoronha"
            },
            {
                "value": "-03:00 Brazil/East",
                "text": "(GMT-03:00) Brazil/East"
            },
            {
                "value": "-04:00 Brazil/West",
                "text": "(GMT-04:00) Brazil/West"
            },
            {
                "value": "+02:00 CET",
                "text": "(GMT+02:00) CET"
            },
            {
                "value": "-05:00 CST6CDT",
                "text": "(GMT-05:00) CST6CDT"
            },
            {
                "value": "-03:00 Canada/Atlantic",
                "text": "(GMT-03:00) Canada/Atlantic"
            },
            {
                "value": "-05:00 Canada/Central",
                "text": "(GMT-05:00) Canada/Central"
            },
            {
                "value": "-06:00 Canada/East-Saskatchewan",
                "text": "(GMT-06:00) Canada/East-Saskatchewan"
            },
            {
                "value": "-04:00 Canada/Eastern",
                "text": "(GMT-04:00) Canada/Eastern"
            },
            {
                "value": "-06:00 Canada/Mountain",
                "text": "(GMT-06:00) Canada/Mountain"
            },
            {
                "value": "-02:30 Canada/Newfoundland",
                "text": "(GMT-02:30) Canada/Newfoundland"
            },
            {
                "value": "-07:00 Canada/Pacific",
                "text": "(GMT-07:00) Canada/Pacific"
            },
            {
                "value": "-06:00 Canada/Saskatchewan",
                "text": "(GMT-06:00) Canada/Saskatchewan"
            },
            {
                "value": "-07:00 Canada/Yukon",
                "text": "(GMT-07:00) Canada/Yukon"
            },
            {
                "value": "-04:00 Chile/Continental",
                "text": "(GMT-04:00) Chile/Continental"
            },
            {
                "value": "-06:00 Chile/EasterIsland",
                "text": "(GMT-06:00) Chile/EasterIsland"
            },
            {
                "value": "-04:00 Cuba",
                "text": "(GMT-04:00) Cuba"
            },
            {
                "value": "+03:00 EET",
                "text": "(GMT+03:00) EET"
            },
            {
                "value": "-05:00 EST",
                "text": "(GMT-05:00) EST"
            },
            {
                "value": "-04:00 EST5EDT",
                "text": "(GMT-04:00) EST5EDT"
            },
            {
                "value": "+02:00 Egypt",
                "text": "(GMT+02:00) Egypt"
            },
            {
                "value": "+01:00 Eire",
                "text": "(GMT+01:00) Eire"
            },
            {
                "value": "+00:00 Etc/GMT",
                "text": "(GMT+00:00) Etc/GMT"
            },
            {
                "value": "+00:00 Etc/GMT+0",
                "text": "(GMT+00:00) Etc/GMT+0"
            },
            {
                "value": "-01:00 Etc/GMT+1",
                "text": "(GMT-01:00) Etc/GMT+1"
            },
            {
                "value": "-10:00 Etc/GMT+10",
                "text": "(GMT-10:00) Etc/GMT+10"
            },
            {
                "value": "-11:00 Etc/GMT+11",
                "text": "(GMT-11:00) Etc/GMT+11"
            },
            {
                "value": "-12:00 Etc/GMT+12",
                "text": "(GMT-12:00) Etc/GMT+12"
            },
            {
                "value": "-02:00 Etc/GMT+2",
                "text": "(GMT-02:00) Etc/GMT+2"
            },
            {
                "value": "-03:00 Etc/GMT+3",
                "text": "(GMT-03:00) Etc/GMT+3"
            },
            {
                "value": "-04:00 Etc/GMT+4",
                "text": "(GMT-04:00) Etc/GMT+4"
            },
            {
                "value": "-05:00 Etc/GMT+5",
                "text": "(GMT-05:00) Etc/GMT+5"
            },
            {
                "value": "-06:00 Etc/GMT+6",
                "text": "(GMT-06:00) Etc/GMT+6"
            },
            {
                "value": "-07:00 Etc/GMT+7",
                "text": "(GMT-07:00) Etc/GMT+7"
            },
            {
                "value": "-08:00 Etc/GMT+8",
                "text": "(GMT-08:00) Etc/GMT+8"
            },
            {
                "value": "-09:00 Etc/GMT+9",
                "text": "(GMT-09:00) Etc/GMT+9"
            },
            {
                "value": "+00:00 Etc/GMT-0",
                "text": "(GMT+00:00) Etc/GMT-0"
            },
            {
                "value": "+01:00 Etc/GMT-1",
                "text": "(GMT+01:00) Etc/GMT-1"
            },
            {
                "value": "+10:00 Etc/GMT-10",
                "text": "(GMT+10:00) Etc/GMT-10"
            },
            {
                "value": "+11:00 Etc/GMT-11",
                "text": "(GMT+11:00) Etc/GMT-11"
            },
            {
                "value": "+12:00 Etc/GMT-12",
                "text": "(GMT+12:00) Etc/GMT-12"
            },
            {
                "value": "+13:00 Etc/GMT-13",
                "text": "(GMT+13:00) Etc/GMT-13"
            },
            {
                "value": "+14:00 Etc/GMT-14",
                "text": "(GMT+14:00) Etc/GMT-14"
            },
            {
                "value": "+02:00 Etc/GMT-2",
                "text": "(GMT+02:00) Etc/GMT-2"
            },
            {
                "value": "+03:00 Etc/GMT-3",
                "text": "(GMT+03:00) Etc/GMT-3"
            },
            {
                "value": "+04:00 Etc/GMT-4",
                "text": "(GMT+04:00) Etc/GMT-4"
            },
            {
                "value": "+05:00 Etc/GMT-5",
                "text": "(GMT+05:00) Etc/GMT-5"
            },
            {
                "value": "+06:00 Etc/GMT-6",
                "text": "(GMT+06:00) Etc/GMT-6"
            },
            {
                "value": "+07:00 Etc/GMT-7",
                "text": "(GMT+07:00) Etc/GMT-7"
            },
            {
                "value": "+08:00 Etc/GMT-8",
                "text": "(GMT+08:00) Etc/GMT-8"
            },
            {
                "value": "+09:00 Etc/GMT-9",
                "text": "(GMT+09:00) Etc/GMT-9"
            },
            {
                "value": "+00:00 Etc/GMT0",
                "text": "(GMT+00:00) Etc/GMT0"
            },
            {
                "value": "+00:00 Etc/Greenwich",
                "text": "(GMT+00:00) Etc/Greenwich"
            },
            {
                "value": "+00:00 Etc/UCT",
                "text": "(GMT+00:00) Etc/UCT"
            },
            {
                "value": "+00:00 Etc/UTC",
                "text": "(GMT+00:00) Etc/UTC"
            },
            {
                "value": "+00:00 Etc/Universal",
                "text": "(GMT+00:00) Etc/Universal"
            },
            {
                "value": "+00:00 Etc/Zulu",
                "text": "(GMT+00:00) Etc/Zulu"
            },
            {
                "value": "+02:00 Europe/Amsterdam",
                "text": "(GMT+02:00) Europe/Amsterdam"
            },
            {
                "value": "+02:00 Europe/Andorra",
                "text": "(GMT+02:00) Europe/Andorra"
            },
            {
                "value": "+04:00 Europe/Astrakhan",
                "text": "(GMT+04:00) Europe/Astrakhan"
            },
            {
                "value": "+03:00 Europe/Athens",
                "text": "(GMT+03:00) Europe/Athens"
            },
            {
                "value": "+01:00 Europe/Belfast",
                "text": "(GMT+01:00) Europe/Belfast"
            },
            {
                "value": "+02:00 Europe/Belgrade",
                "text": "(GMT+02:00) Europe/Belgrade"
            },
            {
                "value": "+02:00 Europe/Berlin",
                "text": "(GMT+02:00) Europe/Berlin"
            },
            {
                "value": "+02:00 Europe/Bratislava",
                "text": "(GMT+02:00) Europe/Bratislava"
            },
            {
                "value": "+02:00 Europe/Brussels",
                "text": "(GMT+02:00) Europe/Brussels"
            },
            {
                "value": "+03:00 Europe/Bucharest",
                "text": "(GMT+03:00) Europe/Bucharest"
            },
            {
                "value": "+02:00 Europe/Budapest",
                "text": "(GMT+02:00) Europe/Budapest"
            },
            {
                "value": "+02:00 Europe/Busingen",
                "text": "(GMT+02:00) Europe/Busingen"
            },
            {
                "value": "+03:00 Europe/Chisinau",
                "text": "(GMT+03:00) Europe/Chisinau"
            },
            {
                "value": "+02:00 Europe/Copenhagen",
                "text": "(GMT+02:00) Europe/Copenhagen"
            },
            {
                "value": "+01:00 Europe/Dublin",
                "text": "(GMT+01:00) Europe/Dublin"
            },
            {
                "value": "+02:00 Europe/Gibraltar",
                "text": "(GMT+02:00) Europe/Gibraltar"
            },
            {
                "value": "+01:00 Europe/Guernsey",
                "text": "(GMT+01:00) Europe/Guernsey"
            },
            {
                "value": "+03:00 Europe/Helsinki",
                "text": "(GMT+03:00) Europe/Helsinki"
            },
            {
                "value": "+01:00 Europe/Isle_of_Man",
                "text": "(GMT+01:00) Europe/Isle_of_Man"
            },
            {
                "value": "+03:00 Europe/Istanbul",
                "text": "(GMT+03:00) Europe/Istanbul"
            },
            {
                "value": "+01:00 Europe/Jersey",
                "text": "(GMT+01:00) Europe/Jersey"
            },
            {
                "value": "+02:00 Europe/Kaliningrad",
                "text": "(GMT+02:00) Europe/Kaliningrad"
            },
            {
                "value": "+03:00 Europe/Kiev",
                "text": "(GMT+03:00) Europe/Kiev"
            },
            {
                "value": "+03:00 Europe/Kirov",
                "text": "(GMT+03:00) Europe/Kirov"
            },
            {
                "value": "+01:00 Europe/Lisbon",
                "text": "(GMT+01:00) Europe/Lisbon"
            },
            {
                "value": "+02:00 Europe/Ljubljana",
                "text": "(GMT+02:00) Europe/Ljubljana"
            },
            {
                "value": "+01:00 Europe/London",
                "text": "(GMT+01:00) Europe/London"
            },
            {
                "value": "+02:00 Europe/Luxembourg",
                "text": "(GMT+02:00) Europe/Luxembourg"
            },
            {
                "value": "+02:00 Europe/Madrid",
                "text": "(GMT+02:00) Europe/Madrid"
            },
            {
                "value": "+02:00 Europe/Malta",
                "text": "(GMT+02:00) Europe/Malta"
            },
            {
                "value": "+03:00 Europe/Mariehamn",
                "text": "(GMT+03:00) Europe/Mariehamn"
            },
            {
                "value": "+03:00 Europe/Minsk",
                "text": "(GMT+03:00) Europe/Minsk"
            },
            {
                "value": "+02:00 Europe/Monaco",
                "text": "(GMT+02:00) Europe/Monaco"
            },
            {
                "value": "+03:00 Europe/Moscow",
                "text": "(GMT+03:00) Europe/Moscow"
            },
            {
                "value": "+03:00 Europe/Nicosia",
                "text": "(GMT+03:00) Europe/Nicosia"
            },
            {
                "value": "+02:00 Europe/Oslo",
                "text": "(GMT+02:00) Europe/Oslo"
            },
            {
                "value": "+02:00 Europe/Paris",
                "text": "(GMT+02:00) Europe/Paris"
            },
            {
                "value": "+02:00 Europe/Podgorica",
                "text": "(GMT+02:00) Europe/Podgorica"
            },
            {
                "value": "+02:00 Europe/Prague",
                "text": "(GMT+02:00) Europe/Prague"
            },
            {
                "value": "+03:00 Europe/Riga",
                "text": "(GMT+03:00) Europe/Riga"
            },
            {
                "value": "+02:00 Europe/Rome",
                "text": "(GMT+02:00) Europe/Rome"
            },
            {
                "value": "+04:00 Europe/Samara",
                "text": "(GMT+04:00) Europe/Samara"
            },
            {
                "value": "+02:00 Europe/San_Marino",
                "text": "(GMT+02:00) Europe/San_Marino"
            },
            {
                "value": "+02:00 Europe/Sarajevo",
                "text": "(GMT+02:00) Europe/Sarajevo"
            },
            {
                "value": "+04:00 Europe/Saratov",
                "text": "(GMT+04:00) Europe/Saratov"
            },
            {
                "value": "+03:00 Europe/Simferopol",
                "text": "(GMT+03:00) Europe/Simferopol"
            },
            {
                "value": "+02:00 Europe/Skopje",
                "text": "(GMT+02:00) Europe/Skopje"
            },
            {
                "value": "+03:00 Europe/Sofia",
                "text": "(GMT+03:00) Europe/Sofia"
            },
            {
                "value": "+02:00 Europe/Stockholm",
                "text": "(GMT+02:00) Europe/Stockholm"
            },
            {
                "value": "+03:00 Europe/Tallinn",
                "text": "(GMT+03:00) Europe/Tallinn"
            },
            {
                "value": "+02:00 Europe/Tirane",
                "text": "(GMT+02:00) Europe/Tirane"
            },
            {
                "value": "+03:00 Europe/Tiraspol",
                "text": "(GMT+03:00) Europe/Tiraspol"
            },
            {
                "value": "+04:00 Europe/Ulyanovsk",
                "text": "(GMT+04:00) Europe/Ulyanovsk"
            },
            {
                "value": "+03:00 Europe/Uzhgorod",
                "text": "(GMT+03:00) Europe/Uzhgorod"
            },
            {
                "value": "+02:00 Europe/Vaduz",
                "text": "(GMT+02:00) Europe/Vaduz"
            },
            {
                "value": "+02:00 Europe/Vatican",
                "text": "(GMT+02:00) Europe/Vatican"
            },
            {
                "value": "+02:00 Europe/Vienna",
                "text": "(GMT+02:00) Europe/Vienna"
            },
            {
                "value": "+03:00 Europe/Vilnius",
                "text": "(GMT+03:00) Europe/Vilnius"
            },
            {
                "value": "+03:00 Europe/Volgograd",
                "text": "(GMT+03:00) Europe/Volgograd"
            },
            {
                "value": "+02:00 Europe/Warsaw",
                "text": "(GMT+02:00) Europe/Warsaw"
            },
            {
                "value": "+02:00 Europe/Zagreb",
                "text": "(GMT+02:00) Europe/Zagreb"
            },
            {
                "value": "+03:00 Europe/Zaporozhye",
                "text": "(GMT+03:00) Europe/Zaporozhye"
            },
            {
                "value": "+02:00 Europe/Zurich",
                "text": "(GMT+02:00) Europe/Zurich"
            },
            {
                "value": "+01:00 GB",
                "text": "(GMT+01:00) GB"
            },
            {
                "value": "+01:00 GB-Eire",
                "text": "(GMT+01:00) GB-Eire"
            },
            {
                "value": "+00:00 GMT",
                "text": "(GMT+00:00) GMT"
            },
            {
                "value": "+00:00 Greenwich",
                "text": "(GMT+00:00) Greenwich"
            },
            {
                "value": "-10:00 HST",
                "text": "(GMT-10:00) HST"
            },
            {
                "value": "+08:00 Hongkong",
                "text": "(GMT+08:00) Hongkong"
            },
            {
                "value": "+00:00 Iceland",
                "text": "(GMT+00:00) Iceland"
            },
            {
                "value": "+03:00 Indian/Antananarivo",
                "text": "(GMT+03:00) Indian/Antananarivo"
            },
            {
                "value": "+06:00 Indian/Chagos",
                "text": "(GMT+06:00) Indian/Chagos"
            },
            {
                "value": "+07:00 Indian/Christmas",
                "text": "(GMT+07:00) Indian/Christmas"
            },
            {
                "value": "+06:30 Indian/Cocos",
                "text": "(GMT+06:30) Indian/Cocos"
            },
            {
                "value": "+03:00 Indian/Comoro",
                "text": "(GMT+03:00) Indian/Comoro"
            },
            {
                "value": "+05:00 Indian/Kerguelen",
                "text": "(GMT+05:00) Indian/Kerguelen"
            },
            {
                "value": "+04:00 Indian/Mahe",
                "text": "(GMT+04:00) Indian/Mahe"
            },
            {
                "value": "+05:00 Indian/Maldives",
                "text": "(GMT+05:00) Indian/Maldives"
            },
            {
                "value": "+04:00 Indian/Mauritius",
                "text": "(GMT+04:00) Indian/Mauritius"
            },
            {
                "value": "+03:00 Indian/Mayotte",
                "text": "(GMT+03:00) Indian/Mayotte"
            },
            {
                "value": "+04:00 Indian/Reunion",
                "text": "(GMT+04:00) Indian/Reunion"
            },
            {
                "value": "+04:30 Iran",
                "text": "(GMT+04:30) Iran"
            },
            {
                "value": "+03:00 Israel",
                "text": "(GMT+03:00) Israel"
            },
            {
                "value": "-05:00 Jamaica",
                "text": "(GMT-05:00) Jamaica"
            },
            {
                "value": "+09:00 Japan",
                "text": "(GMT+09:00) Japan"
            },
            {
                "value": "+12:00 Kwajalein",
                "text": "(GMT+12:00) Kwajalein"
            },
            {
                "value": "+02:00 Libya",
                "text": "(GMT+02:00) Libya"
            },
            {
                "value": "+02:00 MET",
                "text": "(GMT+02:00) MET"
            },
            {
                "value": "-07:00 MST",
                "text": "(GMT-07:00) MST"
            },
            {
                "value": "-06:00 MST7MDT",
                "text": "(GMT-06:00) MST7MDT"
            },
            {
                "value": "-07:00 Mexico/BajaNorte",
                "text": "(GMT-07:00) Mexico/BajaNorte"
            },
            {
                "value": "-06:00 Mexico/BajaSur",
                "text": "(GMT-06:00) Mexico/BajaSur"
            },
            {
                "value": "-05:00 Mexico/General",
                "text": "(GMT-05:00) Mexico/General"
            },
            {
                "value": "+12:00 NZ",
                "text": "(GMT+12:00) NZ"
            },
            {
                "value": "+12:45 NZ-CHAT",
                "text": "(GMT+12:45) NZ-CHAT"
            },
            {
                "value": "-06:00 Navajo",
                "text": "(GMT-06:00) Navajo"
            },
            {
                "value": "+08:00 PRC",
                "text": "(GMT+08:00) PRC"
            },
            {
                "value": "-07:00 PST8PDT",
                "text": "(GMT-07:00) PST8PDT"
            },
            {
                "value": "+13:00 Pacific/Apia",
                "text": "(GMT+13:00) Pacific/Apia"
            },
            {
                "value": "+12:00 Pacific/Auckland",
                "text": "(GMT+12:00) Pacific/Auckland"
            },
            {
                "value": "+11:00 Pacific/Bougainville",
                "text": "(GMT+11:00) Pacific/Bougainville"
            },
            {
                "value": "+12:45 Pacific/Chatham",
                "text": "(GMT+12:45) Pacific/Chatham"
            },
            {
                "value": "+10:00 Pacific/Chuuk",
                "text": "(GMT+10:00) Pacific/Chuuk"
            },
            {
                "value": "-06:00 Pacific/Easter",
                "text": "(GMT-06:00) Pacific/Easter"
            },
            {
                "value": "+11:00 Pacific/Efate",
                "text": "(GMT+11:00) Pacific/Efate"
            },
            {
                "value": "+13:00 Pacific/Enderbury",
                "text": "(GMT+13:00) Pacific/Enderbury"
            },
            {
                "value": "+13:00 Pacific/Fakaofo",
                "text": "(GMT+13:00) Pacific/Fakaofo"
            },
            {
                "value": "+12:00 Pacific/Fiji",
                "text": "(GMT+12:00) Pacific/Fiji"
            },
            {
                "value": "+12:00 Pacific/Funafuti",
                "text": "(GMT+12:00) Pacific/Funafuti"
            },
            {
                "value": "-06:00 Pacific/Galapagos",
                "text": "(GMT-06:00) Pacific/Galapagos"
            },
            {
                "value": "-09:00 Pacific/Gambier",
                "text": "(GMT-09:00) Pacific/Gambier"
            },
            {
                "value": "+11:00 Pacific/Guadalcanal",
                "text": "(GMT+11:00) Pacific/Guadalcanal"
            },
            {
                "value": "+10:00 Pacific/Guam",
                "text": "(GMT+10:00) Pacific/Guam"
            },
            {
                "value": "-10:00 Pacific/Honolulu",
                "text": "(GMT-10:00) Pacific/Honolulu"
            },
            {
                "value": "-10:00 Pacific/Johnston",
                "text": "(GMT-10:00) Pacific/Johnston"
            },
            {
                "value": "+14:00 Pacific/Kiritimati",
                "text": "(GMT+14:00) Pacific/Kiritimati"
            },
            {
                "value": "+11:00 Pacific/Kosrae",
                "text": "(GMT+11:00) Pacific/Kosrae"
            },
            {
                "value": "+12:00 Pacific/Kwajalein",
                "text": "(GMT+12:00) Pacific/Kwajalein"
            },
            {
                "value": "+12:00 Pacific/Majuro",
                "text": "(GMT+12:00) Pacific/Majuro"
            },
            {
                "value": "-09:30 Pacific/Marquesas",
                "text": "(GMT-09:30) Pacific/Marquesas"
            },
            {
                "value": "-11:00 Pacific/Midway",
                "text": "(GMT-11:00) Pacific/Midway"
            },
            {
                "value": "+12:00 Pacific/Nauru",
                "text": "(GMT+12:00) Pacific/Nauru"
            },
            {
                "value": "-11:00 Pacific/Niue",
                "text": "(GMT-11:00) Pacific/Niue"
            },
            {
                "value": "+11:00 Pacific/Norfolk",
                "text": "(GMT+11:00) Pacific/Norfolk"
            },
            {
                "value": "+11:00 Pacific/Noumea",
                "text": "(GMT+11:00) Pacific/Noumea"
            },
            {
                "value": "-11:00 Pacific/Pago_Pago",
                "text": "(GMT-11:00) Pacific/Pago_Pago"
            },
            {
                "value": "+09:00 Pacific/Palau",
                "text": "(GMT+09:00) Pacific/Palau"
            },
            {
                "value": "-08:00 Pacific/Pitcairn",
                "text": "(GMT-08:00) Pacific/Pitcairn"
            },
            {
                "value": "+11:00 Pacific/Pohnpei",
                "text": "(GMT+11:00) Pacific/Pohnpei"
            },
            {
                "value": "+11:00 Pacific/Ponape",
                "text": "(GMT+11:00) Pacific/Ponape"
            },
            {
                "value": "+10:00 Pacific/Port_Moresby",
                "text": "(GMT+10:00) Pacific/Port_Moresby"
            },
            {
                "value": "-10:00 Pacific/Rarotonga",
                "text": "(GMT-10:00) Pacific/Rarotonga"
            },
            {
                "value": "+10:00 Pacific/Saipan",
                "text": "(GMT+10:00) Pacific/Saipan"
            },
            {
                "value": "-11:00 Pacific/Samoa",
                "text": "(GMT-11:00) Pacific/Samoa"
            },
            {
                "value": "-10:00 Pacific/Tahiti",
                "text": "(GMT-10:00) Pacific/Tahiti"
            },
            {
                "value": "+12:00 Pacific/Tarawa",
                "text": "(GMT+12:00) Pacific/Tarawa"
            },
            {
                "value": "+13:00 Pacific/Tongatapu",
                "text": "(GMT+13:00) Pacific/Tongatapu"
            },
            {
                "value": "+10:00 Pacific/Truk",
                "text": "(GMT+10:00) Pacific/Truk"
            },
            {
                "value": "+12:00 Pacific/Wake",
                "text": "(GMT+12:00) Pacific/Wake"
            },
            {
                "value": "+12:00 Pacific/Wallis",
                "text": "(GMT+12:00) Pacific/Wallis"
            },
            {
                "value": "+10:00 Pacific/Yap",
                "text": "(GMT+10:00) Pacific/Yap"
            },
            {
                "value": "+02:00 Poland",
                "text": "(GMT+02:00) Poland"
            },
            {
                "value": "+01:00 Portugal",
                "text": "(GMT+01:00) Portugal"
            },
            {
                "value": "+08:00 ROC",
                "text": "(GMT+08:00) ROC"
            },
            {
                "value": "+09:00 ROK",
                "text": "(GMT+09:00) ROK"
            },
            {
                "value": "+08:00 Singapore",
                "text": "(GMT+08:00) Singapore"
            },
            {
                "value": "+03:00 Turkey",
                "text": "(GMT+03:00) Turkey"
            },
            {
                "value": "+00:00 UCT",
                "text": "(GMT+00:00) UCT"
            },
            
            {
                "value": "+00:00 UTC",
                "text": "(GMT+00:00) UTC"
            },
            {
                "value": "+00:00 Universal",
                "text": "(GMT+00:00) Universal"
            },
            {
                "value": "+03:00 W-SU",
                "text": "(GMT+03:00) W-SU"
            },
            {
                "value": "+01:00 WET",
                "text": "(GMT+01:00) WET"
            },
            {
                "value": "+00:00 Zulu",
                "text": "(GMT+00:00) Zulu"
            }
        ]
        return getTimezones;
    }


    getUsZones() {
        let timezones = [
            {
                "value": "-04:00 US/Eastern",
                "text": "(GMT-04:00) US/Eastern"
            },
            {
                "value": "-05:00 US/Central",
                "text": "(GMT-05:00) US/Central"
            },
            {
                "value": "-06:00 US/Mountain",
                "text": "(GMT-06:00) US/Mountain"
            },
            {
                "value": "-07:00 US/Pacific",
                "text": "(GMT-07:00) US/Pacific"
            }
        ];
        return timezones;
    }

    getIntlZones() {
        let timezones = [
            {
                "value": "+00:00 Africa/Monrovia",
                "text": "(GMT+00:00) Africa/Monrovia"
            },
            {
                "value": "+00:00 GMT",
                "text": "(GMT+00:00) GMT"
            },
            {
                "value": "+01:00 Africa/Casablanca",
                "text": "(GMT+01:00) Africa/Casablanca"
            },
            {
                "value": "+01:00 Europe/London",
                "text": "(GMT+01:00) Europe/London"
            },
            {
                "value": "+00:00 Atlantic/Azores",
                "text": "(GMT+00:00) Atlantic/Azores"
            },
            {
                "value": "+02:00 Europe/Amsterdam",
                "text": "(GMT+02:00) Europe/Amsterdam"
            },
            {
                "value": "+02:00 Europe/Berlin",
                "text": "(GMT+02:00) Europe/Berlin"
            },
            {
                "value": "+02:00 Europe/Rome",
                "text": "(GMT+02:00) Europe/Rome"
            },
            {
                "value": "+02:00 Europe/Stockholm",
                "text": "(GMT+02:00) Europe/Stockholm"
            },
            {
                "value": "+02:00 Europe/Vienna",
                "text": "(GMT+02:00) Europe/Vienna"
            },
            {
                "value": "+02:00 Europe/Belgrade",
                "text": "(GMT+02:00) Europe/Belgrade"
            },
            {
                "value": "+02:00 Europe/Bratislava",
                "text": "(GMT+02:00) Europe/Bratislava"
            },
            {
                "value": "+02:00 Europe/Budapest",
                "text": "(GMT+02:00) Europe/Budapest"
            },
            {
                "value": "+02:00 Europe/Ljubljana",
                "text": "(GMT+02:00) Europe/Ljubljana"
            },
            {
                "value": "+02:00 Europe/Prague",
                "text": "(GMT+02:00) Europe/Prague"
            },
            {
                "value": "+02:00 Europe/Brussels",
                "text": "(GMT+02:00) Europe/Brussels"
            },
            {
                "value": "+02:00 Europe/Copenhagen",
                "text": "(GMT+02:00) Europe/Copenhagen"
            },
            {
                "value": "+02:00 Europe/Madrid",
                "text": "(GMT+02:00) Europe/Madrid"
            },
            {
                "value": "+02:00 Europe/Paris",
                "text": "(GMT+02:00) Europe/Paris"
            },
            {
                "value": "+02:00 Europe/Sarajevo",
                "text": "(GMT+02:00) Europe/Sarajevo"
            },
            {
                "value": "+02:00 Europe/Skopje",
                "text": "(GMT+02:00) Europe/Skopje"
            },
            {
                "value": "+03:00 Europe/Vilnius",
                "text": "(GMT+03:00) Europe/Vilnius"
            },
            {
                "value": "+02:00 Europe/Warsaw",
                "text": "(GMT+02:00) Europe/Warsaw"
            },
            {
                "value": "+02:00 Europe/Zagreb",
                "text": "(GMT+02:00) Europe/Zagreb"
            },
            {
                "value": "+02:00 Africa/Cairo",
                "text": "(GMT+02:00) Africa/Cairo"
            },
            {
                "value": "+02:00 Africa/Harare",
                "text": "(GMT+02:00) Africa/Harare"
            },
            {
                "value": "+03:00 Europe/Bucharest",
                "text": "(GMT+03:00) Europe/Bucharest"
            },
            {
                "value": "+03:00 Europe/Helsinki",
                "text": "(GMT+03:00) Europe/Helsinki"
            },
            {
                "value": "+03:00 Europe/Riga",
                "text": "(GMT+03:00) Europe/Riga"
            },
            {
                "value": "+03:00 Europe/Tallinn",
                "text": "(GMT+03:00) Europe/Tallinn"
            },
            {
                "value": "+03:00 Asia/Jerusalem",
                "text": "(GMT+03:00) Asia/Jerusalem"
            },
            {
                "value": "+03:00 Europe/Athens",
                "text": "(GMT+03:00) Europe/Athens"
            },
            {
                "value": "+03:00 Europe/Istanbul",
                "text": "(GMT+03:00) Europe/Istanbul"
            },
            {
                "value": "+03:00 Europe/Minsk",
                "text": "(GMT+03:00) Europe/Minsk"
            },
            {
                "value": "+03:00 Asia/Baghdad",
                "text": "(GMT+03:00) Asia/Baghdad"
            },
            {
                "value": "+03:00 Asia/Kuwait",
                "text": "(GMT+03:00) Asia/Kuwait"
            },
            {
                "value": "+03:00 Asia/Riyadh",
                "text": "(GMT+03:00) Asia/Riyadh"
            },
            {
                "value": "+03:00 Europe/Moscow",
                "text": "(GMT+03:00) Europe/Moscow"
            },
            {
                "value": "+03:00 Europe/Volgograd",
                "text": "(GMT+03:00) Europe/Volgograd"
            },
            {
                "value": "+03:00 Africa/Nairobi",
                "text": "(GMT+03:00) Africa/Nairobi"
            },
            {
                "value": "+04:30 Asia/Tehran",
                "text": "(GMT+04:30) Asia/Tehran"
            },
            {
                "value": "+04:00 Asia/Muscat",
                "text": "(GMT+04:00) Asia/Muscat"
            },
            {
                "value": "+04:00 Asia/Baku",
                "text": "(GMT+04:00) Asia/Baku"
            },
            {
                "value": "+04:00 Asia/Tbilisi",
                "text": "(GMT+04:00) Asia/Tbilisi"
            },
            {
                "value": "+04:00 Asia/Yerevan",
                "text": "(GMT+04:00) Asia/Yerevan"
            },
            {
                "value": "+04:30 Asia/Kabul",
                "text": "(GMT+04:30) Asia/Kabul"
            },
            {
                "value": "+05:00 Asia/Yekaterinburg",
                "text": "(GMT+05:00) Asia/Yekaterinburg"
            },
            {
                "value": "+05:00 Asia/Karachi",
                "text": "(GMT+05:00) Asia/Karachi"
            },
            {
                "value": "+05:00 Asia/Tashkent",
                "text": "(GMT+05:00) Asia/Tashkent"
            },
            {
                "value": "+05:30 Asia/Kolkata",
                "text": "(GMT+05:30) Asia/Kolkata"
            },
            {
                "value": "+05:45 Asia/Kathmandu",
                "text": "(GMT+05:45) Asia/Kathmandu"
            },
            {
                "value": "+06:00 Asia/Almaty",
                "text": "(GMT+06:00) Asia/Almaty"
            },
            {
                "value": "+07:00 Asia/Novosibirsk",
                "text": "(GMT+07:00) Asia/Novosibirsk"
            },
            {
                "value": "+06:00 Asia/Dhaka",
                "text": "(GMT+06:00) Asia/Dhaka"
            },
            {
                "value": "+06:00 Asia/Urumqi",
                "text": "(GMT+06:00) Asia/Urumqi"
            },
            {
                "value": "+06:30 Asia/Rangoon",
                "text": "(GMT+06:30) Asia/Rangoon"
            },
            {
                "value": "+07:00 Asia/Bangkok",
                "text": "(GMT+07:00) Asia/Bangkok"
            },
            {
                "value": "+07:00 Asia/Jakarta",
                "text": "(GMT+07:00) Asia/Jakarta"
            },
            {
                "value": "+07:00 Asia/Krasnoyarsk",
                "text": "(GMT+07:00) Asia/Krasnoyarsk"
            },
            {
                "value": "+08:00 Asia/Chongqing",
                "text": "(GMT+08:00) Asia/Chongqing"
            },
            {
                "value": "+08:00 Hongkong",
                "text": "(GMT+08:00) Hongkong"
            },
            {
                "value": "+08:00 Asia/Irkutsk",
                "text": "(GMT+08:00) Asia/Irkutsk"
            },
            {
                "value": "+08:00 Asia/Ulaanbaatar",
                "text": "(GMT+08:00) Asia/Ulaanbaatar"
            },
            {
                "value": "+08:00 Asia/Kuala_Lumpur",
                "text": "(GMT+08:00) Asia/Kuala_Lumpur"
            },
            {
                "value": "+08:00 Asia/Singapore",
                "text": "(GMT+08:00) Asia/Singapore"
            },
            {
                "value": "+08:00 Australia/Perth",
                "text": "(GMT+08:00) Australia/Perth"
            },
            {
                "value": "+08:00 Asia/Taipei",
                "text": "(GMT+08:00) Asia/Taipei"
            },
            {
                "value": "+09:00 Asia/Tokyo",
                "text": "(GMT+09:00) Asia/Tokyo"
            },
            {
                "value": "+09:00 Asia/Seoul",
                "text": "(GMT+09:00) Asia/Seoul"
            },
            {
                "value": "+09:00 Asia/Yakutsk",
                "text": "(GMT+09:00) Asia/Yakutsk"
            },
            {
                "value": "+09:30 Australia/Darwin",
                "text": "(GMT+09:30) Australia/Darwin"
            },
            {
                "value": "+10:00 Australia/Brisbane",
                "text": "(GMT+10:00) Australia/Brisbane"
            },
            {
                "value": "+10:00 Pacific/Guam",
                "text": "(GMT+10:00) Pacific/Guam"
            },
            {
                "value": "+10:00 Pacific/Port_Moresby",
                "text": "(GMT+10:00) Pacific/Port_Moresby"
            },
            {
                "value": "+10:00 Asia/Vladivostok",
                "text": "(GMT+10:00) Asia/Vladivostok"
            },
            {
                "value": "+09:30 Australia/Adelaide",
                "text": "(GMT+09:30) Australia/Adelaide"
            },
            {
                "value": "+10:00 Australia/Canberra",
                "text": "(GMT+10:00) Australia/Canberra"
            },
            {
                "value": "+10:00 Australia/Melbourne",
                "text": "(GMT+10:00) Australia/Melbourne"
            },
            {
                "value": "+10:00 Australia/Sydney",
                "text": "(GMT+10:00) Australia/Sydney"
            },
            {
                "value": "+10:00 Australia/Hobart",
                "text": "(GMT+10:00) Australia/Hobart"
            },
            {
                "value": "+11:00 Asia/Magadan",
                "text": "(GMT+11:00) Asia/Magadan"
            },
            {
                "value": "+12:00 Kwajalein",
                "text": "(GMT+12:00) Kwajalein"
            },
            {
                "value": "+12:00 Pacific/Fiji",
                "text": "(GMT+12:00) Pacific/Fiji"
            },
            {
                "value": "+12:00 Asia/Kamchatka",
                "text": "(GMT+12:00) Asia/Kamchatka"
            },
            {
                "value": "+12:00 Pacific/Auckland",
                "text": "(GMT+12:00) Pacific/Auckland"
            },
            {
                "value": "+00:00 Atlantic/Azores",
                "text": "(GMT+00:00) Atlantic/Azores"
            },
            {
                "value": "-01:00 Atlantic/Cape_Verde",
                "text": "(GMT-01:00) Atlantic/Cape_Verde"
            },
            {
                "value": "-02:30 Canada/Newfoundland",
                "text": "(GMT-02:30) Canada/Newfoundland"
            },
            {
                "value": "-03:00 America/Argentina/Buenos_Aires",
                "text": "(GMT-03:00) America/Argentina/Buenos_Aires"
            },
            {
                "value": "-03:00 America/Buenos_Aires",
                "text": "(GMT-03:00) America/Buenos_Aires"
            },
            {
                "value": "-03:00 Canada/Atlantic",
                "text": "(GMT-03:00) Canada/Atlantic"
            },
            {
                "value": "-04:00 America/Santiago",
                "text": "(GMT-04:00) America/Santiago"
            },
            {
                "value": "-04:00 Canada/Eastern",
                "text": "(GMT-04:00) Canada/Eastern"
            },
            {
                "value": "-04:00 America/Caracas",
                "text": "(GMT-04:00) America/Caracas"
            },
            {
                "value": "-04:00 America/La_Paz",
                "text": "(GMT-04:00) America/La_Paz"
            },
            {
                "value": "-04:00 US/East-Indiana",
                "text": "(GMT-04:00) US/East-Indiana"
            },
            {
                "value": "-05:00 America/Bogota",
                "text": "(GMT-05:00) America/Bogota"
            },
            {
                "value": "-05:00 America/Lima",
                "text": "(GMT-05:00) America/Lima"
            },
            {
                "value": "-05:00 America/Mexico_City",
                "text": "(GMT-05:00) America/Mexico_City"
            },
            {
                "value": "-06:00 Canada/Saskatchewan",
                "text": "(GMT-06:00) Canada/Saskatchewan"
            },
            {
                "value": "-07:00 US/Arizona",
                "text": "(GMT-07:00) US/Arizona"
            },
            {
                "value": "-07:00 America/Tijuana",
                "text": "(GMT-07:00) America/Tijuana"
            },
            {
                "value": "-08:00 US/Alaska",
                "text": "(GMT-08:00) US/Alaska"
            },
            {
                "value": "-10:00 US/Hawaii",
                "text": "(GMT-10:00) US/Hawaii"
            },
            {
                "value": "-11:00 Pacific/Midway",
                "text": "(GMT-11:00) Pacific/Midway"
            },
            {
                "value": "-11:00 Pacific/Samoa",
                "text": "(GMT-11:00) Pacific/Samoa"
            }
        ];
        return timezones;
    }

    getQuestionsAnswers(){

        let q_and_a =  [
        {
        
		"us_id": 1,
		"us_name": "James",
		"us_image": "https://tokbird-dev.ofabee.com/api/assets/uploads/user/us_img0.05982600 1509017413.jpg",
		"id": 1,
		"question": "If a red house is made from red bricks, a blue house is made from blue bricks, a pink house is made from pink bricks, and a black house is made from black bricks. What is a greenhouse made from?",
        "created_at":"2017-09-30 20:18:00",
		"answers": [{
				"us_name": "John",
				"us_image": "",
				"answer": "Wood",
                "created_at":"2017-09-30 20:18:00"
			},
			{
				"us_name": "George",
				"us_image": "",
				"answer": "Moss covered stones",
                "created_at":"2017-09-30 20:18:00"
			},
			{
				"us_name": "Christepher",
				"us_image": "",
				"answer": "Green Bricks",
                "created_at":"2017-09-30 20:18:00"
			}
		]
	},
	{
		"us_id": 2,
		"us_name": "Albert",
		"us_image": "",
		"id": 2,
		"question": "Do the words flammable and inflammable have the same or opposite meaning?",
        "created_at":"2017-09-30 20:18:00",
		"answers": [{
				"us_name": "Joy",
				"us_image": "",
				"answer": "Same",
                "created_at":"2017-09-30 20:18:00"
			},
			{
				"us_name": "John",
				"us_image": "",
				"answer": "Opposite",
                "created_at":"2017-09-30 20:18:00"
			},
			{
				"us_name": "George",
				"us_image": "",
				"answer": "Opposite",
                "created_at":"2017-09-30 20:18:00"
			}
		]

	},
    {
		"us_id": 3,
		"us_name": "Stephen",
		"us_image": "",
		"id": 3,
		"question": "Where did the real Boston Tea Party take place?",
        "created_at":"2017-09-30 20:18:00",
		"answers": [{
				"us_name": "Albin",
				"us_image": "",
				"answer": "New york",
                "created_at":"2017-09-30 20:18:00"
			},
			{
				"us_name": "Anvar",
				"us_image": "",
				"answer": "Washington dc",
                "created_at":"2017-09-30 20:18:00"
			},
			{
				"us_name": "Neethu",
				"us_image": "",
				"answer": "Philadelphia",
                "created_at":"2017-09-30 20:18:00"
			}
		]

	},
    {
		"us_id": 4,
		"us_name": "Sam",
		"us_image": "",
		"id": 4,
		"question": "What is the capital of Florida?",
        "created_at":"2017-09-30 20:18:00",
		"answers": [{
				"us_name": "George",
				"us_image": "",
				"answer": "Tallahassee",
                "created_at":"2017-09-30 20:18:00"
			},
			{
				"us_name": "John",
				"us_image": "",
				"answer": "Orlando",
                "created_at":"2017-09-30 20:18:00"
			},
			{
				"us_name": "christepher",
				"us_image": "",
				"answer": "Miami",
                "created_at":"2017-09-30 20:18:00"
			}
		]

	},
    {
		"us_id": 5,
		"us_name": "Neethu",
		"us_image": "",
		"id": 5,
		"question": "You are leading a cow north 1 mile, then east 1 mile, then south 1 mile, then west 1 mile.Where is the cows tail pointing?",
        "created_at":"2017-09-30 20:18:00",
		"answers": []

	},
    {
		"us_id": 6,
		"us_name": "Sam",
		"us_image": "",
		"id": 6,
		"question": "What baby has a beard when it was a baby? Clue:Its an animal-Be precise",
        "created_at":"2017-09-30 20:18:00",
		"answers": []

	}
]

return q_and_a;
    }
}
