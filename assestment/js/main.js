//Se lee el archivo JSON con fetch
$(function () {
  //se cargo el dom
  ajax();
  events();
});

//#region Logica

function ajax() {
  fetch("https://restcountries.com/v3.1/all")
    .then((res) => res.json())
    .then((data) => {
      let pais = data;
      //Se organizan alfabeticamente
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
                      <td class="${pais[i].name.common}"scope="row"> ${pais[i].name.common}</td>
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
                      </tr>
                   `;

        
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

      
    })
    .catch((error) => console.log(error));
}

function events() {
  // $("#table").find("output tr").on("click", () => {});

  $(document).on("click", "tr", function (e) {
    let pais = $(this).find("td:eq(0)").text();
    showWiki(pais);
  });
}

//otra hoja que se llame common.js
function showWiki(nombrePais) {
  nombrePais = nombrePais;
  // let info;
  const urlWiki = `https://en.wikipedia.org/api/rest_v1/page/summary/${nombrePais}`;
  fetch(urlWiki)
    .then((res) => res.json())
    .then((data) => {
      bootbox.alert({ message: data.extract_html, backdrop: true });
    })

    .catch((error) => console.log(error));
}

//function order (order);

//Funcion que despliega una alerta con informacion del pais seleccionado

//Se checa el click para saber que informacion desplegar

//#endregion
