require( 'dotenv' ).config();
const express = require( 'express' );
const app = express();
const PORT = process.env.PORT;
require( './database/database' );
const userRouter = require( './routers/user' );
const multer = require( 'multer' );

app.use( express.json() );
app.use( userRouter );

app.use( ( err, req, res, next ) => {
    if ( err instanceof multer.MulterError ) {
        if ( err.code === 'LIMIT_FIELD_COUNT' ) {
            return res.status( 400 ).json( {
                message: 'Max of 5 files expected.'
            } );
        } else if ( err.code === 'LIMIT_UNEXPECTED_FILE' ) {
            return res.status( 400 ).json( {
                message: 'Unexpected file field, check the field name and the number of files'
            } );
        } else if ( err.code === 'LIMIT_FILE_SIZE' ) {
            return res.status( 400 ).json( {
                message: 'file Size too large, maximum file size is 5mb'
            } );
        }
    }
    next();
} );

app.listen( PORT, () => {
    console.log( `Server is running on Port: ${ PORT }` );
} );
