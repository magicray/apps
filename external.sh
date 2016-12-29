#!/bin/bash -e

CDN=https://cdnjs.cloudflare.com/ajax/libs

JS="react/15.4.1/react                            \
    react/15.4.1/react-dom                        \
    react-bootstrap/0.30.7/react-bootstrap        \
    react-router/4.0.0-0/react-router             \
    redux/3.6.0/redux                             \
    react-redux/4.4.6/react-redux                 \
    lodash/4.17.3/loadash                         \
    immutable/3.8.1/immutable"

rm -f min.js js external.min.js external.js

for js in $JS; do
    curl $CDN/$js.min.js >> min.js
    echo >> min.js
    curl $CDN/$js.js >> js
done

mv min.js external.min.js
mv js external.js

curl https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.css > css
mv css bootstrap.css
