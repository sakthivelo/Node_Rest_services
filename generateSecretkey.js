import crypto from 'crypto';
try{
    const secret = crypto.randomBytes(32).toString('hex');
    console.log(secret);
} catch(Error){
    console.log(Error)
}
