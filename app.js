const mysql=require('mysql');
const express=require('express');
var app=express();
const body_parser= require('body-parser');
app.use(body_parser.json());


//mysql connection
var mysqlcon=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"mathy1404",
    database:"pharmacy"
});
mysqlcon.connect((err)=>{
    if(!err){
        console.log("DB Connect succed");
    }
    else{
        console.log("failed");

    }
});
//Authentication User Roles

const authaccess=(permissions)=>{
    return(req,res,next)=>{
        const userRole=req.body.userRole
        if(permissions.includes(userRole)){
            next()
        }
        else{
            return res.send("no access permission");
        }
    }

};
//login body
app.post('/check',(req,res)=>{
    let uname=req.body.uname;
    let password=req.body.password;
    let name=req.body.name
    
    mysqlcon.query("select * from user where userName=? AND password=? AND Name=?",[uname,password,name],function(err,result,fields){
        if(result.length>0){
            res.send("Successfully login");
            
        }
        else{
           res.send("error");

        }
});
});



//Display all customer

app.get('/customer',authaccess(["owner","manager","cashier"]),(req,res)=>{
    mysqlcon.query('SELECT* FROM customer', (err,rows,fields)=>{
        if(!err){
            res.send(rows)
        }
        else{
            console.log(err);
        }
    })
});
//delete a customer
app.delete('/customer',authaccess(["owner"]),(req,res)=>{
    mysqlcon.query('DELETE FROM customer WHERE cusid=?',[req.body.cusid],(err,rows,fields)=>{
        if(!err){
            res.send('deleted succesfully')
        }
        else{
            console.log(err);
        }
    })
});
//insert customer
app.post('/customer',authaccess(["owner"]),(req,res)=>{
    let id=req.body.id;
    let name=req.body.name;
    let address=req.body.address;
    let age=req.body.age;
    let phonenum=req.body.phonenum;
    

    mysqlcon.query('INSERT INTO customer (cusid, Name,Age,PhoneNum,Address ) VALUES(?,?,?,?,?)',[id,name,address,age,phonenum],(err,rows,fields)=>{
        if(!err){
            res.send('insert succesfully')
        }
        else{
            console.log(err);
        }
    })
});
//update customer
app.put('/customer',authaccess(["owner","manager"]),(req,res)=>{
    let id=req.body.id;
    let name=req.body.name;
    let address=req.body.address;
    let age=req.body.age;
    let phonenum=req.body.phonenum;

    mysqlcon.query('UPDATE  customer SET Name=?,Age=?,PhoneNum=?,Address=? WHERE cusid=?',[name,age,phonenum,address,id,],(err,rows,fields)=>{
        if(!err){
            res.send('updated succesfully')
        }
        else{
            console.log(err);
        }
    })
});



// Insert Inventory

app.post('/inventory',authaccess(["owner"]),(req,res)=>{
    let id=req.body.id;
    let name=req.body.name;
    let description=req.body.description;
    let quantity=req.body.quantity;
    

    mysqlcon.query('INSERT INTO inventory (id,Name,Description,Quantity) VALUES(?,?,?,?)',[id,name,description,quantity],(err,rows,fields)=>{
        if(!err){
            res.send('insert succesfully')
        }
        else{
            console.log(err);
        }
    })
});

//update inventory
app.put('/inventory',authaccess(["cashier","manager"]),(req,res)=>{
    let id=req.body.id;
    let name=req.body.name;
    let description=req.body.description;
    let quantity=req.body.quantity;
    

    mysqlcon.query('UPDATE  inventory SET  Name=? ,Description=?,Quantity=?  WHERE id=?',[name,description,quantity,id],(err,rows,fields)=>{
        if(!err){
            res.send('updated succesfully')
        }
        else{
            console.log(err);
        }
    })
});
//Display all Inventory

app.get('/inventory',authaccess(["owner","manager","cashier"]),(req,res)=>{
    mysqlcon.query('SELECT* FROM inventory', (err,rows,fields)=>{
        if(!err){
            res.send(rows)
        }
        else{
            console.log(err);
        }
    })
});

//delete a inventory
app.delete('/inventory',authaccess(["owner"]),(req,res)=>{
    mysqlcon.query('DELETE FROM inventory WHERE id=?',[req.body.id],(err,rows,fields)=>{
        if(!err){
            res.send('deleted succesfully')
        }
        else{
            console.log(err);
        }
    })
});


app.listen(8080);