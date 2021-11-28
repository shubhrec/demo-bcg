function HeaderBar() {
    return ( 
        <div className="header-bar row">
            <div className="col-6 sitename"><h2>BCG - Demo Insurance Application </h2></div>
            <div id="nav-urls" className="col-5">
                <span id="url-policy"><a href="/">View Policy</a></span>
                <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                <span id="url-analytics" ><a href="/analytics">Analytics</a></span>
            </div>
        </div>
     );
}

export default HeaderBar;