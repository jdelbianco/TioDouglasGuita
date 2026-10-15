function Bg({ children, className = '', bgImg }) {
    return (
        // Removemos aquela div w-64 em volta e colocamos o ml-64 direto no fundo
            <div  className={`justify-between min-h-screen bg-zinc-950 w-full flex font-sans text-gray-300 ${className}`}
            style={bgImg ? { 
                backgroundImage: `url(${bgImg})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center' 
            } : {}}
            >
                {children}
            </div>
      
    )
}

export default Bg;