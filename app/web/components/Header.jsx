import React from "react";
import {Link} from "react-router";

class Header extends React.Component {

    constructor() {
        super();
        this.state = {
            collapsed: true,
            username: null
        };
    }

    toggleCollapse() {
        let collapsed = !this.state.collapsed;
        this.setState({collapsed});
    }

    logout(e) {
        e.preventDefault();
        this.props.logout();
    }

    render() {
        let {collapsed} = this.state;
        const navClass = collapsed
            ? "collapse"
            : "";
        const {auth, location, user} = this.props;
        const plotPointClass = location.pathname === "/"
            ? "active"
            : "";
        const registerClass = location.pathname.match(/^\/register/)
            ? "active"
            : "";
        const loginClass = location.pathname.match(/^\/login/)
            ? "active"
            : "";
        let UserComponent = null;
        UserComponent = auth.isAuthenticated
            ? (
                <ul class="nav navbar-nav navbar-right">
                    <li>
                        <a href="#" onClick={this.logout.bind(this)}>
                            <span class="glyphicon glyphicon-off" aria-hidden="true"></span>
                        </a>
                    </li>
                </ul>
            )
            : <ul class="nav navbar-nav navbar-right"></ul>;
        return (
            <nav class="navbar navbar-inverse navbar-fixed-top">
                <div class="container">
                    <div class="navbar-header">
                        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar" onClick={this.toggleCollapse.bind(this)}>
                            <span class="sr-only">Toggle navigation</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                        <a class="navbar-brand" href="#">{this.props.title}</a>
                    </div>
                    <div id="navbar" class={"navbar-collapse " + navClass}>
                        <ul class="nav navbar-nav"></ul>
                        {UserComponent}
                    </div>
                </div>
            </nav>
        );
    }
}
export default Header;
