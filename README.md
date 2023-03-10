# Strawpoll Autovoter

Allows to make vote attack

# Installation

`git clone https://github.com/thepicture/strawpoll-autovoter.git`

`cd strawpoll-autovoter`

# Usage

In the further examples argument order is not positional.

`npm start -- --headless false --poll [poll_id] --option [option_id] --attempts 8 --ignore-proxy false`

Or the same version with short syntax:

`npm start -- -h false -p [poll_id] -o [option_id] -a 8 -i false`

Override default free http proxy:

`npm start -- -p [poll_id] -o [option_id] -t "http://example.com"`

Use authenticated proxy:

`npm start -- -p [poll_id] -o [option_id] -t "http://example.com" -c "username:password"`

## Arguments

`-h --headless` Whether browser should be visible or not. Defaults to `false`.

`-p --pool` Pool id `pool_id` taken from the link. Should be presented.

`-o --option` Option id `option_id` taken from the DOM. Should be presented.

`-a --attempts` Count of votes boost. Defaults to `4`.

`-i --ignore-proxy` Whether the browser should use the system IP. Defaults to `false`. The proxy is taken from free proxies API by default.

`-t --http-proxy` The user proxy. Defaults to `undefined`.

`-c --proxy-creds` The user proxy credentials. If not specified, http proxy will not try to authenticate. Can be omitted.
