import Navbar from '../Navbar';

function Layout(props) {
    const { children, setPage, page } = props;
    return (
        <div
            id="gradient"
            style={{
                "overflow": "scroll",
                "position": "absolute",
                "top": "0",
                "left": "0",
            }}
        >
            <Navbar setPage={setPage} page={page}/>
            <div
                style={{
                    "width": "100dvw",
                    "height": "calc(100dvh - 2rem)",
                    "marginTop": "0rem",
                    "position": "absolute",
                    "top": "4rem",
                }}
            >
            {children}
            </div>
        </div>
    );
}

export default Layout;
