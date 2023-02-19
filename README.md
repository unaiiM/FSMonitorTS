# FSMonitorTS
Sample file or directory events monitor.

## Example
Example taked from src/examples/index.ts


```
import Monitor, { Options, FileEvent } from "../index.js";

const options : Options = {
    path : "./someFileOrDirectory"
};

const m = new Monitor(options);

m.on("event", (info : FileEvent) => {

    console.log("From " + info.file + " has been " + m.events.getEventName(info.code));

});

m.watch();
```
