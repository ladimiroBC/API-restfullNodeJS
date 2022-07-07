var express=require("express");
var mysql=require("mysql");
var cors=require("cors");

var app =  express();
app.use(express.json());
app.use(cors());

//Establecemos parametros de conexion

var conexion=mysql.createConnection({
    host:'localhost',
    port:3306,
    user:'root',
    password:'',
    database:'peliculasdb'
});

//Test de conexion

conexion.connect(function(err){
    if(err){
        throw err;
    }else{
        console.log("Conexion existosa a la DB")
    }
})

app.get('/',function(req,res){
    res.send('Ruta inicio')
})

//Realizando consultas a todos los articulos

app.get('/api/peliculas',(req,res)=>{
    conexion.query('SELECT * FROM peliculas', (err, filas)=>{
        if(err){
            throw err
        }else{
            res.send(filas);
        }
    });
})

//Realizando consulta individual

app.get('/api/peliculas/:id',(req,res)=>{
    conexion.query('SELECT * FROM peliculas WHERE id = ?',[req.params.id], (err, fila)=>{
        if(err){
            throw err
        }else{
           res.send(fila); //con esta instruccion traemos el objeto
          // res.send(fila[0].description) //aca solo traemos una propiedad del objeto  
        }
    });
})

//Creando articulo
/*
app.post('api/newpelicula',(req,res)=>{
    const {name, category, year} = req.body;
    console.log(name, category, year);
    let sql=`INSERT INTO peliculas (name, category, year) VALUES
            ('${name}', '${category}', '${year}')`;
    conexion.query(sql, (err, result)=>{
        if(err){
            return res.status(404).json(err)
        }
        return res.status(201).json(result);
    });        
});
*/

app.post('/api/peliculas',(req,res)=>{
    let data = {
        nombre:req.body.nombre,
        category:req.body.category,
        year:req.body.year
    }
    let sql = "INSERT INTO peliculas SET ?";
    conexion.query(sql,data,function(err,result){
        if(err){
            throw err;
        }else{
            //res.send(result);
            //Modificacion para el CRUD con JS
            Object.assign(data,{id:result.insertId}) //agregando id al objeto data
            res.send(data) //enviamos los valores
        }
    });
});

//Editar articulo

app.put('/api/peliculas/:id',(req,res)=>{
    let id=req.params.id;
    let nombre=req.body.nombre;
    let category=req.body.category;
    let year=req.body.year;
    let sql = "UPDATE peliculas SET nombre=?, category=?, year=? WHERE id=?";
    conexion.query(sql,[nombre,category,year,id],function(err,result){
        if(err){
            throw err
        }else{
           res.send(result); 
            
        }
    });

});


//Eliminar articulo

app.delete('/api/peliculas/:id',(req,res)=>{
    conexion.query('DELETE FROM peliculas WHERE id=?',[req.params.id],function(err,filas){
        if(err){
            throw err
        }else{
            res.send(filas);
        }
    })
})


//Escuchando el puerto
let PORT=process.env.PORT || 3000;
app.listen(PORT,()=>console.log(`Servidor ok en puerto ${PORT}`));