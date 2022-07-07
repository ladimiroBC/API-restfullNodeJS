

//DEFINICION DE VARIABLES
const url='http://localhost:3000/api/peliculas/';
const container=document.querySelector('tbody')
let answers=''

const modalPelicula = new bootstrap.Modal(document.getElementById('modalPelicula'))
const formPelicula = document.querySelector("form")
const nombre = document.getElementById("nombre")
const category = document.getElementById("category")
const year = document.getElementById("year")
let option=''

btnCreate.addEventListener('click',()=>{
    nombre.value=''
    category.value=''
    year.value=''
    modalPelicula.show()
    option='create'
})

//Funcion para mostrar registros

const mostrar=(peliculas)=>{
    peliculas.forEach(pelicula=>{
        answers+=`
                    <tr>
                        <td>${pelicula.id}</td>
                        <td>${pelicula.nombre}</td>
                        <td>${pelicula.category}</td>
                        <td>${pelicula.year}</td>
                        <td class="text-center">
                            <a class="btnEditar btn btn-primary">Editar</a>
                            <a class="btnBorrar btn btn-danger">Borrar</a>
                        </td>
                    </tr>  
                 `
    })
    container.innerHTML=answers
}

//PROCEDIMIENTO MUESTRA DE REGISTROS

fetch(url)
    .then(response=>response.json())
    .then(data => mostrar(data))
    .catch(err=>console.log(err))

const on = (element, event, selector, handler)=>{
    //console.log(element)
    //console.log(event)
    //console.log(selector)
    //console.log(handler)
    element.addEventListener(event, e=>{
        if(e.target.closest(selector)){
            handler(e)
        }
    })
}


//Procedimiento para borrar
on(document, 'click', '.btnBorrar', e=>{
    //console.log('BORRADO')
    const fila=e.target.parentNode.parentNode
    const id=fila.firstElementChild.innerHTML
    //console.log(id)
    alertify.confirm("Seguro quieres borrar este item?",
    function(){
        fetch(url+id,{
            method:'DELETE'
        })
        .then(res=>res.json())
        .then(()=>location.reload())
        //alertify.success('Ok');
    },
    function(){
        alertify.error('Cancel');
    });
})

//Procedimiento para editar
let idForm=0;
on(document, 'click', '.btnEditar', e=>{
    //console.log('EDITADO')
    const fila=e.target.parentNode.parentNode
    idForm=fila.children[0].innerHTML
    const nombreForm=fila.children[1].innerHTML
    const categoryForm=fila.children[2].innerHTML
    const yearForm=fila.children[3].innerHTML
    //console.log(`ID: ${idForm} - NAME: ${nombreForm} - CATEGORY: ${categoryForm} - YEAR: ${yearForm}`)
    nombre.value=nombreForm
    category.value=categoryForm
    year.value=yearForm
    option='edit'
    modalPelicula.show()

})

//Procedimiento para crear y editar
formPelicula.addEventListener('submit',(e)=>{
    e.preventDefault()
    if(option=='create'){
        //console.log('Opcion crear')
        fetch(url,{
            method:'POST',
            headers:{
                'Content-type':'application/json'
            },
            body:JSON.stringify({
                nombre:nombre.value,
                category:category.value,
                year:year.value
            })
        })
        .then(response=>response.json())
        .then(data=>{
            const newPelicula=[]
            newPelicula.push(data)
            mostrar(newPelicula)
        })
    }
    if(option=='edit'){
        //console.log('Opcion editar')
        fetch(url+idForm,{
            method:'PUT',
            headers:{
                'Content-type':'application/json'
            },
            body:JSON.stringify({
                nombre:nombre.value,
                category:category.value,
                year:year.value
            })

        })
        .then(response=>response.json())
        .then(response=>location.reload())
    }
    modalPelicula.hide()
})