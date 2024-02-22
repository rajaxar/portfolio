import Navbar from '../Navbar';

function Layout(props) {
    const { children, setPage, page } = props;
        
    return (
        <div
            id="gradient"
            style={{
                "overflow": "auto",
                "position": "absolute",
                "top": "0",
                "left": "0",
            }}
        >
            {page !== 'nba_wireframe' && <Navbar setPage={setPage} page={page}/>}
            <div
                style={{
                    "width": "100dvw",
                    "height": "100dvh",
                    "marginTop": "0rem",
                    "position": "absolute",
                    "top": (page === 'nba_wireframe' ? "0rem" : "4rem"),
                    "overflow": (page !== 'nba_wireframe' ? "auto" : "hidden")
                }}
            >
            {children}
            </div>
        </div>
    );
}

export default Layout;
