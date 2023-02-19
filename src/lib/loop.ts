import * as workers from "worker_threads";
import * as fs from "fs";
import Events from "./events.js";
import { FileEvent as Response } from "./../index.js";

interface FILE {
    name : string;
    stat : fs.Stats;
};

function getFileName(path : string) : string {

    let spath : string[] = path.split("/");
    let name : string = spath[spath.length - 1];
    return name;

};

function getFilePath(path : string) : string {

    let spath : string[] = path.split("/");
    let __path : string = spath.slice(0, spath.length - 1).join("/");
    return __path;

};

const events = new Events();
let __path : string = (<string> workers.getEnvironmentData("path")).replaceAll('\\', '/');
let isDir : boolean = true;
let files : FILE[] = [];
let names : string[] = [];

try {
    var dir : string[] = fs.readdirSync(__path);
} catch (err){

    if(err instanceof Error){
        
        isDir = false;

        let name : string = getFileName(__path);
        let file : FILE = {
            name : name,
            stat : fs.statSync((__path = getFilePath(__path)) + "/" + name)
        };
        
        files.push(file);
        names.push(name);

    };
};

if(isDir){
   
    dir.forEach((f : string) => {

        files.push({
            name : f,
            stat : fs.statSync(__path + "/" + f)
        });
        names.push(f);

    });

};

while(files.length > 0){

    for(let i : number = 0; i < files.length; i++){

        let file : FILE = files[i];

        try {
            var stats : fs.Stats = fs.statSync(__path + "/" + file.name);
        } catch(err : any){

            if(err instanceof Error){
                
                let code : string = (<any> err).code;
                
                switch(code) {

                    case "ENOENT": // deleted or moved ?
                        workers.parentPort.postMessage(JSON.stringify(<Response> {
                            file : file.name,
                            code : events.DELETED,
                            stats : stats
                        }));
                        break;
                    default:
                        workers.parentPort.postMessage(JSON.stringify(<Response> {
                            file : file.name,
                            code : events.UNDEFINED,
                            stats : stats
                        }));

                };

            };

            files.splice(i, 1);
            names.splice(i, 1);
            i--;

            continue;
        };

        let code : number = 0;

        if(file.stat.mtimeMs !== stats.mtimeMs){
            code = events.MODIFIED;
        }else if(file.stat.atimeMs !== stats.atimeMs){
            code = events.ACCESSED; // only file sistems with strict update
        }else if(file.stat.ctimeMs !== stats.ctimeMs){
            code = events.UNDEFINED;
        }else continue;

        file.stat = stats;

        workers.parentPort.postMessage(JSON.stringify(<Response> {
            file : file.name,
            code : code,
            stats : stats
        }));

    };

    if(isDir){

        let dir : string[] = fs.readdirSync(__path);

        dir.forEach((f : string) => {

            if(names.indexOf(f) === -1){ 
                
                files.push({
                    name : f,
                    stat : fs.statSync(__path + "/" + f)
                });

                names.push(f);

                workers.parentPort.postMessage(JSON.stringify(<Response> {
                    file : f,
                    code : events.CREATED,
                    stats : files[files.length - 1].stat
                }));

            };

        });

    };

};