import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Card } from './user';
import { FetchSearch } from './api';

export class SearchBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = { doSearch: null };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ doSearch: null });
    }

    render() {
        if (this.state.doSearch) {
            return <Redirect push to={"/search/" + this.state.doSearch} />;
        }

        const enterKeyCode = 13;
        const self = this;
        const onKeyPress = (e) => {
            if (e.which === enterKeyCode) {
                self.setState({ doSearch: e.currentTarget.value });
            }
        };

        return <div>
            <p className="pitch">
                Search for a Rustacean:
            <input id="search_box" placeholder="search" autoComplete="off" onKeyPress={onKeyPress} className="searchbox"></input>
            </p>
            <p className="searchnotes">(by name, irc nick, username for Reddit, GitHub, Discourse, etc.)</p>
        </div>;
    }
};

export const DoSearch = (props) => {
    const getKey = (ps) => ps.match.params.needle;
    return <FetchSearch endPoint="search?for" getKey={getKey} {...props} />;
};

export const SearchResults = (props) => {
    let results = [];
    for (const result of props.results) {
        results.push(<Card {...result} key={result.username}/>);
    }

    return <div>
        {results}
        <SearchBox />
        <Link to='/'>&lt;&lt;&lt; back to rustaceans.org front page</Link>
    </div>;
};
