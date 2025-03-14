const axios = require('axios');
const Swal = require('sweetalert2');

document.addEventListener('DOMContentLoaded', () => {
    const skills = document.querySelectorAll('.lista-conocimientos');
    
    // Clear the alerts
    let alertas = document.querySelectorAll('.alertas')
    
    if(alertas){
        limpiarAlertas();
        /*alertas.forEach(alerta => {
            limpiarAlertas();
        });*/
    }

    if(skills){
        skills.forEach(skills => {
            skills.addEventListener('click', agregarSkills);
        });
        // Once we are on Edit , call this function
        skillsSeleccionado();
    }
    
    const vacantesListado = document.querySelector('.panel-administracion');

    if(vacantesListado){
        vacantesListado.addEventListener('click', accionesListado);
    }
});

const skills = new Set();

const agregarSkills = e =>{
    if(e.target.tagName === 'LI'){
        if(e.target.classList.contains('activo')){
            // Quita el target del Set y posteriorment de la clase
            skills.delete(e.target.textContent);
            e.target.classList.remove('activo');
        }else{
            // Agrega el target al Set y posteriormente a la clase
            skills.add(e.target.textContent);
            e.target.classList.add('activo');
        }
    }
    
    const skillsArray = [...skills];
    document.querySelector('#skills').value = skillsArray;
}

const skillsSeleccionado = () =>{
    const seleccionados = Array.from(document.querySelectorAll('.lista-conocimientos .activo'));
    
    seleccionados.forEach(seleccionado =>{
        skills.add(seleccionado.textContent);
    })

    // Inject into hidden
    const skillsArray = [...skills];
    const skillInput = document.querySelector('#skills');
    if (skillInput) {
        skillInput.value = skillsArray; 
    } else {
        console.log('No hay input');
    }
}

const limpiarAlertas = () => {
    const alertas = document.querySelector('.alertas');
    const interval = setInterval(() => {
        if(alertas.children.length >0){
            alertas.removeChild(alertas.children[0]);
        }else if(alertas.children.length === 0){
            alertas.parentElement.removeChild(alertas);
            clearInterval(interval);
        }
    }, 2000);
}

// Delete vacants
const accionesListado = e => {
    console.log(e.target);
    if(e.target.dataset.eliminar){
        e.preventDefault();
        // Delete with axios
        Swal.fire({
            title: '¿Confirmar Eliminación?',
            text: "No podrás deshacer esta acción!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar!',
            cancelButtonText: 'No, Cancelar!'
        }).then((result) =>{
            if(result.value){
                // Send the request with axios
                const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`;

                // Axios for delete
                axios.delete(url, {params: {url}})
                    .then(function(respuesta){
                        if(respuesta.status===200){
                            Swal.fire(
                                'Eliminado!',
                                respuesta.data,
                                'Exito'
                            );
                            // Delete from DOM
                            e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement);
                        }
                    })
                    .catch(() =>{
                        Swal.fire({
                            type: 'error',
                            title: 'Hubo un error',
                            text: 'No se pudo eliminar'
                        });
                    });
            }
        });
    } else if(e.target.tagName === 'A'){
        window.location.href = e.target.href;
        return;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const menuItems = document.querySelector(".menu-items");

    if (menuToggle && menuItems) {
        menuToggle.addEventListener("click", () => {
            menuItems.classList.toggle("active");
        });
    }
});
