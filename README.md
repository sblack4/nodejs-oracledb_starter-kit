# nodejs-oracledb_starter-kit

A reusable starter template for creating a microservice 
on top of oracle-database 

For official documentation see 
[oracle's documentation](http://www.oracle.com/webfolder/technetwork/tutorials/obe/cloud/apaas/node-cloud-REST-DB/nodecloud-RESTDB.html#section4)

## Prerequisits 

* The connection info (user, password, & connection string) to an Oracle Database instance 
* Nodejs
* The connector package  [oracledb](https://github.com/oracle/node-oracledb) which requires;
    * a cpp compiler
    * the cpp compiler must be in the `PATH`
    * python 2.7 
    * python must be in the `PATH`

If you're running this on Application Container Cloud Service don't worry
, all the `oracledb` prerequisites are already install
, you just have to run `npm install` during the build


