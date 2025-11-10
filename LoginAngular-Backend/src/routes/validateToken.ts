import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    const headerToken = req.headers['authorization']
    // console.log("VALIDATE TOKEN", headerToken);
    if(headerToken != undefined && headerToken.startsWith('Bearer ')){
       try {
        const token = headerToken.slice(7);
        // console.log(token);        
        // Verify and attach decoded payload to request for downstream handlers
        const secret = process.env.SECRET_KEY || 'TSE-Edaniel-Valencia'
        const decoded = jwt.verify(token, secret);
        // attach to request as `user`
        (req as any).user = decoded;
        next()
       } catch (error) {
        res.status(401).json({
            msg: `CIERRE DE SESIÓN AUTOMATICO`
        })
       }
    }else{
        res.status(401).json({
            msg: `Acceso Denegado`
        })
    }
}

export default validateToken;