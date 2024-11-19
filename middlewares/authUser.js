export default function authUsers( perfilAutorizado = [] ) {
    
    return (req , res , next) => {
        const usuario = req.user;
        if(!usuario || !perfilAutorizado.includes(usuario.idUsuarioTipo)) {
            return res.status(403).json({ 
                estado: "Falla",
                mensaje: "Acceso denegado"
        })
    }
    next();
    }
}