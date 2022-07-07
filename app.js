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
    database:'articulos'
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

app.get('/api/articulos',(req,res)=>{
    conexion.query('SELECT * FROM articulos', (err, filas)=>{
        if(err){
            throw err
        }else{
            res.send(filas);
        }
    });
})

//Realizando consulta individual

app.get('/api/articulos/:id',(req,res)=>{
    conexion.query('SELECT * FROM articulos WHERE id = ?',[req.params.id], (err, fila)=>{
        if(err){
            throw err
        }else{
           res.send(fila); //con esta instruccion traemos el objeto
          // res.send(fila[0].description) //aca solo traemos una propiedad del objeto  
        }
    });
})

//Creando articulo

app.post('/api/articulos',(req,res)=>{
    const {description, price, stock} = req.body;
    console.log(description, price, stock);
    let sql=`INSERT INTO articulos (description, price, stock) VALUES
            ('${description}', '${price}', '${stock}')`;
    conexion.query(sql, (err, result)=>{
        if(err){
            return res.status(404).json(err)
        }
        return res.status(201).json(result);
    });        
});

//Editar articulo

app.put('/api/articulos/:id',(req,res)=>{
    let id=req.params.id;
    let description=req.body.description;
    let price=req.body.price;
    let stock=req.body.stock;
    let sql = "UPDATE articulos SET description=?, price=?, stock=? WHERE id=?";
    conexion.query(sql,[description,price,stock,id],function(err,result){
        if(err){
            throw err
        }else{
           res.send(result); 
            
        }
    });

});

//Eliminar articulo

app.delete('/api/articulos/:id',(req,res)=>{
    conexion.query('DELETE FROM articulos WHERE id=?',[req.params.id],function(err,filas){
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