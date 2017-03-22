import React from "react";
import {connect} from "react-redux";
import {compose, gql, graphql} from 'react-apollo';
import {PageHeader} from "bootstrap-react-components";
import constants from "../../constants";
import {load as loadData, add} from "../../actions";
import {WebPreferenceTypeList, WebPreferenceTypeEditor} from "../components/WebPreferenceTypes";
import WebPreferenceTypeGql from "../../graphql/web_preference_types.graphql";
import CreateWebPreferenceType from "../../graphql/create_web_preference_type.graphql";
import UpdateWebPreferenceType from "../../graphql/update_web_preference_type.graphql";
import DeleteWebPreferenceType from "../../graphql/delete_web_preference_type.graphql";

let {DISPLAY_MESSAGE, MESSAGE_CONTEXT_DANGER} = constants;

class WebPreferenceTypeListPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            addFormShow: false
        }
    }

    create(item) {
        this.props.createQl(item).then(({data}) => {
            this.setState({addFormShow: false});
            return data;
        }).catch(error => this.props.showMessage(error));
    }

    remove(item) {
        this.props.removeQl(item).catch(error => this.props.showMessage(error));
    }

    render() {
        let {list} = this.props;
        let mainDisplay = list.loading
            ? <p>Still loading....</p>
            : <WebPreferenceTypeList list={list.web_preference_types} update={this.update.bind(this)} remove={this.props.removeQl.bind(this)}/>;
        let addForm = this.state.addFormShow
            ? <WebPreferenceTypeEditor id={""} description={""} save={this.create.bind(this)}/>
          : <button id="addWebPreferenceTypeButton" class="btn btn-default" onClick={this.showAdd.bind(this)}>
                <span class="glyphicon glyphicon-plus" aria-hidden="true"/>
                Add
            </button>;
        return (
            <div id="WebPreferenceTypeListPage">
                <PageHeader id="WebPreferenceTypeListPage">
                    <h1>Web Preference Types</h1>
                </PageHeader>

                {addForm}
                {mainDisplay}
            </div>
        );
    }

    showAdd = () => {
        this.setState({addFormShow: true})
    }

    update(item) {
        this.props.updateQl(item)
        .catch(error => this.props.showMessage(error));
    }
}

const WebPreferenceTypeListPageWithGql = compose(graphql(WebPreferenceTypeGql, {name: "list"}), graphql(CreateWebPreferenceType, {
    name: 'create',
    props: ({create}) => ({
        createQl: (item) => create({
            variables: {
                description: item.description
            },
            optimisticResponse: {
                "create_web_preference_type": {
                    "description": item.description,
                    "__typename": "WebPreferenceType"
                }
            },
            updateQueries: {
                "web_preference_types": (prev, {mutationResult}) => {
                    let newType = mutationResult.data.create_web_preference_type;
                    return Object.assign({}, prev, {
                        web_preference_types: [
                            ...prev.web_preference_types,
                            newType
                        ]
                    });
                }
            }
        })
    })
}), graphql(UpdateWebPreferenceType, {
    name: 'update',
    props: ({update}) => ({
        updateQl: ({id, description}) => update({
            variables: {
                id,
                description
            },
            optimisticResponse: {
                "update_web_preference_type": {
                    id,
                    description,
                    "__typename": "WebPreferenceType"
                }
            },
            updateQueries: {
                "web_preference_types": (prev, {mutationResult}) => {
                    let newType = mutationResult.data.update_web_preference_type;
                    console.log("mutationResult: ", mutationResult)
                    return Object.assign(prev, {
                        web_preference_types: prev.web_preference_types.map(i => i.id === newType.id
                            ? newType
                            : i)
                    });
                }
            }
        })
    })
}), graphql(DeleteWebPreferenceType, {
    name: 'remove',
    props: ({remove}) => ({
        removeQl: ({id}) => remove({
            variables: {
                id
            },
            optimisticResponse: {
                "delete_web_preference_type": {
                    id,
                    "__typename": "WebPreferenceType"
                }
            },
            updateQueries: {
                "web_preference_types": (prev, {mutationResult}) => {
                    let newType = mutationResult.data.delete_web_preference_type;
                    return Object.assign(prev, {
                        web_preference_types: prev.web_preference_types.filter(i => i.id !== newType.id)
                    });
                }
            }
        })
    })
}))(WebPreferenceTypeListPage);

export default connect(state => ({}), dispatch => ({
    showMessage: message => dispatch({
        type: DISPLAY_MESSAGE,
        payload: {
            context: MESSAGE_CONTEXT_DANGER,
            message: message.message
        }
    })
}))(WebPreferenceTypeListPageWithGql);
