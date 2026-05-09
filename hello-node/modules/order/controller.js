const createOrder = (req,res)=>{
    return res.json({
        message:"order created"
    })
}

const confirmOrder =(req,res)=>{
    return res.json({
        message:"order confirmed"
    })
}

export{
    createOrder,
    confirmOrder
}