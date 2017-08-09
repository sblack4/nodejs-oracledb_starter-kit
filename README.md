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


## Testing

to test I set up oracle database in a docker image, this was trickier than I was lead to believe...   

### 1. Get `git` and make a folder `oracle-docker` then `cd oracle-docker`
If you're a developer you will already have this, which you do.... right..?

### 2. Get and start a base image 
From [https://github.com/oracle/ol-container-images](https://github.com/oracle/ol-container-images)

We need `oracle-linux-7-slim/server:latest` which is not in the docker store anymore...  
I've included the Oracle Linux tarball so you just have one step!
1. run `docker build --force-rm=true --no-cache=true -t oracle-linux-7-slim/server -f Dockerfile.ol .`


### 3. Get and start Oracle Database
From [https://github.com/oracle/docker-images](https://github.com/oracle/docker-images)

We are interested int OracleDatabase [https://github.com/oracle/docker-images/tree/master/OracleDatabase](https://github.com/oracle/docker-images/tree/master/OracleDatabase)
1. Download the oracle database zipfile from 
[http://www.oracle.com/technetwork/database/enterprise-edition/downloads/index.html](http://www.oracle.com/technetwork/database/enterprise-edition/downloads/index.html) 
under "Oracle Database 12c Release 2" for Linux  
2. put it in the `./docker` folder
3. build your container 
`docker build --force-rm=true --no-cache=true -t oracle/database -f Dockerfile.odb .`
3. run it 
`docker run --name=oracledb -p 1521:1521 -p 5500:5500 -e ORACLE_SID=ORCLCDB -e ORACLE_PDB=ORCLPDB1 -e ORACLE_PWD=password -e ORACLE_CHARACTERSET=AL32UTF8 -v /opt/oracle/oradata -m=4g oracledb`

Bash into your database container `docker exec -i -t <CONTAINER_NAME_HERE> /bin/bash`




*from previous attempt* 

# Commands to build and run! 

First download the database .zip files

Second get an image of oracle-linux 7-slim locally (the one referenced isn't there)

Third change the Dockerfile so that it builds from the local image

build it:
`docker build --force-rm=true --no-cache=true -t oracle/database -f Dockerfile.odb .`

run it:  
`docker run --name=oracledb -p 1521:1521 -p 5500:5500 -e ORACLE_SID=ORCLCDB -e ORACLE_PDB=ORCLPDB1 -e ORACLE_PWD=password -e ORACLE_CHARACTERSET=AL32UTF8 -v /opt/oracle/oradata -m=4g oracledb`