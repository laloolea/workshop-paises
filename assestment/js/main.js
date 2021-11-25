//Se lee el archivo JSON con fetch
$(function () {
  //se cargo el dom
  ajax();
  events();
});
//#region Logica
function getAllCountries() {
  return fetch("https://restcountries.com/v3.1/all");
}
function ajax() {
  const borderTable = document.getElementById("output_border");
  getAllCountries()
    .then((res) => res.json())
    .then((data) => {
      let pais = data;
      //Se organizan alfabeticamente
      //Crear otro archivo js con funciones comunes
      data.sort((a, b) => {
        const nameA = a.name.common.toLowerCase();
        const nameB = b.name.common.toLowerCase();

        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      //Variable que almacenara todos los datos
      let output = "";
      //Se cargan en una variable output todo los datos extraidos de la paigna
      for (let i = 0; i < pais.length; i++) {
        //Se cargan los primeros valores
        output += `
                  <tr class="${pais[i].name.common}" id="${pais[i].name.common}">
                      <td scope="row" class="actual"> ${pais[i].name.common}</td>
                      <td class="${pais[i].name.common}"scope="row">${pais[i].capital}</td>
                      <td class="${pais[i].name.common}"scope="row"> ${pais[i].region}</td>`;

        // separar lenguajes de cada arreglo
        let leng = "";
        if (typeof pais[i].languages === "object") {
          for (let j in pais[i].languages) {
            const le = pais[i].languages[j];
            leng += `${le}<br> `;
          }
        }
        //Continua el almacenamiento de los datos
        output += `
                       <td class="${pais[i].name.common}"scope="row"> ${leng}</td>
                       <td class="${pais[i].name.common}"scope="row">${pais[i].population}</td>
                       <td class="${pais[i].name.common}"scope="row"><img src="${pais[i].flags.svg}" width="120px"height="80"
                           class="${pais[i].name.common}"scope="row"></td>;
  
                   `;

        let listaborders = "";
        if (typeof pais[i].borders === "object") {
          for (let j in pais[i].borders) {
            const bord = pais[i].borders[j];
            listaborders += `${bord}<br> `;
          }
        }
        output += ` <td class="${pais[i].name.common}"scope="row"> ${listaborders}</td>
        
        </tr>`;
      }
      //Se inserta en el html en nuestro div output
      document.getElementById("output").innerHTML = output;
      // //Proceso de paginacion
      let options = {
        numberPerPage: 6,
        goBar: true,
        pageCounter: true,
      };
      let filterOptions = {
        el: "#searchBox",
      };
      paginate.init(".table", options, filterOptions);

      //Getting borders
      let outputBorders = "";

      $(document).on("click", "#get_borders", function (e) {
        const borders = document.querySelectorAll(".actual");
        document.getElementById("output_border").innerHTML = "";
        for (let i = 0; i < borders.length; i++) {
          fetch(`https://restcountries.com/v3.1/name/${borders[i].outerText}`)
            .then((response) => response.json())
            .then((data) => showBorders(data))
            .catch((err) => console.log(err));

          const testPais = data.map(function (count) {
            return count.borders;
          });
        }
      });
    })
    .catch((error) => console.log(error));
}

function showBorders(data) {
  const fronteras = data;
  let option = "";

  const mapaPaises = data.map(function (count) {
    return count.borders;
  });

  for (let i = 0; i < data.length; ++i) {
    if (data.length === undefined) {
      i++;
    } else {
      for (let j = 0; j < data[i].borders.length; j++) {
        fetch(`https://restcountries.com/v3.1/alpha/${mapaPaises[i][j]}`)
          .then((resp) => resp.json())
          .then((data1) => {
            option = `
              <tr>
                <th> ${fronteras[i].name.common}</th>
                <th> ${data[i].borders[j]}</th>
                <th>${data1[0].translations.spa.official}</th>
              <tr>
            `;

            document.getElementById("output_border").innerHTML += option;
          });
      }
    }
  }
}

function events() {
  $(document).on("click", "tr", function (e) {
    let pais = $(this).find("td:eq(0)").text();

    showWiki(pais);
  });
}

//otra hoja que se llame common.js
function showWiki(nombrePais) {
  nombrePais = nombrePais;

  const urlWiki = `https://en.wikipedia.org/api/rest_v1/page/summary/${nombrePais}`;
  fetch(urlWiki)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.name);
      console.log(data.coordinates.lat, data.coordinates.lon);

      //divMap = document.createElement("div");
      //divMap.setAttribute("id", "map");
      initMap(data.coordinates.lat, data.coordinates.lon);

      bootbox.alert({
        message: data.extract_html,
        backdrop: true,
      });

      document.getElementById("map").style.display = "block";
      document
        .querySelector(".bootbox-body")
        .appendChild(document.getElementById("map"));

      window.addEventListener("click", () => {
        document.getElementById("map").style.display = "none";
        document
          .querySelector(".container")
          .appendChild(document.getElementById("map"));
      });
    })
    .catch((error) => console.log(error));
}

//Map options
//Crear div para el mapa en el html luego se mueve al bootbox

function initMap(latP, lngP) {
  var options = {
    zoom: 7,
    center: { lat: latP, lng: lngP },
  };
  //creation of the map

  let map = new google.maps.Map(document.getElementById("map"), options);

  // Listen for click on map
}

//#endregion
