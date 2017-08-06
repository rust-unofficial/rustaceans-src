import React from 'react';
import { SearchResults } from './search';

const API_URL = 'http://www.ncameron.org/rustaceans/';

export class FetchSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = { results: null };
    }

    componentWillReceiveProps(nextProps) {
        const thisKey = this.props.getKey(this.props);
        const nextKey = this.props.getKey(nextProps);
        if (thisKey != nextKey) {
            this.setState( { results: null } );
        }
        this.fetchData(nextKey);
    }

    componentWillMount() {
        this.fetchData(this.props.getKey(this.props));
    };

    fetchData(key) {
        const self = this;
        let url = API_URL + self.props.endPoint;
        if (key) {
            url += '=' + key;
        }
        // console.log("fetching " + url);
        fetch(url).then(function(response) {
            return response.json();
        }).then(function(results) {
            self.setState( { results } );
        });
    }

    render() {
        if (!this.state.results) {
            return <div>loading...</div>;
        } else {
            return <SearchResults results={this.state.results} />;
        }
    }
}
