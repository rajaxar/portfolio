function Layout(props) {
    const { children } = props;
    return (
        <div
            id="gradient"
            style={{
                "overflow": "scroll",
                "height": "100%",
                "width": "100%",
                "position": "absolute",
                "top": "0",
                "left": "0"
            }}
        >
            {children}
        </div>
    );
}

export default Layout;
