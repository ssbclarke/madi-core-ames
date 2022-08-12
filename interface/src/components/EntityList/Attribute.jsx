export const Attribute = ({
    title, children
})=>{
    // children = "yes\nno"
    if(typeof children ==='string'){
        children = children.split("\n").map((c,i)=>(<p className="pb-2" key={i}>{c}</p>))
        // console.log('splittting', children.length, JSON.stringify(children))

    }
    return (
        <div className="bg-white px-4 py-2 md:flex md:flex-row">
            <div className="text-sm text-right pr-4 font-bold text-gray-400 md:w-32 md:shrink-0">{title}</div>
            <div className="text-sm text-gray-900">{children}</div>
        </div>
    )
}