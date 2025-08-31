export default async function handler(req,res) 
{
    try{
        const response = await 
        fetch("https://blinkgo-full-stack-server.onrender.com");
        res.status(200).json({ok : true, status: response.status, time:  new Date().toISOString()})
    } catch (error){
        res.status(500).json({ok: false, error: error.message});
    }
}
