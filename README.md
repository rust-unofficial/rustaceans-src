rustaceans-src
==============

This repository is the source code for
[rustaceans.org](http://www.rustaceans.org). To add or modify your data on the
website, you want the [rustaceans.org repo](https://github.com/nick29581/rustaceans.org).

The code is in two parts - `backend` is hosted at www.ncameron.org. The entry
point is `rustaceans.js`. This listens for a GitHub PR hook. It inspects the PR
and merges it then adds the data to an SQLite database. There is also a RESTful
API for getting information about rustaceans from the database. `init.js` is an
alternate stating point which will rebuild the database from the rustaceans.org
repo. This is all node.js stuff.

The `rustaceans.org` directory contains the frontend; `index.html` is the entry
point. This is an ember.js app and is entirely client-based. It uses the
backend's API to get data.

## License

All files in this repository are copyright 2014 rustaceans.org developers.

Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
<LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
option. This file may not be copied, modified, or distributed
except according to those terms.

