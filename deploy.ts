import * as fs from 'fs-extra';
import * as path from 'path';
import * as archiver from 'archiver';

const build = path.join( __dirname, 'build' );
const dist = path.join( __dirname, 'dist' );
const zipOutput = path.join( __dirname, 'easy_control.zip' );

fs.moveSync( build, dist );

let zip = archiver( 'zip' );
let output = fs.createWriteStream( zipOutput );
zip.pipe( output );
zip.directory( dist, false );
zip.finalize();
