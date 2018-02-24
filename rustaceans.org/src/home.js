import React from 'react';
import { Link } from 'react-router-dom';
import { SearchBox } from './search';

export const Home = (props) => (
    <div>
        <img className="logo" src="http://www.rust-lang.org/logos/rust-logo-256x256-blk.png" height="128" width="128" alt="Rust logo" />
        <div className="headsearch"><SearchBox /></div>
        <div className="clear"></div>
        <p className="pitch narrow">
            This website is for finding Rustaceans.
            Wondering who is behind that GitHub username or IRC nick? Here is where to find out (search at the top of the page).
        </p>

        <p className="narrow">
            Rustaceans are people who use Rust, contribute to Rust, or are interested in the development of Rust.
        </p>
        <p className="narrow">
            <a href="http://www.rust-lang.org/">Rust</a> is a systems programming language that runs blazingly fast, prevents almost all crashes, and eliminates data races.
        </p>
        <p>
            If you want to add or edit your details on rustaceans.org, you can send a pull request to the <a href="https://github.com/nrc/rustaceans.org">rustaceans.org repo</a>. It's very simple and there is no new username/password. See the readme in the repo for details.
        </p>
        <p>See a <Link to="/random">random rustacean</Link>.</p>

        <div>
            Rustaceans communicate via many channels:
            <ul>
                <li><a href="https://users.rust-lang.org/">Discourse (users)</a>: for discussing using and learning Rust.</li>
                <li><a href="https://internals.rust-lang.org/">Discourse (internals)</a>: for discussion of Rust language design and implementation. And bike-shedding.</li>
                <li><a href="http://www.reddit.com/r/rust">Reddit</a>: for general Rust discussion.</li>
                <li><a href="https://discord.me/rust-langt">Rust Discord</a>: heavily inspired on the IRC, but with support for code highlighting, Rust emojis and voice chat.</li>
                <li>IRC on Moznet:
                <ul>
                <li><a href="irc://moznet/rust">#rust</a> is for all things Rust;</li>
                <li><a href="irc://moznet/rust-internals">#rust-internals</a> is for discussion of other Rust implementation topics;</li>
                <li><a href="irc://moznet/rustc">#rustc</a> is for discussion of the implementation of the Rust compiler;</li>
                <li><a href="irc://moznet/rust-libs">#rust-lang</a> is for discussion of the design of the Rust language;</li>
                <li><a href="irc://moznet/rust-libs">#rust-libs</a> is for discussion of the implementation of the Rust standard libraries;</li>
                <li><a href="irc://moznet/rust-libs">#rust-tools</a> is for discussion of Rust tools;</li>
                <li><a href="irc://moznet/rust-gamedev">#rust-gamedev</a> is for people doing game development in Rust;</li>
                <li><a href="irc://moznet/rust-crypto">#rust-crypto</a> is for discussion of cryptography in Rust;</li>
                <li><a href="irc://moznet/rust-osdev">#rust-osdev</a> is for people doing OS development in Rust;</li>
                <li><a href="irc://moznet/rust-webdev">#rust-webdev</a> is for people doing web development in Rust;</li>
                <li><a href="irc://moznet/rust-networking">#rust-networking</a> is for people doing computer network development and programming in Rust;</li>
                <li><a href="irc://moznet/cargo">#cargo</a> is for discussion of Cargo, Rust's package manager;</li>
                <li><a href="irc://moznet/rust-offtopic">#rust-offtopic</a> is for general chit-chat amongst Rustaceans;</li>
                <li><a href="irc://moznet/servo">#servo</a> is for discussion of Servo, the browser engine written in Rust;</li>
                <li><a href="irc://moznet/rust-bots">#rust-bots</a> notifcations about Rust from a selection of bots.</li>
                </ul>
                </li>
            </ul>
        </div>
    </div>
);
