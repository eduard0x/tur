/*Muestra las filas de la tabla 'tabla_usuarios' si en 
alguna de sus celdas hay coincidencias con la busqueda searchText*/

function search() {
  const tabla = document.getElementById("tabla_usuarios");
  const searchText = document.getElementById("search").value.toLowerCase();
  let total = 0;

  for (let i = 1; i < tabla.rows.length; i++) {
    let found = false;

    const celdas_fila = tabla.rows[i].getElementsByTagName("td");

    for (let j = 0; j < celdas_fila.length && !found; j++) {
      const compareWith = celdas_fila[j].innerHTML.toLowerCase();
      // Buscamos el texto en el contenido de la celda
      if (searchText.length == 0 || compareWith.indexOf(searchText) > -1) {
        //Se ha encontrado la celda
        found = true;

        //Celdas con coincidencia
        total++;
      }
    }

    if (found) {
      tabla.rows[i].style.display = "";
    } else {
      // si no ha encontrado ninguna coincidencia, esconde la
      // fila de la tabla
      tabla.rows[i].style.display = "none";
    }
  }
}

function buscar_vehiculo(){
  const container = document.getElementById("container_vehiculos");
  const searchText = document.getElementById("search").value.toLowerCase();

  const tarjetas = document.getElementsByClassName("card_vehiculo");

  
  for(let i=0;i<tarjetas.length;i++){
    var found = false;  
    const placa = tarjetas[i].getElementsByTagName("h4")[0].textContent.toLowerCase();
    console.log(placa);
      if(searchText.length == 0 || placa.indexOf(searchText) > -1 ){
        found = true;
      }

      if(found){
        tarjetas[i].style.display = "";
      }else{
        tarjetas[i].style.display = "none";
      }

    }
  

}
