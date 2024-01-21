function Layout(props) {
    const { children } = props;
    return (
        <div 
            id="gradient" 
            style={{
                "width": "99dvw",
                "height": "99dvh",
                "paddingBlock": "1rem",
                "paddingInline": "2rem",
            }}
        >
            <div className="flex flex-col w-full bg-secondary">
                {children}
            </div>
        </div>
    );
}

export default Layout;
