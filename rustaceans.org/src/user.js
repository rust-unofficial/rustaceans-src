import React from 'react';
import { Link } from 'react-router-dom';
import { FetchSearch } from './api';

export const User = (props) => {
    const getKey = (ps) => ps.match.params.user;
    return <FetchSearch endPoint="user?username" getKey={getKey} {...props} />;
};

export const RandomUser = (props) => {
    const getKey = () => null;
    return <FetchSearch endPoint="random" getKey={getKey} {...props} />;
};

export const Card = (props) => {
    let avatar = null;
    if (props.avatar) {
        avatar = <img className="avatar" src={props.avatar} height="128" width="128" />;
    }

    let name = null;
    if (props.name) {
        name = <div className="name"><span className="name"><Link to={"/" + props.username}>{props.name}</Link></span></div>;
    }

    let irc = null;
    if (props.irc) {
        let channelsSpan = null;
        if (props.irc_channels && props.irc_channels.length) {
            let channels = [];
            for (const chan of props.irc_channels) {
                channels.push(<span key={chan}> <a href={"irc://moznet/" + chan}>#{chan}</a></span>);
            }
            channelsSpan = <span> on {channels}</span>;
        }
        irc = <div className="row"><span className="key">irc nick</span><span className="value"><span className="irc-nick">{props.irc}</span>{channelsSpan}</span></div>
    }
    let discourse = null;
    if (props.discourse) {
        discourse = <div className="row"><span className="key">discourse username</span><span className="value"><a href={"https://users.rust-lang.org/u/" + props.discourse}>{props.discourse}</a></span></div>
    }
    let reddit = null;
    if (props.reddit) {
        reddit = <div className="row"><span className="key">reddit username</span><span className="value"><a href={"http://www.reddit.com/user/" + props.reddit}>{props.reddit}</a></span></div>
    }
    let twitter = null;
    if (props.twitter) {
        twitter = <div className="row"><span className="key">twitter username</span><span className="value"><a href={"https://twitter.com/" + props.twitter}>{props.twitter}</a></span></div>
    }
    let patreon = null;
    if (props.patreon) {
        patreon = <div className="row"><span className="key">patreon username</span><span className="value"><a href={"https://www.patreon.com/" + props.patreon}>{props.patreon}</a></span></div>
    }
    let website = null;
    if (props.website) {
        website = <div className="row"><span className="key">website</span><span className="value"><a href={props.website}>{props.website}</a></span></div>
    }
    let blog = null;
    if (props.blog) {
        blog = <div className="row"><span className="key">blog</span><span className="value"><a href={props.blog}>{props.blog}</a></span></div>
    }
    let email = null;
    if (props.email) {
        email = <div className="row"><span className="key">email</span><span className="value"><a href={"mailto:" + props.email}>{props.email}</a></span></div>
    }


    let notes = null;
    if (props.notes) {
        notes = <div className="notesrow"><span className="notes" dangerouslySetInnerHTML={{ __html: props.notes}} /></div>;
    }

    return <div className="searchresult">
        {avatar}
        {name}
        <div className="row"><span className="key">GitHub username</span><span className="value"><a href={"https://github.com/" + props.username}>{props.username}</a></span></div>
        {irc}
        {discourse}
        {reddit}
        {twitter}
        {patreon}
        {website}
        {blog}
        {email}
        <div className="clear"></div>
        {notes}
    </div>;
};
