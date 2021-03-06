import {push} from "react-router-redux";
import Footer from "./Footer";
import Header from "./Header";
import constants from "../../constants";
import React from "react";
import {connect} from "react-redux";
import {logoutAndRedirect, openWebPreferenceTypes} from "../../actions";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../../../node_modules/bootstrap/dist/css/bootstrap-theme.min.css"
let {MESSAGE_CONTEXT_DANGER, MESSAGE_CONTEXT_INFO, MESSAGE_CONTEXT_SUCCESS, MESSAGE_CONTEXT_WARNING} = constants;

class Layout extends React.Component {

    constructor() {
        super();
        this.state = {
            title: "E-Commerce Admin UI"
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({children: nextProps.children});
    }

    render() {
        let {
            app,
            auth,
            logout,
            openWebPreferenceTypes,
            openFunctionTypes,
            openWebContentStatusTypes,
            openWebContentTypes,
            openWebContentRoleTypes
        } = this.props;
        let message = "";
        let contextClass = "alert-info";
        switch (app.message.context) {
            case MESSAGE_CONTEXT_DANGER:
                contextClass = "alert-danger";
                break;
            case MESSAGE_CONTEXT_INFO:
                contextClass = "alert-info";
                break;
            case MESSAGE_CONTEXT_SUCCESS:
                contextClass = "alert-success";
                break;
            case MESSAGE_CONTEXT_WARNING:
                contextClass = "alert-warning";
                break;
            default:
                contextClass = "alert-info";
        }
        if (app.message.show) {
            message = <div class={`alert ${contextClass}`} role="alert">{app.message.message}</div>
        }

        const containerStyle = {
            marginTop: "60px"
        };
        const {location, user} = this.props;
        return (
            <div id="layout" class="container" role="main" style={containerStyle}>
                <Header auth={auth} location={location} title={this.state.title} user={user} logout={logout.bind(this)} openFunctionTypes={openFunctionTypes.bind(this)} openWebContentStatusTypes={openWebContentStatusTypes.bind(this)} openWebContentTypes={openWebContentTypes.bind(this)} openWebContentRoleTypes={openWebContentRoleTypes.bind(this)} openWebPreferenceTypes={openWebPreferenceTypes.bind(this)}/> {message}
                {this.props.children}
                <Footer/>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {app: state.app, location: ownProps.location, auth: state.auth};
};

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => {
            dispatch(logoutAndRedirect());
        },
        openFunctionTypes: () => dispatch(push('/function_types')),
        openWebContentStatusTypes: () => dispatch(push('/web_content_status_types')),
        openWebContentTypes: () => dispatch(push('/web_content_types')),
        openWebContentRoleTypes: () => dispatch(push('/web_content_role_types')),
        openWebPreferenceTypes: () => dispatch(push('/web_preference_types'))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
