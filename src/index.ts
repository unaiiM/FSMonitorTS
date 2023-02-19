import * as workers from "worker_threads";
import { EventEmitter } from "events";
import Config, { Options } from "./lib/config.js";
import Events from "./lib/events.js";
import * as fs from "fs";

interface Response {
    file : string;
    code : number;
    stats : fs.Stats;
};

class Monitor extends EventEmitter {

    private config : Config;
    public events : Events = new Events();

    public constructor(options : Options){
        
        super();
        this.config = new Config(options);

    };

    public async eventsLoop() : Promise<void> {

        workers.setEnvironmentData("path", this.config.path);
        const worker : workers.Worker = new workers.Worker(__dirname + "/lib/loop.js");

        worker.on('message', (json : string) => { 

            let info : Response = JSON.parse(json);
            this.emit("event", info);

        });

        worker.on("exit", code => console.info(`Worker exited with code ${code}`));

    };

    public watch() : void {

        this.eventsLoop();

    };

};

export default Monitor;
export { Options, Response as FileEvent };