 1.2.0 (2021-08-18)
===================

Bugfixes
--------

- Fix an issue where setting `opts.encodingFallback` would cause the process to crash. ([\#84](https://github.com/matrix-org/node-irc/issues/84))


1.1.1 (2021-07-27)
===================

Bugfixes
--------

- Fix when 'registered' is emitted ([\#75](https://github.com/matrix-org/node-irc/issues/75))


Internal Changes
----------------

- Add towncrier-based changelog setup ([\#76](https://github.com/matrix-org/node-irc/issues/76))

 1.1.0 (2021-07-26)
===================

Features
--------

 - Add a getter for maxLineLength

Bugfixes
--------

 - Fix multiline CAP responses not being processed correctly

 Pre 1.1.0
==========

# 0.3.8 to 0.3.9 (2015-01-16)
## Added
* Included notes in the README about icu / iconv
* First draft of contributor doc!
* Log network connection errors
* This changelog

## Changed
* Factored out parseMessage for better decoupling
* Turn off autorejoin on kicks
* Factored out test data to fixtures
* Moved to irc-colors for stripping colors

## Fixed
* Fixed line split delimiter regex to be more correct and robust
* Fixed issue where self.hostMask may not be set when the client's nick is in use
* Fixed hostmask length calculation--n.b., some ircds don't give the full hostmask
* Style cleanups
* Fixed SSL

# 0.3.7 to 0.3.8 (2015-01-09)
## Added
* Added support for binding to a specific local address
* WEBIRC support

## Changed
* Various small changes and fixes

## Fixed
* Proper line wrapping
* Fixed bold and underline codes
