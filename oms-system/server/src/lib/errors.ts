// A custom AppError class that extends Error with a statusCode property

export class AppError extends Error{
    statusCode:number

    constructor(statuscode:number, message:string){
        super(message)
        this.statusCode = statuscode
    }
}