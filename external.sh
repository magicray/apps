#!/bin/bash -e

CDN=https://cdnjs.cloudflare.com/ajax/libs

JS="react/15.4.1/react                            \
    react/15.4.1/react-dom                        \
    react-bootstrap/0.30.7/react-bootstrap        \
    redux/3.6.0/redux                             \
    react-redux/4.4.6/react-redux                 \
    lodash.js/4.17.3/lodash                       \
    immutable/3.8.1/immutable"

rm -f min.js js external.min.js external.js

for js in $JS; do
    curl -f $CDN/$js.min.js >> min.js
    curl -f $CDN/$js.js >> js
    echo >> min.js
done

mv min.js external.min.js
mv js external.js

curl -f https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.css > css
mv css bootstrap.css
