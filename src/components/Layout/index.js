import Navbar from '../Navbar';

function Layout(props) {
    const { children, setPage, page } = props;
        
    return (
        <div
            id="gradient"
            style={{
                "overflow": "auto",
                "position": "fixed",
                "inset": "0",
            }}
        >
            {page !== 'nba_contract' && page !== 'survivor' && <Navbar setPage={setPage} page={page}/>}
            <div
                style={{
                    "width": "100dvw",
                    "height": "100dvh",
                    "marginTop": "0rem",
                    "position": "absolute",
                    "top": (page === 'nba_contract' || page === 'survivor' ? "0rem" : "4rem"),
                    "overflow": (page !== 'nba_contract' && page !== 'survivor' ? "auto" : "hidden")
                }}
            >
            {children}
            </div>
        </div>
    );
}

export default Layout;
