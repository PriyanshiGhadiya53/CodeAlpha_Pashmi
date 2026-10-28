import { apiError } from "../util/apiError.js";

const verifyAdmin=(req,res,next)=>{
    if(req.user?.role!=="admin"){
        return next(
            new apiError(403, "Access denied. Admin only.")
        )
    }

    next();
}

export default verifyAdmin