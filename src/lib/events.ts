class Events {

    public UNDEFINED = 0;
    public CREATED = 1;
    public DELETED = 2;
    public MODIFIED = 3;
    public ACCESSED = 4;

    public getEventName(event : number) : string {

        switch(event){
        
            case this.CREATED:
                return "created";
            case this.DELETED:
                return "deleted";
            case this.MODIFIED:
                return "modified";
            case this.ACCESSED:
                return "accessed";
            default:
                return "undefined";

        };

    };

    public getEventCode(event : string) : number {

        switch(event){
        
            case "created":
                return this.CREATED;   
            case "deleted":
                return this.DELETED;
            case "modified":                
                return this.MODIFIED;
            case "accessed":
                return this.ACCESSED;
            default:
                return this.UNDEFINED;

        };

    };

};

export default Events;