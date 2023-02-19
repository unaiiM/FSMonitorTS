interface Options {
    path : string;
};

/*
    More config options will be added in future versions, like;
        - Watch only files when watching directoris.
        - Watch only directoris when watching directoris.
        - Watch special events.
*/

class Config {

    public path : string;

    public constructor(options : Options) {

        this.path = options.path; 

    };

};

export default Config;
export { Options };