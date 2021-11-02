/*Este archivo es accedido unicamente por los .hbs contenidos
 en views, más no en las subcarpetas.(Corregir esto X)*/

//acc recibe una lista de elementos que tienen como combre de clase 'accordion' 
var acc = document.getElementsByClassName("accordion");



var i;

for (i = 0; i < acc.length; i++) {
  console.log(i);
  //Acción que se ejecutará luego de que el usuario dé click en el elemento acordeon que oculta un contenido.
  acc[i].addEventListener("click", function () {
    /* Toggle between adding and removing the "active" class,
    to highlight the button that controls the panel */

    this.classList.toggle("active");

    /* Toggle between hiding and showing the active panel */
    var panel = this.nextElementSibling;
    if (panel.style.display === "inline-block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "inline-block";
    }
  });
}
