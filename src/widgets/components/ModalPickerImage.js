import React from "react";
import {
  View,
  Modal,
  ActivityIndicator,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet
} from "react-native";

let componentIndex = 0;
const { height, width } = Dimensions.get("window");
const PADDING = 12;
const BORDER_RADIUS = 5;
const FONT_SIZE = 16;
const HIGHLIGHT_COLOR = "rgba(0,118,255,0.9)";
const OPTION_CONTAINER_HEIGHT = 400;

class ModalPicker extends React.Component {
  constructor (props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.renderChildren = this.renderChildren.bind(this);

    this.state = {
      animationType: "slide",
      modalVisible: false,
      transparent: false,
      selected: "please select",
      data: [],
      allData: [
        {
          "name": "Afghanistan (‫افغانستان‬‎)",
          "iso2": "af",
          "dialCode": "93",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Albania (Shqipëri)",
          "iso2": "al",
          "dialCode": "355",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Algeria (‫الجزائر‬‎)",
          "iso2": "dz",
          "dialCode": "213",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "American Samoa",
          "iso2": "as",
          "dialCode": "1684",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Andorra",
          "iso2": "ad",
          "dialCode": "376",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Angola",
          "iso2": "ao",
          "dialCode": "244",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Anguilla",
          "iso2": "ai",
          "dialCode": "1264",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Antigua and Barbuda",
          "iso2": "ag",
          "dialCode": "1268",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Argentina",
          "iso2": "ar",
          "dialCode": "54",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Armenia (Հայաստան)",
          "iso2": "am",
          "dialCode": "374",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Aruba",
          "iso2": "aw",
          "dialCode": "297",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Australia",
          "iso2": "au",
          "dialCode": "61",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Austria (Österreich)",
          "iso2": "at",
          "dialCode": "43",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Azerbaijan (Azərbaycan)",
          "iso2": "az",
          "dialCode": "994",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Bahamas",
          "iso2": "bs",
          "dialCode": "1242",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Bahrain (‫البحرين‬‎)",
          "iso2": "bh",
          "dialCode": "973",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Bangladesh (বাংলাদেশ)",
          "iso2": "bd",
          "dialCode": "880",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Barbados",
          "iso2": "bb",
          "dialCode": "1246",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Belarus (Беларусь)",
          "iso2": "by",
          "dialCode": "375",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Belgium (België)",
          "iso2": "be",
          "dialCode": "32",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Belize",
          "iso2": "bz",
          "dialCode": "501",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Benin (Bénin)",
          "iso2": "bj",
          "dialCode": "229",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Bermuda",
          "iso2": "bm",
          "dialCode": "1441",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Bhutan (འབྲུག)",
          "iso2": "bt",
          "dialCode": "975",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Bolivia",
          "iso2": "bo",
          "dialCode": "591",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Bosnia and Herzegovina (Босна и Херцеговина)",
          "iso2": "ba",
          "dialCode": "387",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Botswana",
          "iso2": "bw",
          "dialCode": "267",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Brazil (Brasil)",
          "iso2": "br",
          "dialCode": "55",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "British Indian Ocean Territory",
          "iso2": "io",
          "dialCode": "246",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "British Virgin Islands",
          "iso2": "vg",
          "dialCode": "1284",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Brunei",
          "iso2": "bn",
          "dialCode": "673",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Bulgaria (България)",
          "iso2": "bg",
          "dialCode": "359",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Burkina Faso",
          "iso2": "bf",
          "dialCode": "226",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Burundi (Uburundi)",
          "iso2": "bi",
          "dialCode": "257",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Cambodia (កម្ពុជា)",
          "iso2": "kh",
          "dialCode": "855",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Cameroon (Cameroun)",
          "iso2": "cm",
          "dialCode": "237",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Canada",
          "iso2": "ca",
          "dialCode": "1",
          "priority": 1,
          "areaCodes": [
            "204",
            "226",
            "236",
            "249",
            "250",
            "289",
            "306",
            "343",
            "365",
            "387",
            "403",
            "416",
            "418",
            "431",
            "437",
            "438",
            "450",
            "506",
            "514",
            "519",
            "548",
            "579",
            "581",
            "587",
            "604",
            "613",
            "639",
            "647",
            "672",
            "705",
            "709",
            "742",
            "778",
            "780",
            "782",
            "807",
            "819",
            "825",
            "867",
            "873",
            "902",
            "905"
          ]
        },
        {
          "name": "Cape Verde (Kabu Verdi)",
          "iso2": "cv",
          "dialCode": "238",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Caribbean Netherlands",
          "iso2": "bq",
          "dialCode": "599",
          "priority": 1,
          "areaCodes": null
        },
        {
          "name": "Cayman Islands",
          "iso2": "ky",
          "dialCode": "1345",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Central African Republic (République centrafricaine)",
          "iso2": "cf",
          "dialCode": "236",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Chad (Tchad)",
          "iso2": "td",
          "dialCode": "235",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Chile",
          "iso2": "cl",
          "dialCode": "56",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "China (中国)",
          "iso2": "cn",
          "dialCode": "86",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Christmas Island",
          "iso2": "cx",
          "dialCode": "61",
          "priority": 2,
          "areaCodes": null
        },
        {
          "name": "Cocos (Keeling) Islands",
          "iso2": "cc",
          "dialCode": "61",
          "priority": 1,
          "areaCodes": null
        },
        {
          "name": "Colombia",
          "iso2": "co",
          "dialCode": "57",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Comoros (‫جزر القمر‬‎)",
          "iso2": "km",
          "dialCode": "269",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo)",
          "iso2": "cd",
          "dialCode": "243",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Congo (Republic) (Congo-Brazzaville)",
          "iso2": "cg",
          "dialCode": "242",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Cook Islands",
          "iso2": "ck",
          "dialCode": "682",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Costa Rica",
          "iso2": "cr",
          "dialCode": "506",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Côte d’Ivoire",
          "iso2": "ci",
          "dialCode": "225",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Croatia (Hrvatska)",
          "iso2": "hr",
          "dialCode": "385",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Cuba",
          "iso2": "cu",
          "dialCode": "53",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Curaçao",
          "iso2": "cw",
          "dialCode": "599",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Cyprus (Κύπρος)",
          "iso2": "cy",
          "dialCode": "357",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Czech Republic (Česká republika)",
          "iso2": "cz",
          "dialCode": "420",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Denmark (Danmark)",
          "iso2": "dk",
          "dialCode": "45",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Djibouti",
          "iso2": "dj",
          "dialCode": "253",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Dominica",
          "iso2": "dm",
          "dialCode": "1767",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Dominican Republic (República Dominicana)",
          "iso2": "do",
          "dialCode": "1",
          "priority": 2,
          "areaCodes": [
            "809",
            "829",
            "849"
          ]
        },
        {
          "name": "Ecuador",
          "iso2": "ec",
          "dialCode": "593",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Egypt (‫مصر‬‎)",
          "iso2": "eg",
          "dialCode": "20",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "El Salvador",
          "iso2": "sv",
          "dialCode": "503",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Equatorial Guinea (Guinea Ecuatorial)",
          "iso2": "gq",
          "dialCode": "240",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Eritrea",
          "iso2": "er",
          "dialCode": "291",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Estonia (Eesti)",
          "iso2": "ee",
          "dialCode": "372",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Ethiopia",
          "iso2": "et",
          "dialCode": "251",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Falkland Islands (Islas Malvinas)",
          "iso2": "fk",
          "dialCode": "500",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Faroe Islands (Føroyar)",
          "iso2": "fo",
          "dialCode": "298",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Fiji",
          "iso2": "fj",
          "dialCode": "679",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Finland (Suomi)",
          "iso2": "fi",
          "dialCode": "358",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "France",
          "iso2": "fr",
          "dialCode": "33",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "French Guiana (Guyane française)",
          "iso2": "gf",
          "dialCode": "594",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "French Polynesia (Polynésie française)",
          "iso2": "pf",
          "dialCode": "689",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Gabon",
          "iso2": "ga",
          "dialCode": "241",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Gambia",
          "iso2": "gm",
          "dialCode": "220",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Georgia (საქართველო)",
          "iso2": "ge",
          "dialCode": "995",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Germany (Deutschland)",
          "iso2": "de",
          "dialCode": "49",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Ghana (Gaana)",
          "iso2": "gh",
          "dialCode": "233",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Gibraltar",
          "iso2": "gi",
          "dialCode": "350",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Greece (Ελλάδα)",
          "iso2": "gr",
          "dialCode": "30",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Greenland (Kalaallit Nunaat)",
          "iso2": "gl",
          "dialCode": "299",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Grenada",
          "iso2": "gd",
          "dialCode": "1473",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Guadeloupe",
          "iso2": "gp",
          "dialCode": "590",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Guam",
          "iso2": "gu",
          "dialCode": "1671",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Guatemala",
          "iso2": "gt",
          "dialCode": "502",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Guernsey",
          "iso2": "gg",
          "dialCode": "44",
          "priority": 1,
          "areaCodes": null
        },
        {
          "name": "Guinea (Guinée)",
          "iso2": "gn",
          "dialCode": "224",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Guinea-Bissau (Guiné Bissau)",
          "iso2": "gw",
          "dialCode": "245",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Guyana",
          "iso2": "gy",
          "dialCode": "592",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Haiti",
          "iso2": "ht",
          "dialCode": "509",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Honduras",
          "iso2": "hn",
          "dialCode": "504",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Hong Kong (香港)",
          "iso2": "hk",
          "dialCode": "852",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Hungary (Magyarország)",
          "iso2": "hu",
          "dialCode": "36",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Iceland (Ísland)",
          "iso2": "is",
          "dialCode": "354",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "India (भारत)",
          "iso2": "in",
          "dialCode": "91",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Indonesia",
          "iso2": "id",
          "dialCode": "62",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Iran (‫ایران‬‎)",
          "iso2": "ir",
          "dialCode": "98",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Iraq (‫العراق‬‎)",
          "iso2": "iq",
          "dialCode": "964",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Ireland",
          "iso2": "ie",
          "dialCode": "353",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Isle of Man",
          "iso2": "im",
          "dialCode": "44",
          "priority": 2,
          "areaCodes": null
        },
        {
          "name": "Israel (‫ישראל‬‎)",
          "iso2": "il",
          "dialCode": "972",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Italy (Italia)",
          "iso2": "it",
          "dialCode": "39",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Jamaica",
          "iso2": "jm",
          "dialCode": "1876",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Japan (日本)",
          "iso2": "jp",
          "dialCode": "81",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Jersey",
          "iso2": "je",
          "dialCode": "44",
          "priority": 3,
          "areaCodes": null
        },
        {
          "name": "Jordan (‫الأردن‬‎)",
          "iso2": "jo",
          "dialCode": "962",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Kazakhstan (Казахстан)",
          "iso2": "kz",
          "dialCode": "7",
          "priority": 1,
          "areaCodes": null
        },
        {
          "name": "Kenya",
          "iso2": "ke",
          "dialCode": "254",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Kiribati",
          "iso2": "ki",
          "dialCode": "686",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Kuwait (‫الكويت‬‎)",
          "iso2": "kw",
          "dialCode": "965",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Kyrgyzstan (Кыргызстан)",
          "iso2": "kg",
          "dialCode": "996",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Laos (ລາວ)",
          "iso2": "la",
          "dialCode": "856",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Latvia (Latvija)",
          "iso2": "lv",
          "dialCode": "371",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Lebanon (‫لبنان‬‎)",
          "iso2": "lb",
          "dialCode": "961",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Lesotho",
          "iso2": "ls",
          "dialCode": "266",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Liberia",
          "iso2": "lr",
          "dialCode": "231",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Libya (‫ليبيا‬‎)",
          "iso2": "ly",
          "dialCode": "218",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Liechtenstein",
          "iso2": "li",
          "dialCode": "423",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Lithuania (Lietuva)",
          "iso2": "lt",
          "dialCode": "370",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Luxembourg",
          "iso2": "lu",
          "dialCode": "352",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Macau (澳門)",
          "iso2": "mo",
          "dialCode": "853",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Macedonia (FYROM) (Македонија)",
          "iso2": "mk",
          "dialCode": "389",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Madagascar (Madagasikara)",
          "iso2": "mg",
          "dialCode": "261",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Malawi",
          "iso2": "mw",
          "dialCode": "265",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Malaysia",
          "iso2": "my",
          "dialCode": "60",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Maldives",
          "iso2": "mv",
          "dialCode": "960",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Mali",
          "iso2": "ml",
          "dialCode": "223",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Malta",
          "iso2": "mt",
          "dialCode": "356",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Marshall Islands",
          "iso2": "mh",
          "dialCode": "692",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Martinique",
          "iso2": "mq",
          "dialCode": "596",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Mauritania (‫موريتانيا‬‎)",
          "iso2": "mr",
          "dialCode": "222",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Mauritius (Moris)",
          "iso2": "mu",
          "dialCode": "230",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Mayotte",
          "iso2": "yt",
          "dialCode": "262",
          "priority": 1,
          "areaCodes": null
        },
        {
          "name": "Mexico (México)",
          "iso2": "mx",
          "dialCode": "52",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Micronesia",
          "iso2": "fm",
          "dialCode": "691",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Moldova (Republica Moldova)",
          "iso2": "md",
          "dialCode": "373",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Monaco",
          "iso2": "mc",
          "dialCode": "377",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Mongolia (Монгол)",
          "iso2": "mn",
          "dialCode": "976",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Montenegro (Crna Gora)",
          "iso2": "me",
          "dialCode": "382",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Montserrat",
          "iso2": "ms",
          "dialCode": "1664",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Morocco (‫المغرب‬‎)",
          "iso2": "ma",
          "dialCode": "212",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Mozambique (Moçambique)",
          "iso2": "mz",
          "dialCode": "258",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Myanmar (Burma)",
          "iso2": "mm",
          "dialCode": "95",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Namibia (Namibië)",
          "iso2": "na",
          "dialCode": "264",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Nauru",
          "iso2": "nr",
          "dialCode": "674",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Nepal (नेपाल)",
          "iso2": "np",
          "dialCode": "977",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Netherlands (Nederland)",
          "iso2": "nl",
          "dialCode": "31",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "New Caledonia (Nouvelle-Calédonie)",
          "iso2": "nc",
          "dialCode": "687",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "New Zealand",
          "iso2": "nz",
          "dialCode": "64",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Nicaragua",
          "iso2": "ni",
          "dialCode": "505",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Niger (Nijar)",
          "iso2": "ne",
          "dialCode": "227",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Nigeria",
          "iso2": "ng",
          "dialCode": "234",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Niue",
          "iso2": "nu",
          "dialCode": "683",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Norfolk Island",
          "iso2": "nf",
          "dialCode": "672",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "North Korea (조선 민주주의 인민 공화국)",
          "iso2": "kp",
          "dialCode": "850",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Northern Mariana Islands",
          "iso2": "mp",
          "dialCode": "1670",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Norway (Norge)",
          "iso2": "no",
          "dialCode": "47",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Oman (‫عُمان‬‎)",
          "iso2": "om",
          "dialCode": "968",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Pakistan (‫پاکستان‬‎)",
          "iso2": "pk",
          "dialCode": "92",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Palau",
          "iso2": "pw",
          "dialCode": "680",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Palestine (‫فلسطين‬‎)",
          "iso2": "ps",
          "dialCode": "970",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Panama (Panamá)",
          "iso2": "pa",
          "dialCode": "507",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Papua New Guinea",
          "iso2": "pg",
          "dialCode": "675",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Paraguay",
          "iso2": "py",
          "dialCode": "595",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Peru (Perú)",
          "iso2": "pe",
          "dialCode": "51",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Philippines",
          "iso2": "ph",
          "dialCode": "63",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Poland (Polska)",
          "iso2": "pl",
          "dialCode": "48",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Portugal",
          "iso2": "pt",
          "dialCode": "351",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Puerto Rico",
          "iso2": "pr",
          "dialCode": "1",
          "priority": 3,
          "areaCodes": [
            "787",
            "939"
          ]
        },
        {
          "name": "Qatar (‫قطر‬‎)",
          "iso2": "qa",
          "dialCode": "974",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Réunion (La Réunion)",
          "iso2": "re",
          "dialCode": "262",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Romania (România)",
          "iso2": "ro",
          "dialCode": "40",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Russia (Россия)",
          "iso2": "ru",
          "dialCode": "7",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Rwanda",
          "iso2": "rw",
          "dialCode": "250",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Saint Barthélemy (Saint-Barthélemy)",
          "iso2": "bl",
          "dialCode": "590",
          "priority": 1,
          "areaCodes": null
        },
        {
          "name": "Saint Helena",
          "iso2": "sh",
          "dialCode": "290",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Saint Kitts and Nevis",
          "iso2": "kn",
          "dialCode": "1869",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Saint Lucia",
          "iso2": "lc",
          "dialCode": "1758",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Saint Martin (Saint-Martin (partie française))",
          "iso2": "mf",
          "dialCode": "590",
          "priority": 2,
          "areaCodes": null
        },
        {
          "name": "Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon)",
          "iso2": "pm",
          "dialCode": "508",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Saint Vincent and the Grenadines",
          "iso2": "vc",
          "dialCode": "1784",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Samoa",
          "iso2": "ws",
          "dialCode": "685",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "San Marino",
          "iso2": "sm",
          "dialCode": "378",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "São Tomé and Príncipe (São Tomé e Príncipe)",
          "iso2": "st",
          "dialCode": "239",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Saudi Arabia (‫المملكة العربية السعودية‬‎)",
          "iso2": "sa",
          "dialCode": "966",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Senegal (Sénégal)",
          "iso2": "sn",
          "dialCode": "221",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Serbia (Србија)",
          "iso2": "rs",
          "dialCode": "381",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Seychelles",
          "iso2": "sc",
          "dialCode": "248",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Sierra Leone",
          "iso2": "sl",
          "dialCode": "232",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Singapore",
          "iso2": "sg",
          "dialCode": "65",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Sint Maarten",
          "iso2": "sx",
          "dialCode": "1721",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Slovakia (Slovensko)",
          "iso2": "sk",
          "dialCode": "421",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Slovenia (Slovenija)",
          "iso2": "si",
          "dialCode": "386",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Solomon Islands",
          "iso2": "sb",
          "dialCode": "677",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Somalia (Soomaaliya)",
          "iso2": "so",
          "dialCode": "252",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "South Africa",
          "iso2": "za",
          "dialCode": "27",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "South Korea (대한민국)",
          "iso2": "kr",
          "dialCode": "82",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "South Sudan (‫جنوب السودان‬‎)",
          "iso2": "ss",
          "dialCode": "211",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Spain (España)",
          "iso2": "es",
          "dialCode": "34",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Sri Lanka (ශ්‍රී ලංකාව)",
          "iso2": "lk",
          "dialCode": "94",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Sudan (‫السودان‬‎)",
          "iso2": "sd",
          "dialCode": "249",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Suriname",
          "iso2": "sr",
          "dialCode": "597",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Svalbard and Jan Mayen",
          "iso2": "sj",
          "dialCode": "47",
          "priority": 1,
          "areaCodes": null
        },
        {
          "name": "Swaziland",
          "iso2": "sz",
          "dialCode": "268",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Sweden (Sverige)",
          "iso2": "se",
          "dialCode": "46",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Switzerland (Schweiz)",
          "iso2": "ch",
          "dialCode": "41",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Syria (‫سوريا‬‎)",
          "iso2": "sy",
          "dialCode": "963",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Taiwan (台灣)",
          "iso2": "tw",
          "dialCode": "886",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Tajikistan",
          "iso2": "tj",
          "dialCode": "992",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Tanzania",
          "iso2": "tz",
          "dialCode": "255",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Thailand (ไทย)",
          "iso2": "th",
          "dialCode": "66",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Timor-Leste",
          "iso2": "tl",
          "dialCode": "670",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Togo",
          "iso2": "tg",
          "dialCode": "228",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Tokelau",
          "iso2": "tk",
          "dialCode": "690",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Tonga",
          "iso2": "to",
          "dialCode": "676",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Trinidad and Tobago",
          "iso2": "tt",
          "dialCode": "1868",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Tunisia (‫تونس‬‎)",
          "iso2": "tn",
          "dialCode": "216",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Turkey (Türkiye)",
          "iso2": "tr",
          "dialCode": "90",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Turkmenistan",
          "iso2": "tm",
          "dialCode": "993",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Turks and Caicos Islands",
          "iso2": "tc",
          "dialCode": "1649",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Tuvalu",
          "iso2": "tv",
          "dialCode": "688",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "U.S. Virgin Islands",
          "iso2": "vi",
          "dialCode": "1340",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Uganda",
          "iso2": "ug",
          "dialCode": "256",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Ukraine (Україна)",
          "iso2": "ua",
          "dialCode": "380",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "United Arab Emirates (‫الإمارات العربية المتحدة‬‎)",
          "iso2": "ae",
          "dialCode": "971",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "United Kingdom",
          "iso2": "gb",
          "dialCode": "44",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "United States",
          "iso2": "us",
          "dialCode": "1",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Uruguay",
          "iso2": "uy",
          "dialCode": "598",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Uzbekistan (Oʻzbekiston)",
          "iso2": "uz",
          "dialCode": "998",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Vanuatu",
          "iso2": "vu",
          "dialCode": "678",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Vatican City (Città del Vaticano)",
          "iso2": "va",
          "dialCode": "39",
          "priority": 1,
          "areaCodes": null
        },
        {
          "name": "Venezuela",
          "iso2": "ve",
          "dialCode": "58",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Vietnam (Việt Nam)",
          "iso2": "vn",
          "dialCode": "84",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Wallis and Futuna",
          "iso2": "wf",
          "dialCode": "681",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Western Sahara (‫الصحراء الغربية‬‎)",
          "iso2": "eh",
          "dialCode": "212",
          "priority": 1,
          "areaCodes": null
        },
        {
          "name": "Yemen (‫اليمن‬‎)",
          "iso2": "ye",
          "dialCode": "967",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Zambia",
          "iso2": "zm",
          "dialCode": "260",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Zimbabwe",
          "iso2": "zw",
          "dialCode": "263",
          "priority": 0,
          "areaCodes": null
        },
        {
          "name": "Åland Islands",
          "iso2": "ax",
          "dialCode": "358",
          "priority": 1,
          "areaCodes": null
        }
      ],
      allImages: {
        "ad": require("../img/countries/ad.jpg"),
        "ae": require("../img/countries/ae.jpg"),
        "af": require("../img/countries/af.jpg"),
        "ag": require("../img/countries/ag.jpg"),
        "ai": require("../img/countries/ai.jpg"),
        "al": require("../img/countries/al.jpg"),
        "am": require("../img/countries/am.jpg"),
        "ao": require("../img/countries/ao.jpg"),
        "ar": require("../img/countries/ar.jpg"),
        "as": require("../img/countries/as.jpg"),
        "at": require("../img/countries/at.jpg"),
        "au": require("../img/countries/au.jpg"),
        "aw": require("../img/countries/aw.jpg"),
        "ax": require("../img/countries/ax.jpg"),
        "az": require("../img/countries/az.jpg"),
        "ba": require("../img/countries/ba.jpg"),
        "bb": require("../img/countries/bb.jpg"),
        "bd": require("../img/countries/bd.jpg"),
        "be": require("../img/countries/be.jpg"),
        "bf": require("../img/countries/bf.jpg"),
        "bg": require("../img/countries/bg.jpg"),
        "bh": require("../img/countries/bh.jpg"),
        "bi": require("../img/countries/bi.jpg"),
        "bj": require("../img/countries/bj.jpg"),
        "bl": require("../img/countries/bl.jpg"),
        "bm": require("../img/countries/bm.jpg"),
        "bn": require("../img/countries/bn.jpg"),
        "bo": require("../img/countries/bo.jpg"),
        "bq": require("../img/countries/bq.jpg"),
        "br": require("../img/countries/br.jpg"),
        "bs": require("../img/countries/bs.jpg"),
        "bt": require("../img/countries/bt.jpg"),
        "bw": require("../img/countries/bw.jpg"),
        "by": require("../img/countries/by.jpg"),
        "bz": require("../img/countries/bz.jpg"),
        "ca": require("../img/countries/ca.jpg"),
        "cc": require("../img/countries/cc.jpg"),
        "cd": require("../img/countries/cd.jpg"),
        "cf": require("../img/countries/cf.jpg"),
        "cg": require("../img/countries/cg.jpg"),
        "ch": require("../img/countries/ch.jpg"),
        "ci": require("../img/countries/ci.jpg"),
        "ck": require("../img/countries/ck.jpg"),
        "cl": require("../img/countries/cl.jpg"),
        "cm": require("../img/countries/cm.jpg"),
        "cn": require("../img/countries/cn.jpg"),
        "co": require("../img/countries/co.jpg"),
        "cr": require("../img/countries/cr.jpg"),
        "cu": require("../img/countries/cu.jpg"),
        "cv": require("../img/countries/cv.jpg"),
        "cw": require("../img/countries/cw.jpg"),
        "cx": require("../img/countries/cx.jpg"),
        "cy": require("../img/countries/cy.jpg"),
        "cz": require("../img/countries/cz.jpg"),
        "de": require("../img/countries/de.jpg"),
        "dj": require("../img/countries/dj.jpg"),
        "dk": require("../img/countries/dk.jpg"),
        "dm": require("../img/countries/dm.jpg"),
        "do": require("../img/countries/do.jpg"),
        "dz": require("../img/countries/dz.jpg"),
        "ec": require("../img/countries/ec.jpg"),
        "ee": require("../img/countries/ee.jpg"),
        "eg": require("../img/countries/eg.jpg"),
        "eh": require("../img/countries/eh.jpg"),
        "er": require("../img/countries/er.jpg"),
        "es": require("../img/countries/es.jpg"),
        "et": require("../img/countries/et.jpg"),
        "fi": require("../img/countries/fi.jpg"),
        "fj": require("../img/countries/fj.jpg"),
        "fk": require("../img/countries/fk.jpg"),
        "fm": require("../img/countries/fm.jpg"),
        "fo": require("../img/countries/fo.jpg"),
        "fr": require("../img/countries/fr.jpg"),
        "ga": require("../img/countries/ga.jpg"),
        "gb": require("../img/countries/gb.jpg"),
        "gd": require("../img/countries/gd.jpg"),
        "ge": require("../img/countries/ge.jpg"),
        "gf": require("../img/countries/gf.jpg"),
        "gg": require("../img/countries/gg.jpg"),
        "gh": require("../img/countries/gh.jpg"),
        "gi": require("../img/countries/gi.jpg"),
        "gm": require("../img/countries/gm.jpg"),
        "gn": require("../img/countries/gn.jpg"),
        "gp": require("../img/countries/gp.jpg"),
        "gq": require("../img/countries/gq.jpg"),
        "gr": require("../img/countries/gr.jpg"),
        "gt": require("../img/countries/gt.jpg"),
        "gu": require("../img/countries/gu.jpg"),
        "gw": require("../img/countries/gw.jpg"),
        "gy": require("../img/countries/gy.jpg"),
        "hk": require("../img/countries/hk.jpg"),
        "hn": require("../img/countries/hn.jpg"),
        "hr": require("../img/countries/hr.jpg"),
        "ht": require("../img/countries/ht.jpg"),
        "hu": require("../img/countries/hu.jpg"),
        "id": require("../img/countries/id.jpg"),
        "ie": require("../img/countries/ie.jpg"),
        "il": require("../img/countries/il.jpg"),
        "im": require("../img/countries/im.jpg"),
        "in": require("../img/countries/in.jpg"),
        "io": require("../img/countries/io.jpg"),
        "iq": require("../img/countries/iq.jpg"),
        "ir": require("../img/countries/ir.jpg"),
        "is": require("../img/countries/is.jpg"),
        "it": require("../img/countries/it.jpg"),
        "je": require("../img/countries/je.jpg"),
        "jm": require("../img/countries/jm.jpg"),
        "jo": require("../img/countries/jo.jpg"),
        "jp": require("../img/countries/jp.jpg"),
        "ke": require("../img/countries/ke.jpg"),
        "kg": require("../img/countries/kg.jpg"),
        "kh": require("../img/countries/kh.jpg"),
        "ki": require("../img/countries/ki.jpg"),
        "km": require("../img/countries/km.jpg"),
        "kn": require("../img/countries/kn.jpg"),
        "kp": require("../img/countries/kp.jpg"),
        "kr": require("../img/countries/kr.jpg"),
        "ks": require("../img/countries/ks.jpg"),
        "kw": require("../img/countries/kw.jpg"),
        "ky": require("../img/countries/ky.jpg"),
        "kz": require("../img/countries/kz.jpg"),
        "la": require("../img/countries/la.jpg"),
        "lb": require("../img/countries/lb.jpg"),
        "lc": require("../img/countries/lc.jpg"),
        "li": require("../img/countries/li.jpg"),
        "lk": require("../img/countries/lk.jpg"),
        "lr": require("../img/countries/lr.jpg"),
        "ls": require("../img/countries/ls.jpg"),
        "lt": require("../img/countries/lt.jpg"),
        "lu": require("../img/countries/lu.jpg"),
        "lv": require("../img/countries/lv.jpg"),
        "ly": require("../img/countries/ly.jpg"),
        "ma": require("../img/countries/ma.jpg"),
        "mc": require("../img/countries/mc.jpg"),
        "md": require("../img/countries/md.jpg"),
        "me": require("../img/countries/me.jpg"),
        "mf": require("../img/countries/mf.jpg"),
        "mg": require("../img/countries/mg.jpg"),
        "mh": require("../img/countries/mh.jpg"),
        "mk": require("../img/countries/mk.jpg"),
        "ml": require("../img/countries/ml.jpg"),
        "mm": require("../img/countries/mm.jpg"),
        "mn": require("../img/countries/mn.jpg"),
        "mo": require("../img/countries/mo.jpg"),
        "mp": require("../img/countries/mp.jpg"),
        "mq": require("../img/countries/mq.jpg"),
        "mr": require("../img/countries/mr.jpg"),
        "ms": require("../img/countries/ms.jpg"),
        "mt": require("../img/countries/mt.jpg"),
        "mu": require("../img/countries/mu.jpg"),
        "mv": require("../img/countries/mv.jpg"),
        "mw": require("../img/countries/mw.jpg"),
        "mx": require("../img/countries/mx.jpg"),
        "my": require("../img/countries/my.jpg"),
        "mz": require("../img/countries/mz.jpg"),
        "na": require("../img/countries/na.jpg"),
        "nc": require("../img/countries/nc.jpg"),
        "ne": require("../img/countries/ne.jpg"),
        "nf": require("../img/countries/nf.jpg"),
        "ng": require("../img/countries/ng.jpg"),
        "ni": require("../img/countries/ni.jpg"),
        "nl": require("../img/countries/nl.jpg"),
        "no": require("../img/countries/no.jpg"),
        "np": require("../img/countries/np.jpg"),
        "nr": require("../img/countries/nr.jpg"),
        "nu": require("../img/countries/nu.jpg"),
        "nz": require("../img/countries/nz.jpg"),
        "om": require("../img/countries/om.jpg"),
        "pa": require("../img/countries/pa.jpg"),
        "pe": require("../img/countries/pe.jpg"),
        "pf": require("../img/countries/pf.jpg"),
        "pg": require("../img/countries/pg.jpg"),
        "ph": require("../img/countries/ph.jpg"),
        "pk": require("../img/countries/pk.jpg"),
        "pl": require("../img/countries/pl.jpg"),
        "pm": require("../img/countries/pm.jpg"),
        "pr": require("../img/countries/pr.jpg"),
        "ps": require("../img/countries/ps.jpg"),
        "pt": require("../img/countries/pt.jpg"),
        "pw": require("../img/countries/pw.jpg"),
        "py": require("../img/countries/py.jpg"),
        "qa": require("../img/countries/qa.jpg"),
        "re": require("../img/countries/re.jpg"),
        "ro": require("../img/countries/ro.jpg"),
        "rs": require("../img/countries/rs.jpg"),
        "ru": require("../img/countries/ru.jpg"),
        "rw": require("../img/countries/rw.jpg"),
        "sa": require("../img/countries/sa.jpg"),
        "sb": require("../img/countries/sb.jpg"),
        "sc": require("../img/countries/sc.jpg"),
        "sd": require("../img/countries/sd.jpg"),
        "se": require("../img/countries/se.jpg"),
        "sg": require("../img/countries/sg.jpg"),
        "sh": require("../img/countries/sh.jpg"),
        "si": require("../img/countries/si.jpg"),
        "sj": require("../img/countries/sj.jpg"),
        "sk": require("../img/countries/sk.jpg"),
        "sl": require("../img/countries/sl.jpg"),
        "sm": require("../img/countries/sm.jpg"),
        "sn": require("../img/countries/sn.jpg"),
        "so": require("../img/countries/so.jpg"),
        "sr": require("../img/countries/sr.jpg"),
        "ss": require("../img/countries/ss.jpg"),
        "st": require("../img/countries/st.jpg"),
        "sv": require("../img/countries/sv.jpg"),
        "sx": require("../img/countries/sx.jpg"),
        "sy": require("../img/countries/sy.jpg"),
        "sz": require("../img/countries/sz.jpg"),
        "tc": require("../img/countries/tc.jpg"),
        "td": require("../img/countries/td.jpg"),
        "tg": require("../img/countries/tg.jpg"),
        "th": require("../img/countries/th.jpg"),
        "tj": require("../img/countries/tj.jpg"),
        "tk": require("../img/countries/tk.jpg"),
        "tl": require("../img/countries/tl.jpg"),
        "tm": require("../img/countries/tm.jpg"),
        "tn": require("../img/countries/tn.jpg"),
        "to": require("../img/countries/to.jpg"),
        "tr": require("../img/countries/tr.jpg"),
        "tt": require("../img/countries/tt.jpg"),
        "tv": require("../img/countries/tv.jpg"),
        "tw": require("../img/countries/tw.jpg"),
        "tz": require("../img/countries/tz.jpg"),
        "ua": require("../img/countries/ua.jpg"),
        "ug": require("../img/countries/ug.jpg"),
        "us": require("../img/countries/us.jpg"),
        "uy": require("../img/countries/uy.jpg"),
        "uz": require("../img/countries/uz.jpg"),
        "va": require("../img/countries/va.jpg"),
        "vc": require("../img/countries/vc.jpg"),
        "ve": require("../img/countries/ve.jpg"),
        "vg": require("../img/countries/vg.jpg"),
        "vi": require("../img/countries/vi.jpg"),
        "vn": require("../img/countries/vn.jpg"),
        "vu": require("../img/countries/vu.jpg"),
        "wf": require("../img/countries/wf.jpg"),
        "ws": require("../img/countries/ws.jpg"),
        "ye": require("../img/countries/ye.jpg"),
        "yt": require("../img/countries/yt.jpg"),
        "za": require("../img/countries/za.jpg"),
        "zm": require("../img/countries/zm.jpg"),
        "zw": require("../img/countries/zw.jpg")
      },
      initValue: "Select me!",
      cancelText: "cancel",
      pickerData: []
    };
  }

  componentWillMount () {
    let flags = this.state.allImages;
    let pickerData = this.state.allData.map((country, index) => ({
      key: index,
      image: flags[country.iso2],
      label: country.name,
      dialCode: `+${country.dialCode}`,
      iso2: country.iso2
    }));
    this.setState({ pickerData });
  }

  componentDidMount () {
    this.setState({ selected: this.state.initValue });
    this.setState({ cancelText: this.state.cancelText });
  }

  onChange (item) {
    this.props.onChange(item);
    this.setState({ selected: item.label });
    this.close();
  }

  close () {
    this.setState({
      modalVisible: false,
      data: []
    });
  }

  open () {
    this.setState({
      modalVisible: true
    });
    setTimeout(() => {
      this.setState({ data: this.state.pickerData });
    }, 0);
  }

  renderSection (section) {
    return (
      <View key={section.key} style={[styles.sectionStyle, this.props.sectionStyle]}>
        <Text style={[styles.sectionTextStyle, this.props.sectionTextStyle]}>{section.label}</Text>
      </View>
    );
  }

  renderOption (option) {
    return (
      <TouchableOpacity key={option.key} onPress={() => this.onChange(option)}>
        <View
          style={[
            styles.optionStyle,
            this.props.optionStyle,
            {
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            }
          ]}
        >
          <View style={{ flex: 0.15 }}>
            <Image source={option.image} resizeMode="stretch" style={{ width: 30, height: 16 }}/>
          </View>
          <View style={{ flex: 0.7, alignItems: "center" }}>
            <Text
              style={[
                styles.optionTextStyle,
                this.props.optionTextStyle,
                { color: "#434343", fontSize: 14 }
              ]}
            >
              {option.label}
            </Text>
          </View>
          <View style={{ flex: 0.15, alignItems: "flex-end" }}>
            <Text
              style={[
                styles.optionTextStyle,
                this.props.optionTextStyle,
                { color: "grey", fontSize: 12 }
              ]}
            >
              {option.dialCode}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderOptionList () {

    const options = this.state.data.map((item) => {
      if (item.section) {
        return this.renderSection(item);
      }
      return this.renderOption(item);
    });

    return (

      <View
        style={[styles.overlayStyle, this.props.overlayStyle]}
        key={`modalPicker${componentIndex++}`}
      >
        <View style={styles.optionContainer}>

          {this.state.data.length === 0 ? <ActivityIndicator style={{ marginTop: 200 }} size="large" color="#333"/> :

            <ScrollView keyboardShouldPersistTaps="always"
                        scrollEnabled={true}
                        horizontal={false}>
              <View style={{ paddingHorizontal: 10 }}>{options}</View>
            </ScrollView>
          }

        </View>


        <View style={styles.cancelContainer}>
          <TouchableOpacity onPress={this.close}>
            <View style={[styles.cancelStyle, this.props.cancelStyle]}>
              <Text style={[styles.cancelTextStyle, this.props.cancelTextStyle]}>
                {this.props.cancelText}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderChildren () {
    if (this.state.children) {
      return this.state.children;
    }
  }

  render () {

    const dp = (
      <Modal
        transparent
        ref={(ref) => { this.modal = ref; }}
        visible={this.state.modalVisible}
        onRequestClose={this.close}
        animationType={this.state.animationType}
      >
        {this.renderOptionList()}
      </Modal>
    );

    return (
      <View style={this.props.style}>
        {dp}
        <TouchableOpacity onPress={this.open}>{this.renderChildren()}</TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  overlayStyle: {
    width: width,
    height: height,
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.7)"
  },

  optionContainer: {
    borderRadius: BORDER_RADIUS,
    width: width * 0.9,
    height: OPTION_CONTAINER_HEIGHT,
    backgroundColor: "rgba(255,255,255,0.9)",
    left: width * 0.05,
    top: -20
  },

  cancelContainer: {
    left: width * 0.05,
    top: -10
  },

  selectStyle: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 8,
    borderRadius: BORDER_RADIUS
  },

  selectTextStyle: {
    textAlign: "center",
    color: "#333",
    fontSize: FONT_SIZE
  },

  cancelStyle: {
    borderRadius: BORDER_RADIUS,
    width: width * 0.9,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: PADDING * 1.2
  },

  cancelTextStyle: {
    textAlign: "center",
    color: "#333",
    fontSize: FONT_SIZE
  },

  optionStyle: {
    padding: PADDING * 1.2,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc"
  },

  optionTextStyle: {
    textAlign: "center",
    fontSize: FONT_SIZE,
    color: HIGHLIGHT_COLOR
  },

  sectionStyle: {
    padding: PADDING * 2,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc"
  },

  sectionTextStyle: {
    textAlign: "center",
    fontSize: FONT_SIZE
  }
});
export default ModalPicker;